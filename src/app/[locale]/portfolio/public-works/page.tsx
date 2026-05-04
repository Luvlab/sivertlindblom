import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import SculptureMap from '@/components/SculptureMap'
import { SCULPTURE_LOCATIONS } from '@/lib/sculpture-locations'

export const metadata: Metadata = { title: 'Public Works' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const EXTERIORS: Array<{ title: string; year: number; location: string; slug?: string }> = [
  { title: 'Blasieholmstorg — Hästar i brons', year: 1989, location: 'Stockholm',            slug: 'blasieholmstorg-1989' },
  { title: 'Bältesspännarparken',               year: 2013, location: 'Göteborg',            slug: 'baltesspaennarparken-2013' },
  { title: 'Nobelmonument',                     year: 2003, location: 'New York',             slug: 'nobelmonument-new-york-2003' },
  { title: 'Gustav Adolfs torg, fontäner',      year: 2002, location: 'Malmö',               slug: 'gustav-adolfs-torg-2002' },
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
  { title: 'Stockholms Universitet Campus',     year: 1987, location: 'Stockholm',            slug: 'frescati-1987' },
  { title: 'SAS Huvudkontor, Frösundavik',      year: 1988, location: 'Stockholm' },
  { title: 'Skissernas Museum, fasad',          year: 1988, location: 'Lund' },
  { title: 'Pharmacia entréplats',              year: 1984, location: 'Uppsala' },
  { title: 'Fersenska Palatset, Handelsbanken', year: 1975, location: 'Stockholm' },
  { title: 'Garnisonen',                        year: 1972, location: 'Stockholm' },
]

const INTERIORS: Array<{ title: string; year: number; location: string; slug?: string }> = [
  { title: 'Nobel Forum',                              year: 1993, location: 'Solna' },
  { title: 'Berns Ljusgård',                           year: 1991, location: 'Stockholm' },
  { title: 'Västra skogen T-banestation',              year: 1975, location: 'Stockholm', slug: 'vastra-skogen-1975' },
  { title: 'Sveriges Riksbank',                        year: 1973, location: 'Stockholm' },
  { title: 'Riksbyggen/Göta Ark, Medborgarplatsen',    year: 1984, location: 'Stockholm' },
  { title: 'Tetra Pak',                                year: 1984, location: 'Lausanne' },
  { title: 'Göteborgs Universitetsbibliotek',          year: 1985, location: 'Göteborg' },
  { title: 'NK Ljusgård',                              year: 1968, location: 'Stockholm' },
  { title: 'Stadsteatern Stockholm',                   year: 1970, location: 'Stockholm' },
]

function WorkRow({
  title, year, location, slug, locale,
}: {
  title: string; year: number; location: string; slug?: string; locale: string
}) {
  const rowStyle = {
    display: 'grid',
    gridTemplateColumns: '5rem 1fr auto',
    gap: '1.5rem',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid var(--color-border)',
  } as const

  const inner = (
    <>
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{year}</span>
      <span style={{ fontSize: 'var(--fs-base)' }}>{title}</span>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{location}</span>
    </>
  )

  if (slug) {
    return (
      <Link href={`/${locale}/portfolio/public-works/${slug}`} className="row-hover" style={rowStyle}>
        {inner}
      </Link>
    )
  }
  return <div className="row-hover" style={rowStyle}>{inner}</div>
}

export default async function PublicWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const counts = {
    total: SCULPTURE_LOCATIONS.length,
    countries: new Set(SCULPTURE_LOCATIONS.map((l) => l.country)).size,
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

      {/* ── Full-viewport map ─────────────────────────────────── */}
      <div style={{ height: '100dvh', width: '100%', position: 'relative' }}>
        <SculptureMap locations={SCULPTURE_LOCATIONS} locale={locale} />
      </div>

      {/* ── All locations ─────────────────────────────────────── */}
      <div className="page-pad" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>

        {/* Exteriors */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
            {dict.portfolio?.exteriors ?? 'Exteriörer'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem' }}>
            {EXTERIORS.length} {dict.portfolio?.count_works ?? 'verk'}
          </p>
          {EXTERIORS.sort((a, b) => b.year - a.year).map((w) => (
            <WorkRow key={w.title} {...w} locale={locale} />
          ))}
        </section>

        {/* Interiors */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
            {dict.portfolio?.interiors ?? 'Interiörer'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem' }}>
            {INTERIORS.length} {dict.portfolio?.count_works ?? 'verk'}
          </p>
          {INTERIORS.sort((a, b) => b.year - a.year).map((w) => (
            <WorkRow key={w.title} {...w} locale={locale} />
          ))}
        </section>

        {/* Blasieholmstorg featured gallery */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
            Blasieholmstorg, Stockholm 1989
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
            {dict.portfolio?.blasieholmstorg_desc ?? 'Två grönpatinerade bronshästar modellerade efter originalen på San Marcos basilika i Venedig. Gjutna av Herman Bergmans Konstgjuteri AB.'}
          </p>
          <GalleryGrid
            images={([
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-75.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-68.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-42.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-02.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-57.jpg',
              'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-60.jpg',
            ] as string[]).map((url, i): LightboxImage => ({ url, alt: `Blasieholmstorg ${i + 1}` }))}
            aspectRatio="4/3"
            columns="sm"
          />
        </section>

        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
        </Link>
      </div>
    </div>
  )
}
