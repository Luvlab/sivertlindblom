'use client'

import { useState } from 'react'
import Lightbox, { type LightboxImage } from './Lightbox'

interface MasonryImage {
  url: string
  caption?: string
}

interface Props {
  images: MasonryImage[]
  /** CSS columns value, default "4" */
  columns?: string
  /** Additional class on the grid wrapper */
  className?: string
}

export default function MasonryGallery({ images, columns = '4', className }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lightboxImages: LightboxImage[] = images.map((img) => ({
    url: img.url,
    alt: img.caption ?? '',
    caption: img.caption,
  }))

  return (
    <>
      <div
        className={className}
        style={{
          columns,
          columnGap: '6px',
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            aria-label={img.caption ?? `Image ${i + 1}`}
            style={{
              display: 'block',
              width: '100%',
              padding: 0,
              margin: '0 0 6px',
              background: 'none',
              border: 'none',
              cursor: 'zoom-in',
              breakInside: 'avoid',
              lineHeight: 0,
              textAlign: 'left',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.caption ?? ''}
              loading={i < 12 ? 'eager' : 'lazy'}
              title={img.caption}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.82' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
