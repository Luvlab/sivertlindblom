import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getExhibitions } from '@/lib/data-server'
import ExhibitionsHeroSlideshow from '@/components/gallery/ExhibitionsHeroSlideshow'

export const metadata: Metadata = { title: 'Exhibitions' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ExhibitionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const sorted = await getExhibitions()

  // One hero image per exhibition, deduped — fed to the client slideshow
  const heroImages = sorted
    .map(ex => ex.images[0])
    .filter((url): url is string => Boolean(url))

  return (
    <div>
      {/* Hero — full viewport, bleeds under the fixed header + subnav */}
      <div style={{ position: 'relative', height: '100vh', minHeight: 480, overflow: 'hidden', marginBottom: '4rem', marginTop: 'calc(-1 * (var(--header-h) + var(--subnav-h) + 1.5rem))' }}>
        <ExhibitionsHeroSlideshow images={heroImages} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.88) 100%)' }} />

        {/* Title block */}
        <div className="page-pad" style={{ position: 'absolute', bottom: '3.5rem', left: 0, right: 0 }}>
          <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            {dict.portfolio?.cat_exhibitions ?? 'Utställningar'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--fs-sm)' }}>
            {sorted.length} {dict.portfolio?.cat_exhibitions?.toLowerCase() ?? 'utställningar'}, 1961–2016
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '1.1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.3rem',
          pointerEvents: 'none',
          zIndex: 2,
        }}>
          <div style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.22)' }} />
          <svg
            className="scroll-hint-chevron"
            width="14" height="8" viewBox="0 0 14 8"
            fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ color: 'rgba(200,169,126,0.75)' }}
          >
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'grid', gap: 0 }}>
          {sorted.map((ex) => (
            <Link
              key={ex.slug}
              href={`/${locale}/portfolio/exhibitions/${ex.slug}`}
              id={ex.slug}
              className="row-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '5rem 1fr auto',
                gap: '1.5rem',
                alignItems: 'center',
                padding: '1.1rem 0',
                borderBottom: '1px solid var(--color-border)',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{ex.year}</span>
              <span style={{ fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}>{ex.title}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{ex.location}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="page-pad" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
        </Link>
      </div>
    </div>
  )
}
