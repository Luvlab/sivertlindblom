import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const KEY = 'texts_sort_order'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ order: [] })
  const { data } = await supabase.from('settings').select('value').eq('key', KEY).maybeSingle()
  const order = data?.value ? JSON.parse(data.value as string) : []
  return NextResponse.json({ order })
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB unavailable' }, { status: 500 })
  const { order } = await req.json() as { order: string[] }
  const { error } = await supabase.from('settings').upsert(
    { key: KEY, value: JSON.stringify(order), updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
