'use client'

import { useState } from 'react'
import Lightbox, { type LightboxImage } from './Lightbox'

interface Props {
  images: LightboxImage[]
  aspectRatio?: string
  columns?: 'sm' | 'md' | 'lg'
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
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images.length) return null

  const gridClass = GRID_CLASS[columns]

  return (
    <>
      <div className={gridClass}>
        {images.map((img, i) => (
          <button
            key={i}
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
