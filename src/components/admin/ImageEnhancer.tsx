'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface Props {
  imageUrl: string
  onClose: () => void
  /** Called with the new Supabase URL after a successful upload */
  onSaved?: (newUrl: string) => void
}

type OutputFormat = 'webp' | 'jpeg' | 'png'
type Phase = 'idle' | 'loading' | 'ready' | 'processing' | 'ai' | 'saving' | 'done'

function humanBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function base64ToBlob(base64: string, mime: string): Blob {
  const bin = atob(base64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return new Blob([buf], { type: mime })
}

/** Unsharp-mask convolution on raw ImageData */
function sharpenImageData(imageData: ImageData, strength: number): ImageData {
  if (strength === 0) return imageData
  const { data, width, height } = imageData
  const out = new Uint8ClampedArray(data)
  const s = strength / 10 // 0..1

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4
      for (let c = 0; c < 3; c++) {
        const center = data[i + c]
        const neighbours =
          data[((y - 1) * width + x) * 4 + c] +
          data[((y + 1) * width + x) * 4 + c] +
          data[(y * width + (x - 1)) * 4 + c] +
          data[(y * width + (x + 1)) * 4 + c]
        out[i + c] = Math.max(0, Math.min(255,
          Math.round(center + s * (4 * center - neighbours)),
        ))
      }
      out[i + 3] = data[i + 3]
    }
  }
  return new ImageData(out, width, height)
}

export default function ImageEnhancer({ imageUrl, onClose, onSaved }: Props) {
  const [phase,         setPhase]         = useState<Phase>('idle')
  const [error,         setError]         = useState<string | null>(null)

  // raw base64 of the source (fetched via proxy)
  const [srcBase64,     setSrcBase64]     = useState<string>('')
  const [srcMime,       setSrcMime]       = useState<string>('image/jpeg')
  const [srcBytes,      setSrcBytes]      = useState<number>(0)

  // controls
  const [sharpness,     setSharpness]     = useState(5)
  const [quality,       setQuality]       = useState(82)
  const [format,        setFormat]        = useState<OutputFormat>('webp')

  // result
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null)
  const [resultBytes,   setResultBytes]   = useState<number>(0)
  const [resultMime,    setResultMime]    = useState<string>('image/webp')
  const [savedUrl,      setSavedUrl]      = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ── Load image via proxy on mount ──────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    async function load() {
      setPhase('loading')
      setError(null)
      try {
        const res = await fetch('/api/admin/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operation: 'proxy', imageUrl }),
        })
        const data = await res.json() as { imageBase64?: string; mimeType?: string; bytes?: number; error?: string }
        if (data.error) throw new Error(data.error)
        if (cancelled) return
        setSrcBase64(data.imageBase64 ?? '')
        setSrcMime(data.mimeType ?? 'image/jpeg')
        setSrcBytes(data.bytes ?? 0)
        setPhase('ready')
      } catch (e) {
        if (!cancelled) { setError(String(e)); setPhase('idle') }
      }
    }
    load()
    return () => { cancelled = true }
  }, [imageUrl])

  // ── Canvas sharpen ─────────────────────────────────────────────────────────
  const applySharpen = useCallback(async () => {
    if (!srcBase64) return
    setPhase('processing')
    setError(null)
    try {
      const mime = `image/${format}`

      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current!
          canvas.width  = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const sharpened = sharpenImageData(imageData, sharpness)
          ctx.putImageData(sharpened, 0, 0)

          const q = quality / 100
          canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Canvas toBlob failed')); return }
            const reader = new FileReader()
            reader.onload = () => {
              const dataUrl = reader.result as string
              setResultDataUrl(dataUrl)
              setResultBytes(blob.size)
              setResultMime(mime)
              setPhase('ready')
              resolve()
            }
            reader.readAsDataURL(blob)
          }, mime, q)
        }
        img.onerror = () => reject(new Error('Image load failed'))
        img.src = `data:${srcMime};base64,${srcBase64}`
      })
    } catch (e) {
      setError(String(e))
      setPhase('ready')
    }
  }, [srcBase64, srcMime, sharpness, quality, format])

  // ── Gemini AI enhance ──────────────────────────────────────────────────────
  const applyAI = useCallback(async () => {
    if (!srcBase64) return
    setPhase('ai')
    setError(null)
    try {
      const res = await fetch('/api/admin/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'ai_enhance', imageBase64: srcBase64, mimeType: srcMime }),
      })
      const data = await res.json() as { imageBase64?: string; mimeType?: string; error?: string }
      if (data.error) throw new Error(data.error)

      // Convert AI result to target format via canvas if needed
      const aiMime  = data.mimeType ?? 'image/png'
      const aiB64   = data.imageBase64 ?? ''
      const outMime = `image/${format}`

      if (format === 'png' && aiMime === 'image/png') {
        // keep as-is
        const blob = base64ToBlob(aiB64, aiMime)
        const dataUrl = `data:${aiMime};base64,${aiB64}`
        setResultDataUrl(dataUrl)
        setResultBytes(blob.size)
        setResultMime(aiMime)
        setPhase('ready')
        return
      }

      // Re-encode to target format + apply any sharpness on top
      await new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current!
          canvas.width  = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0)

          if (sharpness > 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            ctx.putImageData(sharpenImageData(imageData, sharpness), 0, 0)
          }

          canvas.toBlob(blob => {
            if (!blob) { reject(new Error('Canvas toBlob failed')); return }
            const reader = new FileReader()
            reader.onload = () => {
              setResultDataUrl(reader.result as string)
              setResultBytes(blob.size)
              setResultMime(outMime)
              setPhase('ready')
              resolve()
            }
            reader.readAsDataURL(blob)
          }, outMime, quality / 100)
        }
        img.onerror = () => reject(new Error('AI image load failed'))
        img.src = `data:${aiMime};base64,${aiB64}`
      })
    } catch (e) {
      setError(String(e))
      setPhase('ready')
    }
  }, [srcBase64, srcMime, sharpness, quality, format])

  // ── Upload to Supabase ─────────────────────────────────────────────────────
  const uploadResult = useCallback(async () => {
    if (!resultDataUrl) return
    setPhase('saving')
    setError(null)
    try {
      const blob = await fetch(resultDataUrl).then(r => r.blob())
      const ext  = format === 'jpeg' ? 'jpg' : format
      const name = `enhanced-${Date.now()}.${ext}`
      const form = new FormData()
      form.append('file', blob, name)

      const res  = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json() as { url?: string; error?: string }
      if (data.error) throw new Error(data.error)

      setSavedUrl(data.url ?? '')
      setPhase('done')
      onSaved?.(data.url ?? '')
    } catch (e) {
      setError(String(e))
      setPhase('ready')
    }
  }, [resultDataUrl, format, onSaved])

  // ── Download ───────────────────────────────────────────────────────────────
  function download() {
    if (!resultDataUrl) return
    const a = document.createElement('a')
    a.href = resultDataUrl
    a.download = `enhanced-${Date.now()}.${format === 'jpeg' ? 'jpg' : format}`
    a.click()
  }

  const busy   = phase === 'loading' || phase === 'processing' || phase === 'ai' || phase === 'saving'
  const srcUrl = srcBase64 ? `data:${srcMime};base64,${srcBase64}` : imageUrl

  const saving = (pct: number) => `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`
  const delta  = resultBytes && srcBytes
    ? ((resultBytes - srcBytes) / srcBytes) * 100
    : null

  // ── Styles ─────────────────────────────────────────────────────────────────
  const label: React.CSSProperties = {
    fontSize: 'var(--fs-xs)', color: 'var(--color-muted)',
    textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.4rem',
  }
  const tag: React.CSSProperties = {
    display: 'inline-block', padding: '0.15rem 0.5rem',
    background: 'var(--color-bg)', border: '1px solid var(--color-border)',
    fontSize: 'var(--fs-xs)', borderRadius: 2, color: 'var(--color-muted)',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
    }}>
      {/* Panel */}
      <div style={{
        background: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 6, width: '100%', maxWidth: 960,
        maxHeight: '92vh', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)', margin: 0 }}>
              ✨ AI Bildförbättring
            </h2>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
              Canvas-skärpning + Gemini AI + WebP-konvertering
            </p>
          </div>
          <button onClick={onClose} disabled={busy} style={{
            background: 'none', border: '1px solid var(--color-border)',
            color: 'var(--color-muted)', cursor: busy ? 'not-allowed' : 'pointer',
            width: 32, height: 32, borderRadius: 4, fontSize: '1rem', flexShrink: 0,
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: 1 }}>

          {/* ── Before / After ── */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

              {/* Before */}
              <div>
                <span style={label}>Original</span>
                <div style={{ background: '#0a0a0a', border: '1px solid var(--color-border)', borderRadius: 3, overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={srcUrl} alt="Original" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={tag}>{srcMime.split('/')[1].toUpperCase()}</span>
                  {srcBytes > 0 && <span style={tag}>{humanBytes(srcBytes)}</span>}
                </div>
              </div>

              {/* After */}
              <div>
                <span style={label}>Förbättrad</span>
                <div style={{
                  background: '#0a0a0a', border: `1px solid ${resultDataUrl ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: 3, overflow: 'hidden', aspectRatio: '4/3',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  {resultDataUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={resultDataUrl} alt="Förbättrad" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                      {phase === 'loading' ? 'Laddar bild…' : phase === 'processing' ? 'Bearbetar…' : phase === 'ai' ? '✨ Gemini bearbetar…' : 'Ingen förbättring ännu'}
                    </span>
                  )}
                  {busy && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 'var(--fs-xs)', color: '#fff', letterSpacing: '0.1em' }}>
                        {phase === 'loading' ? 'LADDAR…' : phase === 'processing' ? 'SKÄRPER…' : phase === 'ai' ? 'GEMINI AI…' : 'SPARAR…'}
                      </span>
                    </div>
                  )}
                </div>
                {resultDataUrl && (
                  <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={tag}>{format.toUpperCase()}</span>
                    <span style={tag}>{humanBytes(resultBytes)}</span>
                    {delta !== null && (
                      <span style={{ ...tag, color: delta < 0 ? '#6db87a' : '#f87', borderColor: delta < 0 ? '#6db87a' : '#f87' }}>
                        {saving(delta)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Success banner */}
            {phase === 'done' && savedUrl && (
              <div style={{ background: '#0d2010', border: '1px solid #4a8f5a', borderRadius: 4, padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', color: '#6db87a' }}>
                ✓ Uppladdad till Supabase!{' '}
                <a href={savedUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', wordBreak: 'break-all' }}>{savedUrl}</a>
              </div>
            )}

            {error && (
              <div style={{ background: '#2a0a0a', border: '1px solid #a33', borderRadius: 4, padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>
                {error}
              </div>
            )}
          </div>

          {/* ── Controls ── */}
          <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Sharpness */}
            <div>
              <label style={label}>Skärpning (Canvas) — {sharpness}</label>
              <input
                type="range" min={0} max={10} value={sharpness}
                onChange={e => setSharpness(Number(e.target.value))}
                disabled={busy}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                <span>0 — ingen</span><span>10 — max</span>
              </div>
            </div>

            {/* Quality */}
            <div>
              <label style={label}>Kvalitet — {quality}%</label>
              <input
                type="range" min={60} max={100} value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                disabled={busy}
                style={{ width: '100%', accentColor: 'var(--color-accent)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                <span>60 — liten fil</span><span>100 — lossless</span>
              </div>
            </div>

            {/* Format */}
            <div>
              <label style={label}>Utformat</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['webp', 'jpeg', 'png'] as OutputFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    disabled={busy}
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.06em',
                      background: format === f ? 'var(--color-accent)' : 'transparent',
                      color: format === f ? '#0a0a0a' : 'var(--color-muted)',
                      border: `1px solid ${format === f ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      borderRadius: 3, cursor: busy ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {format === 'webp' && (
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
                  WebP är 25–35% lättare än JPEG vid samma kvalitet.
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                className="btn btn-primary"
                onClick={applySharpen}
                disabled={busy || !srcBase64}
                style={{ justifyContent: 'center', opacity: (busy || !srcBase64) ? 0.5 : 1 }}
              >
                ⚡ Canvas-skärp + {format.toUpperCase()}
              </button>

              <button
                className="btn"
                onClick={applyAI}
                disabled={busy || !srcBase64}
                style={{
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1a3a 100%)',
                  border: '1px solid #5b4fef',
                  color: '#a89df5',
                  opacity: (busy || !srcBase64) ? 0.5 : 1,
                }}
              >
                ✨ AI-förbättra (Gemini)
              </button>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  className="btn"
                  onClick={download}
                  disabled={!resultDataUrl || busy}
                  style={{ justifyContent: 'center', opacity: (!resultDataUrl || busy) ? 0.4 : 1 }}
                >
                  ⬇ Ladda ned
                </button>

                <button
                  className="btn btn-primary"
                  onClick={uploadResult}
                  disabled={!resultDataUrl || busy}
                  style={{ justifyContent: 'center', opacity: (!resultDataUrl || busy) ? 0.4 : 1 }}
                >
                  {phase === 'saving' ? 'Sparar…' : '☁ Ladda upp till Supabase'}
                </button>
              </div>
            </div>

            {/* Gemini key info */}
            <div style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '0.75rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
              <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '0.3rem' }}>Gemini AI</strong>
              Kräver <code style={{ background: 'var(--color-bg-card)', padding: '0.1em 0.3em', borderRadius: 2 }}>GEMINI_API_KEY</code> i <code style={{ background: 'var(--color-bg-card)', padding: '0.1em 0.3em', borderRadius: 2 }}>.env.local</code> och Vercel Environment Variables.{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>Hämta nyckel →</a>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
