import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

// Every content table on the site. `settings` holds references (skulptur, film,
// fotografier, grafik, ögonblick, utmärkelser), start page, SEO & delning,
// litteraturförteckning, akvarell-config, kontakt and the AI-guide config.
const TABLES = [
  'works', 'images', 'work_subpages',                        // Utställningar
  'public_works', 'public_work_images', 'public_work_subpages', // Offentliga arbeten
  'scenography_works', 'scenography_images',                  // Scenografi
  'texts', 'text_subpages',                                   // Texter
  'biography_entries',                                        // Biografi
  'watercolors',                                              // Akvareller
  'map_pins',                                                 // Karta
  'settings',                                                 // Referenser, SEO/Delning, Inställningar m.m.
  'guide_chats',                                              // AI-guide (logg)
  'content_nodes', 'documents',                               // Övrigt
] as const

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'Supabase ej tillgänglig' }, { status: 500 })

  const results = await Promise.all(TABLES.map((t) => supabase.from(t).select('*')))

  const errors: string[] = []
  const backup: Record<string, unknown> = {
    exportedAt: new Date().toISOString(),
    site: 'sivertlindblom',
    note: 'Fullständig innehållssäkerhetskopia. Bild-, ljud-, video- och PDF-filerna ligger i Supabase Storage; deras URL:er finns i posterna nedan.',
  }
  TABLES.forEach((t, i) => {
    if (results[i].error) errors.push(`${t}: ${results[i].error!.message}`)
    backup[t] = results[i].data ?? []
  })

  if (errors.length) return NextResponse.json({ error: errors.join('; ') }, { status: 500 })

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="sivertlindblom-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      'Cache-Control': 'no-store',
    },
  })
}
