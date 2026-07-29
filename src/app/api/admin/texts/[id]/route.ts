import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { TEXTS_DATA } from '@/lib/texts-data'
import type { TextItem, TextSubpage } from '@/lib/texts-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

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

function dbToTextSubpage(r: Record<string, unknown>): TextSubpage {
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

function dbToTextItem(row: Record<string, unknown>): TextItem {
  return {
    slug: row.slug as string,
    type: (row.text_type as TextItem['type']) ?? 'essay',
    year: (row.year as number) ?? 0,
    title: row.title as string,
    author: (row.author as string) ?? '',
    authorBio: (row.author_bio as string) ?? '',
    publication: (row.publication as string) ?? '',
    lang: (row.language as TextItem['lang']) ?? 'sv',
    body: (row.content as string) ?? '',
    images: (row.images as string[] | null) ?? [],
    showOcr: (row.show_ocr as boolean | null) ?? false,
    pdfs: (row.pdfs as TextItem['pdfs']) ?? [],
    audioUrl: (row.audio_url as string) ?? undefined,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('texts').select('*').eq('slug', id).single()
    if (!error && data) {
      const item = dbToTextItem(data as Record<string, unknown>)
      const { data: subs } = await supabase
        .from('text_subpages')
        .select('*')
        .eq('text_id', (data as Record<string, unknown>).id as string)
        .order('sort_order', { ascending: true })
      item.subpages = (subs ?? []).map(r => dbToTextSubpage(r as Record<string, unknown>))
      return NextResponse.json(item)
    }
  }

  const data = loadCmsData<TextItem>('texts', TEXTS_DATA)
  const item = data.find(t => t.slug === id)
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
    const body = await request.json() as TextItem

    const supabase = createAdminClient()
    if (supabase) {
      const { data: text, error } = await supabase.from('texts').update({
        title: body.title,
        author: body.author,
        author_bio: body.authorBio ?? null,
        text_type: body.type,
        publication: body.publication,
        year: body.year,
        language: body.lang,
        content: body.body,
        images: body.images ?? [],
        show_ocr: body.showOcr ?? false,
        pdfs: Array.isArray(body.pdfs)
          ? body.pdfs.filter((p) => p && typeof p.url === 'string' && p.url.trim())
              .map((p) => ({ label: (p.label ?? '').toString().trim() || 'PDF', url: p.url }))
          : [],
        audio_url: body.audioUrl?.trim() || null,
      }).eq('slug', id).select('id').single()
      if (!error && text) {
        // Sync sub-pages: upsert incoming, delete removed
        if (body.subpages !== undefined) {
          const incoming = (body.subpages ?? []).map((sp, i) => ({
            ...sp,
            slug: sp.slug?.trim() || slugifySubpage(sp.title),
            sortOrder: sp.sortOrder ?? i,
          }))
          const keepSlugs = incoming.map(sp => sp.slug)
          let del = supabase.from('text_subpages').delete().eq('text_id', text.id)
          if (keepSlugs.length) del = del.not('slug', 'in', `(${keepSlugs.map(s => `"${s}"`).join(',')})`)
          await del
          if (incoming.length) {
            const { error: subErr } = await supabase.from('text_subpages').upsert(
              incoming.map(sp => ({
                text_id: text.id,
                slug: sp.slug,
                title: sp.title,
                body: sp.body ?? '',
                images: sp.images ?? [],
                video_url: sp.videoUrl ?? '',
                videos: sp.videos ?? [],
                sort_order: sp.sortOrder,
                published: sp.published ?? true,
                updated_at: new Date().toISOString(),
              })),
              { onConflict: 'text_id,slug' }
            )
            if (subErr) {
              return NextResponse.json({ error: `Undersidor sparades inte: ${subErr.message}` }, { status: 500 })
            }
          }
        }
        revalidateTag('texts', 'max')
        return NextResponse.json(body)
      }
    }

    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const idx = current.findIndex(t => t.slug === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]; updated[idx] = body
    const result = saveCmsData('texts', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    revalidateTag('texts', 'max')
    return NextResponse.json(body)
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
      const { error } = await supabase.from('texts').delete().eq('slug', id)
      if (!error) {
        revalidateTag('texts', 'max')
        return NextResponse.json({ ok: true })
      }
    }

    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const updated = current.filter(t => t.slug !== id)
    if (updated.length === current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const result = saveCmsData('texts', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    revalidateTag('texts', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
