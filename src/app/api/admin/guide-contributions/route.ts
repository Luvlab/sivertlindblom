import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const KNOWLEDGE_KEY = 'guide_knowledge'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ contributions: [] })
  const { data, error } = await supabase
    .from('guide_contributions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ contributions: data ?? [] })
}

// Screen one contribution: action 'add' appends it to the guide knowledge
// (Jan's existing text is read first and never overwritten), 'dismiss' just
// marks it handled.
export async function PATCH(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

  let body: { id?: string; action?: 'add' | 'dismiss' }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 }) }
  if (!body.id || (body.action !== 'add' && body.action !== 'dismiss')) {
    return NextResponse.json({ error: 'id och action (add/dismiss) krävs' }, { status: 400 })
  }

  if (body.action === 'add') {
    const { data: contrib, error: cErr } = await supabase
      .from('guide_contributions').select('*').eq('id', body.id).maybeSingle()
    if (cErr || !contrib) return NextResponse.json({ error: cErr?.message ?? 'Bidraget hittades inte' }, { status: 404 })

    const { data: kRow } = await supabase.from('settings').select('value').eq('key', KNOWLEDGE_KEY).maybeSingle()
    const current = ((kRow?.value as string) ?? '').trimEnd()
    // Version the current knowledge before appending — nothing is ever lost.
    if (current) {
      try { await supabase.from('guide_knowledge_versions').insert({ value: current, source: 'contribution' }) } catch { /* non-critical */ }
    }
    const date = new Date(contrib.created_at as string).toISOString().slice(0, 10)
    const label = contrib.kind === 'contribution' ? 'Bidrag från besökare' : 'Info efterlyst av besökare'
    const block = `\n\n--- ${label} (${date}, granskat) ---\nFråga: ${contrib.question ?? '(okänd)'}\nInfo: ${contrib.detail}`
    const { error: kErr } = await supabase.from('settings').upsert(
      { key: KNOWLEDGE_KEY, value: (current + block).slice(0, 100000), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (kErr) return NextResponse.json({ error: kErr.message }, { status: 500 })
  }

  const { error } = await supabase
    .from('guide_contributions')
    .update({ status: body.action === 'add' ? 'added' : 'dismissed' })
    .eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
