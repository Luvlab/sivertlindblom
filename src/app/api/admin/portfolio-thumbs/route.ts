import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPortfolioThumbsAdmin } from '@/lib/data-server'
import {
  PORTFOLIO_CATEGORY_KEYS,
  portfolioThumbsKey,
  type PortfolioThumbs,
} from '@/lib/portfolio-thumbs'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const thumbs = await getPortfolioThumbsAdmin()
  return NextResponse.json(thumbs)
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await request.json() as Partial<PortfolioThumbs>

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

    const upserts = PORTFOLIO_CATEGORY_KEYS.map((cat) => {
      const list = Array.isArray(body[cat]) ? (body[cat] as string[]).filter((u) => typeof u === 'string' && u.trim()) : []
      return {
        key: portfolioThumbsKey(cat),
        value: JSON.stringify(list),
        updated_at: new Date().toISOString(),
      }
    })

    const { error } = await supabase.from('settings').upsert(upserts, { onConflict: 'key' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('portfolio-thumbs', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
