'use client'

import { useState } from 'react'
import Lightbox, { type LightboxImage } from './Lightbox'

interface MasonryImage {
  url: string
  caption?: string
  credit?: string
}

interface Props {
  images: MasonryImage[]
  /** CSS columns value, default "4" */
  columns?: string
  /** Additional class on the grid wrapper */
  className?: string
  /** Make the last image span full width */
  fullWidthLast?: boolean
}

export default function MasonryGallery({ images, columns = '4', className, fullWidthLast = false }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const lightboxImages: LightboxImage[] = images.map((img) => {
    const captionIsCredit = img.caption && /^Foto:/i.test(img.caption) && !img.credit
    return {
      url: img.url,
      alt: captionIsCredit ? '' : (img.caption ?? ''),
      caption: captionIsCredit ? undefined : img.caption,
      credit: captionIsCredit ? img.caption : img.credit,
    }
  })

  return (
    <>
      <div
        className={className}
        style={{
          columns,
          columnGap: '6px',
        }}
      >
        {images.map((img, i) => {
          const isLast = fullWidthLast && i === images.length - 1
          return (
          <div
            key={i}
            style={{
              breakInside: 'avoid',
              marginBottom: 6,
              ...(isLast ? { columnSpan: 'all' as const } : {}),
            }}
          >
            <button
              onClick={() => setLightboxIndex(i)}
              aria-label={img.caption ?? `Image ${i + 1}`}
              style={{
                display: 'block',
                width: '100%',
                padding: 0,
                background: 'none',
                border: 'none',
                cursor: 'zoom-in',
                lineHeight: 0,
                textAlign: 'left',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption ?? ''}
                loading={i < 12 ? 'eager' : 'lazy'}
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
            {(img.caption || img.credit) && (() => {
              // Route a caption that's ALREADY written as a credit (starts with "Foto:")
              // into the credit slot when no separate credit was entered — but never
              // invent or rewrite the wording. Jan controls the exact text in admin.
              const captionIsCredit = img.caption && /^Foto:/i.test(img.caption) && !img.credit
              const caption = captionIsCredit ? undefined : img.caption
              const credit = captionIsCredit ? img.caption : img.credit
              return (
                // Jan's rule: his credit always sits on the right, in every
                // gallery — caption left, credit right, one row.
                <div style={{ lineHeight: 1.4, paddingTop: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                  {caption && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', textShadow: '0 1px 3px rgba(0,0,0,0.4)', flex: '1 1 auto', minWidth: 0, overflowWrap: 'break-word' }}>
                      {caption}
                    </p>
                  )}
                  {credit && (
                    <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', textShadow: '0 1px 3px rgba(0,0,0,0.4)', flex: '0 1 auto', minWidth: 0, maxWidth: caption ? '55%' : '100%', textAlign: 'right', marginLeft: 'auto', overflowWrap: 'break-word' }}>
                      {credit}
                    </p>
                  )}
                </div>
              )
            })()}
          </div>
          )
        })}
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
