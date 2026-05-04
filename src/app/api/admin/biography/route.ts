import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { BiographyEntryType } from '@/types'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'

export interface BioCmsEntry {
  id: string
  entry_type: BiographyEntryType
  year_start: number
  year_end?: number
  title: string
  description?: string
  location?: string
}

const STATIC_BIO: BioCmsEntry[] = [
  { id: '1', entry_type: 'personal',          year_start: 1931, title: 'Född i Husby-Rekarne, Södermanland' },
  { id: '2', entry_type: 'education',          year_start: 1945, year_end: 1949, title: 'Teknisk utbildning', location: 'Eskilstuna' },
  { id: '3', entry_type: 'education',          year_start: 1958, year_end: 1963, title: 'Kungliga Konsthögskolan', location: 'Stockholm' },
  { id: '4', entry_type: 'position',           year_start: 1957, year_end: 1974, title: 'Samarbete med arkitekt Peter Celsing' },
  { id: '5', entry_type: 'position',           year_start: 1991, title: 'Professor i skulptur, Kungliga Konsthögskolan' },
  { id: '6', entry_type: 'award',              year_start: 1985, title: 'Stenpriset, Sveriges Stenindustrifförbund' },
  { id: '7', entry_type: 'award',              year_start: 1995, title: 'Sergelpriset', location: 'Stockholm' },
  { id: '8', entry_type: 'public_commission',  year_start: 1989, title: 'Blasieholmstorg — Hästar i brons', location: 'Stockholm' },
  { id: '9', entry_type: 'public_commission',  year_start: 2002, title: 'Gustav Adolfs torg, fontäner', location: 'Malmö' },
  { id: '10', entry_type: 'public_commission', year_start: 2003, title: 'Nobelmonument', location: 'New York' },
]

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

function dbToBio(row: Record<string, unknown>): BioCmsEntry {
  return {
    id: row.id as string,
    entry_type: row.entry_type as BiographyEntryType,
    year_start: (row.year_start as number) ?? 0,
    year_end: (row.year_end as number) ?? undefined,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    location: (row.location as string) ?? undefined,
  }
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase
      .from('biography_entries')
      .select('*')
      .order('year_start', { ascending: true })
    if (!error && data) {
      return NextResponse.json(data.map(row => dbToBio(row as Record<string, unknown>)))
    }
  }

  const data = loadCmsData<BioCmsEntry>('biography', STATIC_BIO)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as BioCmsEntry

    const supabase = createAdminClient()
    if (supabase) {
      const { data, error } = await supabase
        .from('biography_entries')
        .insert({
          entry_type: body.entry_type,
          year_start: body.year_start,
          year_end: body.year_end ?? null,
          title: body.title,
          description: body.description ?? null,
          location: body.location ?? null,
        })
        .select()
        .single()
      if (!error && data) return NextResponse.json(dbToBio(data as Record<string, unknown>), { status: 201 })
    }

    const current = loadCmsData<BioCmsEntry>('biography', STATIC_BIO)
    const newItem: BioCmsEntry = { ...body, id: body.id || String(Date.now()) }
    const updated = [...current, newItem]
    const result = saveCmsData('biography', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json(newItem, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
