'use client'

import { useRef, useState } from 'react'
import { uploadImageFile } from '@/lib/upload-image'

export interface PdfItem { label: string; url: string }

interface Props {
  pdfs: PdfItem[]
  onChange: (next: PdfItem[]) => void
  label?: string
}

/**
 * Upload PDF files and manage a labelled list of them. Files are uploaded to
 * storage via the shared upload endpoint (the image compressor no-ops on a
 * non-image and falls back to the raw file), and each gets an editable title
 * shown to visitors as a "Ladda ner" link.
 */
export default function PdfListEditor({ pdfs, onChange, label = 'PDF-filer att ladda ner' }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleFile(file: File | undefined) {
    if (!file) return
    if (file.type && file.type !== 'application/pdf') {
      setErr('Endast PDF-filer kan laddas upp här.')
      return
    }
    setUploading(true)
    setErr(null)
    const d = await uploadImageFile(file, file.name)
    if (d.url) {
      onChange([...pdfs, { label: file.name.replace(/\.pdf$/i, ''), url: d.url }])
    } else {
      setErr(d.error ?? 'Uppladdningen misslyckades')
    }
    setUploading(false)
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem',
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {pdfs.map((p, i) => (
        <div key={i} style={rowStyle}>
          <span style={{ fontSize: '1rem' }}>📄</span>
          <input
            className="input"
            style={{ flex: 1, minWidth: 0 }}
            value={p.label}
            onChange={e => onChange(pdfs.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
            placeholder="Titel (visas som nedladdningslänk)"
          />
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: 'var(--fs-xs)', flexShrink: 0 }}>Visa</a>
          <button
            type="button"
            onClick={() => onChange(pdfs.filter((_, idx) => idx !== i))}
            className="btn"
            style={{ fontSize: 'var(--fs-xs)', flexShrink: 0 }}
          >
            ✕
          </button>
        </div>
      ))}

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
      />
      <button type="button" className="btn" disabled={uploading} onClick={() => fileRef.current?.click()} style={{ marginTop: '0.25rem' }}>
        {uploading ? 'Laddar upp…' : '⬆ Ladda upp PDF'}
      </button>
      {err && <p style={{ color: '#f87', fontSize: 'var(--fs-xs)', marginTop: '0.4rem' }}>{err}</p>}
    </div>
  )
}
