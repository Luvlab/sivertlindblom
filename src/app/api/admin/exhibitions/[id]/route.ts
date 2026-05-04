import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { exhibitions } from '@/lib/exhibitions-data'
import type { Exhibition } from '@/lib/exhibitions-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToExhibition(w: Record<string, unknown>): Exhibition {
  return {
    slug: w.slug as string,
    title: w.title as string,
    year: (w.year_start as number) ?? 0,
    location: (w.location as string) ?? '',
    url: (w.source_url as string) ?? '',
    description: (w.description as string) ?? '',
    images: ((w.images as { url: string; sort_order?: number }[]) ?? [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map(img => img.url),
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
    const { data, error } = await supabase
      .from('works')
      .select(`*, images(url, alt, sort_order)`)
      .eq('slug', id)
      .single()
    if (!error && data) return NextResponse.json(dbToExhibition(data as Record<string, unknown>))
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
    const body = await request.json() as Exhibition

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
        })
        .eq('slug', id)
        .select('id')
        .single()

      if (!error && work) {
        // Replace images
        await supabase.from('images').delete().eq('work_id', work.id)
        if (body.images?.length) {
          await supabase.from('images').insert(
            body.images.map((url: string, i: number) => ({
              work_id: work.id,
              url,
              alt: body.title,
              sort_order: i,
            }))
          )
        }
        return NextResponse.json(body)
      }
    }

    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const idx = current.findIndex(e => e.slug === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]; updated[idx] = body
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
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
      const { error } = await supabase.from('works').delete().eq('slug', id)
      if (!error) return NextResponse.json({ ok: true })
    }

    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const updated = current.filter(e => e.slug !== id)
    if (updated.length === current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
