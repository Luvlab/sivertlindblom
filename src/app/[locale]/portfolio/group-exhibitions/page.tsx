import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getExhibitions } from '@/lib/data-server'
import type { Exhibition } from '@/lib/exhibitions-data'
import ExhibitionsHeroSlideshow from '@/components/gallery/ExhibitionsHeroSlideshow'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'

export const metadata: Metadata = { title: 'Grupputställningar' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Pull YouTube video IDs from an exhibition's links/body/url and turn them into
// thumbnail URLs, so exhibitions whose material is a film still show an image.
const YT_RE = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/g

function youtubeThumbs(ex: Exhibition): string[] {
  const ids = new Set<string>()
  const haystacks: string[] = []
  if (ex.url) haystacks.push(ex.url)
  if (ex.body) haystacks.push(ex.body)
  for (const l of ex.links ?? []) if (l.url) haystacks.push(l.url)
  for (const h of haystacks) {
    for (const m of h.matchAll(YT_RE)) ids.add(m[1])
  }
  return [...ids].map((id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`)
}

// Images first, then film thumbnails — the card slideshow cycles through all.
function slidesFor(ex: Exhibition): string[] {
  return [...ex.images, ...youtubeThumbs(ex)]
}

export default async function GroupExhibitionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  // Only the exhibitions Jan flagged as group shows, newest first.
  const groups = (await getExhibitions())
    .filter((ex) => ex.group)
    .sort((a, b) => b.year - a.year)

  const title = dict.portfolio?.cat_group_exhibitions ?? 'Grupputställningar i urval'
  const heroImages = groups
    .map((ex) => slidesFor(ex)[0])
    .filter((url): url is string => Boolean(url))

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* Hero — full viewport, bleeds under the fixed header + subnav */}
      <div style={{ position: 'relative', height: '85vh', minHeight: 480, overflow: 'hidden', marginBottom: '4rem' }}>
        <ExhibitionsHeroSlideshow images={heroImages} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.88) 100%)' }} />

        <div className="page-pad" style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0 }}>
          <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--fs-sm)' }}>
            {groups.length} {(dict.portfolio?.cat_group_exhibitions ?? 'grupputställningar').toLowerCase()}
          </p>
        </div>
      </div>

      <hr className="divider" />

      {/* Mosaic grid — same card treatment as Utställningar */}
      <div className="page-pad" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {groups.map((ex, i) => {
            const slides = slidesFor(ex)
            return (
              <Link
                key={ex.slug}
                href={`/${locale}/portfolio/exhibitions/${ex.slug}`}
                id={ex.slug}
                className="card-hover"
                style={{
                  display: 'block',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: 2,
                }}
              >
                {slides.length > 0 ? (
                  <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
                    <PortfolioSlideshow
                      images={slides}
                      alt={ex.title}
                      objectFit="cover"
                      interval={4000 + i * 350}
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
                      {ex.year}
                    </span>
                  </div>
                )}
                <div style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{ex.year}</span>
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 1.35, marginTop: '0.3rem' }}>{ex.title}</div>
                  {ex.location && (
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.25rem' }}>{ex.location}</div>
                  )}
                </div>
              </Link>
            )
          })}
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
