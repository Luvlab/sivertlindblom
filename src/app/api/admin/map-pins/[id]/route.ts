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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('map_pins').select('*').eq('slug', id).single()
    if (!error && data) return NextResponse.json(dbToLocation(data as Record<string, unknown>))
  }

  const data = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
  const item = data.find(p => p.id === id)
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
    const body = await request.json() as SculptureLocation

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase.from('map_pins').update({
        title: body.title,
        lat: body.lat,
        lng: body.lng,
        city: body.city,
        country: body.country,
        year: body.year,
        description: body.description,
      }).eq('slug', id)
      if (!error) return NextResponse.json({ ok: true, ...body })
    }

    const current = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
    const idx = current.findIndex(p => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]; updated[idx] = body
    const result = saveCmsData('map-pins', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json({ ok: true, ...body })
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
      const { error } = await supabase.from('map_pins').delete().eq('slug', id)
      if (!error) return NextResponse.json({ ok: true })
    }

    const current = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
    const updated = current.filter(p => p.id !== id)
    if (updated.length === current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const result = saveCmsData('map-pins', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
