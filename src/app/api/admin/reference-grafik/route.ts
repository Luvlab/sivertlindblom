import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGrafikAdmin } from '@/lib/data-server'
import { GRAFIK_SETTINGS_KEY, type GrafikSection } from '@/lib/reference-grafik'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getGrafikAdmin())
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as GrafikSection
    const clean: GrafikSection = {
      title: typeof body.title === 'string' ? body.title : '',
      years: typeof body.years === 'string' ? body.years : '',
      intro: typeof body.intro === 'string' ? body.intro : '',
      photographer: typeof body.photographer === 'string' ? body.photographer : '',
      images: Array.isArray(body.images)
        ? body.images
            .filter((i) => i && typeof i.url === 'string' && i.url.trim())
            .map((i) => ({ url: i.url, caption: i.caption?.trim() || undefined }))
        : [],
    }

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const { error } = await supabase.from('settings').upsert(
      { key: GRAFIK_SETTINGS_KEY, value: JSON.stringify(clean), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('references-grafik', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
