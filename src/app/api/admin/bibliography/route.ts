import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBibliographyAdmin } from '@/lib/data-server'
import { BIBLIOGRAPHY_SETTINGS_KEY, type BibEntry } from '@/lib/bibliography'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getBibliographyAdmin())
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as { entries?: BibEntry[] }
    const clean: BibEntry[] = Array.isArray(body.entries)
      ? body.entries
          .filter((e) => e && typeof e.text === 'string' && e.text.trim())
          .map((e) => ({
            year: typeof e.year === 'string' ? e.year : String(e.year ?? ''),
            text: e.text.trim(),
            slug: e.slug?.trim() || undefined,
            note: e.note?.trim() || undefined,
          }))
      : []

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const { error } = await supabase.from('settings').upsert(
      { key: BIBLIOGRAPHY_SETTINGS_KEY, value: JSON.stringify({ entries: clean }), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('bibliography', 'max')
    revalidateTag('biography', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
