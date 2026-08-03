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
              <div style={{ paddingTop: '0.3rem', lineHeight: 1.4 }}>
                {img.caption && (
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text)', fontStyle: 'italic', letterSpacing: '0.02em' }}>
                    {img.caption}
                  </p>
                )}
                {img.credit && (
                  <p style={{ margin: 0, fontSize: '0.66rem', color: 'var(--color-accent)', letterSpacing: '0.04em', marginTop: '0.1rem' }}>
                    {img.credit}
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
