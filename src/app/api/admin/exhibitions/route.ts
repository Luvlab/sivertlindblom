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
      .order('year_start', { ascending: false })

    if (!error && data) {
      // Map Supabase rows → Exhibition shape
      const mapped: Exhibition[] = data.map((w) => ({
        slug: w.slug,
        title: w.title,
        year: w.year_start ?? 0,
        location: w.location ?? '',
        url: w.source_url ?? '',
        description: w.description ?? '',
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

    // Try Supabase first
    const supabase = createAdminClient()
    if (supabase) {
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
        return NextResponse.json(body, { status: 201 })
      }
    }

    // Fallback: file-based
    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const updated = [...current, body]
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json(body, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
