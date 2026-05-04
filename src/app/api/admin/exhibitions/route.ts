import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { exhibitions } from '@/lib/exhibitions-data'
import type { Exhibition } from '@/lib/exhibitions-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = loadCmsData<Exhibition>('exhibitions', exhibitions)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as Exhibition
    const current = loadCmsData<Exhibition>('exhibitions', exhibitions)
    const updated = [...current, body]
    const result = saveCmsData('exhibitions', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json(body, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
