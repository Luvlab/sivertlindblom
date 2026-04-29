import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Texter' }

const TEXTS = [
  // Essays & prefaces
  { type: 'essay',       year: 2012, title: 'Text till katalog, Akvareller m.m.',                     author: 'Peter Cornell',           lang: 'sv', publication: 'Katalog Konstakademien' },
  { type: 'essay',       year: 2012, title: 'Text till katalog, Akvareller m.m.',                     author: 'Jan Öqvist',              lang: 'sv', publication: 'Katalog Konstakademien' },
  { type: 'essay',       year: 2012, title: 'Text till katalog, Akvareller',                          author: 'Catharina Gabrielsson',   lang: 'sv', publication: 'Katalog Konstakademien' },
  { type: 'preface',     year: 1993, title: 'Förord, Skulptur, Lunds Konsthall',                      author: 'Daniel Birnbaum',         lang: 'sv', publication: 'Katalog Lunds Konsthall' },
  { type: 'essay',       year: 1993, title: 'Text, Skulptur Arkitektur, Skissernas Museum',           author: 'Stefan Alenius',          lang: 'sv', publication: 'Katalog Skissernas Museum' },
  { type: 'preface',     year: 1993, title: 'Förord, Skulptur, Lunds Konsthall',                      author: 'Cecilia Nelson',          lang: 'sv', publication: 'Katalog Lunds Konsthall' },
  { type: 'essay',       year: 1993, title: 'Text, Skulptur, Lunds Konsthall',                        author: 'Stig Larsson',            lang: 'sv', publication: 'Katalog Lunds Konsthall' },
  { type: 'essay',       year: 1981, title: 'Om Sivert Lindblom, Galeri Åsbaek',                      author: 'Stig Larsson',            lang: 'sv', publication: 'Galeri Åsbaek, Köpenhamn' },
  { type: 'essay',       year: 1977, title: 'Katalogtext, Live Show II, Kunstmuseum Luzern',          author: 'Jean-Christophe Ammann',  lang: 'de', publication: 'Katalog Kunstmuseum Luzern' },
  { type: 'essay',       year: 1971, title: 'Text till utställning, Galerie Gimpel',                  author: 'Ulf Linde',               lang: 'en', publication: 'Galerie Gimpel' },
  { type: 'preface',     year: 1963, title: 'Förord till utställning, Galerie Buren',                 author: 'Leon Rappaport',          lang: 'sv', publication: 'Galerie Buren' },
  // Reviews
  { type: 'review',      year: 2012, title: 'Om Sivert Lindblom, Kungl. Konstakademien',              author: 'Ingela Lind',             lang: 'sv', publication: 'Dagens Nyheter' },
  { type: 'review',      year: 1993, title: 'Skissernas Museum / Lunds Konsthall',                    author: 'Janne Malmros',           lang: 'sv', publication: 'Skånska Dagbladet' },
  { type: 'review',      year: 1993, title: 'Lunds Konsthall / Skissernas Museum',                    author: 'Jelena Zetterström',      lang: 'sv', publication: 'Sydsvenskan' },
  { type: 'review',      year: 1989, title: 'Blasieholms torg',                                       author: 'Rebecka Tarschys',        lang: 'sv', publication: 'Dagens Nyheter' },
  { type: 'review',      year: 1989, title: 'Blasieholms torg',                                       author: 'Ingmar Unge',             lang: 'sv', publication: 'Dagens Nyheter' },
  { type: 'review',      year: 1989, title: 'Blasieholmstorg',                                        author: 'Hedvig Hedqvist',         lang: 'sv', publication: 'Svenska Dagbladet' },
  { type: 'review',      year: 1976, title: 'Om Live Show, Moderna Museet',                           author: 'Jan Håfström',            lang: 'sv', publication: 'Moderna Museet' },
  // Interviews
  { type: 'interview',   year: 1983, title: 'Intervju med Sivert Lindblom',                           author: 'Red.',                    lang: 'sv', publication: 'Arkitektur nr 5' },
  { type: 'interview',   year: 1967, title: 'Samtal med Sivert Lindblom',                             author: 'Beate Sydhoff',           lang: 'sv', publication: 'Konstrevy nr 2' },
  // Own writings
  { type: 'own_writing', year: 1998, title: 'Citat ur Gemensamma rum',                                author: 'Peter Cornell & Sivert Lindblom', lang: 'sv', publication: 'Gemensamma rum' },
  { type: 'own_writing', year: 1986, title: 'Bra konst i bra arkitektur',                             author: 'Sivert Lindblom',         lang: 'sv', publication: 'KRO Distrikt 17' },
  { type: 'own_writing', year: 1974, title: 'Katalogtext, Live Show, Moderna Museet',                 author: 'Sivert Lindblom',         lang: 'sv', publication: 'Moderna Museet' },
  // Translated
  { type: 'translated',  year: 1980, title: 'Préface pour la exhibition à Centre Culturel Suédois',  author: 'Lars Bergquist',          lang: 'fr', publication: 'CCS Paris' },
  { type: 'translated',  year: 1967, title: 'A Conversation with Sivert Lindblom',                   author: 'Beate Sydhoff',           lang: 'en', publication: 'Konstrevy nr 2' },
  { type: 'translated',  year: 1967, title: 'Conversazione con Sivert Lindblom',                     author: 'Beate Sydhoff',           lang: 'it', publication: 'Konstrevy nr 2' },
]

const TYPE_LABELS: Record<string, string> = {
  essay:       'Essay',
  preface:     'Förord',
  review:      'Recension',
  interview:   'Intervju',
  own_writing: 'Egen text',
  translated:  'Översatt',
}

const LANG_LABELS: Record<string, string> = {
  sv: 'SV', en: 'EN', de: 'DE', fr: 'FR', it: 'IT',
}

const TYPE_ORDER = ['own_writing', 'essay', 'preface', 'interview', 'review', 'translated']

export default function TextsPage() {
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: TEXTS.filter((t) => t.type === type).sort((a, b) => b.year - a.year),
  })).filter((g) => g.items.length)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Texter</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
          Kritik, essays & intervjuer
        </h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '1rem', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
          Texter om och av Sivert Lindblom: kritiska essays, recensioner, intervjuer och egna skrifter, 1963–2012.
        </p>

        {/* Type filter nav */}
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }} aria-label="Filtrera texter">
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

          {/* Multi-column text list on wide screens */}
          <div style={{ display: 'grid', gap: 0 }}>
            {group.items.map((t, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '4rem 1fr auto',
                gap: '1.5rem',
                alignItems: 'start',
                padding: '1rem 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
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
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
