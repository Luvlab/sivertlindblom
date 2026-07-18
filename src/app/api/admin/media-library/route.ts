import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

async function checkAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('admin_session')?.value === 'authenticated'
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i
const PAGE = 1000
const MAX_DEPTH = 6

type FileEntry = { name: string; path: string; folder: string }

/** List one folder fully (paginating past the 1000-row limit). */
async function listFolder(
  supabase: SupabaseClient,
  prefix: string,
): Promise<{ files: FileEntry[]; folders: string[] }> {
  const files: FileEntry[] = []
  const folders: string[] = []
  let offset = 0
  // Paginate until a short page is returned.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await supabase.storage
      .from('images')
      .list(prefix, { limit: PAGE, offset, sortBy: { column: 'name', order: 'asc' } })
    if (error || !data || data.length === 0) break
    for (const e of data) {
      if (e.name.startsWith('.')) continue
      // Folders come back with no id / no metadata.
      const isFolder = (e as { id?: string | null }).id == null && (e as { metadata?: unknown }).metadata == null
      if (isFolder) {
        folders.push(e.name)
      } else if (IMAGE_EXT.test(e.name)) {
        files.push({ name: e.name, path: prefix ? `${prefix}/${e.name}` : e.name, folder: prefix || '/' })
      }
    }
    if (data.length < PAGE) break
    offset += PAGE
  }
  return { files, folders }
}

/** Recursively walk the bucket collecting every image file. */
async function walk(supabase: SupabaseClient, prefix: string, depth: number): Promise<FileEntry[]> {
  if (depth > MAX_DEPTH) return []
  const { files, folders } = await listFolder(supabase, prefix)
  const subResults = await Promise.all(
    folders.map((f) => walk(supabase, prefix ? `${prefix}/${f}` : f, depth + 1)),
  )
  return [...files, ...subResults.flat()]
}

/** GET — list every image in the storage bucket (uploads/ + historical wp/**). */
export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ files: [] })

  try {
    const all = await walk(supabase, '', 0)
    const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`
    // Newest-looking first is impossible without metadata here; keep folder+name order,
    // uploads first (they carry a timestamp prefix) then the rest.
    const files = all.map((f) => ({
      url: `${base}${f.path}`,
      name: f.name,
      folder: f.folder,
    }))
    return NextResponse.json({ files, count: files.length })
  } catch (e) {
    return NextResponse.json({ files: [], error: String(e) }, { status: 500 })
  }
}
