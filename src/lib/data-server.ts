/**
 * Server-side data fetchers — query Supabase with fallback to static data.
 * Use only in Server Components and API routes (never in client components).
 *
 * All exported async functions are wrapped with `'use cache'` (Next.js 16).
 * Each is tagged so admin mutations can call revalidateTag(tag, 'max') to
 * bust the cache immediately after a save.
 */
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Exhibition, ExhibitionLink, ExhibitionSubpage } from '@/lib/exhibitions-data'
import { exhibitions as STATIC_EXHIBITIONS } from '@/lib/exhibitions-data'
import type { PublicWork, PublicWorkSubpage } from '@/lib/public-works'
import { PUBLIC_WORKS as STATIC_PUBLIC_WORKS } from '@/lib/public-works'
import type { SculptureLocation } from '@/lib/sculpture-locations'
import { SCULPTURE_LOCATIONS as STATIC_LOCATIONS } from '@/lib/sculpture-locations'
import type { TextItem, TextSubpage } from '@/lib/texts-data'
import { TEXTS_DATA as STATIC_TEXTS } from '@/lib/texts-data'
import {
  DEFAULT_PORTFOLIO_THUMBS,
  PORTFOLIO_CATEGORY_KEYS,
  portfolioThumbsKey,
  type PortfolioThumbs,
  type PortfolioCategoryKey,
} from '@/lib/portfolio-thumbs'
import {
  FOTOGRAFI_SETTINGS_KEY,
  DEFAULT_FOTOGRAFI,
  parseFotografi,
  type FotografiSection,
} from '@/lib/reference-fotografi'
import {
  GRAFIK_SETTINGS_KEY,
  DEFAULT_GRAFIK,
  parseGrafik,
  type GrafikSection,
} from '@/lib/reference-grafik'
import {
  FILM_SETTINGS_KEY,
  DEFAULT_FILMS,
  parseFilms,
  type FilmEntry,
} from '@/lib/reference-film'
import {
  UTMARKELSER_SETTINGS_KEY,
  DEFAULT_UTMARKELSER,
  parseUtmarkelser,
  type UtmarkelserSection,
} from '@/lib/reference-utmarkelser'
import {
  OGONBLICK_SETTINGS_KEY,
  DEFAULT_OGONBLICK,
  parseOgonblick,
  type OgonblickSection,
} from '@/lib/reference-ogonblick'
import {
  BIBLIOGRAPHY_SETTINGS_KEY,
  DEFAULT_BIBLIOGRAPHY,
  parseBibliography,
  type BibEntry,
} from '@/lib/bibliography'
import {
  SCULPTURE_SETTINGS_KEY,
  SCULPTURE_PROJECTS,
  parseSculptureProjects,
  resolveSculptureProjects,
  type SculptureProject,
} from '@/lib/sculpture-projects'

// ─── References → Fotografier (editable inspiration gallery) ─────────────────

export async function getFotografi(): Promise<FotografiSection> {
  'use cache'
  cacheTag('references-fotografi')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === FOTOGRAFI_SETTINGS_KEY) as { value?: string } | undefined
      return parseFotografi(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULT_FOTOGRAFI }
}

/** Fresh (non-cached) read for admin GET. */
export async function getFotografiAdmin(): Promise<FotografiSection> {
  const supabase = createAdminClient()
  if (!supabase) return { ...DEFAULT_FOTOGRAFI }
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === FOTOGRAFI_SETTINGS_KEY) as { value?: string } | undefined
  return parseFotografi(raw?.value)
}

// ─── References → Ögonblick (editable candid gallery) ───────────────────────

export async function getOgonblick(): Promise<OgonblickSection> {
  'use cache'
  cacheTag('references-ogonblick')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === OGONBLICK_SETTINGS_KEY) as { value?: string } | undefined
      return parseOgonblick(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULT_OGONBLICK }
}

/** Fresh (non-cached) read for admin GET. */
export async function getOgonblickAdmin(): Promise<OgonblickSection> {
  const supabase = createAdminClient()
  if (!supabase) return { ...DEFAULT_OGONBLICK }
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === OGONBLICK_SETTINGS_KEY) as { value?: string } | undefined
  return parseOgonblick(raw?.value)
}

// ─── Biografi → Litteraturförteckning (editable, entries link to texts) ──────

export async function getBibliography(): Promise<BibEntry[]> {
  'use cache'
  cacheTag('biography', 'bibliography')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === BIBLIOGRAPHY_SETTINGS_KEY) as { value?: string } | undefined
      return parseBibliography(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_BIBLIOGRAPHY
}

/** Fresh (non-cached) read for admin GET. */
export async function getBibliographyAdmin(): Promise<BibEntry[]> {
  const supabase = createAdminClient()
  if (!supabase) return DEFAULT_BIBLIOGRAPHY
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === BIBLIOGRAPHY_SETTINGS_KEY) as { value?: string } | undefined
  return parseBibliography(raw?.value)
}

// ─── References → Skulptur (editable series/submenus) ───────────────────────

export async function getSculptureProjects(): Promise<SculptureProject[]> {
  'use cache'
  cacheTag('references-sculpture')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === SCULPTURE_SETTINGS_KEY) as { value?: string } | undefined
      return parseSculptureProjects(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return resolveSculptureProjects(SCULPTURE_PROJECTS)
}

/** Fresh (non-cached) read for admin GET. */
export async function getSculptureProjectsAdmin(): Promise<SculptureProject[]> {
  const supabase = createAdminClient()
  if (!supabase) return resolveSculptureProjects(SCULPTURE_PROJECTS)
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === SCULPTURE_SETTINGS_KEY) as { value?: string } | undefined
  return parseSculptureProjects(raw?.value)
}

export async function getGrafik(): Promise<GrafikSection> {
  'use cache'
  cacheTag('references-grafik')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === GRAFIK_SETTINGS_KEY) as { value?: string } | undefined
      return parseGrafik(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULT_GRAFIK }
}

/** Fresh (non-cached) read for admin GET. */
export async function getGrafikAdmin(): Promise<GrafikSection> {
  const supabase = createAdminClient()
  if (!supabase) return { ...DEFAULT_GRAFIK }
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === GRAFIK_SETTINGS_KEY) as { value?: string } | undefined
  return parseGrafik(raw?.value)
}

export async function getFilms(): Promise<FilmEntry[]> {
  'use cache'
  cacheTag('references-film')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === FILM_SETTINGS_KEY) as { value?: string } | undefined
      return parseFilms(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_FILMS
}

/** Fresh (non-cached) read for admin GET. */
export async function getFilmsAdmin(): Promise<FilmEntry[]> {
  const supabase = createAdminClient()
  if (!supabase) return DEFAULT_FILMS
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === FILM_SETTINGS_KEY) as { value?: string } | undefined
  return parseFilms(raw?.value)
}

export async function getUtmarkelser(): Promise<UtmarkelserSection> {
  'use cache'
  cacheTag('references-utmarkelser')
  cacheLife('days')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const raw = (data ?? []).find((r) => (r as { key: string }).key === UTMARKELSER_SETTINGS_KEY) as { value?: string } | undefined
      return parseUtmarkelser(raw?.value)
    }
  } catch {
    // fall through to defaults
  }
  return { ...DEFAULT_UTMARKELSER }
}

/** Fresh (non-cached) read for admin GET. */
export async function getUtmarkelserAdmin(): Promise<UtmarkelserSection> {
  const supabase = createAdminClient()
  if (!supabase) return { ...DEFAULT_UTMARKELSER }
  const { data } = await supabase.from('settings').select('key, value')
  const raw = (data ?? []).find((r) => (r as { key: string }).key === UTMARKELSER_SETTINGS_KEY) as { value?: string } | undefined
  return parseUtmarkelser(raw?.value)
}

// ─── Portfolio category thumbnails (the 4 slideshows on /portfolio) ──────────

/**
 * Image lists for the 4 portfolio category cards, editable in admin.
 * Reads the `settings` table (one JSON key per category); any category the
 * admin hasn't customised falls back to DEFAULT_PORTFOLIO_THUMBS, so the page
 * is unchanged until Jan edits it.
 */
export async function getPortfolioThumbs(): Promise<PortfolioThumbs> {
  'use cache'
  cacheTag('portfolio-thumbs')
  cacheLife('days')

  const result: PortfolioThumbs = {
    exhibitions: [...DEFAULT_PORTFOLIO_THUMBS.exhibitions],
    'public-works': [...DEFAULT_PORTFOLIO_THUMBS['public-works']],
    watercolors: [...DEFAULT_PORTFOLIO_THUMBS.watercolors],
    scenography: [...DEFAULT_PORTFOLIO_THUMBS.scenography],
  }

  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('key, value')
      const byKey = new Map<string, string>((data ?? []).map((r) => [(r as { key: string }).key, (r as { value?: string }).value ?? '']))
      for (const cat of PORTFOLIO_CATEGORY_KEYS) {
        const raw = byKey.get(portfolioThumbsKey(cat))
        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (Array.isArray(parsed) && parsed.every((u) => typeof u === 'string')) {
              // Empty array = "cleared" → keep defaults so a card is never blank.
              if (parsed.length) result[cat] = parsed as string[]
            }
          } catch {
            // malformed value — keep default
          }
        }
      }
    }
  } catch {
    // DB/fetch error — serve defaults so the page always renders.
  }
  return result
}

/** Non-cached read for admin GET (always fresh, includes empty customisations). */
export async function getPortfolioThumbsAdmin(): Promise<PortfolioThumbs> {
  const result: PortfolioThumbs = {
    exhibitions: [...DEFAULT_PORTFOLIO_THUMBS.exhibitions],
    'public-works': [...DEFAULT_PORTFOLIO_THUMBS['public-works']],
    watercolors: [...DEFAULT_PORTFOLIO_THUMBS.watercolors],
    scenography: [...DEFAULT_PORTFOLIO_THUMBS.scenography],
  }
  const supabase = createAdminClient()
  if (supabase) {
    const { data } = await supabase.from('settings').select('key, value')
    const byKey = new Map<string, string>((data ?? []).map((r) => [(r as { key: string }).key, (r as { value?: string }).value ?? '']))
    for (const cat of PORTFOLIO_CATEGORY_KEYS) {
      const raw = byKey.get(portfolioThumbsKey(cat))
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) result[cat] = parsed.filter((u) => typeof u === 'string')
        } catch { /* keep default */ }
      }
    }
  }
  return result
}

export type { PortfolioCategoryKey }

// ─── Exhibitions ────────────────────────────────────────────────────────────

function dbRowToExhibition(w: Record<string, unknown>): Exhibition {
  const imgs = (w.images as { url: string; sort_order?: number }[] | null) ?? []
  return {
    slug: w.slug as string,
    title: w.title as string,
    year: (w.year_start as number) ?? 0,
    location: (w.location as string) ?? '',
    url: (w.source_url as string) ?? '',
    description: (w.description as string) ?? '',
    body: (w.body as string) ?? undefined,
    links: (w.links as ExhibitionLink[]) ?? undefined,
    pdfs: (w.pdfs as Array<{ label: string; url: string }>) ?? undefined,
    audioUrl: (w.audio_url as string) || undefined,
    media: (w.media as Array<{ label: string; url: string }>) ?? undefined,
    group: (w.group_exhibition as boolean) || undefined,
    photographerCredit: (w.photographer_credit as string) ?? undefined,
    images: imgs
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img) => img.url),
  }
}

export async function getExhibitions(): Promise<Exhibition[]> {
  'use cache'
  cacheTag('exhibitions')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('works')
      .select('*, images(url, sort_order)')
      .eq('published', true)
      .order('year_start', { ascending: false })
    if (!error && data) return data.map((r) => dbRowToExhibition(r as Record<string, unknown>))
  }
  return [...STATIC_EXHIBITIONS].sort((a, b) => b.year - a.year)
}

function dbRowToSubpage(row: Record<string, unknown>): ExhibitionSubpage {
  const imgs = (row.images as string[] | null) ?? []
  return {
    slug: row.slug as string,
    title: (row.title as string) ?? '',
    body: (row.body as string) ?? '',
    images: Array.isArray(imgs) ? imgs : [],
    videoUrl: (row.video_url as string) || undefined,
    videos: normalizeVideos(row.videos),
    sortOrder: (row.sort_order as number) ?? 0,
    published: (row.published as boolean) ?? true,
  }
}

/** Coerce a jsonb `videos` column into a clean Array<{url,title?}>. */
function normalizeVideos(raw: unknown): Array<{ url: string; title?: string }> | undefined {
  if (!Array.isArray(raw)) return undefined
  const out = raw
    .map((v) => {
      if (typeof v === 'string') return { url: v }
      if (v && typeof v === 'object' && typeof (v as { url?: unknown }).url === 'string') {
        const o = v as { url: string; title?: unknown }
        return { url: o.url, title: typeof o.title === 'string' ? o.title : undefined }
      }
      return null
    })
    .filter((v): v is { url: string; title?: string } => v !== null && v.url.length > 0)
  return out.length ? out : undefined
}

export async function getExhibition(slug: string): Promise<Exhibition | null> {
  'use cache'
  cacheTag('exhibitions', `exhibition-${slug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('works')
      .select('*, images(url, alt, sort_order)')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (!error && data) {
      const exhibition = dbRowToExhibition(data as Record<string, unknown>)
      const { data: subs } = await supabase
        .from('work_subpages')
        .select('*')
        .eq('work_id', (data as Record<string, unknown>).id as string)
        .order('sort_order', { ascending: true })
      if (subs && subs.length) {
        exhibition.subpages = subs.map((r) => dbRowToSubpage(r as Record<string, unknown>))
      }
      return exhibition
    }
  }
  return STATIC_EXHIBITIONS.find((e) => e.slug === slug) ?? null
}

/** Fetch a single editable sub-page nested under an exhibition. */
export async function getExhibitionSubpage(
  exhibitionSlug: string,
  subpageSlug: string
): Promise<{ exhibition: Exhibition; subpage: ExhibitionSubpage } | null> {
  'use cache'
  cacheTag('exhibitions', `exhibition-${exhibitionSlug}`, `subpage-${exhibitionSlug}-${subpageSlug}`)
  cacheLife('days')
  const exhibition = await getExhibition(exhibitionSlug)
  if (!exhibition) return null
  const subpage = exhibition.subpages?.find((s) => s.slug === subpageSlug && s.published !== false)
  if (!subpage) return null
  return { exhibition, subpage }
}

/** All { exhibitionSlug, subpageSlug } pairs — for generateStaticParams. */
export async function getAllSubpageParams(): Promise<{ slug: string; subpage: string }[]> {
  'use cache'
  cacheTag('exhibitions')
  cacheLife('days')
  const supabase = createAdminClient()
  if (!supabase) return [{ slug: '_', subpage: '_' }]
  const { data, error } = await supabase
    .from('work_subpages')
    .select('slug, published, works!inner(slug)')
    .eq('published', true)
  if (error || !data) return [{ slug: '_', subpage: '_' }]
  const results = data
    .map((r) => {
      const works = (r as Record<string, unknown>).works as { slug: string } | { slug: string }[] | null
      const parentSlug = Array.isArray(works) ? works[0]?.slug : works?.slug
      return parentSlug ? { slug: parentSlug, subpage: (r as Record<string, unknown>).slug as string } : null
    })
    .filter((x): x is { slug: string; subpage: string } => x !== null)
  // Next.js 16 with 'use cache' requires at least one result from generateStaticParams
  return results.length > 0 ? results : [{ slug: '_', subpage: '_' }]
}

export async function getExhibitionSlugs(): Promise<string[]> {
  'use cache'
  cacheTag('exhibitions')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('works').select('slug').eq('published', true)
    if (!error && data) return data.map((r) => r.slug as string)
  }
  return STATIC_EXHIBITIONS.map((e) => e.slug)
}

// ─── Public Works ───────────────────────────────────────────────────────────

function dbRowToPublicWork(
  row: Record<string, unknown>,
  images: Array<{ url: string; alt: string | null; sort_order: number }>
): PublicWork {
  return {
    slug: row.slug as string,
    title: row.title as string,
    year: String(row.year ?? ''),
    location: (row.location as string) ?? '',
    category: ((row.subcategory as string) === 'interior' ? 'interior' : 'exterior') as PublicWork['category'],
    description: (row.description as string) ?? '',
    body: (row.description_sv as string) ?? '',
    videos: (normalizeVideos(row.videos) ?? []).map((v) => ({ url: v.url, title: v.title ?? '' })),
    links: (row.links as PublicWork['links']) ?? undefined,
    pdfs: (row.pdfs as PublicWork['pdfs']) ?? undefined,
    audioUrl: (row.audio_url as string) || undefined,
    media: (row.media as PublicWork['media']) ?? undefined,
    photographerCredit: (row.photographer_credit as string) || undefined,
    images: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ url: img.url, alt: img.alt ?? '' })),
  }
}

export async function getPublicWorks(): Promise<PublicWork[]> {
  'use cache'
  // Also tagged 'exhibitions' so editing an exhibition's cross-list flag
  // invalidates this list too.
  cacheTag('public-works', 'exhibitions')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('public_works')
      .select('*, public_work_images(url, alt, sort_order)')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    if (!error && data) {
      const dbWorks = data.map((w) =>
        dbRowToPublicWork(
          w as Record<string, unknown>,
          (w.public_work_images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? []
        )
      )

      // Cross-listed exhibitions: shown under Public Works as exterior/interior,
      // but the card links back to the exhibition page where the content lives.
      const { data: exRows } = await supabase
        .from('works')
        .select('slug, title, year_start, location, description, body, public_subcategory, public_temporary, images(url, alt, sort_order)')
        .eq('show_in_public_works', true)
        .eq('published', true)
      const exWorks: PublicWork[] = (exRows ?? []).map((row) => {
        const r = row as Record<string, unknown>
        const imgs = ((r.images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => ({ url: img.url, alt: img.alt ?? '' }))
        return {
          slug: r.slug as string,
          title: r.title as string,
          year: String(r.year_start ?? ''),
          location: (r.location as string) ?? '',
          category: ((r.public_subcategory as string) === 'interior' ? 'interior' : 'exterior') as PublicWork['category'],
          description: (r.description as string) ?? '',
          body: (r.body as string) ?? '',
          images: imgs,
          temporary: (r.public_temporary as boolean) ?? false,
          hrefBase: '/portfolio/exhibitions',
        }
      })

      return [...dbWorks, ...exWorks]
    }
  }
  return STATIC_PUBLIC_WORKS
}

export async function getPublicWork(slug: string): Promise<PublicWork | null> {
  'use cache'
  cacheTag('public-works', `public-work-${slug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('public_works')
      .select('*, public_work_images(url, alt, sort_order)')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (!error && data) {
      const work = dbRowToPublicWork(
        data as Record<string, unknown>,
        (data.public_work_images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? []
      )
      // Fall back to static images if DB entry has none
      if (work.images.length === 0) {
        const staticMatch = STATIC_PUBLIC_WORKS.find((s) => s.slug === slug)
        if (staticMatch && staticMatch.images.length > 0) {
          return { ...work, images: staticMatch.images }
        }
      }
      return work
    }
  }
  return STATIC_PUBLIC_WORKS.find((w) => w.slug === slug) ?? null
}

export async function getPublicWorkSlugs(): Promise<string[]> {
  'use cache'
  cacheTag('public-works')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('public_works').select('slug').eq('published', true)
    if (!error && data) return data.map((r) => r.slug as string)
  }
  return STATIC_PUBLIC_WORKS.map((w) => w.slug)
}

// ─── Public-work sub-pages ───────────────────────────────────────────────────

function dbRowToPublicWorkSubpage(row: Record<string, unknown>): PublicWorkSubpage {
  const imgs = (row.images as string[] | null) ?? []
  return {
    slug: row.slug as string,
    title: (row.title as string) ?? '',
    body: (row.body as string) ?? '',
    images: Array.isArray(imgs) ? imgs : [],
    videoUrl: (row.video_url as string) || undefined,
    videos: normalizeVideos(row.videos),
    sortOrder: (row.sort_order as number) ?? 0,
    published: (row.published as boolean) ?? true,
  }
}

/** Fetch a single editable sub-page nested under a public work. */
export async function getPublicWorkSubpage(
  workSlug: string,
  subpageSlug: string,
): Promise<{ work: PublicWork; subpage: PublicWorkSubpage } | null> {
  'use cache'
  cacheTag('public-works', `public-work-${workSlug}`, `pw-subpage-${workSlug}-${subpageSlug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (!supabase) return null
  const work = await getPublicWork(workSlug)
  if (!work) return null
  const { data: pw } = await supabase.from('public_works').select('id').eq('slug', workSlug).single()
  if (!pw) return null
  const { data: sub } = await supabase
    .from('public_work_subpages')
    .select('*')
    .eq('work_id', (pw as Record<string, unknown>).id as string)
    .eq('slug', subpageSlug)
    .eq('published', true)
    .single()
  if (!sub) return null
  return { work, subpage: dbRowToPublicWorkSubpage(sub as Record<string, unknown>) }
}

/** All { slug, subpage } pairs for public-work sub-pages — for generateStaticParams. */
export async function getAllPublicWorkSubpageParams(): Promise<{ slug: string; subpage: string }[]> {
  'use cache'
  cacheTag('public-works')
  cacheLife('days')
  const supabase = createAdminClient()
  if (!supabase) return [{ slug: '_', subpage: '_' }]
  const { data, error } = await supabase
    .from('public_work_subpages')
    .select('slug, published, public_works!inner(slug)')
    .eq('published', true)
  if (error || !data) return [{ slug: '_', subpage: '_' }]
  const results = data
    .map((r) => {
      const pw = (r as Record<string, unknown>).public_works as { slug: string } | { slug: string }[] | null
      const parentSlug = Array.isArray(pw) ? pw[0]?.slug : pw?.slug
      return parentSlug ? { slug: parentSlug, subpage: (r as Record<string, unknown>).slug as string } : null
    })
    .filter((x): x is { slug: string; subpage: string } => x !== null)
  return results.length > 0 ? results : [{ slug: '_', subpage: '_' }]
}

// ─── Map Pins ────────────────────────────────────────────────────────────────

function dbRowToLocation(row: Record<string, unknown>): SculptureLocation {
  // `subcategory` is enriched from the matching public_works row (map_pins itself
  // has no category column). interior → interior, everything else → exterior.
  const subcategory = (row.subcategory as string) ?? null
  const type: SculptureLocation['type'] = subcategory === 'interior' ? 'interior' : 'exterior'
  return {
    id: row.slug as string,
    title: row.title as string,
    year: (row.year as number) ?? 0,
    city: (row.city as string) ?? '',
    country: (row.country as string) ?? 'Sweden',
    lat: row.lat as number,
    lng: row.lng as number,
    type,
    slug: row.slug as string,
    description: (row.description as string) ?? undefined,
  }
}

export async function getMapPins(): Promise<SculptureLocation[]> {
  'use cache'
  cacheTag('map-pins', 'public-works')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const [{ data: pins, error }, { data: works }] = await Promise.all([
      supabase.from('map_pins').select('*').order('year', { ascending: true }),
      supabase.from('public_works').select('slug, subcategory, lat, lng, title, year, city, country, description').eq('published', true),
    ])
    if (!error && pins) {
      // Build lookup from public_works for coord enrichment + dedup
      const bySlug = new Map<string, { subcategory?: string; lat?: number | null; lng?: number | null }>(
        (works ?? []).map((w) => [w.slug as string, { subcategory: w.subcategory as string, lat: w.lat as number | null, lng: w.lng as number | null }]),
      )
      const pinSlugs = new Set((pins as Record<string, unknown>[]).map((p) => p.slug as string))

      // Enrich map_pins rows with authoritative coords from public_works
      const pinLocations = (pins as Record<string, unknown>[]).map((row) => {
        const pw = bySlug.get(row.slug as string)
        const lat = pw && pw.lat != null ? pw.lat : row.lat
        const lng = pw && pw.lng != null ? pw.lng : row.lng
        return dbRowToLocation({ ...row, lat, lng, subcategory: pw?.subcategory })
      })

      // Include public_works that have coords but no map_pins row
      const pwOnlyLocations = (works ?? [])
        .filter((w) => !pinSlugs.has(w.slug as string) && w.lat != null && w.lng != null)
        .map((w) => dbRowToLocation({
          slug: w.slug,
          title: w.title,
          year: w.year,
          city: w.city,
          country: w.country,
          description: w.description,
          lat: w.lat,
          lng: w.lng,
          subcategory: w.subcategory,
        }))

      return [...pinLocations, ...pwOnlyLocations].sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    }
  }
  return STATIC_LOCATIONS
}

// ─── Texts ──────────────────────────────────────────────────────────────────

function dbRowToText(row: Record<string, unknown>): TextItem {
  return {
    slug: row.slug as string,
    type: row.text_type as TextItem['type'],
    year: (row.year as number) ?? 0,
    month: (row.month as number) ?? undefined,
    title: row.title as string,
    author: (row.author as string) ?? '',
    authorBio: (row.author_bio as string) ?? '',
    publication: (row.publication as string) ?? '',
    lang: ((row.language as string) ?? 'sv') as TextItem['lang'],
    body: (row.content as string) ?? '',
    images: (row.images as string[] | null) ?? [],
    showOcr: (row.show_ocr as boolean | null) ?? false,
    pdfs: (row.pdfs as TextItem['pdfs']) ?? undefined,
    audioUrl: (row.audio_url as string) || undefined,
    media: (row.media as TextItem['media']) ?? undefined,
    videoUrl: (row.video_url as string) || undefined,
  }
}

export async function getTexts(): Promise<TextItem[]> {
  'use cache'
  cacheTag('texts')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('texts')
      .select('*')
      .eq('published', true)
      .order('year', { ascending: false })
      .order('month', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: true })
    if (!error && data) return data.map((r) => dbRowToText(r as Record<string, unknown>))
  }
  return STATIC_TEXTS
}

export async function getText(slug: string): Promise<TextItem | null> {
  'use cache'
  cacheTag('texts', `text-${slug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('texts')
      .select('*')
      .eq('slug', slug)
      .single()
    if (!error && data) return dbRowToText(data as Record<string, unknown>)
  }
  return STATIC_TEXTS.find((t) => t.slug === slug) ?? null
}

function dbRowToTextSubpage(r: Record<string, unknown>): TextSubpage {
  const imgs = (r.images as string[] | null) ?? []
  return {
    slug: r.slug as string,
    title: (r.title as string) ?? '',
    body: (r.body as string) ?? '',
    images: Array.isArray(imgs) ? imgs : [],
    videoUrl: (r.video_url as string) || undefined,
    videos: (r.videos as Array<{ url: string; title?: string }>) ?? undefined,
    sortOrder: (r.sort_order as number) ?? 0,
    published: (r.published as boolean) ?? true,
  }
}

/** A single internal sub-page of a text, plus its parent text. */
export async function getTextSubpage(
  textSlug: string,
  subSlug: string,
): Promise<{ text: TextItem; subpage: TextSubpage } | null> {
  'use cache'
  cacheTag('texts', `text-${textSlug}`, `text-subpage-${textSlug}-${subSlug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data: text } = await supabase.from('texts').select('*').eq('slug', textSlug).single()
  if (!text) return null
  const { data: sub } = await supabase
    .from('text_subpages')
    .select('*')
    .eq('text_id', (text as Record<string, unknown>).id as string)
    .eq('slug', subSlug)
    .eq('published', true)
    .maybeSingle()
  if (!sub) return null
  return {
    text: dbRowToText(text as Record<string, unknown>),
    subpage: dbRowToTextSubpage(sub as Record<string, unknown>),
  }
}

/** All { slug, subpage } pairs for text sub-pages — for generateStaticParams. */
export async function getAllTextSubpageParams(): Promise<{ slug: string; subpage: string }[]> {
  'use cache'
  cacheTag('texts')
  cacheLife('days')
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('text_subpages')
    .select('slug, published, texts!inner(slug)')
    .eq('published', true)
  if (error || !data) return []
  return data
    .map((r) => {
      const texts = (r as Record<string, unknown>).texts as { slug: string } | { slug: string }[] | null
      const parentSlug = Array.isArray(texts) ? texts[0]?.slug : texts?.slug
      return parentSlug ? { slug: parentSlug, subpage: (r as Record<string, unknown>).slug as string } : null
    })
    .filter((x): x is { slug: string; subpage: string } => x !== null)
}

// Returns the map pin for a public work slug (for coordinates / Google Maps link)
export async function getMapPinForWork(slug: string): Promise<SculptureLocation | null> {
  'use cache'
  cacheTag('map-pins', 'public-works', `map-pin-${slug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data: work } = await supabase
      .from('public_works')
      .select('subcategory, lat, lng, title, year, city, country')
      .eq('slug', slug)
      .maybeSingle()
    const { data: pin } = await supabase.from('map_pins').select('*').eq('slug', slug).maybeSingle()

    // public_works coords are authoritative (set via the work-edit map picker).
    // Show the map whenever coordinates exist there, even if no map_pins row —
    // otherwise the "Visa platsen" map silently disappears (Jan, Undring 6).
    const pwHasCoords = work?.lat != null && work?.lng != null
    const pinHasCoords = pin?.lat != null && pin?.lng != null
    if (pwHasCoords || pinHasCoords) {
      const lat = pwHasCoords ? work!.lat : (pin as Record<string, unknown>).lat
      const lng = pwHasCoords ? work!.lng : (pin as Record<string, unknown>).lng
      // Prefer the map_pins row for metadata (title/year/desc); fall back to the
      // public_works row when there is no pin.
      const base = (pin as Record<string, unknown>) ?? {
        slug,
        title: work?.title,
        year: work?.year,
        city: work?.city,
        country: work?.country,
      }
      return dbRowToLocation({ ...base, slug, lat, lng, subcategory: work?.subcategory })
    }
  }
  return STATIC_LOCATIONS.find((l) => l.slug === slug) ?? null
}

export async function getTextSlugs(): Promise<string[]> {
  'use cache'
  cacheTag('texts')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('texts')
      .select('slug')
      .eq('published', true)
    if (!error && data) return data.map((r) => r.slug as string)
  }
  return STATIC_TEXTS.map((t) => t.slug)
}

// ─── Hero Slides ─────────────────────────────────────────────────────────────

// Fallback: first 9 images from ALL_IMAGES in HeroSlideshow
const FALLBACK_HERO_SLIDES = [
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg', alt: 'Blasieholmstorg, Stockholm 1989' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg', alt: 'Hästar i brons' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg', alt: 'Blasieholmstorg detalj' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg', alt: 'Blasieholmstorg natt' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg', alt: 'Blasieholmstorg panorama' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg', alt: 'Blasieholmstorg sidovy' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Triumf-Paris.jpg', alt: 'Sivert Lindblom i Paris' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/img307.jpg', alt: 'Arkivbild' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Glyptoteket.jpg', alt: 'Glyptoteket, Köpenhamn' },
]

export async function getHeroSlides(): Promise<Array<{ url: string; alt: string }>> {
  'use cache'
  cacheTag('hero')
  cacheLife('hours')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_slides')
      .single()
    if (!error && data?.value) {
      try {
        const slides = JSON.parse(data.value) as Array<{ url: string; alt: string }>
        if (Array.isArray(slides) && slides.length > 0) return slides
      } catch {
        // fall through to fallback
      }
    }
  }
  return FALLBACK_HERO_SLIDES
}

/**
 * Returns the curated hero slides, random-order setting, and hero tagline.
 * Falls back to FALLBACK_HERO_SLIDES + random=true when no DB data exists.
 * tagline is undefined when not set in DB — callers fall back to locale or FALLBACK_SETTINGS.
 */
export async function getHeroConfig(): Promise<{
  slides: Array<{ url: string; alt: string; focal?: string }>
  random: boolean
  tagline: string | undefined
}> {
  'use cache'
  cacheTag('hero')
  cacheLife('hours')
  const supabase = createAdminClient()
  let slides: Array<{ url: string; alt: string; focal?: string }> = []
  let random = true
  let tagline: string | undefined

  if (supabase) {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_slides', 'hero_random', 'hero_tagline'])

    for (const row of data ?? []) {
      if (row.key === 'hero_slides') {
        try {
          const parsed = JSON.parse(row.value) as Array<{ url: string; alt: string; focal?: string }>
          if (Array.isArray(parsed) && parsed.length > 0) slides = parsed
        } catch { /* ignore */ }
      }
      if (row.key === 'hero_random') {
        random = row.value !== '0'
      }
      if (row.key === 'hero_tagline' && row.value) {
        tagline = row.value
      }
    }
  }

  return { slides: slides.length > 0 ? slides : FALLBACK_HERO_SLIDES, random, tagline }
}

// ─── All media images (hero slideshow) ──────────────────────────────────────
// Collects every image from exhibitions + public works so the home hero can
// cycle through the full media vault in random order.
export async function getAllMediaImages(): Promise<Array<{ url: string; alt: string }>> {
  'use cache'
  cacheTag('exhibitions', 'public-works')
  cacheLife('days')
  const [exhibitions, publicWorks] = await Promise.all([
    getExhibitions(),
    getPublicWorks(),
  ])

  const out: Array<{ url: string; alt: string }> = []

  for (const ex of exhibitions) {
    for (const url of ex.images) {
      if (url) out.push({ url, alt: ex.title })
    }
  }

  for (const work of publicWorks) {
    for (const img of work.images) {
      if (img.url) out.push({ url: img.url, alt: img.alt || work.title })
    }
  }

  // Fall back to the curated hero slides if nothing came back from the DB
  return out.length > 0 ? out : FALLBACK_HERO_SLIDES
}

// ─── Homepage editable content ───────────────────────────────────────────────

import type { HomeContent } from './home-content-types'
import { HOME_CONTENT_DEFAULTS } from './home-content-types'
export type { HomeContent }
export { HOME_CONTENT_DEFAULTS }

const HOME_CONTENT_KEYS = [
  'site_title', 'hero_tagline', 'about_short',
  'home_press_quote', 'home_press_attribution', 'home_press_source', 'home_press_duration',
  'home_audio_url', 'home_audio_link',
  'home_stat_n_active', 'home_stat_n_public', 'home_stat_n_countries', 'home_stat_n_born',
  'home_contact_image',
] as const

export async function getHomeContent(): Promise<HomeContent> {
  'use cache'
  cacheTag('home-content')
  cacheLife('hours')
  const supabase = createAdminClient()
  if (!supabase) return HOME_CONTENT_DEFAULTS
  const { data } = await supabase.from('settings').select('key, value').in('key', [...HOME_CONTENT_KEYS])
  const map: Record<string, string> = {}
  for (const row of data ?? []) if (row.value) map[row.key] = row.value
  return {
    siteTitle: map['site_title'] || HOME_CONTENT_DEFAULTS.siteTitle,
    tagline: map['hero_tagline'] || HOME_CONTENT_DEFAULTS.tagline,
    pressQuote: map['home_press_quote'] || HOME_CONTENT_DEFAULTS.pressQuote,
    pressAttribution: map['home_press_attribution'] || HOME_CONTENT_DEFAULTS.pressAttribution,
    pressSource: map['home_press_source'] || HOME_CONTENT_DEFAULTS.pressSource,
    pressDuration: map['home_press_duration'] || HOME_CONTENT_DEFAULTS.pressDuration,
    audioUrl: map['home_audio_url'] || HOME_CONTENT_DEFAULTS.audioUrl,
    audioLink: map['home_audio_link'] || HOME_CONTENT_DEFAULTS.audioLink,
    aboutText: map['about_short'] || HOME_CONTENT_DEFAULTS.aboutText,
    statNActive: map['home_stat_n_active'] || HOME_CONTENT_DEFAULTS.statNActive,
    statNPublic: map['home_stat_n_public'] || HOME_CONTENT_DEFAULTS.statNPublic,
    statNCountries: map['home_stat_n_countries'] || HOME_CONTENT_DEFAULTS.statNCountries,
    statNBorn: map['home_stat_n_born'] || HOME_CONTENT_DEFAULTS.statNBorn,
    contactImage: map['home_contact_image'] || HOME_CONTENT_DEFAULTS.contactImage,
  }
}

export interface BiographyEntry {
  id: string
  entry_type: string
  year_start: number
  year_end: number | null
  title: string
  description: string | null
  location: string | null
  sort_order: number | null
}

export async function getBiographyEntries(): Promise<BiographyEntry[]> {
  'use cache'
  cacheTag('biography')
  cacheLife('minutes')
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data } = await supabase
    .from('biography_entries')
    .select('id, entry_type, year_start, year_end, title, description, location, sort_order')
    .order('year_start', { ascending: false })
  return data ?? []
}
