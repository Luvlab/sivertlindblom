import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Texts' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const TEXTS: Array<{ type: string; year: number; title: string; author: string; lang: string; publication: string; slug?: string }> = [
  { type: 'essay',       year: 2012, title: 'Text till katalog, Akvareller m.m.',                     author: 'Peter Cornell',           lang: 'sv', publication: 'Katalog Konstakademien',   slug: 'peter-cornell-2012' },
  { type: 'essay',       year: 2012, title: 'Text till katalog, Akvareller m.m.',                     author: 'Jan Öqvist',              lang: 'sv', publication: 'Katalog Konstakademien',   slug: 'jan-oqvist-2012' },
  { type: 'essay',       year: 2012, title: 'Text till katalog, Akvareller',                          author: 'Catharina Gabrielsson',   lang: 'sv', publication: 'Katalog Konstakademien',   slug: 'catharina-gabrielsson-2012' },
  { type: 'preface',     year: 1993, title: 'Förord, Skulptur, Lunds Konsthall',                      author: 'Daniel Birnbaum',         lang: 'sv', publication: 'Katalog Lunds Konsthall',  slug: 'daniel-birnbaum-1993' },
  { type: 'essay',       year: 1993, title: 'Text, Skulptur Arkitektur, Skissernas Museum',           author: 'Stefan Alenius',          lang: 'sv', publication: 'Katalog Skissernas Museum' },
  { type: 'preface',     year: 1993, title: 'Förord, Skulptur, Lunds Konsthall',                      author: 'Cecilia Nelson',          lang: 'sv', publication: 'Katalog Lunds Konsthall' },
  { type: 'essay',       year: 1993, title: 'Text, Skulptur, Lunds Konsthall',                        author: 'Stig Larsson',            lang: 'sv', publication: 'Katalog Lunds Konsthall',  slug: 'stig-larsson-1993' },
  { type: 'essay',       year: 1981, title: 'Om Sivert Lindblom, Galeri Åsbaek',                      author: 'Stig Larsson',            lang: 'sv', publication: 'Galeri Åsbaek, Köpenhamn', slug: 'stig-larsson-1981' },
  { type: 'essay',       year: 1977, title: 'Katalogtext, Live Show II, Kunstmuseum Luzern',          author: 'Jean-Christophe Ammann',  lang: 'de', publication: 'Katalog Kunstmuseum Luzern', slug: 'jean-christophe-ammann-1977' },
  { type: 'essay',       year: 1971, title: 'Text till utställning, Galerie Gimpel',                  author: 'Ulf Linde',               lang: 'en', publication: 'Galerie Gimpel',            slug: 'ulf-linde-1971' },
  { type: 'preface',     year: 1963, title: 'Förord till utställning, Galerie Buren',                 author: 'Leon Rappaport',          lang: 'sv', publication: 'Galerie Buren',             slug: 'leon-rappaport-1963' },
  { type: 'review',      year: 2012, title: 'Om Sivert Lindblom, Kungl. Konstakademien',              author: 'Ingela Lind',             lang: 'sv', publication: 'Dagens Nyheter' },
  { type: 'review',      year: 1993, title: 'Skissernas Museum / Lunds Konsthall',                    author: 'Janne Malmros',           lang: 'sv', publication: 'Skånska Dagbladet' },
  { type: 'review',      year: 1993, title: 'Lunds Konsthall / Skissernas Museum',                    author: 'Jelena Zetterström',      lang: 'sv', publication: 'Sydsvenskan' },
  { type: 'review',      year: 1989, title: 'Blasieholms torg',                                       author: 'Rebecka Tarschys',        lang: 'sv', publication: 'Dagens Nyheter' },
  { type: 'review',      year: 1989, title: 'Blasieholms torg',                                       author: 'Ingmar Unge',             lang: 'sv', publication: 'Dagens Nyheter' },
  { type: 'review',      year: 1989, title: 'Blasieholmstorg',                                        author: 'Hedvig Hedqvist',         lang: 'sv', publication: 'Svenska Dagbladet' },
  { type: 'review',      year: 1976, title: 'Om Live Show, Moderna Museet',                           author: 'Jan Håfström',            lang: 'sv', publication: 'Moderna Museet',            slug: 'jan-hafstrom-1976' },
  { type: 'interview',   year: 1983, title: 'Intervju med Sivert Lindblom',                           author: 'Red.',                    lang: 'sv', publication: 'Arkitektur nr 5' },
  { type: 'interview',   year: 1967, title: 'Samtal med Sivert Lindblom',                             author: 'Beate Sydhoff',           lang: 'sv', publication: 'Konstrevy nr 2',            slug: 'beate-sydhoff-1967' },
  { type: 'own_writing', year: 1998, title: 'Citat ur Gemensamma rum',                                author: 'Peter Cornell & Sivert Lindblom', lang: 'sv', publication: 'Gemensamma rum' },
  { type: 'own_writing', year: 1986, title: 'Bra konst i bra arkitektur',                             author: 'Sivert Lindblom',         lang: 'sv', publication: 'KRO Distrikt 17',           slug: 'sivert-lindblom-bra-konst-1986' },
  { type: 'own_writing', year: 1974, title: 'Katalogtext, Live Show, Moderna Museet',                 author: 'Sivert Lindblom',         lang: 'sv', publication: 'Moderna Museet',            slug: 'sivert-lindblom-live-show-1974' },
  { type: 'translated',  year: 1980, title: 'Préface pour la exhibition à Centre Culturel Suédois',  author: 'Lars Bergquist',          lang: 'fr', publication: 'CCS Paris' },
  { type: 'translated',  year: 1967, title: 'A Conversation with Sivert Lindblom',                   author: 'Beate Sydhoff',           lang: 'en', publication: 'Konstrevy nr 2',            slug: 'beate-sydhoff-english-1967' },
  { type: 'translated',  year: 1967, title: 'Conversazione con Sivert Lindblom',                     author: 'Beate Sydhoff',           lang: 'it', publication: 'Konstrevy nr 2' },
]

const LANG_LABELS: Record<string, string> = {
  sv: 'SV', en: 'EN', de: 'DE', fr: 'FR', it: 'IT',
}

const TYPE_ORDER = ['own_writing', 'essay', 'preface', 'interview', 'review', 'translated']

export default async function TextsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const TYPE_LABELS: Record<string, string> = {
    essay:       dict.texts?.essay ?? 'Essay',
    preface:     dict.texts?.preface ?? 'Förord',
    review:      dict.texts?.review ?? 'Recension',
    interview:   dict.texts?.interview ?? 'Intervju',
    own_writing: dict.texts?.own_writing ?? 'Egen text',
    translated:  dict.texts?.translated ?? 'Översatt',
  }

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: TEXTS.filter((t) => t.type === type).sort((a, b) => b.year - a.year),
  })).filter((g) => g.items.length)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          {dict.texts?.subtitle ?? 'Texter'}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
          {dict.texts?.title ?? 'Kritik, essays & intervjuer'}
        </h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '1rem', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
          {dict.texts?.intro ?? ''}
        </p>

        {/* Type filter nav */}
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }} aria-label="Filter">
          {TYPE_ORDER.map((t) => (
            <a key={t} href={`#${t}`} className="filter-link" style={{
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              padding: '0.3em 0.8em',
              transition: 'all 0.15s',
            }}>
              {TYPE_LABELS[t]}
            </a>
          ))}
        </nav>
      </div>

      <hr className="divider" />

      {grouped.map((group) => (
        <section key={group.type} id={group.type} className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>{group.label}</h2>

          <div style={{ display: 'grid', gap: 0 }}>
            {group.items.map((t, i) => {
              const rowContent = (
                <>
                  <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{t.year}</span>
                  <div>
                    <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.2rem' }}>{t.title}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                      {t.author} — {t.publication}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                    <span className="badge">{LANG_LABELS[t.lang] || t.lang}</span>
                  </div>
                </>
              )
              const rowStyle = {
                display: 'grid',
                gridTemplateColumns: '4rem 1fr auto',
                gap: '1.5rem',
                alignItems: 'start',
                padding: '1rem 0',
                borderBottom: '1px solid var(--color-border)',
              }
              if (t.slug) {
                return (
                  <Link key={i} href={`/${locale}/texts/${t.slug}`} className="row-hover" style={rowStyle}>
                    {rowContent}
                  </Link>
                )
              }
              return (
                <div key={i} style={rowStyle}>
                  {rowContent}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
