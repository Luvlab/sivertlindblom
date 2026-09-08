'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import PdfFlipbook from '@/components/pdf/PdfFlipbook'
import { uploadFileDirect } from '@/lib/upload-direct'

interface FlipbookData {
  slug: string
  title: string
  subtitle: string | null
  pdf_url: string | null
  pdf_label: string | null
  location: string
  sort_order: number
  published: boolean
}

const LOCATIONS: { key: string; label: string; preview: string }[] = [
  { key: 'watercolors', label: 'Akvareller', preview: '/sv/portfolio/watercolors' },
  { key: 'ararat', label: 'ARARAT', preview: '/sv/portfolio/exhibitions/a-2026' },
  { key: 'publicerat', label: 'Publicerat', preview: '/sv/references/publicerat' },
]

function EditFlipbook() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [data, setData] = useState<FlipbookData | null>(null)
  const [original, setOriginal] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/admin/flipbooks/${slug}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((d: FlipbookData & { error?: string }) => {
        if (!d.error) { setData(d); setOriginal(JSON.stringify(d)) }
        else setError(d.error)
      })
      .finally(() => setLoading(false))
  }, [slug])

  const dirty = !!data && JSON.stringify(data) !== original

  async function handleFile(file: File | undefined) {
    if (!file || !data) return
    if (file.type && file.type !== 'application/pdf') {
      setError('Endast PDF-filer kan laddas upp här.')
      return
    }
    setUploading(true)
    setError(null)
    const d = await uploadFileDirect(file, { bucket: 'images', folder: 'flipbooks' })
    if (d.url) setData({ ...data, pdf_url: d.url })
    else setError(d.error ?? 'Uppladdningen misslyckades')
    setUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/flipbooks/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json() as FlipbookData & { error?: string }
      if (res.ok && !result.error) {
        setData(result)
        setOriginal(JSON.stringify(result))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? 'Fel')
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Dölja denna flipbook från sajten? Den kan publiceras igen senare.')) return
    const res = await fetch(`/api/admin/flipbooks/${slug}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/flipbooks')
  }

  if (loading) return <div style={{ padding: '3rem' }}>Laddar…</div>
  if (!data) return <div style={{ padding: '3rem', color: '#f88' }}>Hittades inte. {error}</div>

  const locInfo = LOCATIONS.find(l => l.key === data.location)
  const inputStyle: React.CSSProperties = { width: '100%' }

  return (
    <AdminForm
      title={data.title || 'Flipbook'}
      backHref="/admin/flipbooks"
      backLabel="Flipbooks"
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
      saved={saved}
      dirty={dirty}
      error={error}
      previewHref={locInfo?.preview}
      maxWidth={700}
    >
      <div>
        <FieldLabel>Titel</FieldLabel>
        <input className="input" style={inputStyle} value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
      </div>

      <div>
        <FieldLabel>Undertitel (valfri)</FieldLabel>
        <input className="input" style={inputStyle} value={data.subtitle ?? ''} onChange={e => setData({ ...data, subtitle: e.target.value })} placeholder="t.ex. upphovsperson eller källa" />
      </div>

      <div>
        <FieldLabel>Var på sajten visas den</FieldLabel>
        <select className="input" style={inputStyle} value={data.location} onChange={e => setData({ ...data, location: e.target.value })}>
          {LOCATIONS.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
        </select>
      </div>

      <div>
        <FieldLabel>Ordning (lägre nummer visas först)</FieldLabel>
        <input type="number" className="input" style={{ width: 120 }} value={data.sort_order} onChange={e => setData({ ...data, sort_order: parseInt(e.target.value) || 0 })} />
      </div>

      <div>
        <FieldLabel>PDF</FieldLabel>
        {data.pdf_url ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={() => setPreview(true)}>📖 Bläddra</button>
            <a href={data.pdf_url} target="_blank" rel="noopener noreferrer" className="btn">Visa</a>
            <button type="button" className="btn" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? 'Laddar upp…' : 'Byt ut PDF'}
            </button>
          </div>
        ) : (
          <button type="button" className="btn" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? 'Laddar upp…' : '⬆ Ladda upp PDF'}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
        />
      </div>

      <div>
        <FieldLabel>Text på nedladdningsknappen (valfri, t.ex. &quot;Ladda ner PDF&quot;)</FieldLabel>
        <input className="input" style={inputStyle} value={data.pdf_label ?? ''} onChange={e => setData({ ...data, pdf_label: e.target.value })} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input type="checkbox" id="published" checked={data.published} onChange={e => setData({ ...data, published: e.target.checked })} />
        <label htmlFor="published" style={{ fontSize: 'var(--fs-sm)' }}>Publicerad (synlig på sajten)</label>
      </div>

      {preview && data.pdf_url && (
        <PdfFlipbook url={data.pdf_url} title={data.title} onClose={() => setPreview(false)} />
      )}
    </AdminForm>
  )
}

export default function AdminFlipbookEditPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem' }}>Laddar…</div>}>
      <EditFlipbook />
    </Suspense>
  )
}
