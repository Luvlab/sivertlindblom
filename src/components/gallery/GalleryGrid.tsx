'use client'

import { useState } from 'react'
import Lightbox, { type LightboxImage } from './Lightbox'

interface Props {
  images: LightboxImage[]
  aspectRatio?: string
  columns?: 'sm' | 'md' | 'lg'
  /** Show caption and credit text below each thumbnail */
  showCaptions?: boolean
  /** Make the last image span full width with caption left and credit right */
  fullWidthLast?: boolean
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
  fullWidthLast = false,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images.length) return null

  const gridClass = GRID_CLASS[columns]

  return (
    <>
      <div className={gridClass}>
        {images.map((img, i) => {
          const isLast = fullWidthLast && i === images.length - 1
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                ...(isLast ? { gridColumn: '1 / -1' } : {}),
              }}
            >
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
                  aspectRatio: isLast ? undefined : aspectRatio,
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
                    height: isLast ? 'auto' : '100%',
                    objectFit: isLast ? undefined : 'cover',
                    display: 'block',
                  }}
                />
              </button>
              {showCaptions && (img.caption || img.credit) && (
                <div style={{ paddingTop: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
                  {img.caption && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', lineHeight: 1.4, flex: '1 1 auto' }}>
                      {img.caption}
                    </p>
                  )}
                  {img.credit && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', opacity: 0.6, lineHeight: 1.4, whiteSpace: 'nowrap', marginLeft: 'auto' }}>
                      {(() => { const c = img.credit.replace(/^ur: /i, 'ur '); return /^(ur |Foto:)/i.test(c) ? c : `Foto: ${c}` })()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
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
