import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getSculptureProjectsAdmin } from '@/lib/data-server'
import { SCULPTURE_SETTINGS_KEY, type SculptureProject } from '@/lib/sculpture-projects'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(await getSculptureProjectsAdmin())
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as { projects?: SculptureProject[] }
    const clean: SculptureProject[] = Array.isArray(body.projects)
      ? body.projects
          .filter((p) => p && typeof p.slug === 'string' && p.slug.trim() && typeof p.title === 'string' && p.title.trim())
          .map((p) => ({
            slug: p.slug.trim(),
            title: p.title.trim(),
            years: p.years?.trim() || undefined,
            description: typeof p.description === 'string' ? p.description : '',
            body: typeof p.body === 'string' ? p.body : '',
            images: Array.isArray(p.images)
              ? p.images.filter((im) => im && typeof im.url === 'string' && im.url.trim())
                  .map((im) => ({ url: im.url, alt: typeof im.alt === 'string' ? im.alt : '' }))
              : [],
            links: Array.isArray(p.links)
              ? p.links.filter((l) => l && typeof l.url === 'string' && typeof l.label === 'string')
              : undefined,
            shortDesc: p.shortDesc?.trim() || undefined,
            inTab: typeof p.inTab === 'boolean' ? p.inTab : undefined,
          }))
      : []

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const { error } = await supabase.from('settings').upsert(
      { key: SCULPTURE_SETTINGS_KEY, value: JSON.stringify({ projects: clean }), updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('references-sculpture', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
