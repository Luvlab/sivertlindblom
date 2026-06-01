import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { exhibitions } from '@/lib/exhibitions-data'
import type { Exhibition } from '@/lib/exhibitions-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeLinks, sanitizeSourceUrl } from '@/lib/old-site-guard'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try Supabase first
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('works')
      .select(`*, images(url, alt, sort_order)`)
      .eq('category', 'exhibition')
      .order('sort_order', { ascending: true })

    if (!error && data) {
      // Map Supabase rows → Exhibition shape
      const mapped: Exhibition[] = data.map((w) => ({
        slug: w.slug,
        title: w.title,
        year: w.year_start ?? 0,
        location: w.location ?? '',
        url: w.source_url ?? '',
        description: w.description ?? '',
        body: w.body ?? undefined,
        links: (w.links as Exhibition['links']) ?? undefined,
        photographerCredit: (w.photographer_credit as string) ?? undefined,
        images: ((w.images as { url: string; sort_order?: number }[]) ?? [])
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((img) => img.url),
      }))
      return NextResponse.json(mapped)
    }
  }

  // Fallback: static data / local JSON overrides
  const data = loadCmsData<Exhibition>('exhibitions', exhibitions)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as Exhibition

    // ── Old-site guard: block + strip any link back to sivertlindblom.se ──
    const warnings: string[] = []
    const src = sanitizeSourceUrl(body.url)
    if (src.warning) warnings.push(src.warning)
    const linkResult = sanitizeLinks(body.links)
    warnings.push(...linkResult.warnings)
    body.url = src.url
    body.links = linkResult.links

    // Try Supabase first
    const supabase = createAdminClient()
    if (supabase) {
      // Find current max sort_order so new exhibition lands at the end
      const { data: maxRow } = await supabase
        .from('works')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single()
      const nextSortOrder = ((maxRow?.sort_order as number) ?? 0) + 10

      const { data: work, error } = await supabase
        .from('works')
        .insert({
          slug: body.slug,
          title: body.title,
          category: 'exhibition',
          year_start: body.year,
          location: body.location,
          source_url: body.url,
          description: body.description,
          body: body.body ?? null,
          links: body.links ?? [],
          photographer_credit: body.photographerCredit ?? null,
          sort_order: nextSortOrder,
        })
        .select()
        .single()

      if (!error && work) {
        // Insert images
        if (body.images?.length) {
          await supabase.from('images').insert(
            body.images.map((url: string, i: number) => ({
              work_id: work.id,
              url,
              sort_order: i,
            }))
          )
        }
        revalidateTag('exhibitions', 'max')
        return NextResponse.json({ ...body, warnings }, { status: 201 })
      }
    }

    // Fallback: file-based
    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const updated = [...current, body]
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    revalidateTag('exhibitions', 'max')
    return NextResponse.json({ ...body, warnings }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
