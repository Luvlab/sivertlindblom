'use client'

import Link from 'next/link'
import { useState } from 'react'
import Lightbox from '@/components/gallery/Lightbox'
import type { LightboxImage } from '@/components/gallery/Lightbox'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props { locale: string; dict: any; images: LightboxImage[]; title?: string; description?: string }

export default function WatercolorsGallery({ locale, dict, images, title, description }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const wc = dict?.watercolors ?? {}
  const nav = dict?.nav ?? {}

  return (
    <div className="section-gap">
      {/* Header */}
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{nav.portfolio ?? 'Portfolio'}</span>
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          {title ?? wc.title ?? 'Akvareller 1975–2012'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1rem' }}>
          {description ?? wc.short_description ?? 'En serie axonometriska arkitektoniska visioner.'}
        </p>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>
          {wc.context_1 ?? ''} {wc.context_2 ?? ''}
        </p>
        {/* Catalogue text links */}
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: 'var(--fs-xs)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <Link href={`/${locale}/texts/jan-oqvist-2012`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            LÄS MER — Jan Öqvist
          </Link>
          <Link href={`/${locale}/texts/peter-cornell-2012`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            LÄS MER — Peter Cornell
          </Link>
          <Link href={`/${locale}/texts/catharina-gabrielsson-2012`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            LÄS MER — Catharina Gabrielsson
          </Link>
        </div>
        <div style={{ marginTop: '1rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.08em' }}>
          {images.length} {wc.gallery_count ?? 'verk'} — {wc.click_hint ?? 'klicka för bildspel'}
        </div>
      </div>

      <hr className="divider" />

      {/* Uniform grid — alla thumbnails exakt samma storlek */}
      <div className="page-pad" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '4px',
        }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIdx(i)}
              aria-label={img.alt}
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '1 / 1',
                padding: '6px',
                border: 'none',
                background: '#f0ede8',
                cursor: 'pointer',
                overflow: 'hidden',
                boxSizing: 'border-box',
                lineHeight: 0,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                loading={i < 16 ? 'eager' : 'lazy'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom back-link */}
      <div className="page-pad" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{nav.portfolio ?? 'Portfolio'}</span>
        </Link>
      </div>

      {/* Fullscreen lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  )
}
