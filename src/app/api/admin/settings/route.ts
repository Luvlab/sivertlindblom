import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { FALLBACK_SETTINGS } from '@/lib/db'
import type { SiteSettings } from '@/types'
import { loadCmsObject, saveCmsObject } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Try Supabase
  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('settings').select('key, value')
    if (!error && data?.length) {
      const settings: Record<string, string> = {}
      data.forEach(({ key, value }: { key: string; value: string }) => { settings[key] = value ?? '' })
      return NextResponse.json({ ...FALLBACK_SETTINGS, ...settings })
    }
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

    // Try Supabase
    const supabase = createAdminClient()
    if (supabase) {
      const upserts = Object.entries(body).map(([key, value]) => ({
        key,
        value: String(value),
        updated_at: new Date().toISOString(),
      }))
      const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
      if (!error) return NextResponse.json({ ok: true })
    }

    // Fallback: file-based
    const result = saveCmsObject('settings', body)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.message, message: result.message },
        { status: 500 }
      )
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
