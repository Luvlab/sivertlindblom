import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

  const [
    { data: publicWorks, error: e1 },
    { data: publicWorkImages, error: e2 },
    { data: publicWorkSubpages, error: e3 },
    { data: exhibitions, error: e4 },
    { data: exhibitionImages, error: e5 },
    { data: exhibitionSubpages, error: e6 },
    { data: mapPins, error: e7 },
  ] = await Promise.all([
    supabase.from('public_works').select('*').order('year', { ascending: false }),
    supabase.from('public_work_images').select('*').order('sort_order'),
    supabase.from('public_work_subpages').select('*').order('sort_order'),
    supabase.from('works').select('*').order('year', { ascending: false }),
    supabase.from('images').select('*').order('sort_order'),
    supabase.from('work_subpages').select('*').order('sort_order'),
    supabase.from('map_pins').select('*'),
  ])

  const errors = [e1, e2, e3, e4, e5, e6, e7].filter(Boolean)
  if (errors.length) {
    return NextResponse.json({ error: errors.map(e => e?.message).join('; ') }, { status: 500 })
  }

  const backup = {
    exportedAt: new Date().toISOString(),
    publicWorks: publicWorks ?? [],
    publicWorkImages: publicWorkImages ?? [],
    publicWorkSubpages: publicWorkSubpages ?? [],
    exhibitions: exhibitions ?? [],
    exhibitionImages: exhibitionImages ?? [],
    exhibitionSubpages: exhibitionSubpages ?? [],
    mapPins: mapPins ?? [],
  }

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="sivertlindblom-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      'Cache-Control': 'no-store',
    },
  })
}
