/**
 * Build a lightweight, serialisable search index from all static data sources.
 * Locale-aware: uses translated text bodies and biography labels where available.
 * Runs server-side at render time — no API round-trip needed.
 */
import { exhibitions } from './exhibitions-data'
import { TEXTS_DATA } from './texts-data'
import { SCULPTURE_LOCATIONS } from './sculpture-locations'
import { PUBLIC_WORKS } from './public-works'
import { SCULPTURE_PROJECTS } from './sculpture-projects'
import { FALLBACK_WORKS as SCENOGRAPHY_WORKS } from './scenography-data'
import { FILMS } from './films-data'
import type { UtmarkelserSection } from './reference-utmarkelser'
import type { BibEntry } from './bibliography'
import type { GrafikSection } from './reference-grafik'

export type SearchItem = {
  id: string
  type: 'exhibition' | 'text' | 'public-work' | 'sculpture' | 'scenography' | 'film' | 'biography' | 'reference'
  title: string
  subtitle: string   // author / location / year
  excerpt: string    // short text snippet shown in the result card
  body?: string      // full text for scoring only — not displayed
  year?: number
  href: string       // locale-relative path (without /{locale} prefix)
  lat?: number       // when the item is a place, so search can show "VISA PLATSEN"
  lng?: number
}

function excerpt(text: string, maxLen = 200): string {
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

// Optional live (DB) data sources. When omitted, the static imports are used —
// so search still works if the DB is unavailable, but passing DB data makes the
// index complete and current (texts/works Jan added in admin become searchable).
export interface SearchSources {
  exhibitions?: typeof exhibitions
  texts?: typeof TEXTS_DATA
  publicWorks?: typeof PUBLIC_WORKS
  sculptureLocations?: typeof SCULPTURE_LOCATIONS
  sculptureProjects?: typeof SCULPTURE_PROJECTS
  scenography?: typeof SCENOGRAPHY_WORKS
  films?: typeof FILMS
  utmarkelser?: UtmarkelserSection
  bibliography?: BibEntry[]
  grafik?: GrafikSection
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildSearchIndex(locale = 'sv', dict: any = {}, sources: SearchSources = {}): SearchItem[] {
  const items: SearchItem[] = []
  const bio = (dict.biography ?? {}) as Record<string, string>
  const exhibitionsData = sources.exhibitions ?? exhibitions
  const textsData = sources.texts ?? TEXTS_DATA
  const publicWorksData = sources.publicWorks ?? PUBLIC_WORKS
  const sculptureData = sources.sculptureLocations ?? SCULPTURE_LOCATIONS
  const sculptureProjectsData = sources.sculptureProjects ?? SCULPTURE_PROJECTS
  const scenographyData = sources.scenography ?? SCENOGRAPHY_WORKS
  const filmsData = sources.films ?? FILMS

  // Coordinates keyed by work slug, so a public-work result without its own
  // lat/lng can still show "VISA PLATSEN" using the map-pin location.
  const coordsBySlug = new Map<string, { lat: number; lng: number }>()
  for (const s of sculptureData) {
    if (s.slug && typeof s.lat === 'number' && typeof s.lng === 'number') {
      coordsBySlug.set(s.slug, { lat: s.lat, lng: s.lng })
    }
  }

  // ── Exhibitions ───────────────────────────────────────────
  // Exhibition content is in Swedish; always indexed so any locale can find works
  for (const ex of exhibitionsData) {
    const exBody = (ex as { body?: string }).body
    items.push({
      id: `ex-${ex.slug}`,
      type: 'exhibition',
      title: ex.title,
      subtitle: [ex.year, ex.location].filter(Boolean).join(' · '),
      excerpt: excerpt(ex.description ?? ''),
      body: exBody || undefined,
      year: ex.year,
      href: `/portfolio/exhibitions/${ex.slug}`,
    })
  }

  // ── Texts ─────────────────────────────────────────────────
  // Use locale-translated body when available; always index the original too
  for (const t of textsData) {
    const localBody = t.bodies?.[locale] ?? t.body
    const fullBody = localBody !== t.body ? `${localBody} ${t.body}` : t.body
    items.push({
      id: `txt-${t.slug}`,
      type: 'text',
      title: t.title,
      subtitle: [t.author, t.year, t.publication].filter(Boolean).join(' · '),
      excerpt: excerpt(localBody !== t.body ? localBody : t.body),
      body: fullBody || undefined,
      year: t.year,
      href: `/texts/${t.slug}`,
    })
  }

  // ── Public works ──────────────────────────────────────────
  for (const w of publicWorksData) {
    const wc = w as { lat?: number | null; lng?: number | null }
    const coord = (typeof wc.lat === 'number' && typeof wc.lng === 'number')
      ? { lat: wc.lat, lng: wc.lng }
      : coordsBySlug.get(w.slug)
    items.push({
      id: `pw-${w.slug}`,
      type: 'public-work',
      title: w.title,
      subtitle: [w.year, w.location].filter(Boolean).join(' · '),
      excerpt: excerpt(w.description ?? ''),
      body: w.body || undefined,
      year: typeof w.year === 'string' ? parseInt(w.year) || undefined : w.year,
      href: `/portfolio/public-works/${w.slug}`,
      lat: coord?.lat,
      lng: coord?.lng,
    })
  }

  // ── Sculpture map locations ───────────────────────────────
  for (const s of sculptureData) {
    if (publicWorksData.some((pw) => pw.slug === s.slug)) continue
    items.push({
      id: `sc-${s.id}`,
      type: 'sculpture',
      title: s.title,
      subtitle: [s.year, s.city, s.country !== 'Sweden' ? s.country : ''].filter(Boolean).join(' · '),
      excerpt: excerpt(s.description ?? ''),
      year: s.year,
      href: s.slug ? `/portfolio/public-works/${s.slug}` : `/portfolio/map`,
      lat: typeof s.lat === 'number' ? s.lat : undefined,
      lng: typeof s.lng === 'number' ? s.lng : undefined,
    })
  }

  // ── Sculpture series (Referenser → Skulptur, e.g. Kofeser) ──
  for (const p of sculptureProjectsData) {
    const fullBody = [p.shortDesc, p.description, p.body].filter(Boolean).join(' ')
    items.push({
      id: `scp-${p.slug}`,
      type: 'sculpture',
      title: p.title,
      subtitle: p.years ?? '',
      excerpt: excerpt([p.shortDesc, p.description].filter(Boolean).join(' ')),
      body: fullBody || undefined,
      href: `/references/${p.slug}`,
    })
  }

  // ── Scenography ───────────────────────────────────────────
  for (const w of scenographyData) {
    items.push({
      id: `scn-${w.slug}`,
      type: 'scenography',
      title: w.title,
      subtitle: [w.year, w.venue].filter(Boolean).join(' · '),
      excerpt: excerpt(w.description ?? ''),
      year: w.year ?? undefined,
      href: `/portfolio/scenography/${w.slug}`,
    })
  }

  // ── Film & TV ─────────────────────────────────────────────
  for (const f of filmsData) {
    items.push({
      id: `flm-${f.slug}`,
      type: 'film',
      title: f.title,
      subtitle: [f.year > 0 ? f.year : '', f.director, f.venue].filter(Boolean).join(' · '),
      excerpt: excerpt(f.desc ?? ''),
      year: f.year > 0 ? f.year : undefined,
      href: `/references/film-tv/${f.slug}`,
    })
  }

  // ── Utmärkelser (prizes + medals) ────────────────────────
  if (sources.utmarkelser) {
    for (const [i, prize] of sources.utmarkelser.prizes.entries()) {
      items.push({
        id: `prize-${i}`,
        type: 'reference',
        title: prize.title,
        subtitle: [prize.year, prize.sub].filter(Boolean).join(' · '),
        excerpt: excerpt([prize.desc, prize.quote].filter(Boolean).join(' ')),
        href: '/references#utmarkelser',
      })
    }
  }

  // ── Bibliography ──────────────────────────────────────────
  if (sources.bibliography) {
    for (const [i, entry] of sources.bibliography.entries()) {
      items.push({
        id: `bib-${i}`,
        type: 'reference',
        title: excerpt(entry.text, 120),
        subtitle: entry.year,
        excerpt: entry.note ?? '',
        body: entry.text || undefined,
        href: '/references/publicerat',
      })
    }
  }

  // ── Grafik ───────────────────────────────────────────────
  if (sources.grafik) {
    items.push({
      id: 'grafik-section',
      type: 'reference',
      title: sources.grafik.title || 'Grafik',
      subtitle: sources.grafik.years ?? '',
      excerpt: excerpt(sources.grafik.intro ?? ''),
      href: '/references/grafik',
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
