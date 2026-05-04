import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { TEXTS_DATA } from '@/lib/texts-data'
import type { TextItem } from '@/lib/texts-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const data = loadCmsData<TextItem>('texts', TEXTS_DATA)
  const item = data.find(t => t.slug === id)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const body = await request.json() as TextItem
    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const idx = current.findIndex(t => t.slug === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = [...current]
    updated[idx] = body
    const result = saveCmsData('texts', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json(body)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await params
    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const updated = current.filter(t => t.slug !== id)
    if (updated.length === current.length) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const result = saveCmsData('texts', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
