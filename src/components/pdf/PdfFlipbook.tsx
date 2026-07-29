'use client'

import { useEffect, useRef, useState } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

const PDFJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
const PAGEFLIP_SRC = 'https://unpkg.com/page-flip@2.0.7/dist/js/page-flip.browser.js'

/** Load an external script once, resolving when it's ready. */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-ext="${src}"]`) as HTMLScriptElement | null
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve()
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('script failed')))
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.dataset.ext = src
    s.addEventListener('load', () => { s.dataset.loaded = 'true'; resolve() })
    s.addEventListener('error', () => reject(new Error('script failed')))
    document.head.appendChild(s)
  })
}

interface Props {
  url: string
  title?: string
  onClose: () => void
}

/**
 * Fullscreen page-flip viewer for a PDF. pdf.js (rendered to page images) drives
 * StPageFlip; both are loaded from CDN, mirroring how the site loads Leaflet.
 */
export default function PdfFlipbook({ url, title, onClose }: Props) {
  const bookRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<any>(null)
  const [status, setStatus] = useState<'loading' | 'ready'>('loading')
  // Fall back to the browser's native PDF view if the flip renderer can't run
  // (blocked worker, unusual browser, etc.) so the PDF is always viewable.
  const [mode, setMode] = useState<'flip' | 'iframe'>('flip')
  const [progress, setProgress] = useState('')
  const [page, setPage] = useState({ current: 1, total: 0 })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') flipRef.current?.flipNext?.()
      if (e.key === 'ArrowLeft') flipRef.current?.flipPrev?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    let guard: ReturnType<typeof setTimeout> | undefined
    ;(async () => {
      try {
        setStatus('loading')
        // Overall safety net: if the flip renderer stalls, show the PDF natively.
        guard = setTimeout(() => { if (!cancelled) setMode('iframe') }, 25000)
        await Promise.all([loadScript(PDFJS_SRC), loadScript(PAGEFLIP_SRC)])
        const pdfjsLib = (window as any).pdfjsLib
        const St = (window as any).St
        if (!pdfjsLib || !St?.PageFlip) throw new Error('libs missing')
        // The worker is cross-origin (CDN); browsers block new Worker() across
        // origins, so wrap it in a same-origin blob URL.
        if (!(window as any).__pdfWorkerBlob) {
          const wjs = await (await fetch(PDFJS_WORKER)).text()
          ;(window as any).__pdfWorkerBlob = URL.createObjectURL(new Blob([wjs], { type: 'text/javascript' }))
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = (window as any).__pdfWorkerBlob

        const pdf = await pdfjsLib.getDocument(url).promise
        const total = pdf.numPages
        const images: string[] = []
        let ratio = 1.414 // height / width fallback (A4)
        for (let i = 1; i <= total; i++) {
          if (cancelled) return
          setProgress(`${i} / ${total}`)
          const p = await pdf.getPage(i)
          const base = p.getViewport({ scale: 1 })
          const scale = Math.min(2, 1000 / base.width)
          const vp = p.getViewport({ scale })
          if (i === 1) ratio = vp.height / vp.width
          const canvas = document.createElement('canvas')
          canvas.width = vp.width
          canvas.height = vp.height
          const ctx = canvas.getContext('2d')!
          await p.render({ canvasContext: ctx, viewport: vp }).promise
          images.push(canvas.toDataURL('image/jpeg', 0.82))
        }
        if (cancelled || !bookRef.current) return

        // Size the book to the viewport, one page's aspect ratio.
        const maxH = window.innerHeight * 0.9
        const maxW = window.innerWidth * 0.94
        let pageH = maxH
        let pageW = pageH / ratio
        if (pageW * 2 > maxW) { pageW = maxW / 2; pageH = pageW * ratio }

        const pageFlip = new St.PageFlip(bookRef.current, {
          width: Math.round(pageW),
          height: Math.round(pageH),
          size: 'fixed',
          showCover: false,
          maxShadowOpacity: 0.4,
          mobileScrollSupport: true,
          useMouseEvents: true,
          drawShadow: true,
        })
        pageFlip.loadFromImages(images)
        pageFlip.on('flip', (e: any) => setPage((s) => ({ ...s, current: (e.data as number) + 1 })))
        flipRef.current = pageFlip
        setPage({ current: 1, total })
        if (guard) clearTimeout(guard)
        setStatus('ready')
      } catch (e) {
        if (!cancelled) { console.error('PdfFlipbook', e); if (guard) clearTimeout(guard); setMode('iframe') }
      }
    })()
    return () => {
      cancelled = true
      if (guard) clearTimeout(guard)
      try { flipRef.current?.destroy?.() } catch { /* noop */ }
    }
  }, [url])

  const ctrlBtn: React.CSSProperties = {
    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
    color: '#fff', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', fontSize: '1.1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }

  return (
    <div
      role="dialog"
      aria-label={title || 'PDF'}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(10,10,10,0.94)', backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', color: '#fff' }}>
        <span style={{ fontSize: 'var(--fs-sm)', opacity: 0.8, maxWidth: '70vw', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        <button onClick={onClose} aria-label="Stäng" style={{ ...ctrlBtn, width: 40, height: 40 }}>✕</button>
      </div>

      {mode === 'iframe' ? (
        <iframe
          src={url}
          title={title || 'PDF'}
          style={{ width: '92vw', height: '86vh', border: 'none', borderRadius: 6, background: '#fff', marginTop: '2.5rem' }}
        />
      ) : (
        <>
          {status === 'loading' && (
            <div style={{ color: '#fff', textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--fs-sm)', opacity: 0.85 }}>Laddar PDF…</div>
              {progress && <div style={{ fontSize: 'var(--fs-xs)', opacity: 0.6, marginTop: '0.4rem' }}>Sida {progress}</div>}
            </div>
          )}

          {/* Book + side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', visibility: status === 'ready' ? 'visible' : 'hidden' }}>
            <button onClick={() => flipRef.current?.flipPrev?.()} style={ctrlBtn} aria-label="Föregående">‹</button>
            <div ref={bookRef} />
            <button onClick={() => flipRef.current?.flipNext?.()} style={ctrlBtn} aria-label="Nästa">›</button>
          </div>

          {status === 'ready' && page.total > 0 && (
            <div style={{ position: 'absolute', bottom: '1.1rem', color: 'rgba(255,255,255,0.6)', fontSize: 'var(--fs-xs)', letterSpacing: '0.06em' }}>
              {page.current}–{Math.min(page.current + 1, page.total)} / {page.total}
            </div>
          )}
        </>
      )}
    </div>
  )
}
