import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const SETTINGS_KEY = 'biography_pictogram'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export interface PictogramSection {
  title: string
  intro: string
  images: Array<{ url: string; caption?: string; credit?: string }>
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase.from('settings').select('value').eq('key', SETTINGS_KEY).single()
      if (data?.value) return NextResponse.json(JSON.parse(data.value) as PictogramSection)
    }
  } catch { /* fall through */ }
  return NextResponse.json({
    title: 'Om Sivert som ett grammatiskt piktogram',
    intro: '',
    images: [],
  } satisfies PictogramSection)
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as PictogramSection
    const clean: PictogramSection = {
      title: typeof body.title === 'string' ? body.title.trim() : 'Om Sivert som ett grammatiskt piktogram',
      intro: typeof body.intro === 'string' ? body.intro.trim() : '',
      images: Array.isArray(body.images)
        ? body.images
            .filter(i => i && typeof i.url === 'string' && i.url.trim())
            .map(i => ({ url: i.url.trim(), caption: i.caption?.trim() || undefined, credit: i.credit?.trim() || undefined }))
        : [],
    }
    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })
    const { error } = await supabase.from('settings').upsert(
      { key: SETTINGS_KEY, value: JSON.stringify(clean), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidateTag('biography', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
