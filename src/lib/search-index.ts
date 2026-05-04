/**
 * Build a lightweight, serialisable search index from all static data sources.
 * This runs server-side at render time and is passed as props to the client
 * search component — no API round-trip needed.
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
  excerpt: string    // short text snippet
  year?: number
  href: string       // locale-relative path (without /{locale} prefix)
}

// Biography data inline (small, no separate lib file)
const BIOGRAPHY_ENTRIES: SearchItem[] = [
  { id: 'bio-1931',   type: 'biography', title: 'Född i Husby-Rekarne, Södermanland', subtitle: '1931', excerpt: '', href: '/biography' },
  { id: 'bio-1958',   type: 'biography', title: 'Kungliga Konsthögskolan', subtitle: '1958–1963 · Stockholm', excerpt: 'Studier vid Konsthögskolan, Stockholm.', href: '/biography' },
  { id: 'bio-celsing', type: 'biography', title: 'Samarbete med arkitekt Peter Celsing', subtitle: '1957–1974', excerpt: '', href: '/biography' },
  { id: 'bio-kth',    type: 'biography', title: 'Lärare i formteori, KTH Arkitekturskolan', subtitle: '1966–1970 · Stockholm', excerpt: '', href: '/biography' },
  { id: 'bio-aka',    type: 'biography', title: 'Ledamot, Kungliga Akademien för de fria konsterna', subtitle: '1974–', excerpt: '', href: '/biography' },
  { id: 'bio-prof',   type: 'biography', title: 'Professor i skulptur, Kungliga Konsthögskolan', subtitle: '1991– · Stockholm', excerpt: '', href: '/biography' },
  { id: 'bio-sergel', type: 'biography', title: 'Sergelpriset', subtitle: '1995 · Stockholm', excerpt: '', href: '/biography' },
  { id: 'bio-sten',   type: 'biography', title: 'Stenpriset, Sveriges Stenindustrifförbund', subtitle: '1985', excerpt: '', href: '/biography' },
]

function excerpt(text: string, maxLen = 120): string {
  if (!text) return ''
  const clean = text.replace(/\n+/g, ' ').trim()
  return clean.length <= maxLen ? clean : clean.slice(0, maxLen).replace(/\s\S*$/, '') + '…'
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // ── Exhibitions ───────────────────────────────────────────
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
  for (const t of TEXTS_DATA) {
    items.push({
      id: `txt-${t.slug}`,
      type: 'text',
      title: t.title,
      subtitle: [t.author, t.year, t.publication].filter(Boolean).join(' · '),
      excerpt: excerpt(t.body),
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
      year: typeof w.year === 'string' ? parseInt(w.year) : w.year,
      href: `/portfolio/public-works/${w.slug}`,
    })
  }

  // ── Sculpture map locations ───────────────────────────────
  for (const s of SCULPTURE_LOCATIONS) {
    // Skip if already covered by a public work with the same slug
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
  items.push(...BIOGRAPHY_ENTRIES)

  return items
}
