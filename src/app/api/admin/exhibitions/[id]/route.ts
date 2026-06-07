import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { exhibitions } from '@/lib/exhibitions-data'
import type { Exhibition, ExhibitionSubpage } from '@/lib/exhibitions-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'
import { sanitizeLinks, sanitizeSourceUrl } from '@/lib/old-site-guard'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToSubpage(r: Record<string, unknown>): ExhibitionSubpage {
  const imgs = (r.images as string[] | null) ?? []
  return {
    slug: r.slug as string,
    title: (r.title as string) ?? '',
    body: (r.body as string) ?? '',
    images: Array.isArray(imgs) ? imgs : [],
    videoUrl: (r.video_url as string) || undefined,
    sortOrder: (r.sort_order as number) ?? 0,
    published: (r.published as boolean) ?? true,
  }
}

function dbToExhibition(w: Record<string, unknown>): Exhibition {
  return {
    slug: w.slug as string,
    title: w.title as string,
    year: (w.year_start as number) ?? 0,
    location: (w.location as string) ?? '',
    url: (w.source_url as string) ?? '',
    description: (w.description as string) ?? '',
    links: (w.links as Exhibition['links']) ?? undefined,
    body: (w.body as string) ?? undefined,
    photographerCredit: (w.photographer_credit as string) ?? undefined,
    showInPublicWorks: (w.show_in_public_works as boolean) ?? false,
    publicSubcategory: (w.public_subcategory as 'exterior' | 'interior') ?? undefined,
    publicTemporary: (w.public_temporary as boolean) ?? false,
    images: ((w.images as { url: string; sort_order?: number }[]) ?? [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(img => img.url),
  }
}

/** Slugify a sub-page title for use in the URL. */
function slugifySubpage(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'sida'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('works')
      .select(`*, images(url, alt, sort_order)`)
      .eq('slug', id)
      .single()
    if (!error && data) {
      const result = dbToExhibition(data as Record<string, unknown>)
      const { data: subs } = await supabase
        .from('work_subpages')
        .select('*')
        .eq('work_id', (data as Record<string, unknown>).id as string)
        .order('sort_order', { ascending: true })
      result.subpages = (subs ?? []).map(r => dbToSubpage(r as Record<string, unknown>))
      return NextResponse.json(result)
    }
  }

  const data = loadCmsData<Exhibition>('exhibitions', exhibitions)
  const item = data.find(e => e.slug === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json() as Exhibition & { subpages?: ExhibitionSubpage[] }

    // ── Old-site guard: block + strip any link back to sivertlindblom.se ──
    const warnings: string[] = []
    const src = sanitizeSourceUrl(body.url)
    if (src.warning) warnings.push(src.warning)
    const linkResult = sanitizeLinks(body.links)
    warnings.push(...linkResult.warnings)
    body.url = src.url
    body.links = linkResult.links

    const supabase = createAdminClient()
    if (supabase) {
      const { data: work, error } = await supabase
        .from('works')
        .update({
          title: body.title,
          year_start: body.year,
          location: body.location,
          source_url: body.url,
          description: body.description,
          body: body.body ?? null,
          links: body.links ?? [],
          photographer_credit: body.photographerCredit ?? null,
          show_in_public_works: body.showInPublicWorks ?? false,
          public_subcategory: body.showInPublicWorks ? (body.publicSubcategory ?? 'exterior') : null,
          public_temporary: body.publicTemporary ?? false,
        })
        .eq('slug', id)
        .select('id')
        .single()

      if (!error && work) {
        // Replace images — delete old, insert new
        await supabase.from('images').delete().eq('work_id', work.id)
        if (body.images?.length) {
          const { error: imgErr } = await supabase.from('images').insert(
            body.images.map((url: string, i: number) => ({
              work_id: work.id,
              url,
              alt: body.title,
              sort_order: i,
            }))
          )
          if (imgErr) {
            return NextResponse.json({ error: `Bilder sparades inte: ${imgErr.message}` }, { status: 500 })
          }
        }

        // Sync sub-pages: upsert incoming, delete removed
        if (body.subpages !== undefined) {
          const incoming = (body.subpages ?? []).map((sp, i) => ({
            ...sp,
            slug: sp.slug?.trim() || slugifySubpage(sp.title),
            sortOrder: sp.sortOrder ?? i,
          }))
          const keepSlugs = incoming.map(sp => sp.slug)
          // Delete sub-pages no longer present
          let del = supabase.from('work_subpages').delete().eq('work_id', work.id)
          if (keepSlugs.length) del = del.not('slug', 'in', `(${keepSlugs.map(s => `"${s}"`).join(',')})`)
          await del
          // Upsert the rest
          if (incoming.length) {
            const { error: subErr } = await supabase.from('work_subpages').upsert(
              incoming.map(sp => ({
                work_id: work.id,
                slug: sp.slug,
                title: sp.title,
                body: sp.body ?? '',
                images: sp.images ?? [],
                video_url: sp.videoUrl ?? '',
                sort_order: sp.sortOrder,
                published: sp.published ?? true,
                updated_at: new Date().toISOString(),
              })),
              { onConflict: 'work_id,slug' }
            )
            if (subErr) {
              return NextResponse.json({ error: `Undersidor sparades inte: ${subErr.message}` }, { status: 500 })
            }
          }
        }

        revalidateTag('exhibitions', 'max')
        return NextResponse.json({ ...body, warnings })
      }
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const idx = current.findIndex(e => e.slug === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]; updated[idx] = body
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    revalidateTag('exhibitions', 'max')
    return NextResponse.json({ ...body, warnings })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase.from('works').delete().eq('slug', id)
      if (!error) {
        revalidateTag('exhibitions', 'max')
        return NextResponse.json({ ok: true })
      }
    }

    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const updated = current.filter(e => e.slug !== id)
    if (updated.length === current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    revalidateTag('exhibitions', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
