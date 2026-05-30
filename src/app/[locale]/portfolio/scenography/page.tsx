import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import ExhibitionsHeroSlideshow from '@/components/gallery/ExhibitionsHeroSlideshow'
import { getWorks } from '@/lib/scenography-data'

export const metadata: Metadata = { title: 'Scenography' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const FILTERS = [
  { key: 'alla', label: 'Alla' },
  { key: 'Teaterscenografi', label: 'Teaterscenografi' },
  { key: 'Koreografi', label: 'Koreografi' },
] as const

export default async function ScenographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [dict, WORKS] = await Promise.all([
    getDictionary(locale as Locale),
    getWorks(),
  ])

  // Pool all scenography images for the hero slideshow
  const heroImages = WORKS.flatMap(w => w.images).filter(Boolean)

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* Hero — full viewport, bleeds under header + subnav */}
      <div style={{ position: 'relative', height: '100vh', minHeight: 480, overflow: 'hidden', marginBottom: '4rem' }}>
        <ExhibitionsHeroSlideshow images={heroImages} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.88) 100%)' }} />

        {/* Title block */}
        <div className="page-pad" style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0 }}>
          <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            {dict.portfolio?.cat_scenography ?? 'Scenografi'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--fs-sm)', margin: 0 }}>
            {WORKS.length} {dict.portfolio?.cat_scenography?.toLowerCase() ?? 'scenografier'}
            {WORKS.length > 0 && `, ${Math.min(...WORKS.map(w => w.year ?? 9999).filter(y => y < 9999))}–${Math.max(...WORKS.map(w => w.year ?? 0))}`}
          </p>

          {/* Scroll-down arrow */}
          <div style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            opacity: 0.7,
            animation: 'scrollDrop 2.4s ease-in-out infinite',
            pointerEvents: 'none',
          }}>
            <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ display: 'block' }}>
              <line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="4,14 10,21 16,14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="section-gap" style={{ paddingTop: 0 }}>
        <div className="page-pad" style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
            {dict.portfolio?.desc_scenography ?? 'Sivert har genom åren samarbetat med såväl teaterregissörer och koreografer med scenografiska lösningar och skulpturala objekt.'}
          </p>

          {/* Filter nav */}
          <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }} aria-label="Filter">
            {FILTERS.map((f) => (
              <a
                key={f.key}
                href={f.key === 'alla' ? '#works' : `#type-${f.key}`}
                className="filter-link"
                style={{
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  padding: '0.3em 0.8em',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                {f.label}
              </a>
            ))}
          </nav>
        </div>

        <hr className="divider" />

        {/* Works grid — full bleed, no page-pad */}
        <div
          id="works"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '3px',
          }}
        >
          {WORKS.map((w) => (
            <Link
              key={w.slug}
              href={`/${locale}/portfolio/scenography/${w.slug}`}
              className="card card-hover"
              id={`type-${w.type}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              {/* Image area — 4/3 aspect ratio */}
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: 'var(--color-bg-surface, #111)' }}>
                {w.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={w.images[0]}
                    alt={w.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#1a1a1a' }} />
                )}
              </div>

              {/* Text area */}
              <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                  {w.year ?? ''}
                </p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-lg, 1.15rem)', margin: '0 0 0.3rem', lineHeight: 1.3 }}>
                  {w.title}
                </h2>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', margin: '0 0 0.6rem' }}>
                  {w.venue}
                </p>
                <span className="badge">
                  {w.type}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
