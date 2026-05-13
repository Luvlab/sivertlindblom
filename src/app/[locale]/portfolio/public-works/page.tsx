import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'
import SculptureMap from '@/components/SculptureMap'
import { getMapPins, getPublicWorks } from '@/lib/data-server'

export const metadata: Metadata = { title: 'Public Works' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const EXTERIORS: Array<{ title: string; year: number; location: string; slug?: string }> = [
  { title: 'Blasieholmstorg — Hästar i brons', year: 1989, location: 'Stockholm',  slug: 'blasieholmstorg-1989' },
  { title: 'Bältesspännarparken',               year: 2013, location: 'Göteborg',  slug: 'baltesspaennarparken-2013' },
  { title: 'Nobelmonument',                     year: 2003, location: 'New York',  slug: 'nobelmonument-new-york-2003' },
  { title: 'Gustav Adolfs torg, fontäner',      year: 2002, location: 'Malmö',     slug: 'gustav-adolfs-torg-2002' },
  { title: 'Eskilstuna rondellen — Profilen',   year: 2002, location: 'Eskilstuna' },
  { title: 'Potatisåkern — Profilen',           year: 2001, location: 'Malmö' },
  { title: 'Kungsträdgården, norra delen',      year: 1997, location: 'Stockholm' },
  { title: 'Cavallobrunnen, Resecentrum',       year: 1995, location: 'Skövde' },
  { title: 'Haga Norra gångbro',                year: 1993, location: 'Stockholm' },
  { title: 'Kungliga Biblioteket',              year: 1998, location: 'Stockholm' },
  { title: 'Sergels torg — Sergel monumentet',  year: 1998, location: 'Stockholm' },
  { title: 'Synagoga — Förintelsenmonumentet',  year: 1998, location: 'Stockholm' },
  { title: 'SEB Banken Huvudkontor',            year: 1992, location: 'Rissne' },
  { title: 'Sveriges ambassad, entré',          year: 1990, location: 'Tokyo' },
  { title: 'Stockholms Universitet Campus',     year: 1987, location: 'Stockholm',  slug: 'frescati-1987' },
  { title: 'SAS Huvudkontor, Frösundavik',      year: 1988, location: 'Stockholm' },
  { title: 'Skissernas Museum, fasad',          year: 1988, location: 'Lund' },
  { title: 'Pharmacia entréplats',              year: 1984, location: 'Uppsala' },
  { title: 'Fersenska Palatset, Handelsbanken', year: 1975, location: 'Stockholm' },
  { title: 'Garnisonen',                        year: 1972, location: 'Stockholm' },
]

const INTERIORS: Array<{ title: string; year: number; location: string; slug?: string }> = [
  { title: 'Nobel Forum',                           year: 1993, location: 'Solna' },
  { title: 'Berns Ljusgård',                        year: 1991, location: 'Stockholm' },
  { title: 'Västra skogen T-banestation',           year: 1975, location: 'Stockholm', slug: 'vastra-skogen-1975' },
  { title: 'Sveriges Riksbank',                     year: 1973, location: 'Stockholm' },
  { title: 'Riksbyggen/Göta Ark, Medborgarplatsen', year: 1984, location: 'Stockholm' },
  { title: 'Tetra Pak',                             year: 1984, location: 'Lausanne' },
  { title: 'Göteborgs Universitetsbibliotek',       year: 1985, location: 'Göteborg' },
  { title: 'NK Ljusgård',                           year: 1968, location: 'Stockholm' },
  { title: 'Stadsteatern Stockholm',                year: 1970, location: 'Stockholm' },
]

function WorkCard({
  title, year, location, slug, locale, images, idx,
}: {
  title: string; year: number; location: string; slug?: string; locale: string; images?: string[]; idx: number
}) {
  const hasImages = images && images.length > 0

  const inner = (
    <>
      {/* Thumbnail slideshow */}
      {hasImages ? (
        <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
          <PortfolioSlideshow
            images={images}
            alt={title}
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
            {year}
          </span>
        </div>
      )}

      {/* Text */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>{year}</span>
        <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 1.35, marginTop: '0.3rem' }}>{title}</div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.25rem' }}>{location}</div>
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

  if (slug) {
    return (
      <Link href={`/${locale}/portfolio/public-works/${slug}`} className="card-hover" style={cardStyle}>
        {inner}
      </Link>
    )
  }
  return <div className="card-hover" style={cardStyle}>{inner}</div>
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

  // Build slug → image URLs lookup from DB works
  const imagesBySlug: Record<string, string[]> = {}
  for (const w of allWorks) {
    if (w.slug && w.images.length > 0) {
      imagesBySlug[w.slug] = w.images.slice(0, 8).map((i) => i.url)
    }
  }

  const counts = {
    total: locations.length,
    countries: new Set(locations.map((l) => l.country)).size,
  }

  const sortedExteriors = [...EXTERIORS].sort((a, b) => b.year - a.year)
  const sortedInteriors = [...INTERIORS].sort((a, b) => b.year - a.year)

  const blasieholmWork = allWorks.find((w) => w.slug === 'blasieholmstorg-1989')
  const blasieholmImages: LightboxImage[] = (blasieholmWork?.images ?? []).map((img) => ({
    url: img.url,
    alt: img.alt,
  }))

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

      {/* ── Map — natural height, no 100dvh wrapper ───────────── */}
      <SculptureMap locations={locations} locale={locale} />

      {/* ── Exteriörer — thumbnail grid ───────────────────────── */}
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
            {EXTERIORS.length} {dict.portfolio?.count_works ?? 'verk'}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        }}>
          {sortedExteriors.map((w, i) => (
            <WorkCard
              key={w.title}
              {...w}
              locale={locale}
              images={w.slug ? imagesBySlug[w.slug] : undefined}
              idx={i}
            />
          ))}
        </div>
      </div>

      {/* ── Interiörer — thumbnail grid ───────────────────────── */}
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
            {INTERIORS.length} {dict.portfolio?.count_works ?? 'verk'}
          </span>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        }}>
          {sortedInteriors.map((w, i) => (
            <WorkCard
              key={w.title}
              {...w}
              locale={locale}
              images={w.slug ? imagesBySlug[w.slug] : undefined}
              idx={i}
            />
          ))}
        </div>
      </div>

      {/* ── Blasieholmstorg featured gallery ──────────────────── */}
      <div className="page-pad" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
            Blasieholmstorg, Stockholm 1989
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
            {dict.portfolio?.blasieholmstorg_desc ?? 'Två grönpatinerade bronshästar modellerade efter originalen på San Marcos basilika i Venedig. Gjutna av Herman Bergmans Konstgjuteri AB.'}
          </p>
          {blasieholmImages.length > 0 && (
            <GalleryGrid images={blasieholmImages} aspectRatio="4/3" columns="sm" />
          )}
        </section>

        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
        </Link>
      </div>
    </div>
  )
}
