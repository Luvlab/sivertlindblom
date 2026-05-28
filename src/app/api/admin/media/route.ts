import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

/** PATCH /api/admin/media
 * Body: { updates: Array<{ url: string; alt: string }> }
 * Updates public_work_images.alt for matching URLs.
 */
export async function PATCH(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'DB not available' }, { status: 503 })
  }

  const body = await request.json() as { updates: Array<{ url: string; alt: string }> }
  if (!Array.isArray(body?.updates)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const errors: string[] = []
  for (const { url, alt } of body.updates) {
    const { error } = await supabase
      .from('public_work_images')
      .update({ alt })
      .eq('url', url)
    if (error) errors.push(`${url}: ${error.message}`)
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join('; ') }, { status: 500 })
  }

  return NextResponse.json({ ok: true, updated: body.updates.length })
}
