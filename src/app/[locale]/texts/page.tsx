import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getTexts } from '@/lib/data-server'
import ScrollSaver from '@/components/ScrollSaver'

export const metadata: Metadata = { title: 'Texts' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Static lookup for items that link to an exhibition or public-work detail page.
// Keyed by slug; supplements the live DB data (which has no relatedPath column).
const RELATED_PATHS: Record<string, { relatedPath: string; relatedLabel: string }> = {
  'hakan-bull-2013':                  { relatedPath: 'portfolio/watercolors',                                        relatedLabel: 'Akvareller' },
  'peter-cornell-2012':               { relatedPath: 'portfolio/exhibitions/kungl-konstakademien-2012',              relatedLabel: 'Konstakademien 2012' },
  'jan-oqvist-2012':                  { relatedPath: 'portfolio/exhibitions/kungl-konstakademien-2012',              relatedLabel: 'Konstakademien 2012' },
  'catharina-gabrielsson-2012':       { relatedPath: 'portfolio/exhibitions/kungl-konstakademien-2012',              relatedLabel: 'Konstakademien 2012' },
  'ingela-lind-2012':                 { relatedPath: 'portfolio/exhibitions/kungl-konstakademien-2012',              relatedLabel: 'Konstakademien 2012' },
  'daniel-birnbaum-1993':             { relatedPath: 'portfolio/exhibitions/lunds-konsthall-1993',                   relatedLabel: 'Lunds Konsthall 1993' },
  'cecilia-nelson-1993':              { relatedPath: 'portfolio/exhibitions/lunds-konsthall-1993',                   relatedLabel: 'Lunds Konsthall 1993' },
  'stig-larsson-1993':                { relatedPath: 'portfolio/exhibitions/lunds-konsthall-1993',                   relatedLabel: 'Lunds Konsthall 1993' },
  'janne-malmros-1993':               { relatedPath: 'portfolio/exhibitions/skissernas-museum-1993',                 relatedLabel: 'Skissernas Museum 1993' },
  'jan-torsten-ahlstrand-1993':       { relatedPath: 'portfolio/exhibitions/skissernas-museum-1993',                 relatedLabel: 'Skissernas Museum 1993' },
  'stefan-alenius-1993':              { relatedPath: 'portfolio/exhibitions/skissernas-museum-1993',                 relatedLabel: 'Skissernas Museum 1993' },
  'jelena-zetterström-1993':          { relatedPath: 'portfolio/exhibitions/lunds-konsthall-1993',                   relatedLabel: 'Lunds Konsthall 1993' },
  'rebecka-tarschys-1989':            { relatedPath: 'portfolio/public-works/blasieholmstorg-1989',                  relatedLabel: 'Blasieholmstorg' },
  'ingmar-unge-1989':                 { relatedPath: 'portfolio/public-works/blasieholmstorg-1989',                  relatedLabel: 'Blasieholmstorg' },
  'hedvig-hedqvist-1989':             { relatedPath: 'portfolio/public-works/blasieholmstorg-1989',                  relatedLabel: 'Blasieholmstorg' },
  'stig-larsson-1981':                { relatedPath: 'portfolio/exhibitions/galeri-asbaek-kopenhamn-1981',           relatedLabel: 'Galeri Asbæk 1981' },
  'jean-christophe-ammann-1977':      { relatedPath: 'portfolio/exhibitions/kunstmuseum-luzern-live-show-ii-1977',   relatedLabel: 'Kunstmuseum Luzern 1977' },
  'jan-hafstrom-1976':                { relatedPath: 'portfolio/exhibitions/moderna-museet-live-show-1974',          relatedLabel: 'Live Show 1974' },
  'sivert-lindblom-live-show-1974':   { relatedPath: 'portfolio/exhibitions/moderna-museet-live-show-1974',          relatedLabel: 'Live Show 1974' },
  'beate-sydhoff-galerie-buren-1973': { relatedPath: 'portfolio/exhibitions/galerie-buren-foreslagna-atgarder-1973', relatedLabel: 'Galerie Burén 1973' },
  'lars-bergquist-1980':              { relatedPath: 'portfolio/exhibitions/sans-titre-ccs-paris-1980',              relatedLabel: 'CCS Paris 1980' },
  'torsten-ekbom-1980':               { relatedPath: 'portfolio/exhibitions/sans-titre-ccs-paris-1980',              relatedLabel: 'CCS Paris 1980' },
  'ulf-linde-1971':                   { relatedPath: 'portfolio/exhibitions/galerie-gimpel-hanover-zurich-1971',     relatedLabel: 'Galerie Gimpel 1971' },
  'leon-rappaport-1963':              { relatedPath: 'portfolio/exhibitions/galerie-buren-1963',                     relatedLabel: 'Galerie Burén 1963' },
}

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
  const [dict, allTexts] = await Promise.all([
    getDictionary(locale as Locale),
    getTexts(),
  ])

  const TYPE_LABELS: Record<string, string> = {
    essay:       dict.texts?.essay ?? 'Essay',
    preface:     dict.texts?.preface ?? 'Förord',
    review:      dict.texts?.review ?? 'Recension',
    interview:   dict.texts?.interview ?? 'Intervju',
    own_writing: dict.texts?.own_writing ?? 'Egen text',
    translated:  dict.texts?.translated ?? 'Översatt',
  }

  // getTexts() already returns newest-first (year DESC from Supabase)
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: allTexts.filter((t) => t.type === type),
  })).filter((g) => g.items.length)

  return (
    <div className="section-gap">
      {/* Saves + restores scroll position so ← back keeps your place */}
      <ScrollSaver storageKey="texts-list-scroll" />
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

          <div>
            {group.items.map((t, i) => {
              const related = t.slug ? RELATED_PATHS[t.slug] : undefined
              return (
              <div key={i} className="text-row">
                {/* Year */}
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', flexShrink: 0 }}>{t.year}</span>

                {/* Title + author */}
                {t.slug ? (
                  <Link href={`/${locale}/texts/${t.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.15rem' }}>{t.title}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                      {t.author} · {t.publication}
                    </div>
                  </Link>
                ) : (
                  <div>
                    <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.15rem' }}>{t.title}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                      {t.author} · {t.publication}
                    </div>
                  </div>
                )}

                {/* Badges: lang + optional related link */}
                <div className="text-row-meta">
                  <span className="badge">{LANG_LABELS[t.lang] || t.lang}</span>
                  {related && (
                    <Link
                      href={`/${locale}/${related.relatedPath}`}
                      style={{
                        fontSize: 'var(--fs-xs)',
                        color: 'var(--color-accent)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid var(--color-accent-dim)',
                        paddingBottom: '0.1em',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      → {related.relatedLabel}
                    </Link>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        </section>
      ))}

      <div className="page-pad" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Link href={`/${locale}`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.home ?? 'Hem'}</span>
        </Link>
      </div>
    </div>
  )
}
