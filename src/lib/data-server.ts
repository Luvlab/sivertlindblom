/**
 * Server-side data fetchers — query Supabase with fallback to static data.
 * Use only in Server Components and API routes (never in client components).
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { Exhibition } from '@/lib/exhibitions-data'
import { exhibitions as STATIC_EXHIBITIONS } from '@/lib/exhibitions-data'
import type { PublicWork } from '@/lib/public-works'
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
    images: imgs
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img) => img.url),
  }
}

export async function getExhibitions(): Promise<Exhibition[]> {
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('works')
      .select('*, images(url, sort_order)')
      .order('year_start', { ascending: false })
    if (!error && data) return data.map((r) => dbRowToExhibition(r as Record<string, unknown>))
  }
  return [...STATIC_EXHIBITIONS].sort((a, b) => b.year - a.year)
}

export async function getExhibition(slug: string): Promise<Exhibition | null> {
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('works')
      .select('*, images(url, alt, sort_order)')
      .eq('slug', slug)
      .single()
    if (!error && data) return dbRowToExhibition(data as Record<string, unknown>)
  }
  return STATIC_EXHIBITIONS.find((e) => e.slug === slug) ?? null
}

export async function getExhibitionSlugs(): Promise<string[]> {
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
    images: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ url: img.url, alt: img.alt ?? '' })),
  }
}

export async function getPublicWorks(): Promise<PublicWork[]> {
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('public_works')
      .select('*, public_work_images(url, alt, sort_order)')
      .order('sort_order', { ascending: true })
    if (!error && data) {
      return data.map((w) =>
        dbRowToPublicWork(
          w as Record<string, unknown>,
          (w.public_work_images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? []
        )
      )
    }
  }
  return STATIC_PUBLIC_WORKS
}

export async function getPublicWork(slug: string): Promise<PublicWork | null> {
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('public_works')
      .select('*, public_work_images(url, alt, sort_order)')
      .eq('slug', slug)
      .single()
    if (!error && data) {
      return dbRowToPublicWork(
        data as Record<string, unknown>,
        (data.public_work_images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? []
      )
    }
  }
  return STATIC_PUBLIC_WORKS.find((w) => w.slug === slug) ?? null
}

export async function getPublicWorkSlugs(): Promise<string[]> {
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('public_works').select('slug')
    if (!error && data) return data.map((r) => r.slug as string)
  }
  return STATIC_PUBLIC_WORKS.map((w) => w.slug)
}

// ─── Map Pins ────────────────────────────────────────────────────────────────

function dbRowToLocation(row: Record<string, unknown>): SculptureLocation {
  return {
    id: row.slug as string,
    title: row.title as string,
    year: (row.year as number) ?? 0,
    city: (row.city as string) ?? '',
    country: (row.country as string) ?? 'Sweden',
    lat: row.lat as number,
    lng: row.lng as number,
    type: 'exterior',
    slug: row.slug as string,
    description: (row.description as string) ?? undefined,
  }
}

export async function getMapPins(): Promise<SculptureLocation[]> {
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('map_pins')
      .select('*')
      .order('year', { ascending: true })
    if (!error && data) return data.map((r) => dbRowToLocation(r as Record<string, unknown>))
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
    publication: (row.publication as string) ?? '',
    lang: ((row.language as string) ?? 'sv') as TextItem['lang'],
    body: (row.content as string) ?? '',
  }
}

export async function getTexts(): Promise<TextItem[]> {
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

export async function getTextSlugs(): Promise<string[]> {
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
