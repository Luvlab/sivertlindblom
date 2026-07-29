import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getFotografiAdmin } from '@/lib/data-server'
import { FOTOGRAFI_SETTINGS_KEY, type FotografiSection } from '@/lib/reference-fotografi'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getFotografiAdmin())
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as FotografiSection
    const clean: FotografiSection = {
      intro: typeof body.intro === 'string' ? body.intro : '',
      photographer: typeof body.photographer === 'string' ? body.photographer : '',
      images: Array.isArray(body.images)
        ? body.images
            .filter((i) => i && typeof i.url === 'string' && i.url.trim())
            .map((i) => ({ url: i.url, caption: i.caption?.trim() || undefined, photographer: i.photographer?.trim() || undefined }))
        : [],
    }

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const { error } = await supabase.from('settings').upsert(
      { key: FOTOGRAFI_SETTINGS_KEY, value: JSON.stringify(clean), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('references-fotografi', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
