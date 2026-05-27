import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getTexts } from '@/lib/data-server'
import ScrollSaver from '@/components/ScrollSaver'
import TabsLayout from '@/components/TabsLayout'

export const metadata: Metadata = { title: 'Texts' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Static lookup for items that link to an exhibition or public-work detail page.
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
  'rebecka-tarschys-1989':            { relatedPath: 'portfolio/public-works/blasieholmstorg-stockholm-1989',        relatedLabel: 'Blasieholmstorg' },
  'ingmar-unge-1989':                 { relatedPath: 'portfolio/public-works/blasieholmstorg-stockholm-1989',        relatedLabel: 'Blasieholmstorg' },
  'hedvig-hedqvist-1989':             { relatedPath: 'portfolio/public-works/blasieholmstorg-stockholm-1989',        relatedLabel: 'Blasieholmstorg' },
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

// "andras_texter" is a virtual group that combines essay + preface (texts by others about Sivert)
const TYPE_ORDER = ['andras_texter', 'own_writing', 'interview', 'review', 'translated'] as const
type GroupType = typeof TYPE_ORDER[number]

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

  const TYPE_LABELS: Record<GroupType, string> = {
    andras_texter: dict.texts?.others_texts ?? 'Andras texter',
    own_writing:   dict.texts?.own_writing  ?? 'Egna texter',
    interview:     dict.texts?.interview    ?? 'Intervjuer',
    review:        dict.texts?.review       ?? 'Recensioner',
    translated:    dict.texts?.translated   ?? 'Översatt text',
  }

  // getTexts() already returns newest-first (year DESC from Supabase)
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: type === 'andras_texter'
      ? allTexts.filter((t) => t.type === 'essay' || t.type === 'preface')
      : allTexts.filter((t) => t.type === type),
  })).filter((g) => g.items.length)

  const TABS = grouped.map((g) => ({
    id: g.type,
    label: g.label,
    count: g.items.length,
  }))

  return (
    <div style={{ paddingBottom: '5rem', marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* Saves + restores scroll position so ← back keeps your place */}
      <ScrollSaver storageKey="texts-list-scroll" />

      {/* Tabs — label + description embedded in tab strip row */}
      <TabsLayout
        tabs={TABS}
        defaultTab={grouped[0]?.type ?? 'andras_texter'}
        label={dict.texts?.title ?? 'Texter'}
        description={dict.texts?.intro}
      >
        {grouped.map((group) => (
          <section key={group.type} className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
            <div>
              {group.items.map((t, i) => {
                const related = t.slug ? RELATED_PATHS[t.slug] : undefined
                return (
                  <div key={i} className="text-row">
                    {/* Year */}
                    <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', flexShrink: 0 }}>
                      {t.year}
                    </span>

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
      </TabsLayout>

      <div className="page-pad" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Link href={`/${locale}`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.home ?? 'Hem'}</span>
        </Link>
      </div>
    </div>
  )
}
