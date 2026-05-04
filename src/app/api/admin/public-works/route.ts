import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PUBLIC_WORKS } from '@/lib/public-works'
import type { PublicWork } from '@/lib/public-works'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = loadCmsData<PublicWork>('public-works', PUBLIC_WORKS)
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as PublicWork[]
    const result = saveCmsData('public-works', body)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json(body)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
