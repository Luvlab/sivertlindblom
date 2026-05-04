import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { FALLBACK_SETTINGS } from '@/lib/db'
import type { SiteSettings } from '@/types'
import { loadCmsObject, saveCmsObject } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = loadCmsObject<SiteSettings>('settings', FALLBACK_SETTINGS)
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as SiteSettings
    const result = saveCmsObject('settings', body)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json(body)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
