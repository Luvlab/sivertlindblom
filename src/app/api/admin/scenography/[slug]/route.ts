import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ScenographyWork } from '../route'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

interface Props { params: Promise<{ slug: string }> }

export async function GET(_req: Request, { params }: Props) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data, error } = await supabase
    .from('scenography_works')
    .select(`*, scenography_images(id, url, alt, sort_order)`)
    .eq('slug', slug)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const work: ScenographyWork = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    year: data.year,
    venue: data.venue ?? '',
    type: (data.type as 'Teaterscenografi' | 'Koreografi') ?? 'Teaterscenografi',
    description: data.description ?? '',
    video_url: data.video_url ?? '',
    sort_order: data.sort_order ?? 0,
    published: data.published ?? true,
    images: ((data.scenography_images ?? []) as { url: string; alt: string | null; sort_order: number }[])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => ({ url: img.url, alt: img.alt ?? '' })),
  }

  return NextResponse.json(work)
}

export async function PUT(request: Request, { params }: Props) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  try {
    const body = await request.json() as ScenographyWork

    const { data: work, error } = await supabase
      .from('scenography_works')
      .upsert({
        slug: body.slug,
        title: body.title,
        year: body.year ?? null,
        venue: body.venue ?? '',
        type: body.type ?? 'Teaterscenografi',
        description: body.description ?? '',
        video_url: body.video_url ?? '',
        sort_order: body.sort_order ?? 0,
        published: body.published ?? true,
      }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (error || !work) return NextResponse.json({ error: error?.message ?? 'Upsert failed' }, { status: 500 })

    // Replace images
    await supabase.from('scenography_images').delete().eq('work_id', work.id)
    if (body.images?.length) {
      await supabase.from('scenography_images').insert(
        body.images.map((img, i) => ({
          work_id: work.id,
          url: img.url,
          alt: img.alt ?? '',
          sort_order: i,
        }))
      )
    }

    // If slug changed, redirect to new slug
    revalidateTag('scenography', 'max')
    return NextResponse.json({ ...body, id: work.id })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { error } = await supabase.from('scenography_works').delete().eq('slug', slug)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateTag('scenography', 'max')
  return NextResponse.json({ ok: true })
}
