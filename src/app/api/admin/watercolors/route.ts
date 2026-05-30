import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export interface WatercolorItem {
  id?: string
  url: string
  alt: string
  sort_order: number
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data, error } = await supabase
    .from('watercolors')
    .select('id, url, alt, sort_order')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// PUT replaces the full ordered list
export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  try {
    const body = await request.json() as WatercolorItem[]

    // Delete all existing, then re-insert in order
    await supabase.from('watercolors').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    if (body.length > 0) {
      const rows = body.map((item, i) => ({
        url: item.url,
        alt: item.alt ?? '',
        sort_order: i,
      }))
      const { error } = await supabase.from('watercolors').insert(rows)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
