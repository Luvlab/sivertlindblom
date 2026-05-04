import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import exhibitions from '@/lib/exhibitions-data'

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

  // Sort newest first
  const sorted = [...exhibitions].sort((a, b) => b.year - a.year)

  return (
    <div>
      {/* Hero — bleeds under the fixed header, no top padding */}
      <div style={{ position: 'relative', height: '55vh', minHeight: 300, overflow: 'hidden', marginBottom: '4rem', marginTop: 'calc(-1 * (var(--header-h) + 1.5rem))' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://sivertlindblom.se/wp-content/uploads/2015/01/Siverts-exit.jpg"
          alt="Sivert Lindblom"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.9) 100%)' }} />
        <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
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
