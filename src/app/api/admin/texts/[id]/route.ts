import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { TEXTS_DATA } from '@/lib/texts-data'
import type { TextItem } from '@/lib/texts-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToTextItem(row: Record<string, unknown>): TextItem {
  return {
    slug: row.slug as string,
    type: (row.text_type as TextItem['type']) ?? 'essay',
    year: (row.year as number) ?? 0,
    title: row.title as string,
    author: (row.author as string) ?? '',
    publication: (row.publication as string) ?? '',
    lang: (row.language as TextItem['lang']) ?? 'sv',
    body: (row.content as string) ?? '',
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
    if (!error && data) return NextResponse.json(dbToTextItem(data as Record<string, unknown>))
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
      const { error } = await supabase.from('texts').update({
        title: body.title,
        author: body.author,
        text_type: body.type,
        publication: body.publication,
        year: body.year,
        language: body.lang,
        content: body.body,
      }).eq('slug', id)
      if (!error) return NextResponse.json(body)
    }

    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const idx = current.findIndex(t => t.slug === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]; updated[idx] = body
    const result = saveCmsData('texts', updated)
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
      const { error } = await supabase.from('texts').delete().eq('slug', id)
      if (!error) return NextResponse.json({ ok: true })
    }

    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const updated = current.filter(t => t.slug !== id)
    if (updated.length === current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const result = saveCmsData('texts', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
