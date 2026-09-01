'use client'

import { useState } from 'react'
import Lightbox, { type LightboxImage } from './Lightbox'

interface Props {
  images: LightboxImage[]
  aspectRatio?: string
  /** Preset responsive columns (auto-fill), or a fixed column count for a
   *  tidy grid of exact rows (e.g. 6 → 3 rows of 6 for 18 images). A fixed
   *  count steps down to 3 columns ≤900px and 2 columns ≤600px. */
  columns?: 'sm' | 'md' | 'lg' | number
  /** Show caption and credit text below each thumbnail */
  showCaptions?: boolean
  /** Make the last image span full width with caption left and credit right */
  fullWidthLast?: boolean
}

const GRID_CLASS: Record<'sm' | 'md' | 'lg', string> = {
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

  const isFixed = typeof columns === 'number'
  const fixedClass = isFixed ? `grid-fixed-${columns}` : undefined
  const gridClass = isFixed ? fixedClass : GRID_CLASS[columns]

  return (
    <>
      {isFixed && (
        <style>{`
          .${fixedClass} { display: grid; gap: 1.5rem; grid-template-columns: repeat(${columns}, 1fr); }
          @media (max-width: 900px) { .${fixedClass} { grid-template-columns: repeat(3, 1fr); } }
          @media (max-width: 600px) { .${fixedClass} { grid-template-columns: repeat(2, 1fr); } }
        `}</style>
      )}
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
                // The full-width last image has room to spare, so caption and
                // credit sit side by side (credit right-aligned) instead of
                // the stacked layout used for the smaller grid thumbnails.
                <div style={{
                  paddingTop: '0.3rem',
                  display: 'flex',
                  flexDirection: isLast ? 'row' : 'column',
                  justifyContent: isLast ? 'space-between' : undefined,
                  gap: isLast ? '1rem' : '0.15rem',
                }}>
                  {img.caption && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', lineHeight: 1.4, textShadow: '0 1px 3px rgba(0,0,0,0.4)', overflowWrap: 'break-word', flex: isLast ? '1 1 auto' : undefined, minWidth: 0 }}>
                      {img.caption}
                    </p>
                  )}
                  {img.credit && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', lineHeight: 1.4, textShadow: '0 1px 3px rgba(0,0,0,0.4)', overflowWrap: 'break-word', flex: isLast ? '0 1 auto' : undefined, minWidth: 0, textAlign: isLast ? 'right' : undefined, marginLeft: isLast ? 'auto' : undefined }}>
                      {img.credit}
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
