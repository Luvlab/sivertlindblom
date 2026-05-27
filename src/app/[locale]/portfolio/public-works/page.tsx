import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'
import SculptureMap from '@/components/SculptureMap'
import { getMapPins, getPublicWorks } from '@/lib/data-server'
import type { PublicWork } from '@/lib/public-works'

export const metadata: Metadata = { title: 'Public Works' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

function WorkCard({
  work,
  locale,
  idx,
}: {
  work: PublicWork
  locale: string
  idx: number
}) {
  const images = work.images.slice(0, 8).map((i) => i.url)
  const hasImages = images.length > 0

  const inner = (
    <>
      {/* Thumbnail */}
      {hasImages ? (
        <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
          <PortfolioSlideshow
            images={images}
            alt={work.title}
            objectFit="cover"
            interval={4000 + idx * 350}
          />
        </div>
      ) : (
        <div style={{
          aspectRatio: '4/3',
          background: 'var(--color-bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-border)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {work.year}
          </span>
        </div>
      )}

      {/* Text */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{work.year}</span>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 1.35, marginTop: '0.3rem' }}>{work.title}</div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.25rem' }}>{work.location}</div>
      </div>
    </>
  )

  const cardStyle = {
    display: 'block',
    overflow: 'hidden',
    textDecoration: 'none',
    borderRight: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
  } as const

  return (
    <Link href={`/${locale}/portfolio/public-works/${work.slug}`} className="card-hover" style={cardStyle}>
      {inner}
    </Link>
  )
}

export default async function PublicWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [dict, locations, allWorks] = await Promise.all([
    getDictionary(locale as Locale),
    getMapPins(),
    getPublicWorks(),
  ])

  const exteriors = allWorks
    .filter((w) => w.category === 'exterior')
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))

  const interiors = allWorks
    .filter((w) => w.category === 'interior')
    .sort((a, b) => parseInt(b.year) - parseInt(a.year))

  const counts = {
    total: locations.length,
    countries: new Set(locations.map((l) => l.country)).size,
  }

  return (
    <div>
      {/* ── Compact page header ──────────────────────────────── */}
      <div className="page-pad" style={{ paddingTop: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
        <Link href={`/${locale}/portfolio`} className="back-link" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.5rem)', margin: 0 }}>
            {dict.portfolio?.cat_public ?? 'Offentliga arbeten'}
          </h1>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', margin: 0 }}>
            {counts.total} {dict.portfolio?.map_works ?? 'verk'} · {counts.countries} {dict.portfolio?.map_countries ?? 'länder'}
          </p>
        </div>
      </div>

      {/* ── Exteriörer ────────────────────────────────────────── */}
      <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="page-pad" style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '1.5rem',
          paddingTop: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, margin: 0 }}>
            {dict.portfolio?.exteriors ?? 'Exteriörer'}
          </h2>
          <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {exteriors.length} {dict.portfolio?.count_works ?? 'verk'}
          </span>
        </div>
        <div className="page-pad" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
        }}>
          {exteriors.map((w, i) => (
            <WorkCard key={w.slug} work={w} locale={locale} idx={i} />
          ))}
        </div>
      </div>

      {/* ── Interiörer ────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="page-pad" style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '1.5rem',
          paddingTop: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, margin: 0 }}>
            {dict.portfolio?.interiors ?? 'Interiörer'}
          </h2>
          <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {interiors.length} {dict.portfolio?.count_works ?? 'verk'}
          </span>
        </div>
        <div className="page-pad" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
        }}>
          {interiors.map((w, i) => (
            <WorkCard key={w.slug} work={w} locale={locale} idx={i} />
          ))}
        </div>
      </div>

      {/* ── Map ───────────────────────────────────────────────── */}
      <SculptureMap locations={locations} locale={locale} />

      {/* ── Back link ──────────────────────────────────────────── */}
      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
        </Link>
      </div>
    </div>
  )
}
