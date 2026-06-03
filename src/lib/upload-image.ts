'use client'

import { compressImageFile } from '@/lib/compress-image'

export interface UploadResult {
  url?: string
  alt?: string
  error?: string
}

/**
 * Upload an image to /api/admin/upload with browser-side downscaling and
 * defensive response parsing. Large photos are compressed first so they fit
 * under the serverless body limit, and a non-JSON error response (e.g. a 413)
 * is turned into a readable message instead of a raw "syntax error".
 */
export async function uploadImageFile(file: File, alt?: string): Promise<UploadResult> {
  let toSend: File = file
  try { toSend = await compressImageFile(file) } catch { toSend = file }

  const fd = new FormData()
  fd.append('file', toSend)
  fd.append('alt', alt ?? file.name)

  let res: Response
  try {
    res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
  } catch (err) {
    return { error: `Nätverksfel vid uppladdning: ${String(err)}` }
  }

  const ct = res.headers.get('content-type') ?? ''
  if (ct.includes('application/json')) {
    try {
      return await res.json() as UploadResult
    } catch {
      return { error: `Kunde inte tolka svaret (HTTP ${res.status}).` }
    }
  }

  await res.text().catch(() => '')
  if (res.status === 413) {
    return { error: 'Bilden är för stor för att laddas upp. Försök igen — den komprimeras automatiskt.' }
  }
  return { error: `Uppladdningen misslyckades (HTTP ${res.status}).` }
}
