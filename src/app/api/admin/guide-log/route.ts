import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ chats: [], stats: { total: 0, sessions: 0, ips: 0 } })

  const { data, error } = await supabase
    .from('guide_chats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const chats = data ?? []
  const sessions = new Set(chats.map((c) => c.session_id).filter(Boolean))
  const ips = new Set(chats.map((c) => c.ip).filter(Boolean))
  return NextResponse.json({ chats, stats: { total: chats.length, sessions: sessions.size, ips: ips.size } })
}

// Clear the whole log (privacy / housekeeping).
export async function DELETE() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ ok: false })
  const { error } = await supabase.from('guide_chats').delete().not('id', 'is', null)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
