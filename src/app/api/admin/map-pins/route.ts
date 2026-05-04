import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SCULPTURE_LOCATIONS } from '@/lib/sculpture-locations'
import type { SculptureLocation } from '@/lib/sculpture-locations'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToLocation(row: Record<string, unknown>): SculptureLocation {
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

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('map_pins')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error && data) {
      return NextResponse.json(data.map(row => dbToLocation(row as Record<string, unknown>)))
    }
  }

  const data = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as SculptureLocation

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase.from('map_pins').upsert({
        slug: body.id ?? body.slug,
        title: body.title,
        lat: body.lat,
        lng: body.lng,
        city: body.city,
        country: body.country,
        year: body.year,
        description: body.description,
        published: true,
      }, { onConflict: 'slug' })
      if (!error) return NextResponse.json({ ok: true, ...body }, { status: 201 })
    }

    const current = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
    const updated = [...current, body]
    const result = saveCmsData('map-pins', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json({ ok: true, ...body }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
