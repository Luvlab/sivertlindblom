'use client'

import Link from 'next/link'
import { useState } from 'react'
import Lightbox from '@/components/gallery/Lightbox'
import type { LightboxImage } from '@/components/gallery/Lightbox'

const WATERCOLOR_IMAGES: LightboxImage[] = [
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',  alt: 'Akvarell nr 01, 1507' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-02-1506-2.jpg',  alt: 'Akvarell nr 02, 1506' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-02-1931-2.jpg',  alt: 'Akvarell nr 02, 1931' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-03-1505.jpg',    alt: 'Akvarell nr 03, 1505' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-04-1504.jpg',    alt: 'Akvarell nr 04, 1504' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-10-1435.jpg',    alt: 'Akvarell nr 10, 1435' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-12-1489.jpg',    alt: 'Akvarell nr 12, 1489' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-12-1501.jpg',    alt: 'Akvarell nr 12, 1501' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-13-1500.jpg',    alt: 'Akvarell nr 13, 1500' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-14-1499-2.jpg',  alt: 'Akvarell nr 14, 1499' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-15-1498.jpg',    alt: 'Akvarell nr 15, 1498' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-16-1497.jpg',    alt: 'Akvarell nr 16, 1497' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-17-1496.jpg',    alt: 'Akvarell nr 17, 1496' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-19-1494.jpg',    alt: 'Akvarell nr 19, 1494' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-21-1492.jpg',    alt: 'Akvarell nr 21, 1492' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-22-1491.jpg',    alt: 'Akvarell nr 22, 1491' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-23-1490.jpg',    alt: 'Akvarell nr 23, 1490' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-25-1488.jpg',    alt: 'Akvarell nr 25, 1488' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-27-1486.jpg',    alt: 'Akvarell nr 27, 1486' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-29-1431-2.jpg',  alt: 'Akvarell nr 29, 1431' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-30-1485.jpg',    alt: 'Akvarell nr 30, 1485' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-33-1482.jpg',    alt: 'Akvarell nr 33, 1482' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-35-1481.jpg',    alt: 'Akvarell nr 35, 1481' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-36-1480.jpg',    alt: 'Akvarell nr 36, 1480' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-38-1478.jpg',    alt: 'Akvarell nr 38, 1478' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-42-1473.jpg',    alt: 'Akvarell nr 42, 1473' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-43-1472.jpg',    alt: 'Akvarell nr 43, 1472' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-44-1471.jpg',    alt: 'Akvarell nr 44, 1471' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-46-1469.jpg',    alt: 'Akvarell nr 46, 1469' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-47-1468.jpg',    alt: 'Akvarell nr 47, 1468' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-48-1467.jpg',    alt: 'Akvarell nr 48, 1467' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-48-1470.jpg',    alt: 'Akvarell nr 48, 1470' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-52-1465.jpg',    alt: 'Akvarell nr 52, 1465' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-54-1463.jpg',    alt: 'Akvarell nr 54, 1463' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-55-1462.jpg',    alt: 'Akvarell nr 55, 1462' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-56-1461.jpg',    alt: 'Akvarell nr 56, 1461' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-57-1460.jpg',    alt: 'Akvarell nr 57, 1460' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-58-1459.jpg',    alt: 'Akvarell nr 58, 1459' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-59-1458.jpg',    alt: 'Akvarell nr 59, 1458' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-62-1455.jpg',    alt: 'Akvarell nr 62, 1455' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-64-1453-2.jpg',  alt: 'Akvarell nr 64, 1453' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-66-1451-2.jpg',  alt: 'Akvarell nr 66, 1451' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-67-1450.jpg',    alt: 'Akvarell nr 67, 1450' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-68-1449.jpg',    alt: 'Akvarell nr 68, 1449' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-69-1448-2.jpg',  alt: 'Akvarell nr 69, 1448' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-70-1447-2.jpg',  alt: 'Akvarell nr 70, 1447' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-76-1443-2.jpg',  alt: 'Akvarell nr 76, 1443' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-79-1445.jpg',    alt: 'Akvarell nr 79, 1445' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-80-1428.jpg',    alt: 'Akvarell nr 80, 1428' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props { locale: string; dict: any }

export default function WatercolorsGallery({ locale, dict }: Props) {
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
          {wc.title ?? 'Akvareller 1975–2012'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1rem' }}>
          {wc.short_description ?? 'En serie axonometriska arkitektoniska visioner.'}
        </p>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>
          {wc.context_1 ?? ''} {wc.context_2 ?? ''}
        </p>
        <div style={{ marginTop: '1rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.08em' }}>
          {WATERCOLOR_IMAGES.length} {wc.gallery_count ?? 'verk'} — {wc.click_hint ?? 'klicka för bildspel'}
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
          {WATERCOLOR_IMAGES.map((img, i) => (
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
          images={WATERCOLOR_IMAGES}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </div>
  )
}
