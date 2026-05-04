import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'
import { createAdminClient } from '@/lib/supabase/admin'
import type { BioCmsEntry } from '../route'

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
    entry_type: row.entry_type as BioCmsEntry['entry_type'],
    year_start: (row.year_start as number) ?? 0,
    year_end: (row.year_end as number) ?? undefined,
    title: row.title as string,
    description: (row.description as string) ?? undefined,
    location: (row.location as string) ?? undefined,
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const supabase = createAdminClient()
  if (supabase) {
    const { data, error } = await supabase.from('biography_entries').select('*').eq('id', id).single()
    if (!error && data) return NextResponse.json(dbToBio(data as Record<string, unknown>))
  }

  const data = loadCmsData<BioCmsEntry>('biography', STATIC_BIO)
  const item = data.find(b => b.id === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json() as BioCmsEntry

    const supabase = createAdminClient()
    if (supabase) {
      const { data, error } = await supabase
        .from('biography_entries')
        .update({
          entry_type: body.entry_type,
          year_start: body.year_start,
          year_end: body.year_end ?? null,
          title: body.title,
          description: body.description ?? null,
          location: body.location ?? null,
        })
        .eq('id', id)
        .select()
        .single()
      if (!error && data) return NextResponse.json(dbToBio(data as Record<string, unknown>))
    }

    const current = loadCmsData<BioCmsEntry>('biography', STATIC_BIO)
    const idx = current.findIndex(b => b.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]; updated[idx] = { ...body, id }
    const result = saveCmsData('biography', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json(updated[idx])
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params

    const supabase = createAdminClient()
    if (supabase) {
      const { error } = await supabase.from('biography_entries').delete().eq('id', id)
      if (!error) return NextResponse.json({ ok: true })
    }

    const current = loadCmsData<BioCmsEntry>('biography', STATIC_BIO)
    const updated = current.filter(b => b.id !== id)
    if (updated.length === current.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const result = saveCmsData('biography', updated)
    if (!result.ok) return NextResponse.json({ error: result.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
