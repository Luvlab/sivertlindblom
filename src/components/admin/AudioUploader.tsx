'use client'

import { useRef, useState } from 'react'
import { uploadFileDirect } from '@/lib/upload-direct'

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
}

/**
 * Upload a single audio file (mp3 etc.) straight to storage and preview it.
 * Used for the "LYSSNA PÅ" interview clips on exhibitions.
 */
export default function AudioUploader({ value, onChange, label = 'Ljudfil att lyssna på (mp3)' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (file.type && !file.type.startsWith('audio/')) {
      setErr('Endast ljudfiler (mp3, m4a, wav…).')
      return
    }
    setUploading(true)
    setErr(null)
    const d = await uploadFileDirect(file, { bucket: 'videos', folder: 'audio' })
    if (d.url) onChange(d.url)
    else setErr(d.error ?? 'Uppladdningen misslyckades')
    setUploading(false)
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {value ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={value} style={{ width: '100%', maxWidth: 420, height: 36 }} />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" className="btn" disabled={uploading} onClick={() => fileRef.current?.click()} style={{ fontSize: 'var(--fs-xs)' }}>
              {uploading ? 'Laddar upp…' : 'Byt ljudfil'}
            </button>
            <button type="button" className="btn" onClick={() => onChange('')} style={{ fontSize: 'var(--fs-xs)' }}>
              Ta bort
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? 'Laddar upp…' : '⬆ Ladda upp ljudfil'}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        style={{ display: 'none' }}
        onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
      />
      {err && <p style={{ color: '#f87', fontSize: 'var(--fs-xs)', marginTop: '0.4rem' }}>{err}</p>}
    </div>
  )
}
