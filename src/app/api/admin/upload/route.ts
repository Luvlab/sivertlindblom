import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

/** GET — list all uploaded files from images/uploads/ */
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ files: [] })

  const { data, error } = await supabase.storage
    .from('images')
    .list('uploads', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } })

  if (error || !data) return NextResponse.json({ files: [] })

  const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/uploads/`
  const files = data
    .filter(f => f.name && !f.name.startsWith('.'))
    .map(f => ({
      url: `${base}${f.name}`,
      alt: '',
      name: f.name,
    }))

  return NextResponse.json({ files })
}

/** POST — upload a file (multipart/form-data, field: "file") */
export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string | null) ?? ''

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'No database connection' }, { status: 500 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 40)
    const fileName = `uploads/${Date.now()}-${safeName}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl, alt })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
