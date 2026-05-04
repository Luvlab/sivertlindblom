import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SCULPTURE_LOCATIONS } from '@/lib/sculpture-locations'
import type { SculptureLocation } from '@/lib/sculpture-locations'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    const current = loadCmsData<SculptureLocation>('map-pins', SCULPTURE_LOCATIONS)
    const updated = [...current, body]
    const result = saveCmsData('map-pins', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, ...body }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
