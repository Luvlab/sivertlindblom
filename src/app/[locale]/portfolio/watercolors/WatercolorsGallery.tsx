'use client'

import Link from 'next/link'
import { useState, useCallback, useEffect, useRef } from 'react'

// All 49 watercolors confirmed from sivertlindblom.se/folio/akvareller-1975-2012/
const WATERCOLOR_IMAGES = [
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',  alt: 'Akvarell nr 01, 1507' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-02-1506-2.jpg',  alt: 'Akvarell nr 02, 1506' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-02-1931-2.jpg',  alt: 'Akvarell nr 02, 1931' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-03-1505.jpg',    alt: 'Akvarell nr 03, 1505' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-04-1504.jpg',    alt: 'Akvarell nr 04, 1504' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-10-1435.jpg',    alt: 'Akvarell nr 10, 1435' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-12-1489.jpg',    alt: 'Akvarell nr 12, 1489' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-12-1501.jpg',    alt: 'Akvarell nr 12, 1501' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-13-1500.jpg',    alt: 'Akvarell nr 13, 1500' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-14-1499-2.jpg',  alt: 'Akvarell nr 14, 1499' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-15-1498.jpg',    alt: 'Akvarell nr 15, 1498' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-16-1497.jpg',    alt: 'Akvarell nr 16, 1497' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-17-1496.jpg',    alt: 'Akvarell nr 17, 1496' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-19-1494.jpg',    alt: 'Akvarell nr 19, 1494' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-21-1492.jpg',    alt: 'Akvarell nr 21, 1492' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-22-1491.jpg',    alt: 'Akvarell nr 22, 1491' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-23-1490.jpg',    alt: 'Akvarell nr 23, 1490' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-25-1488.jpg',    alt: 'Akvarell nr 25, 1488' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-27-1486.jpg',    alt: 'Akvarell nr 27, 1486' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-29-1431-2.jpg',  alt: 'Akvarell nr 29, 1431' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-30-1485.jpg',    alt: 'Akvarell nr 30, 1485' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-33-1482.jpg',    alt: 'Akvarell nr 33, 1482' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-35-1481.jpg',    alt: 'Akvarell nr 35, 1481' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-36-1480.jpg',    alt: 'Akvarell nr 36, 1480' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-38-1478.jpg',    alt: 'Akvarell nr 38, 1478' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-42-1473.jpg',    alt: 'Akvarell nr 42, 1473' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-43-1472.jpg',    alt: 'Akvarell nr 43, 1472' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-44-1471.jpg',    alt: 'Akvarell nr 44, 1471' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-46-1469.jpg',    alt: 'Akvarell nr 46, 1469' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-47-1468.jpg',    alt: 'Akvarell nr 47, 1468' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-48-1467.jpg',    alt: 'Akvarell nr 48, 1467' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-48-1470.jpg',    alt: 'Akvarell nr 48, 1470' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-52-1465.jpg',    alt: 'Akvarell nr 52, 1465' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-54-1463.jpg',    alt: 'Akvarell nr 54, 1463' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-55-1462.jpg',    alt: 'Akvarell nr 55, 1462' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-56-1461.jpg',    alt: 'Akvarell nr 56, 1461' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-57-1460.jpg',    alt: 'Akvarell nr 57, 1460' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-58-1459.jpg',    alt: 'Akvarell nr 58, 1459' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-59-1458.jpg',    alt: 'Akvarell nr 59, 1458' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-62-1455.jpg',    alt: 'Akvarell nr 62, 1455' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-64-1453-2.jpg',  alt: 'Akvarell nr 64, 1453' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-66-1451-2.jpg',  alt: 'Akvarell nr 66, 1451' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-67-1450.jpg',    alt: 'Akvarell nr 67, 1450' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-68-1449.jpg',    alt: 'Akvarell nr 68, 1449' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-69-1448-2.jpg',  alt: 'Akvarell nr 69, 1448' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-70-1447-2.jpg',  alt: 'Akvarell nr 70, 1447' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-76-1443-2.jpg',  alt: 'Akvarell nr 76, 1443' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-79-1445.jpg',    alt: 'Akvarell nr 79, 1445' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-80-1428.jpg',    alt: 'Akvarell nr 80, 1428' },
]

interface Props { locale: string }

export default function WatercolorsGallery({ locale }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)

  const open  = useCallback((i: number) => {
    setLightboxIdx(i)
    document.body.style.overflow = 'hidden'
  }, [])

  const close = useCallback(() => {
    setLightboxIdx(null)
    document.body.style.overflow = ''
  }, [])

  const prev = useCallback(() =>
    setLightboxIdx(i => i === null ? null : (i - 1 + WATERCOLOR_IMAGES.length) % WATERCOLOR_IMAGES.length), [])

  const next = useCallback(() =>
    setLightboxIdx(i => i === null ? null : (i + 1) % WATERCOLOR_IMAGES.length), [])

  useEffect(() => {
    if (lightboxIdx === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', handler)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIdx, prev, next, close])

  // Cleanup on unmount
  useEffect(() => () => { document.body.style.overflow = '' }, [])

  const current = lightboxIdx !== null ? WATERCOLOR_IMAGES[lightboxIdx] : null

  return (
    <div className="section-gap">
      {/* Header */}
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">Portfolio</span>
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          Akvareller 1975–2012
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1rem' }}>
          En serie axonometriska arkitektoniska visioner målade med omärkta Winsor &amp; Newton-pigment direkt från asken.
          Peter Cornell beskriver dem som &ldquo;ett strömmande av geniala konstruktioner&rdquo; — ett hermetiskt arkitektoniskt landskap.
        </p>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>
          Hundra verk visades i sin helhet på Kungl. Konstakademien, Stockholm, oktober–november 2012 (70 löpmeter vägg).
          Katalog med texter av Peter Cornell, Jan Öqvist och Catharina Gabrielsson.
        </p>
        <div style={{ marginTop: '1rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.08em' }}>
          {WATERCOLOR_IMAGES.length} verk &mdash; klicka för fullskärmsvisning
        </div>
      </div>

      <hr className="divider" />

      {/* 3:2 landscape grid */}
      <div
        className="page-pad"
        style={{
          paddingTop: '2rem',
          paddingBottom: '3rem',
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        }}
      >
        {WATERCOLOR_IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            className="gallery-thumb"
            aria-label={img.alt}
            style={{ aspectRatio: '3/2', border: 'none', padding: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} loading={i < 9 ? 'eager' : 'lazy'} />
          </button>
        ))}
      </div>

      {/* ── Fullscreen lightbox ── */}
      {current && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          tabIndex={-1}
          onClick={close}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.97)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            outline: 'none',
          }}
          /* touch swipe */
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            const diff = touchStartX.current - e.changedTouches[0].clientX
            if (diff > 50)       next()
            else if (diff < -50) prev()
          }}
        >
          {/* Counter */}
          <div style={{
            position: 'absolute', top: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.45)', fontSize: 'var(--fs-xs)',
            letterSpacing: '0.2em', textTransform: 'uppercase', pointerEvents: 'none',
          }}>
            {(lightboxIdx ?? 0) + 1} / {WATERCOLOR_IMAGES.length}
          </div>

          {/* Close */}
          <button aria-label="Stäng" onClick={e => { e.stopPropagation(); close() }}
            style={{
              position: 'absolute', top: '0.75rem', right: '1.25rem',
              background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.6)', fontSize: '2.2rem',
              cursor: 'pointer', lineHeight: 1, zIndex: 201,
            }}>×</button>

          {/* Prev */}
          <button aria-label="Föregående" onClick={e => { e.stopPropagation(); prev() }}
            style={{
              position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)', fontSize: '1.8rem',
              cursor: 'pointer', padding: '0.6rem 1rem', lineHeight: 1,
              transition: 'background 0.15s',
            }}>‹</button>

          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url} alt={current.alt}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain', display: 'block' }}
          />

          {/* Next */}
          <button aria-label="Nästa" onClick={e => { e.stopPropagation(); next() }}
            style={{
              position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)', fontSize: '1.8rem',
              cursor: 'pointer', padding: '0.6rem 1rem', lineHeight: 1,
              transition: 'background 0.15s',
            }}>›</button>

          {/* Caption */}
          <div style={{
            position: 'absolute', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.35)', fontSize: 'var(--fs-xs)',
            letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {current.alt}
          </div>
        </div>
      )}
    </div>
  )
}
