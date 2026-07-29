'use client'

import { useRef, useState } from 'react'
import { uploadFileDirect } from '@/lib/upload-direct'

/**
 * A small "upload a file and get its URL" button — for single-URL fields
 * (film poster image, film mp4, etc.). Uploads straight to storage.
 */
export default function InlineUploadButton({
  accept,
  bucket = 'images',
  folder = 'uploads',
  label = '⬆ Ladda upp',
  onUploaded,
}: {
  accept: string
  bucket?: string
  folder?: string
  label?: string
  onUploaded: (url: string) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handle(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setErr(null)
    const d = await uploadFileDirect(file, { bucket, folder })
    if (d.url) onUploaded(d.url)
    else setErr(d.error ?? 'Uppladdningen misslyckades')
    setBusy(false)
  }

  return (
    <>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }}
        onChange={e => { handle(e.target.files?.[0]); e.target.value = '' }} />
      <button type="button" className="btn" disabled={busy} onClick={() => ref.current?.click()}
        style={{ fontSize: 'var(--fs-xs)', flexShrink: 0, whiteSpace: 'nowrap' }}>
        {busy ? 'Laddar…' : label}
      </button>
      {err && <span style={{ color: '#f87', fontSize: 'var(--fs-xs)' }}>{err}</span>}
    </>
  )
}
