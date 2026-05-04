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

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('texts')
      .select('*')
      .eq('published', true)
      .order('year', { ascending: false })
    if (!error && data) {
      return NextResponse.json(data.map(dbToTextItem))
    }
  }

  const data = loadCmsData<TextItem>('texts', TEXTS_DATA)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as TextItem

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase.from('texts').upsert({
        slug: body.slug,
        title: body.title,
        author: body.author,
        text_type: body.type,
        publication: body.publication,
        year: body.year,
        language: body.lang,
        content: body.body,
        published: true,
      }, { onConflict: 'slug' })
      if (!error) return NextResponse.json(body, { status: 201 })
    }

    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const updated = [...current, body]
    const result = saveCmsData('texts', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json(body, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
