'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Image as ImageType } from '@/types'

interface Props {
  images: ImageType[]
  altPrefix?: string
}

export default function ImageGrid({ images, altPrefix = '' }: Props) {
  const [lightbox, setLightbox] = useState<ImageType | null>(null)

  if (!images.length) return null

  return (
    <>
      <div className="auto-grid">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img)}
            aria-label={`Visa bild: ${img.alt || altPrefix}`}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'zoom-in',
              display: 'block',
              aspectRatio: '4/3',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src={img.url}
              alt={img.alt || altPrefix}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt || 'Bild'}
        >
          <button
            aria-label="Stäng"
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              lineHeight: 1,
              zIndex: 201,
            }}
          >
            ×
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.alt || ''}
            style={{
              maxWidth: '95vw',
              maxHeight: '92vh',
              objectFit: 'contain',
              display: 'block',
            }}
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.caption && (
            <p style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 'var(--fs-sm)',
              textAlign: 'center',
            }}>
              {lightbox.caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}
