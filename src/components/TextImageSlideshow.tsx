'use client'

import { useState, useEffect, useCallback } from 'react'

interface Props {
  images: string[]
  title: string
  /** Aspect ratio for thumbnail strip items. Default '3/4' (portrait scans). Use '4/3' for landscape photos. */
  thumbnailAspect?: string
}

export default function TextImageSlideshow({ images, title, thumbnailAspect = '3/4' }: Props) {
  const [idx, setIdx] = useState(0)

  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  const current = images[idx]

  return (
    <div>
      {/* Main image */}
      <div style={{ position: 'relative', background: '#0a0a0a', border: '1px solid var(--color-border)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={current}
          alt={`${title} — sida ${idx + 1}`}
          style={{ width: '100%', display: 'block' }}
        />

        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Föregående" style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%',
              background: 'linear-gradient(to right, rgba(0,0,0,0.45), transparent)',
              border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
              fontSize: '1.6rem', display: 'flex', alignItems: 'center',
              justifyContent: 'flex-start', paddingLeft: '0.6rem',
            }}>‹</button>
            <button onClick={next} aria-label="Nästa" style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%',
              background: 'linear-gradient(to left, rgba(0,0,0,0.45), transparent)',
              border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
              fontSize: '1.6rem', display: 'flex', alignItems: 'center',
              justifyContent: 'flex-end', paddingRight: '0.6rem',
            }}>›</button>
            <div style={{
              position: 'absolute', bottom: '0.5rem', right: '0.6rem',
              background: 'rgba(0,0,0,0.65)', color: '#e8e8e4',
              fontSize: '0.65rem', padding: '0.2rem 0.5rem', letterSpacing: '0.06em',
            }}>
              {idx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '0.5rem' }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                flex: 1, padding: 0, border: 'none',
                outline: i === idx ? '2px solid var(--color-accent)' : '2px solid transparent',
                outlineOffset: -2, cursor: 'pointer', overflow: 'hidden',
                background: '#111',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`sida ${i + 1}`}
                loading="lazy"
                style={{ width: '100%', aspectRatio: thumbnailAspect, objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
