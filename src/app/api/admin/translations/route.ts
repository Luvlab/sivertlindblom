import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'authenticated'
}

// GET /api/admin/translations?entity_type=text&entity_id=slug&locale=en
export async function GET(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const entity_type = searchParams.get('entity_type')
  const entity_id = searchParams.get('entity_id')
  const locale = searchParams.get('locale')

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  let query = supabase.from('translations').select('*')
  if (entity_type) query = query.eq('entity_type', entity_type)
  if (entity_id) query = query.eq('entity_id', entity_id)
  if (locale) query = query.eq('locale', locale)

  const { data, error } = await query.order('updated_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data ?? [])
}

// PUT /api/admin/translations — upsert a translation (edit or mark reviewed)
export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const body = await req.json() as {
    entity_type: string
    entity_id: string
    locale: string
    title?: string
    content?: string
    description?: string
    author_bio?: string
    machine_translated?: boolean
    reviewed_by?: string | null
  }

  const now = new Date().toISOString()
  const reviewed = body.machine_translated === false && body.reviewed_by
  const upsertData = {
    entity_type: body.entity_type,
    entity_id: body.entity_id,
    locale: body.locale,
    title: body.title ?? null,
    content: body.content ?? null,
    description: body.description ?? null,
    author_bio: body.author_bio ?? null,
    machine_translated: body.machine_translated ?? false,
    reviewed_by: body.reviewed_by ?? null,
    reviewed_at: reviewed ? now : null,
    updated_at: now,
  }

  const { error } = await supabase.from('translations').upsert(upsertData, {
    onConflict: 'entity_type,entity_id,locale',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
