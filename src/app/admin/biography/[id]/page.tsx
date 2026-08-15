'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import LinkTextarea from '@/components/admin/LinkTextarea'
import { uploadImageFile } from '@/lib/upload-image'

interface BioEntry {
  id: string
  entry_type: 'education' | 'position' | 'award' | 'public_commission' | 'group_exhibition' | 'publication' | 'personal'
  year_start?: number
  year_end?: number
  title: string
  description?: string
  location?: string
  sort_order: number
  images?: string[]
  video_url?: string
}

const TYPE_LABELS = {
  personal: 'Personligt', education: 'Utbildning', position: 'Tjänst/Uppdrag',
  award: 'Pris/Utmärkelse', public_commission: 'Offentligt uppdrag',
  group_exhibition: 'Grupputställning', publication: 'Publikation',
}

interface MediaItem { url: string; name: string; folder: string }

function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/admin/media-library')
      .then(r => r.json())
      .then((d: { files?: MediaItem[] }) => { if (d.files) setItems(d.files) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = q
    ? items.filter(i => i.name.toLowerCase().includes(q.toLowerCase()) || i.folder.toLowerCase().includes(q.toLowerCase()))
    : items

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 900,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
          width: '100%', maxWidth: 860, maxHeight: '85vh',
          display: 'flex', flexDirection: 'column', borderRadius: 2,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', margin: 0 }}>Media Vault</h2>
          <input
            type="search"
            className="input"
            placeholder="Sök bilder…"
            value={q}
            onChange={e => setQ(e.target.value)}
            autoFocus
            style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.25rem', lineHeight: 1, padding: '0.25rem' }}>✕</button>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {loading ? (
            <p style={{ color: 'var(--color-muted)', padding: '2rem', textAlign: 'center' }}>Laddar…</p>
          ) : filtered.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', padding: '2rem', textAlign: 'center' }}>Inga bilder hittades.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
              {filtered.map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  onClick={() => { onPick(img.url); onClose() }}
                  title={img.name}
                  style={{
                    background: 'none', border: '1px solid var(--color-border)',
                    cursor: 'pointer', padding: 0, overflow: 'hidden', borderRadius: 2,
                    transition: 'border-color 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  <div style={{ padding: '0.25rem 0.35rem', fontSize: '0.62rem', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {img.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--color-border)', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
          {filtered.length} bilder · Klicka för att välja
        </div>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = { width: '100%' }
const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

export default function EditBioPage() {
  return (
    <Suspense fallback={<div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>}>
      <EditBioPageInner />
    </Suspense>
  )
}

function EditBioPageInner() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<BioEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  useEffect(() => {
    fetch(`/api/admin/biography/${id}`)
      .then(r => r.json())
      .then((d: BioEntry | { error: string }) => {
        if ('error' in d) setError(d.error)
        else setForm(d)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof BioEntry>(key: K, val: BioEntry[K]) {
    setForm(prev => prev ? { ...prev, [key]: val } : prev)
    setDirty(true)
  }

  function addImage(url: string) {
    if (!url) return
    setForm(prev => {
      if (!prev) return prev
      const existing = prev.images ?? []
      if (existing.includes(url)) return prev
      return { ...prev, images: [...existing, url] }
    })
    setDirty(true)
  }

  function removeImage(url: string) {
    setForm(prev => prev ? { ...prev, images: (prev.images ?? []).filter(u => u !== url) } : prev)
    setDirty(true)
  }

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const data = await uploadImageFile(file, form?.title ?? 'bio')
      if (data.url) addImage(data.url)
    } catch { /* ignore */ }
    finally {
      setUploading(false)
      e.target.value = ''
    }
  }, [form?.title]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/biography/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { error?: string; message?: string }
      if (res.ok && !data.error) { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error ?? data.message ?? 'Fel vid sparning')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}"?`)) return
    await fetch(`/api/admin/biography/${id}`, { method: 'DELETE' })
    router.push('/admin/biography')
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>{error ?? 'Hittades inte'}</div>

  const images = form.images ?? []

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: 760 }}>
      {showPicker && (
        <MediaPicker
          onPick={addImage}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/biography" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Biografi</Link>
        {dirty && <span style={{ fontSize: 'var(--fs-xs)', color: '#f0a' }}>● Osparade ändringar</span>}
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '2rem' }}>Redigera biografipost</h1>

      {error && <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>{error}</div>}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Type + Years */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            {lbl('Typ')}
            <select className="input" style={inp} value={form.entry_type} onChange={e => set('entry_type', e.target.value as BioEntry['entry_type'])}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            {lbl('År från')}
            <input className="input" type="number" style={inp} value={form.year_start ?? ''} onChange={e => set('year_start', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div>
            {lbl('År till')}
            <input className="input" type="number" style={inp} value={form.year_end ?? ''} onChange={e => set('year_end', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>

        {/* Title + Location */}
        <div>
          {lbl('Titel')}
          <input className="input" style={inp} value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>

        <div>
          {lbl('Plats')}
          <input className="input" style={inp} value={form.location ?? ''} onChange={e => set('location', e.target.value)} />
        </div>

        {/* Description */}
        <div>
          {lbl('Beskrivning')}
          <LinkTextarea
            value={form.description ?? ''}
            onChange={v => set('description', v)}
            rows={4}
            hint="Markera text + 🔗 Länk för att infoga hyperlänk."
          />
        </div>

        {/* Video URL */}
        <div>
          {lbl('Video URL (YouTube / Vimeo)')}
          <input
            className="input"
            style={inp}
            type="url"
            placeholder="https://youtu.be/…"
            value={form.video_url ?? ''}
            onChange={e => set('video_url', e.target.value || undefined)}
          />
        </div>

        {/* Images */}
        <div>
          {lbl('Bilder')}

          {/* Existing images */}
          {images.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {images.map((url, i) => (
                <div key={`${url}-${i}`} style={{ position: 'relative', border: '1px solid var(--color-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(160,30,30,0.85)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.65rem', padding: '0.15rem 0.35rem', lineHeight: 1 }}
                    title="Ta bort"
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Add controls */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn"
              onClick={() => setShowPicker(true)}
              style={{ fontSize: 'var(--fs-xs)' }}
            >
              ▣ Välj från Media Vault
            </button>

            <label className="btn" style={{ fontSize: 'var(--fs-xs)', cursor: 'pointer' }}>
              {uploading ? 'Laddar upp…' : '↑ Ladda upp bild'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>

          {/* Paste URL */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="url"
              className="input"
              placeholder="Eller klistra in bild-URL…"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage(urlInput); setUrlInput('') } }}
              style={{ flex: 1, fontSize: 'var(--fs-xs)' }}
            />
            <button
              type="button"
              className="btn"
              onClick={() => { addImage(urlInput); setUrlInput('') }}
              disabled={!urlInput}
              style={{ fontSize: 'var(--fs-xs)', flexShrink: 0 }}
            >
              Lägg till
            </button>
          </div>
        </div>

        {/* Sort order */}
        <div>
          {lbl('Sorteringsordning')}
          <input className="input" type="number" style={{ width: 120 }} value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sparar…' : 'Spara post'}</button>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          <button type="button" onClick={handleDelete}
            style={{ marginLeft: 'auto', background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.5em 1em', fontSize: 'var(--fs-xs)' }}>
            Radera
          </button>
        </div>
      </form>
    </div>
  )
}
