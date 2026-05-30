'use client'

import Link from 'next/link'
import { useState } from 'react'
import Lightbox from '@/components/gallery/Lightbox'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import ExhibitionsHeroSlideshow from '@/components/gallery/ExhibitionsHeroSlideshow'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props { locale: string; dict: any; images: LightboxImage[]; title?: string; description?: string; heroImages?: string[] }

export default function WatercolorsGallery({ locale, dict, images, title, description, heroImages }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const wc = dict?.watercolors ?? {}
  const nav = dict?.nav ?? {}
  const displayTitle = title ?? wc.title ?? 'Akvareller 1975–2012'
  const displayDesc = description ?? wc.short_description ?? 'En serie axonometriska arkitektoniska visioner.'
  const hasHero = heroImages && heroImages.length > 0

  return (
    <div style={hasHero ? { marginTop: 'calc(-1 * var(--header-h))' } : {}}>

      {/* ── Hero slideshow (only when heroImages configured) ── */}
      {hasHero && (
        <div style={{ position: 'relative', height: '100vh', minHeight: 480, overflow: 'hidden', marginBottom: '4rem' }}>
          <ExhibitionsHeroSlideshow images={heroImages} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)' }} />

          <div className="page-pad" style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0 }}>
            <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{nav.portfolio ?? 'Portfolio'}</span>
            </Link>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              {displayTitle}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--fs-sm)', margin: '0 0 1.5rem' }}>
              {images.length} {wc.gallery_count ?? 'verk'}
            </p>
            {/* Scroll-down arrow */}
            <div style={{ opacity: 0.7, animation: 'scrollDrop 2.4s ease-in-out infinite', pointerEvents: 'none', display: 'inline-block' }}>
              <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
                <line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="4,14 10,21 16,14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className={hasHero ? '' : 'section-gap'}>
        {/* Header (non-hero mode or repeated in scrolled view) */}
        {!hasHero && (
          <div className="page-pad" style={{ marginBottom: '3rem' }}>
            <Link href={`/${locale}/portfolio`} className="back-link">
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{nav.portfolio ?? 'Portfolio'}</span>
            </Link>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
              {displayTitle}
            </h1>
          </div>
        )}

        {/* Description + links — always shown below hero or header */}
        <div className="page-pad" style={{ marginBottom: '2rem', paddingTop: hasHero ? 0 : undefined }}>
          {hasHero && (
            <Link href={`/${locale}/portfolio`} className="back-link" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{nav.portfolio ?? 'Portfolio'}</span>
            </Link>
          )}
          {hasHero && (
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: hasHero ? '1rem' : undefined, marginBottom: '1rem' }}>
              {displayTitle}
            </h1>
          )}
          <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1rem' }}>
            {displayDesc}
          </p>
          <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>
            {wc.context_1 ?? ''} {wc.context_2 ?? ''}
          </p>
          {/* Catalogue text links */}
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem', fontSize: 'var(--fs-xs)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Link href={`/${locale}/texts/jan-oqvist-2012`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>LÄS MER — Jan Öqvist</Link>
            <Link href={`/${locale}/texts/peter-cornell-2012`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>LÄS MER — Peter Cornell</Link>
            <Link href={`/${locale}/texts/catharina-gabrielsson-2012`} style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>LÄS MER — Catharina Gabrielsson</Link>
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
      </div>{/* end hasHero wrapper */}
    </div>
  )
}
