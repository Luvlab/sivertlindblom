import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import type { PublicWork } from '@/lib/public-works'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToWork(
  row: Record<string, unknown>,
  images: Array<{ url: string; alt: string | null; sort_order: number }>
): PublicWork {
  return {
    slug: row.slug as string,
    title: row.title as string,
    year: String(row.year ?? ''),
    location: (row.location as string) ?? '',
    category: ((row.subcategory as string) === 'interior' ? 'interior' : 'exterior') as PublicWork['category'],
    description: (row.description as string) ?? '',
    body: (row.description_sv as string) ?? '',
    images: images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => ({ url: img.url, alt: img.alt ?? '' })),
    lat: (row.lat as number | null) ?? null,
    lng: (row.lng as number | null) ?? null,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { slug } = await params

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('public_works')
      .select('*, public_work_images(url, alt, sort_order)')
      .eq('slug', slug)
      .single()
    if (!error && data) {
      return NextResponse.json(
        dbToWork(
          data as Record<string, unknown>,
          (data.public_work_images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? []
        )
      )
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { slug } = await params
    const body = await request.json() as PublicWork

    const supabase = createAdminClient()
    if (supabase) {
      const { data: work, error } = await supabase
        .from('public_works')
        .update({
          title: body.title,
          year: parseInt(body.year) || null,
          location: body.location,
          subcategory: body.category === 'interior' ? 'interior' : 'exterior',
          description: body.description,
          description_sv: body.body,
          lat: body.lat ?? null,
          lng: body.lng ?? null,
          published: true,
        })
        .eq('slug', slug)
        .select('id')
        .single()

      if (!error && work) {
        // Replace images
        await supabase.from('public_work_images').delete().eq('work_id', work.id)
        if (body.images?.length) {
          const { error: imgErr } = await supabase.from('public_work_images').insert(
            body.images.map((img, i) => ({
              work_id: work.id,
              url: img.url,
              alt: img.alt || body.title,
              sort_order: i,
            }))
          )
          if (imgErr) {
            return NextResponse.json({ error: `Bilder sparades inte: ${imgErr.message}` }, { status: 500 })
          }
        }
        return NextResponse.json(body)
      }
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
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
    if (supabase) {
      const { error } = await supabase.from('public_works').delete().eq('slug', slug)
      if (!error) return NextResponse.json({ ok: true })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
