import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Exhibitions' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const EXHIBITIONS = [
  { slug: 'vandalorum-2016',               title: 'VANDALORUM',                                               year: 2016, location: 'Värnamo' },
  { slug: 'konstakademien-2012',           title: 'Kungl. Konstakademien för de fria konsterna',              year: 2012, location: 'Stockholm' },
  { slug: 'korsbarsgarden-2010',           title: 'Körsbärsgården, Sundre',                                   year: 2010, location: 'Gotland' },
  { slug: 'galerie-aronowitsch-2005',      title: 'Galerie Aronowitsch',                                      year: 2005, location: 'Stockholm' },
  { slug: 'historiska-museet-1998',        title: 'Historiska Museet — Kulturåret',                          year: 1998, location: 'Stockholm' },
  { slug: 'eskilstuna-1996',               title: 'Eskilstuna Konstförening',                                 year: 1996, location: 'Eskilstuna' },
  { slug: 'skovde-1996',                   title: 'Skövde Konsthall',                                         year: 1996, location: 'Skövde' },
  { slug: 'lunds-konsthall-1993',          title: 'Lunds Konsthall',                                          year: 1993, location: 'Lund' },
  { slug: 'skissernas-1993',               title: 'Skissernas Museum',                                        year: 1993, location: 'Lund' },
  { slug: 'bildmuseet-1993',               title: 'Bildmuseet',                                               year: 1993, location: 'Umeå' },
  { slug: 'galleri-wallner-1987',          title: 'Galleri Wallner',                                          year: 1987, location: 'Stockholm' },
  { slug: 'malmo-konsthall-1986',          title: 'Malmö Konsthall — Metapolis',                              year: 1986, location: 'Malmö' },
  { slug: 'liljevalchs-1986',              title: 'Liljevalchs Konsthall',                                    year: 1986, location: 'Stockholm' },
  { slug: 'ibid-ii-1983',                  title: 'IBID II, Münchenbryggeriet',                               year: 1983, location: 'Stockholm' },
  { slug: 'ibid-i-1982',                   title: 'IBID I, Linoljefabriken Danviken',                         year: 1982, location: 'Stockholm' },
  { slug: 'galeri-asbaek-1981',            title: 'Galeri Asbæk',                                             year: 1981, location: 'Köpenhamn' },
  { slug: 'aronowitsch-1981',              title: 'Galerie Aronowitsch',                                      year: 1981, location: 'Stockholm' },
  { slug: 'ccs-paris-1980',               title: 'Sans Titre, Centre Culturel Suédois',                      year: 1980, location: 'Paris' },
  { slug: 'biennale-middelheim-1979',      title: 'Biennale Middelheim',                                      year: 1979, location: 'Antwerpen' },
  { slug: 'galleri-wallner-1978',          title: 'Galleri Wallner',                                          year: 1978, location: 'Stockholm' },
  { slug: 'doktor-glas-kungstradgarden-1978', title: 'Galleri Doktor Glas, Kungsträdgården',                 year: 1978, location: 'Stockholm' },
  { slug: 'doktor-glas-1978',              title: 'Galleri Doktor Glas',                                      year: 1978, location: 'Stockholm' },
  { slug: 'kunstmuseum-luzern-1977',       title: 'Kunstmuseum Luzern — Live Show II',                        year: 1977, location: 'Schweiz' },
  { slug: 'edition-leger-1977',            title: 'Edition Leger',                                            year: 1977, location: 'Malmö' },
  { slug: 'galleri-wallner-1977',          title: 'Galleri Wallner',                                          year: 1977, location: 'Stockholm' },
  { slug: 'skulptorer-1975',               title: '12 svenska skulptörer, Malmö Konsthall',                   year: 1975, location: 'Malmö' },
  { slug: 'moderna-museet-1974',           title: 'Moderna Museet — Live Show',                               year: 1974, location: 'Stockholm' },
  { slug: 'galerie-belle-1973',            title: 'Galerie Belle — kringresande utställning',                 year: 1973, location: 'Västerås' },
  { slug: 'musee-dynamique-1973',          title: 'Images du Nord — Art Suédois, Musée Dynamique',            year: 1973, location: 'Dakar' },
  { slug: 'galerie-buren-1973',            title: 'Galerie Burén — Föreslagna Åtgärder',                      year: 1973, location: 'Stockholm' },
  { slug: 'swedish-art-1972',              title: 'Swedish Art 1972',                                         year: 1972, location: 'Tokyo & Kyoto' },
  { slug: 'galerie-gimpel-1971',           title: 'Galerie Gimpel & Hanover',                                 year: 1971, location: 'Zürich' },
  { slug: 'ars-baltica-1970',              title: 'Gotlands Fornsal — Ars Baltica IV',                        year: 1970, location: 'Visby' },
  { slug: 'biennale-venezia-1968',         title: '34:e Biennalen i Venedig',                                 year: 1968, location: 'Venedig' },
  { slug: 'konsthallen-eskilstuna-1968',   title: 'Konsthallen',                                              year: 1968, location: 'Eskilstuna' },
  { slug: 'galerie-buren-1968',            title: 'Galerie Burén',                                            year: 1968, location: 'Stockholm' },
  { slug: 'galleri-lowdahl-1967',          title: 'Galleri Löwendahl',                                        year: 1967, location: 'Stockholm' },
  { slug: 'har-och-nu-1967',              title: 'Här och Nu — Gävle Museum / Moderna Museet',               year: 1967, location: 'Gävle' },
  { slug: 'galerie-buren-1966',            title: 'Galerie Burén',                                            year: 1966, location: 'Stockholm' },
  { slug: 'vasterbotten-1966',             title: 'Hantverkshuset, Västerbottens Läns Konstförening',         year: 1966, location: 'Umeå' },
  { slug: 'bronsgaller-1965',              title: 'Bronsgaller, Dagens Nyheter',                              year: 1965, location: 'Stockholm' },
  { slug: 'galerie-buren-1963',            title: 'Galerie Burén',                                            year: 1963, location: 'Stockholm' },
  { slug: 'konsthallen-goteborg-1964',     title: 'Konsthallen',                                              year: 1964, location: 'Göteborg' },
  { slug: 'norrköping-1962',               title: 'Norrköpings Museum',                                       year: 1962, location: 'Norrköping' },
  { slug: 'vadsbo-1962',                   title: 'Vadsbo Museum',                                            year: 1962, location: 'Mariestad' },
  { slug: 'skara-1961',                    title: 'Skara Konstförening',                                      year: 1961, location: 'Skara' },
]

export default async function ExhibitionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/portfolio`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          {dict.portfolio?.cat_exhibitions ?? 'Utställningar'}
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          {EXHIBITIONS.length} {dict.portfolio?.cat_exhibitions?.toLowerCase() ?? 'utställningar'}, 1963–2016
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '2rem' }}>
        <div style={{ display: 'grid', gap: 0 }}>
          {EXHIBITIONS.map((ex) => (
            <div
              key={ex.slug}
              className="row-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '5rem 1fr auto',
                gap: '1.5rem',
                alignItems: 'center',
                padding: '1.1rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{ex.year}</span>
              <div>
                <span style={{ fontSize: 'var(--fs-base)' }}>{ex.title}</span>
              </div>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{ex.location}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
