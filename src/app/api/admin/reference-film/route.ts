import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getFilmsAdmin } from '@/lib/data-server'
import { FILM_SETTINGS_KEY, cleanFilms } from '@/lib/reference-film'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getFilmsAdmin())
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json()
    const clean = cleanFilms(body?.films ?? body)

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const { error } = await supabase.from('settings').upsert(
      { key: FILM_SETTINGS_KEY, value: JSON.stringify(clean), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('references-film', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
