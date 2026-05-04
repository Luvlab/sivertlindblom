import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SCULPTURE_LOCATIONS } from '@/lib/sculpture-locations'
import type { SculptureLocation } from '@/lib/sculpture-locations'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const data = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
  const item = data.find(p => p.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json() as SculptureLocation
    const current = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
    const idx = current.findIndex(p => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]
    updated[idx] = body
    const result = saveCmsData('map-pins', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json(body)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const current = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
    const updated = current.filter(p => p.id !== id)
    if (updated.length === current.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const result = saveCmsData('map-pins', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
