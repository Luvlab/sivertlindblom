import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { HomeContent } from '@/lib/data-server'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

const CONTENT_KEY_MAP: Record<keyof HomeContent, string> = {
  siteTitle:         'site_title',
  tagline:           'hero_tagline',
  pressQuote:        'home_press_quote',
  pressAttribution:  'home_press_attribution',
  pressSource:       'home_press_source',
  pressDuration:     'home_press_duration',
  audioUrl:          'home_audio_url',
  audioLink:         'home_audio_link',
  aboutText:         'about_short',
  statNActive:       'home_stat_n_active',
  statNPublic:       'home_stat_n_public',
  statNCountries:    'home_stat_n_countries',
  statNBorn:         'home_stat_n_born',
  contactImage:      'home_contact_image',
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  let slides: Array<{ url: string; alt: string; focal?: string }> = []
  let random = true
  const content: Partial<HomeContent> = {}

  if (supabase) {
    const allKeys = ['hero_slides', 'hero_random', ...Object.values(CONTENT_KEY_MAP)]
    const { data } = await supabase.from('settings').select('key, value').in('key', allKeys)

    for (const row of data ?? []) {
      if (row.key === 'hero_slides') {
        try { slides = JSON.parse(row.value) } catch { /* ignore */ }
      } else if (row.key === 'hero_random') {
        random = row.value !== '0'
      } else {
        // Find which HomeContent field this key maps to
        const field = (Object.entries(CONTENT_KEY_MAP) as [keyof HomeContent, string][])
          .find(([, dbKey]) => dbKey === row.key)?.[0]
        if (field) (content as Record<string, string>)[field] = row.value
      }
    }
  }

  return NextResponse.json({ slides, random, content })
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json() as {
      slides?: Array<{ url: string; alt: string; focal?: string }>
      random?: boolean
      content?: Partial<HomeContent>
    }

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'No database connection' }, { status: 500 })

    const upsertRows: Array<{ key: string; value: string }> = []

    if (body.slides !== undefined) {
      upsertRows.push({ key: 'hero_slides', value: JSON.stringify(body.slides) })
    }
    if (body.random !== undefined) {
      upsertRows.push({ key: 'hero_random', value: body.random ? '1' : '0' })
    }
    if (body.content) {
      for (const [field, value] of Object.entries(body.content) as [keyof HomeContent, string][]) {
        const dbKey = CONTENT_KEY_MAP[field]
        if (dbKey && value !== undefined) upsertRows.push({ key: dbKey, value: String(value) })
      }
    }

    if (upsertRows.length === 0) return NextResponse.json({ ok: true })

    const { error } = await supabase.from('settings').upsert(upsertRows, { onConflict: 'key' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    revalidateTag('hero', 'max')
    revalidateTag('home-content', 'max')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
