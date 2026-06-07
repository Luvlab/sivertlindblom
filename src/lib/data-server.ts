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
import type { TextItem } from '@/lib/texts-data'
import { TEXTS_DATA as STATIC_TEXTS } from '@/lib/texts-data'

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
      .order('sort_order', { ascending: true })
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
  if (!supabase) return []
  const { data, error } = await supabase
    .from('work_subpages')
    .select('slug, published, works!inner(slug)')
    .eq('published', true)
  if (error || !data) return []
  return data
    .map((r) => {
      const works = (r as Record<string, unknown>).works as { slug: string } | { slug: string }[] | null
      const parentSlug = Array.isArray(works) ? works[0]?.slug : works?.slug
      return parentSlug ? { slug: parentSlug, subpage: (r as Record<string, unknown>).slug as string } : null
    })
    .filter((x): x is { slug: string; subpage: string } => x !== null)
}

export async function getExhibitionSlugs(): Promise<string[]> {
  'use cache'
  cacheTag('exhibitions')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('works').select('slug')
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
  if (!supabase) return []
  const { data, error } = await supabase
    .from('public_work_subpages')
    .select('slug, published, public_works!inner(slug)')
    .eq('published', true)
  if (error || !data) return []
  return data
    .map((r) => {
      const pw = (r as Record<string, unknown>).public_works as { slug: string } | { slug: string }[] | null
      const parentSlug = Array.isArray(pw) ? pw[0]?.slug : pw?.slug
      return parentSlug ? { slug: parentSlug, subpage: (r as Record<string, unknown>).slug as string } : null
    })
    .filter((x): x is { slug: string; subpage: string } => x !== null)
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
  cacheTag('map-pins')
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('map_pins')
      .select('*')
      .order('year', { ascending: true })
    if (!error && data) {
      // Enrich each pin with the real category from public_works (joined by slug)
      // so the map can colour interior vs exterior pins correctly.
      const { data: works } = await supabase.from('public_works').select('slug, subcategory')
      const subBySlug = new Map<string, string>(
        (works ?? []).map((w) => [w.slug as string, w.subcategory as string]),
      )
      return data.map((r) => {
        const row = r as Record<string, unknown>
        return dbRowToLocation({ ...row, subcategory: subBySlug.get(row.slug as string) })
      })
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
    title: row.title as string,
    author: (row.author as string) ?? '',
    authorBio: (row.author_bio as string) ?? '',
    publication: (row.publication as string) ?? '',
    lang: ((row.language as string) ?? 'sv') as TextItem['lang'],
    body: (row.content as string) ?? '',
    images: (row.images as string[] | null) ?? [],
    showOcr: (row.show_ocr as boolean | null) ?? false,
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

// Returns the map pin for a public work slug (for coordinates / Google Maps link)
export async function getMapPinForWork(slug: string): Promise<SculptureLocation | null> {
  'use cache'
  cacheTag('map-pins', `map-pin-${slug}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('map_pins').select('*').eq('slug', slug).single()
    if (!error && data) {
      const { data: work } = await supabase
        .from('public_works')
        .select('subcategory')
        .eq('slug', slug)
        .maybeSingle()
      return dbRowToLocation({
        ...(data as Record<string, unknown>),
        subcategory: work?.subcategory,
      })
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
 * Returns both the curated hero slides and the random-order setting.
 * Falls back to FALLBACK_HERO_SLIDES + random=true when no DB data exists.
 */
export async function getHeroConfig(): Promise<{
  slides: Array<{ url: string; alt: string }>
  random: boolean
}> {
  'use cache'
  cacheTag('hero')
  cacheLife('hours')
  const supabase = createAdminClient()
  let slides: Array<{ url: string; alt: string }> = []
  let random = true

  if (supabase) {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_slides', 'hero_random'])

    for (const row of data ?? []) {
      if (row.key === 'hero_slides') {
        try {
          const parsed = JSON.parse(row.value) as Array<{ url: string; alt: string }>
          if (Array.isArray(parsed) && parsed.length > 0) slides = parsed
        } catch { /* ignore */ }
      }
      if (row.key === 'hero_random') {
        random = row.value !== '0'
      }
    }
  }

  return { slides: slides.length > 0 ? slides : FALLBACK_HERO_SLIDES, random }
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
