'use client'

import { useState } from 'react'
import Lightbox, { type LightboxImage } from './Lightbox'

interface Props {
  images: LightboxImage[]
  aspectRatio?: string
  columns?: 'sm' | 'md' | 'lg'
  /** Show caption and credit text below each thumbnail */
  showCaptions?: boolean
}

const GRID_CLASS: Record<NonNullable<Props['columns']>, string> = {
  sm: 'auto-grid-sm',
  md: 'auto-grid',
  lg: 'auto-grid-wide',
}

export default function GalleryGrid({
  images,
  aspectRatio = '3/2',
  columns = 'sm',
  showCaptions = false,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images.length) return null

  const gridClass = GRID_CLASS[columns]

  return (
    <>
      <div className={gridClass}>
        {images.map((img, i) => (
          <div key={i} style={showCaptions ? { display: 'flex', flexDirection: 'column' } : undefined}>
            <button
              className="gallery-thumb"
              aria-label={`Visa bild: ${img.alt}`}
              onClick={() => setLightboxIndex(i)}
              style={{
                display: 'block',
                padding: 0,
                margin: 0,
                background: 'none',
                border: '1px solid var(--color-border)',
                cursor: 'zoom-in',
                aspectRatio,
                overflow: 'hidden',
                width: '100%',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </button>
            {showCaptions && (img.caption || img.credit) && (
              <div style={{ paddingTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.75rem' }}>
                {img.caption && (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text)', letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0,0,0,0.5)', flex: '1 1 auto' }}>
                    {img.caption}
                  </p>
                )}
                {img.credit && (
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-muted)', letterSpacing: '0.03em', textShadow: '0 1px 3px rgba(0,0,0,0.5)', flexShrink: 0, textAlign: 'right' }}>
                    Foto: {img.credit}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
