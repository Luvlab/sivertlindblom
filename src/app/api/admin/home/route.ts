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
  if (supabase) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_slides')
      .single()
    if (!error && data) {
      try {
        const slides = JSON.parse(data.value)
        return NextResponse.json({ slides })
      } catch {
        // fall through to empty
      }
    }
  }

  return NextResponse.json({ slides: [] })
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json() as { slides: Array<{ url: string; alt: string }> }

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'hero_slides', value: JSON.stringify(body.slides) }, { onConflict: 'key' })
      if (!error) return NextResponse.json({ ok: true })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'No database connection' }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
