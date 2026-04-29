import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Utställningar' }

const EXHIBITIONS = [
  { slug: 'vandalorum-2016',               title: 'VANDALORUM',                             year: 2016, location: 'Värnamo' },
  { slug: 'konstakademien-2012',           title: 'Kungl. Konstakademien',                  year: 2012, location: 'Stockholm' },
  { slug: 'korsbarsgarden-2010',           title: 'Körsbärsgården',                          year: 2010, location: 'Gotland' },
  { slug: 'galerie-aronowitsch-2005',      title: 'Galerie Aronowitsch',                    year: 2005, location: 'Stockholm' },
  { slug: 'historiska-museet-1998',        title: 'Historiska Museet',                      year: 1998, location: 'Stockholm' },
  { slug: 'eskilstuna-1996',               title: 'Eskilstuna Konstförening',               year: 1996, location: 'Eskilstuna' },
  { slug: 'skovde-1996',                   title: 'Skövde Konsthall',                       year: 1996, location: 'Skövde' },
  { slug: 'lunds-konsthall-1993',          title: 'Lunds Konsthall',                        year: 1993, location: 'Lund' },
  { slug: 'skissernas-1993',               title: 'Skissernas Museum',                      year: 1993, location: 'Lund' },
  { slug: 'bildmuseet-1993',               title: 'Bildmuseet',                             year: 1993, location: 'Umeå' },
  { slug: 'galleri-wallner-1987',          title: 'Galleri Wallner',                        year: 1987, location: 'Stockholm' },
  { slug: 'malmo-konsthall-1986',          title: 'Malmö Konsthall — Metapolis',            year: 1986, location: 'Malmö' },
  { slug: 'liljevalchs-1986',              title: 'Liljevalchs Konsthall',                  year: 1986, location: 'Stockholm' },
  { slug: 'ibid-ii-1983',                  title: 'IBID II, Linoljefabriken',               year: 1983, location: 'Stockholm' },
  { slug: 'ibid-i-1982',                   title: 'IBID, Linoljefabriken',                  year: 1982, location: 'Stockholm' },
  { slug: 'aronowitsch-1981',              title: 'Galerie Aronowitsch',                    year: 1981, location: 'Stockholm' },
  { slug: 'biennale-middelheim-1979',      title: 'Biennale Middelheim',                    year: 1979, location: 'Antwerpen' },
  { slug: 'galleri-wallner-1978',          title: 'Galleri Wallner',                        year: 1978, location: 'Stockholm' },
  { slug: 'doktor-glas-1978',              title: 'Galleri Doktor Glas',                    year: 1978, location: 'Stockholm' },
  { slug: 'kunstmuseum-luzern-1977',       title: 'Kunstmuseum Luzern — Live Show II',      year: 1977, location: 'Schweiz' },
  { slug: 'galleri-wallner-1977',          title: 'Galleri Wallner',                        year: 1977, location: 'Stockholm' },
  { slug: 'moderna-museet-1974',           title: 'Moderna Museet — Live Show',             year: 1974, location: 'Stockholm' },
  { slug: 'galerie-buren-1973',            title: 'Galerie Buren — Föreslagna Åtgärder',    year: 1973, location: 'Stockholm' },
  { slug: 'galerie-gimpel-1971',           title: 'Galerie Gimpel, Hanover & Zürich',       year: 1971, location: 'Europa' },
  { slug: 'ars-baltica-1970',              title: 'Gotlands Fornsal — Ars Baltica IV',      year: 1970, location: 'Visby' },
  { slug: 'biennale-venezia-1968',         title: '34:e Biennalen i Venedig',               year: 1968, location: 'Venedig' },
  { slug: 'galerie-buren-1966',            title: 'Galerie Buren',                          year: 1966, location: 'Stockholm' },
  { slug: 'galerie-buren-1963',            title: 'Galerie Buren',                          year: 1963, location: 'Stockholm' },
]

export default function ExhibitionsPage() {
  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href="/portfolio" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ← Portfolio
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '1rem', marginBottom: '0.5rem' }}>
          Utställningar
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          {EXHIBITIONS.length} utställningar, 1963–2016
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '2rem' }}>
        {/* Year-grouped list */}
        <div style={{ display: 'grid', gap: 0 }}>
          {EXHIBITIONS.map((ex, i) => (
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
