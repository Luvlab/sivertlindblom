'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { PublicWork } from '@/lib/public-works'
import ImageEnhancer from '@/components/admin/ImageEnhancer'

interface MediaImage {
  url: string
  alt: string
  work: string
}

const PAGE_SIZE = 48

export default function AdminMedia() {
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'grid' | 'slideshow'>('grid')
  const [slideIdx, setSlideIdx] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  const [enhancerUrl, setEnhancerUrl] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const worksRes = await fetch('/api/admin/public-works')
        const worksData = await worksRes.json() as PublicWork[] | { error: string }

        const collected: MediaImage[] = []

        if (!('error' in worksData)) {
          for (const work of worksData) {
            for (const img of work.images ?? []) {
              collected.push({ url: img.url, alt: img.alt ?? '', work: work.title })
            }
          }
        }

        const textsRes = await fetch('/api/admin/texts')
        const textsData = await textsRes.json() as Array<{ title: string; images?: string[] }> | { error: string }

        if (!('error' in textsData)) {
          for (const text of textsData) {
            for (const url of text.images ?? []) {
              if (typeof url === 'string' && url) {
                collected.push({ url, alt: '', work: text.title })
              }
            }
          }
        }

        // Fetch manually uploaded images from storage
        const uploadsRes = await fetch('/api/admin/upload')
        const uploadsData = await uploadsRes.json() as { files?: Array<{ url: string; alt: string; name: string }> } | { error: string }
        if (!('error' in uploadsData) && uploadsData.files) {
          for (const f of uploadsData.files) {
            collected.push({ url: f.url, alt: f.alt ?? '', work: 'Uppladdningar' })
          }
        }

        setImages(collected)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return images
    const q = filter.toLowerCase()
    return images.filter(img =>
      img.work.toLowerCase().includes(q) ||
      img.alt.toLowerCase().includes(q) ||
      img.url.toLowerCase().includes(q)
    )
  }, [images, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageImages = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleFilterChange(v: string) {
    setFilter(v)
    setPage(1)
    setSlideIdx(0)
  }

  const goNext = useCallback(() => {
    setSlideIdx(i => (i + 1) % filtered.length)
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setSlideIdx(i => (i - 1 + filtered.length) % filtered.length)
  }, [filtered.length])

  // Keyboard navigation in slideshow
  useEffect(() => {
    if (view !== 'slideshow') return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
      if (e.key === 'Escape') setView('grid')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, goNext, goPrev])

  // Autoplay
  useEffect(() => {
    if (!autoplay || view !== 'slideshow' || filtered.length === 0) return
    const id = setInterval(goNext, 3000)
    return () => clearInterval(id)
  }, [autoplay, view, goNext, filtered.length])

  function openSlideshow(idx: number) {
    setSlideIdx(idx)
    setView('slideshow')
  }

  const safeSlideIdx = filtered.length > 0 ? Math.min(slideIdx, filtered.length - 1) : 0
  const currentSlide = filtered[safeSlideIdx]

  return (
    <div style={{ padding: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>
            Media
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar…' : `${filtered.length} bilder${filter ? ' (filtrerade)' : ''} av totalt ${images.length}`}
          </p>
        </div>

        {/* View toggle */}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 1, overflow: 'hidden' }}>
            {(['grid', 'slideshow'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '0.4rem 1rem', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.08em',
                background: view === v ? 'var(--color-accent)' : 'transparent',
                color: view === v ? '#0a0a0a' : 'var(--color-muted)',
                border: 'none', cursor: 'pointer',
              }}>
                {v === 'grid' ? '⊞ Rutnät' : '▶ Bildspel'}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök verk, alt-text…"
          value={filter}
          onChange={e => handleFilterChange(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : view === 'slideshow' && filtered.length > 0 ? (
        /* ── SLIDESHOW ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Main image */}
          <div style={{ position: 'relative', background: '#0a0a0a', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentSlide?.url}
              src={currentSlide?.url}
              alt={currentSlide?.alt ?? ''}
              style={{ display: 'block', width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              onError={e => { (e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>' }}
            />

            {/* Prev / Next overlays */}
            <button onClick={goPrev} style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '15%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
              border: 'none', cursor: 'pointer', color: '#fff', fontSize: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1rem',
            }}>‹</button>
            <button onClick={goNext} style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '15%',
              background: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)',
              border: 'none', cursor: 'pointer', color: '#fff', fontSize: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '1rem',
            }}>›</button>

            {/* Counter badge */}
            <div style={{
              position: 'absolute', bottom: '0.75rem', right: '0.75rem',
              background: 'rgba(0,0,0,0.7)', color: '#e8e8e4',
              fontSize: 'var(--fs-xs)', padding: '0.25rem 0.6rem', letterSpacing: '0.06em',
            }}>
              {safeSlideIdx + 1} / {filtered.length}
            </div>
          </div>

          {/* Caption + controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              {currentSlide?.alt && (
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-base)', marginBottom: '0.25rem' }}>{currentSlide.alt}</div>
              )}
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>{currentSlide?.work}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.25rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {currentSlide?.url}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
              {currentSlide?.url && (
                <button className="btn" onClick={() => setEnhancerUrl(currentSlide.url)} style={{
                  background: 'rgba(180,140,60,0.15)', color: 'var(--color-accent)',
                  border: '1px solid var(--color-accent)', fontSize: 'var(--fs-xs)',
                }}>
                  ✨ Förbättra
                </button>
              )}
              <button className="btn" onClick={() => setAutoplay(a => !a)} style={{
                background: autoplay ? 'var(--color-accent)' : 'transparent',
                color: autoplay ? '#0a0a0a' : 'var(--color-muted)',
                fontSize: 'var(--fs-xs)',
              }}>
                {autoplay ? '⏸ Pausa' : '▶ Auto'}
              </button>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>← → tangenter</span>
            </div>
          </div>

          {/* Filmstrip thumbnails */}
          <div style={{
            display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '0.5rem',
            scrollbarWidth: 'thin',
          }}>
            {filtered.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                onClick={() => setSlideIdx(i)}
                title={img.alt || img.work}
                style={{
                  flexShrink: 0, width: 64, height: 48, padding: 0, border: 'none',
                  outline: i === safeSlideIdx ? '2px solid var(--color-accent)' : '2px solid transparent',
                  outlineOffset: -2, cursor: 'pointer', overflow: 'hidden', background: '#111',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── GRID ── */
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {pageImages.map((img, i) => {
              const globalIdx = (safePage - 1) * PAGE_SIZE + i
              return (
                <div
                  key={`${img.url}-${i}`}
                  style={{ border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-bg-surface)', cursor: 'pointer', position: 'relative' }}
                  onClick={() => openSlideshow(globalIdx)}
                  title="Klicka för bildspel"
                >
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#111', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    {/* Enhance button — stops propagation so it doesn't open slideshow */}
                    <button
                      onClick={e => { e.stopPropagation(); setEnhancerUrl(img.url) }}
                      title="Förbättra med AI"
                      style={{
                        position: 'absolute', bottom: 4, right: 4,
                        background: 'rgba(0,0,0,0.72)', color: 'var(--color-accent)',
                        border: '1px solid rgba(180,140,60,0.5)', borderRadius: 2,
                        fontSize: 10, padding: '2px 6px', cursor: 'pointer', lineHeight: 1.4,
                        opacity: 0.85,
                      }}
                    >
                      ✨
                    </button>
                  </div>
                  <div style={{ padding: '0.5rem 0.6rem' }}>
                    {img.alt && (
                      <div style={{
                        fontSize: 'var(--fs-xs)', color: 'var(--color-text)', marginBottom: '0.15rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{img.alt}</div>
                    )}
                    <div style={{
                      fontSize: 'var(--fs-xs)', color: 'var(--color-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{img.work}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
              <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
                style={{ opacity: safePage === 1 ? 0.4 : 1 }}>← Föregående</button>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
                Sida {safePage} av {totalPages}
              </span>
              <button className="btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
                style={{ opacity: safePage === totalPages ? 0.4 : 1 }}>Nästa →</button>
            </div>
          )}

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '3rem' }}>
              Inga bilder hittades.
            </p>
          )}
        </>
      )}

      {/* AI Image Enhancer overlay */}
      {enhancerUrl && (
        <ImageEnhancer
          imageUrl={enhancerUrl}
          onClose={() => setEnhancerUrl(null)}
          onSaved={() => setEnhancerUrl(null)}
        />
      )}
    </div>
  )
}
