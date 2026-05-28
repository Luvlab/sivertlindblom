import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  let slides: Array<{ url: string; alt: string }> = []
  let random = true

  if (supabase) {
    const { data } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['hero_slides', 'hero_random'])

    for (const row of data ?? []) {
      if (row.key === 'hero_slides') {
        try { slides = JSON.parse(row.value) } catch { /* ignore */ }
      }
      if (row.key === 'hero_random') {
        random = row.value !== '0'
      }
    }
  }

  return NextResponse.json({ slides, random })
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      slides: Array<{ url: string; alt: string }>
      random?: boolean
    }

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase
        .from('settings')
        .upsert([
          { key: 'hero_slides', value: JSON.stringify(body.slides) },
          { key: 'hero_random', value: (body.random ?? true) ? '1' : '0' },
        ], { onConflict: 'key' })
      if (!error) return NextResponse.json({ ok: true })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'No database connection' }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
