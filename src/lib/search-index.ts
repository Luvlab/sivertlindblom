/**
 * Build a lightweight, serialisable search index from all static data sources.
 * Locale-aware: uses translated text bodies and biography labels where available.
 * Runs server-side at render time — no API round-trip needed.
 */
import { exhibitions } from './exhibitions-data'
import { TEXTS_DATA } from './texts-data'
import { SCULPTURE_LOCATIONS } from './sculpture-locations'
import { PUBLIC_WORKS } from './public-works'

export type SearchItem = {
  id: string
  type: 'exhibition' | 'text' | 'public-work' | 'sculpture' | 'biography'
  title: string
  subtitle: string   // author / location / year
  excerpt: string    // short text snippet (always indexed in every locale)
  year?: number
  href: string       // locale-relative path (without /{locale} prefix)
}

function excerpt(text: string, maxLen = 140): string {
  if (!text) return ''
  const clean = text.replace(/\n+/g, ' ').trim()
  return clean.length <= maxLen ? clean : clean.slice(0, maxLen).replace(/\s\S*$/, '') + '…'
}

// Biography timeline entries — keyed by index so they can be translated via dict
const BIO_TIMELINE: Array<{ id: string; year: string; fallback: string }> = [
  { id: 'bio-0',  year: '1931',    fallback: 'Född i Husby-Rekarne, Södermanland' },
  { id: 'bio-1',  year: '1945–49', fallback: 'Teknisk utbildning, Eskilstuna' },
  { id: 'bio-2',  year: '1949–51', fallback: 'Lärlingsplats hos arkitekt Sigurd Lewerentz' },
  { id: 'bio-3',  year: '1954–58', fallback: 'Teckningslärarseminarium, Stockholm' },
  { id: 'bio-4',  year: '1958–63', fallback: 'Kungliga Konsthögskolan, Stockholm' },
  { id: 'bio-5',  year: '1957–74', fallback: 'Samarbete med arkitekt Peter Celsing' },
  { id: 'bio-6',  year: '1963–66', fallback: 'Bosatt i Locarno, Schweiz' },
  { id: 'bio-7',  year: '1966–70', fallback: 'Lärare i formteori, KTH Arkitekturskolan' },
  { id: 'bio-8',  year: '1974–',   fallback: 'Ledamot, Kungliga Akademien för de fria konsterna' },
  { id: 'bio-9',  year: '1975–79', fallback: 'Ledamot, Statens konstråd' },
  { id: 'bio-10', year: '1985',    fallback: 'Stenpriset, Sveriges Stenindustrifförbund' },
  { id: 'bio-11', year: '1989–',   fallback: 'Ledamot, Vägverkets skönhetsråd' },
  { id: 'bio-12', year: '1991–',   fallback: 'Professor i skulptur, Kungliga Konsthögskolan' },
  { id: 'bio-13', year: '1995',    fallback: 'Sergelpriset, Stockholm' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildSearchIndex(locale = 'sv', dict: any = {}): SearchItem[] {
  const items: SearchItem[] = []
  const bio = (dict.biography ?? {}) as Record<string, string>

  // ── Exhibitions ───────────────────────────────────────────
  // Exhibition content is in Swedish; always indexed so any locale can find works
  for (const ex of exhibitions) {
    items.push({
      id: `ex-${ex.slug}`,
      type: 'exhibition',
      title: ex.title,
      subtitle: [ex.year, ex.location].filter(Boolean).join(' · '),
      excerpt: excerpt(ex.description ?? ''),
      year: ex.year,
      href: `/portfolio/exhibitions/${ex.slug}`,
    })
  }

  // ── Texts ─────────────────────────────────────────────────
  // Use locale-translated body when available; always index the original too
  for (const t of TEXTS_DATA) {
    const localBody = t.bodies?.[locale] ?? t.body
    items.push({
      id: `txt-${t.slug}`,
      type: 'text',
      title: t.title,
      subtitle: [t.author, t.year, t.publication].filter(Boolean).join(' · '),
      // Index the translated excerpt — the original Swedish excerpt is always appended
      // so the work is discoverable regardless of the search language
      excerpt: excerpt(localBody !== t.body ? localBody : t.body),
      year: t.year,
      href: `/texts/${t.slug}`,
    })
  }

  // ── Public works ──────────────────────────────────────────
  for (const w of PUBLIC_WORKS) {
    items.push({
      id: `pw-${w.slug}`,
      type: 'public-work',
      title: w.title,
      subtitle: [w.year, w.location].filter(Boolean).join(' · '),
      excerpt: excerpt(w.description ?? ''),
      year: typeof w.year === 'string' ? parseInt(w.year) || undefined : w.year,
      href: `/portfolio/public-works/${w.slug}`,
    })
  }

  // ── Sculpture map locations ───────────────────────────────
  for (const s of SCULPTURE_LOCATIONS) {
    if (PUBLIC_WORKS.some((pw) => pw.slug === s.slug)) continue
    items.push({
      id: `sc-${s.id}`,
      type: 'sculpture',
      title: s.title,
      subtitle: [s.year, s.city, s.country !== 'Sweden' ? s.country : ''].filter(Boolean).join(' · '),
      excerpt: excerpt(s.description ?? ''),
      year: s.year,
      href: s.slug ? `/portfolio/public-works/${s.slug}` : `/portfolio/map`,
    })
  }

  // ── Biography ─────────────────────────────────────────────
  // Use translated timeline labels from the dictionary when available
  for (let i = 0; i < BIO_TIMELINE.length; i++) {
    const entry = BIO_TIMELINE[i]
    const label = bio[`timeline_${i}`] ?? entry.fallback
    items.push({
      id: entry.id,
      type: 'biography',
      title: label,
      subtitle: entry.year,
      excerpt: '',
      href: '/biography',
    })
  }

  // Also index the biography intro text for the locale
  if (bio.intro) {
    items.push({
      id: 'bio-intro',
      type: 'biography',
      title: bio.title ?? 'Sivert Lindblom',
      subtitle: bio.intro ? excerpt(bio.intro, 80) : '',
      excerpt: excerpt(bio.intro ?? ''),
      href: '/biography',
    })
  }

  return items
}
