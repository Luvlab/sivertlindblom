import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
  const { data, error } = await supabase.from('flipbooks').select('*').eq('slug', slug).single()
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { slug } = await params
    const body = await request.json() as {
      title: string; subtitle?: string | null; pages?: string[]
      pdf_url?: string | null; pdf_label?: string | null
      location: string; sort_order?: number; published?: boolean
    }
    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const { data, error } = await supabase
      .from('flipbooks')
      .update({
        title: body.title,
        subtitle: body.subtitle?.trim() || null,
        pages: Array.isArray(body.pages) ? body.pages : [],
        pdf_url: body.pdf_url?.trim() || null,
        pdf_label: body.pdf_label?.trim() || null,
        location: body.location,
        sort_order: body.sort_order ?? 0,
        published: body.published ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
      .select('*')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('flipbooks', { expire: 0 })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { slug } = await params
    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
    // Soft-delete: hide (unpublish) instead of erasing, so an accidental
    // "Radera" never destroys data — the post can be republished later.
    const { error } = await supabase.from('flipbooks').update({ published: false }).eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidateTag('flipbooks', { expire: 0 })
    return NextResponse.json({ ok: true, hidden: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
