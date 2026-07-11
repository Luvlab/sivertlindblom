import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export interface LinkablePage {
  group: string
  title: string
  path: string
}

/**
 * Returns every internal page an admin can link to (title + internal path),
 * so the link editor can offer a searchable picker instead of hand-typed URLs.
 * All paths are locale-less internal paths starting with "/".
 */
export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ pages: [] })

  const pages: LinkablePage[] = []

  try {
    // Exhibitions + their subpages
    const { data: works } = await supabase
      .from('works')
      .select('slug, title, published, work_subpages(slug, title, published)')
      .eq('published', true)
    for (const w of works ?? []) {
      const slug = (w as Record<string, unknown>).slug as string
      pages.push({ group: 'Utställningar', title: (w as Record<string, unknown>).title as string, path: `/portfolio/exhibitions/${slug}` })
      const subs = ((w as Record<string, unknown>).work_subpages as Array<{ slug: string; title: string; published?: boolean }>) ?? []
      for (const s of subs) {
        if (s.published === false) continue
        pages.push({ group: 'Utställningar · undersidor', title: `${(w as Record<string, unknown>).title} → ${s.title}`, path: `/portfolio/exhibitions/${slug}/${s.slug}` })
      }
    }

    // Public works + their subpages
    const { data: pw } = await supabase
      .from('public_works')
      .select('slug, title, published, public_work_subpages(slug, title, published)')
      .eq('published', true)
    for (const w of pw ?? []) {
      const slug = (w as Record<string, unknown>).slug as string
      pages.push({ group: 'Offentliga arbeten', title: (w as Record<string, unknown>).title as string, path: `/portfolio/public-works/${slug}` })
      const subs = ((w as Record<string, unknown>).public_work_subpages as Array<{ slug: string; title: string; published?: boolean }>) ?? []
      for (const s of subs) {
        if (s.published === false) continue
        pages.push({ group: 'Offentliga arbeten · undersidor', title: `${(w as Record<string, unknown>).title} → ${s.title}`, path: `/portfolio/public-works/${slug}/${s.slug}` })
      }
    }

    // Scenography
    const { data: scen } = await supabase.from('scenography_works').select('slug, title').order('sort_order', { ascending: true })
    for (const s of scen ?? []) {
      pages.push({ group: 'Scenografi', title: (s as Record<string, unknown>).title as string, path: `/portfolio/scenography/${(s as Record<string, unknown>).slug}` })
    }

    // Texts
    const { data: texts } = await supabase.from('texts').select('slug, title, published').eq('published', true)
    for (const t of texts ?? []) {
      pages.push({ group: 'Texter', title: (t as Record<string, unknown>).title as string, path: `/texts/${(t as Record<string, unknown>).slug}` })
    }

    // Fixed section landing pages
    pages.push(
      { group: 'Sektioner', title: 'Portfolio', path: '/portfolio' },
      { group: 'Sektioner', title: 'Utställningar (översikt)', path: '/portfolio/exhibitions' },
      { group: 'Sektioner', title: 'Offentliga arbeten (översikt)', path: '/portfolio/public-works' },
      { group: 'Sektioner', title: 'Scenografi (översikt)', path: '/portfolio/scenography' },
      { group: 'Sektioner', title: 'Akvareller', path: '/portfolio/watercolors' },
      { group: 'Sektioner', title: 'Referenser', path: '/references' },
      { group: 'Sektioner', title: 'Texter (översikt)', path: '/texts' },
      { group: 'Sektioner', title: 'Biografi', path: '/biography' },
      { group: 'Sektioner', title: 'Karta', path: '/portfolio/map' },
    )
  } catch (e) {
    return NextResponse.json({ error: String(e), pages }, { status: 200 })
  }

  return NextResponse.json({ pages })
}
