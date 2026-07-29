import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const KEY = 'guide_knowledge'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ text: '' })
  const { data } = await supabase.from('settings').select('value').eq('key', KEY).maybeSingle()
  return NextResponse.json({ text: (data?.value as string) ?? '' })
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
  let body: { text?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 }) }
  const text = (body.text ?? '').slice(0, 100000)
  const { error } = await supabase.from('settings').upsert(
    { key: KEY, value: text, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
