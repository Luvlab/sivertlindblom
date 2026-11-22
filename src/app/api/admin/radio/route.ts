import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { RADIO_KEYS, radioConfig, LIBRARY_TRACKS } from '@/lib/radio'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings: Record<string, string> = {}
  const supabase = createAdminClient()
  if (supabase) {
    const { data } = await supabase.from('settings').select('key, value').in('key', Object.values(RADIO_KEYS))
    ;(data ?? []).forEach((r) => { const row = r as { key: string; value: string | null }; settings[row.key] = row.value ?? '' })
  }
  return NextResponse.json({ ...radioConfig(settings), library: LIBRARY_TRACKS, stored: !!supabase })
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as { enabled?: boolean; random?: boolean; rows?: { id: string; on: boolean }[] }
    if (!Array.isArray(body.rows)) return NextResponse.json({ ok: false, error: 'Spellistan saknas.' }, { status: 400 })
    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ ok: false, error: 'Databasen är inte ansluten, så ändringen kunde inte sparas.' }, { status: 500 })
    const now = new Date().toISOString()
    const playlist = body.rows.filter((r) => r && typeof r.id === 'string').map((r) => ({ id: r.id, on: !!r.on }))
    const { error } = await supabase.from('settings').upsert([
      { key: RADIO_KEYS.enabled, value: String(body.enabled !== false), updated_at: now },
      { key: RADIO_KEYS.random, value: String(!!body.random), updated_at: now },
      { key: RADIO_KEYS.playlist, value: JSON.stringify(playlist), updated_at: now },
    ], { onConflict: 'key' })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    revalidateTag('radio', { expire: 0 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
