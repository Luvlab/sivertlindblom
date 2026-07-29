'use client'

/**
 * Upload a file straight from the browser to Supabase Storage, bypassing the
 * Next.js/Vercel serverless request-body limit (~4.5 MB). Used for large files
 * like PDFs and audio that can't be squeezed through /api/admin/upload.
 *
 * The anon key is a public (NEXT_PUBLIC_) key; a storage RLS "anon insert"
 * policy governs what may be written. Files still hit the project's ~50 MB
 * upload ceiling.
 */
export interface DirectUploadResult { url?: string; error?: string }

function slugifyName(name: string): string {
  const dot = name.lastIndexOf('.')
  const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'fil'
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, '') : ''
  return ext ? `${base}.${ext}` : base
}

export async function uploadFileDirect(
  file: File,
  opts: { bucket?: string; folder?: string } = {},
): Promise<DirectUploadResult> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!base || !key) return { error: 'Lagringen är inte konfigurerad.' }

  const bucket = opts.bucket ?? 'images'
  const folder = opts.folder ?? 'uploads'
  // A time-based prefix keeps names unique without Date.now() being critical.
  const stamp = `${Math.floor(performance.timeOrigin + performance.now())}`
  const path = `${folder}/${stamp}-${slugifyName(file.name)}`

  try {
    const res = await fetch(`${base}/storage/v1/object/${bucket}/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        'x-upsert': 'true',
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      if (res.status === 413) return { error: 'Filen är för stor (max ca 50 MB).' }
      return { error: `Uppladdningen misslyckades (${res.status}). ${txt.slice(0, 140)}` }
    }
    return { url: `${base}/storage/v1/object/public/${bucket}/${path}` }
  } catch (e) {
    return { error: `Nätverksfel vid uppladdning: ${String(e)}` }
  }
}
