import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'flipbook'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
  const { data, error } = await supabase
    .from('flipbooks')
    .select('*')
    .order('location', { ascending: true })
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as { title: string; location: string }
    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    let slug = slugify(body.title || 'flipbook')
    const { data: existing } = await supabase.from('flipbooks').select('slug').eq('slug', slug).maybeSingle()
    if (existing) slug = `${slug}-${Date.now().toString(36)}`

    const { data, error } = await supabase
      .from('flipbooks')
      .insert({
        slug,
        title: body.title || 'Ny flipbook',
        subtitle: null,
        pages: [],
        pdf_url: null,
        pdf_label: null,
        location: body.location || 'publicerat',
        sort_order: 0,
        published: true,
      })
      .select('*')
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidateTag('flipbooks', 'max')
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
