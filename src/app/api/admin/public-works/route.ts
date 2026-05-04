import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PUBLIC_WORKS } from '@/lib/public-works'
import type { PublicWork } from '@/lib/public-works'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToWork(row: Record<string, unknown>, images: Array<{ url: string; alt: string | null; sort_order: number }>): PublicWork {
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
  }
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('public_works')
      .select(`*, public_work_images(url, alt, sort_order)`)
      .order('sort_order', { ascending: true })
    if (!error && data) {
      const mapped: PublicWork[] = data.map((w) =>
        dbToWork(
          w as Record<string, unknown>,
          (w.public_work_images as Array<{ url: string; alt: string | null; sort_order: number }>) ?? []
        )
      )
      return NextResponse.json(mapped)
    }
  }

  const data = loadCmsData<PublicWork>('public-works', PUBLIC_WORKS)
  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as PublicWork[]

    const supabase = createAdminClient()
    if (supabase) {
      // Upsert all works
      for (const work of body) {
        const { data: pw, error } = await supabase
          .from('public_works')
          .upsert({
            slug: work.slug,
            title: work.title,
            year: parseInt(work.year) || null,
            location: work.location,
            subcategory: work.category,
            description: work.description,
            description_sv: work.body,
          }, { onConflict: 'slug' })
          .select('id')
          .single()

        if (!error && pw) {
          // Replace images
          await supabase.from('public_work_images').delete().eq('work_id', pw.id)
          if (work.images?.length) {
            await supabase.from('public_work_images').insert(
              work.images.map((img, i) => ({
                work_id: pw.id,
                url: img.url,
                alt: img.alt,
                sort_order: i,
              }))
            )
          }
        }
      }
      return NextResponse.json(body)
    }

    const result = saveCmsData('public-works', body)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json(body)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
