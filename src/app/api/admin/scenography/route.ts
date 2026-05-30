import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export interface ScenographyWork {
  id?: string
  slug: string
  title: string
  year: number | null
  venue: string
  type: 'Teaterscenografi' | 'Koreografi'
  description: string
  video_url: string
  sort_order: number
  published: boolean
  images: { url: string; alt: string }[]
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'No DB' }, { status: 500 })

  const { data, error } = await supabase
    .from('scenography_works')
    .select(`*, scenography_images(id, url, alt, sort_order)`)
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const works: ScenographyWork[] = (data ?? []).map(w => ({
    id: w.id,
    slug: w.slug,
    title: w.title,
    year: w.year,
    venue: w.venue ?? '',
    type: (w.type as 'Teaterscenografi' | 'Koreografi') ?? 'Teaterscenografi',
    description: w.description ?? '',
    video_url: w.video_url ?? '',
    sort_order: w.sort_order ?? 0,
    published: w.published ?? true,
    images: ((w.scenography_images ?? []) as { url: string; alt: string | null; sort_order: number }[])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => ({ url: img.url, alt: img.alt ?? '' })),
  }))

  return NextResponse.json(works)
}
