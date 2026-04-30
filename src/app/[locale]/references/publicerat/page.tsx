import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = {
  title: 'Publicerat — Sivert Lindblom',
  description: 'Kataloger, tidskriftsartiklar och böcker med texter om Sivert Lindbloms konstnärskap.',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// All publication covers scraped from sivertlindblom.se/biografi/publicerat/
const PUBLICATIONS: Array<{ title: string; year?: string; isbn?: string; publisher?: string; imageUrl?: string }> = [
  {
    title: 'Akvareller 1975–2012, Kungl. Konstakademien',
    year: '2012',
    isbn: '978-91-86583-13-2',
    publisher: 'Bullfinch Publishing',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Grått-omslag-klipp.jpg',
  },
  {
    title: 'Skissernas Museum',
    year: '1993',
    isbn: '91-7856-046-2',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Rött-omslag-klipp.jpg',
  },
  {
    title: 'Lunds Konsthall',
    year: '1993',
    isbn: '91-630-1609-5',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Vitt-omslag-klipp.jpg',
  },
  {
    title: 'KRO Konstnären Nr. 2',
    year: 'Mars 1993',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/03/KRO-Konstnären-1.jpg',
  },
  {
    title: 'Akvarellen',
    year: '2013',
    isbn: 'ISSN 1102-7843',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/akvarellen-2013.jpg',
  },
  {
    title: 'Skissernas Museum',
    year: '1999',
    isbn: '91-7856-059-4',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Skissernas-museum-1999.jpg',
  },
  {
    title: 'Medelhavsmuseet — Istanbul',
    year: '1990',
    isbn: 'ISSN 0347-8068',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Istanbul-1990-ISSBN-0347-8068.jpg',
  },
  {
    title: 'Malmö Konsthall — Metapolis',
    year: '1986',
    isbn: '91-7704-019-8',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Metapolis-2.jpg',
  },
  {
    title: 'Gemensamma rum',
    year: '1998',
    publisher: 'Peter Cornell & Sivert Lindblom, Bonnier Essä',
    isbn: '91-34-52034-1',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Cornell-och-Sivert-1998-ISBN-91-34-52034-1.jpg',
  },
  {
    title: 'Arkitektur nr 5, årgång 83',
    year: 'Juni 1983',
    isbn: 'ISSN 0004-2021',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Arkitektur-nr-5-1983.jpg',
  },
  {
    title: 'Föreningen KRIS',
    year: 'Mars 1983',
    isbn: 'ISSN 0348-033X',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Kris-25_27.jpg',
  },
  {
    title: 'Föreningen KRIS',
    year: 'Mars 1981',
    isbn: 'ISSN 0348-033X',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Kris-17_18.jpg',
  },
  {
    title: 'Centre Culturel Suédois, Paris',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/CCS-omslag.jpg',
  },
  {
    title: 'Kunstmuseum Luzern — Live Show II',
    year: '1977',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Kunstmuseum-Luzern-2.jpg',
  },
  {
    title: 'Moderna Museet — Live Show',
    year: '1974',
    isbn: '91-7100-041-0',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Live-Show.jpg',
  },
  {
    title: 'Biennale Nürnberg',
    year: '1969',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Biennale-1969.jpg',
  },
  {
    title: 'Studio International, Vol. 177, No. 911',
    year: '1969',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Studio-1-1969.jpg',
  },
  {
    title: 'Sveriges Stenindustriförbund, Nr 2',
    year: '1985',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/02/Skannad-bild-150460006.jpg',
  },
  {
    title: '"Glöm oss inte"',
    year: '1999',
    publisher: 'Hilleviförlaget',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/02/Glöm-oss-inte-Omslag.jpg',
  },
  {
    title: 'Peter Celsing',
    publisher: 'LiberFörlaget / Arkitekturmuseet',
    isbn: '91-38-05276-8',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/02/Peter-Celsing-bok.jpg',
  },
  {
    title: 'Konsthögskolan — Galleri Mejan',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/02/Konsthögskolan-.jpg',
  },
  {
    title: '"Frisk med konst", Östergötlands läns landsting',
    year: '1988',
    isbn: '91-7970-204-X',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/02/Frisk-med-konst-.jpg',
  },
  {
    title: 'Images du Nord, Dakar',
    year: '1973',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Dakar-1.jpg',
  },
  {
    title: 'Sivert Lindblom — Statens konstråd',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Statens-konstråd-1-.jpg',
  },
  {
    title: 'Sivert Lindblom — Konstrevy',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Konstrevy-1.jpg',
  },
  {
    title: 'Paletten',
    year: '1974',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/02/Paletten-1974.jpg',
  },
  {
    title: 'Vår Konst Nr. 6',
    year: '1968',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/02/Vår-Konst-Nr.6-1968.jpg',
  },
  {
    title: 'Gula sidorna A–J',
    year: '1992',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/02/Gula-1992-1jpg.jpg',
  },
  {
    title: 'Paletten',
    year: '1967',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/03/Paletten-67.jpg',
  },
  {
    title: 'Art and Artists',
    year: '1969',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/03/Art-and-artists-1969.jpg',
  },
  {
    title: 'IBID I',
    year: '1982',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/03/Ibid-1982-.jpg',
  },
  {
    title: 'IBID II',
    year: '1983',
    imageUrl: 'https://sivertlindblom.se/wp-content/uploads/2018/03/Ibid-1983-.jpg',
  },
]

export default async function PubliceratPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/references`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.title ?? 'Referensmaterial'}</span>
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          {dict.references?.publicerat ?? 'Publicerat'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '65ch', fontSize: 'var(--fs-base)', lineHeight: 1.8 }}>
          Kataloger, tidskriftsartiklar och böcker med texter som anknyter till Siverts konstnärskap.
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        {/* Masonry grid of publication covers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {PUBLICATIONS.map((pub, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pub.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={pub.imageUrl}
                  alt={pub.title}
                  loading={i < 8 ? 'eager' : 'lazy'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {pub.title}
                  </span>
                </div>
              )}
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4, fontStyle: 'italic' }}>
                  {pub.title}
                </div>
                {pub.year && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', marginTop: '0.2rem' }}>{pub.year}</div>
                )}
                {pub.publisher && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem' }}>{pub.publisher}</div>
                )}
                {pub.isbn && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem', fontVariantNumeric: 'tabular-nums' }}>{pub.isbn}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
