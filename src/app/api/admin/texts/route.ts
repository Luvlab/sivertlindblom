import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { TEXTS_DATA } from '@/lib/texts-data'
import type { TextItem } from '@/lib/texts-data'
import { loadCmsData, saveCmsData } from '@/lib/cms-data'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = loadCmsData<TextItem>('texts', TEXTS_DATA)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await request.json() as TextItem
    const current = loadCmsData<TextItem>('texts', TEXTS_DATA)
    const updated = [...current, body]
    const result = saveCmsData('texts', updated)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 500 })
    }
    return NextResponse.json(body, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
