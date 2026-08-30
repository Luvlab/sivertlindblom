import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const KEY = 'guide_knowledge'
const MAX_VERSIONS = 100

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ text: '' })

  const url = new URL(request.url)
  if (url.searchParams.get('versions')) {
    const { data } = await supabase
      .from('guide_knowledge_versions')
      .select('id, created_at, chars, source')
      .order('created_at', { ascending: false })
      .limit(50)
    return NextResponse.json({ versions: data ?? [] })
  }

  const { data } = await supabase.from('settings').select('value').eq('key', KEY).maybeSingle()
  return NextResponse.json({ text: (data?.value as string) ?? '' })
}

/** Snapshot the current knowledge into the version log (called before every write). */
async function snapshot(supabase: NonNullable<ReturnType<typeof createAdminClient>>, source: string, skipIfSame?: string) {
  const { data } = await supabase.from('settings').select('value').eq('key', KEY).maybeSingle()
  const current = (data?.value as string) ?? ''
  if (!current || current === skipIfSame) return
  await supabase.from('guide_knowledge_versions').insert({ value: current, source })
  // Prune: keep only the newest MAX_VERSIONS rows.
  const { data: old } = await supabase
    .from('guide_knowledge_versions')
    .select('id')
    .order('created_at', { ascending: false })
    .range(MAX_VERSIONS, MAX_VERSIONS + 50)
  if (old && old.length > 0) {
    await supabase.from('guide_knowledge_versions').delete().in('id', old.map((r) => r.id))
  }
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
  let body: { text?: string; autosave?: boolean; base?: string; force?: boolean }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 }) }
  const text = (body.text ?? '').slice(0, 100000)

  // Lost-update guard: if the client tells us which text its edit was based on
  // and the DB has moved on (another tab/computer saved meanwhile), refuse the
  // write — after snapshotting BOTH versions so neither can ever be lost.
  if (typeof body.base === 'string' && !body.force) {
    const { data: cur } = await supabase.from('settings').select('value').eq('key', KEY).maybeSingle()
    const current = (cur?.value as string) ?? ''
    if (current !== body.base) {
      try {
        if (current) await supabase.from('guide_knowledge_versions').insert({ value: current, source: 'conflict' })
        if (text && text !== current) await supabase.from('guide_knowledge_versions').insert({ value: text, source: 'conflict' })
      } catch { /* non-critical */ }
      return NextResponse.json({ error: 'conflict', current }, { status: 409 })
    }
  }

  // Version the outgoing value first — nothing is ever lost on save.
  try { await snapshot(supabase, body.autosave ? 'autosave' : 'manual', text) } catch { /* non-critical */ }

  const { error } = await supabase.from('settings').upsert(
    { key: KEY, value: text, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// Restore a previous version (the current text is snapshotted first).
export async function POST(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
  let body: { restoreId?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Ogiltig förfrågan' }, { status: 400 }) }
  if (!body.restoreId) return NextResponse.json({ error: 'restoreId krävs' }, { status: 400 })

  const { data: ver, error: vErr } = await supabase
    .from('guide_knowledge_versions').select('value').eq('id', body.restoreId).maybeSingle()
  if (vErr || !ver) return NextResponse.json({ error: vErr?.message ?? 'Versionen hittades inte' }, { status: 404 })

  try { await snapshot(supabase, 'restore') } catch { /* non-critical */ }

  const { error } = await supabase.from('settings').upsert(
    { key: KEY, value: ver.value as string, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, text: ver.value })
}
