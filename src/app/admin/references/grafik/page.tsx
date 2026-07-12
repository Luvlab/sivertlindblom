'use client'

import { useState, useEffect, useRef } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import type { GrafikSection } from '@/lib/reference-grafik'

export default function AdminGrafik() {
  const [form, setForm] = useState<GrafikSection>({ title: '', years: '', intro: '', photographer: '', images: [] })
  const captionsRef = useRef<Record<string, string>>({})
  const [urls, setUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reference-grafik', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: GrafikSection | { error: string }) => {
        if ('error' in d) { setError(String(d.error)); return }
        setForm(d)
        setUrls(d.images.map(i => i.url))
        const map: Record<string, string> = {}
        for (const i of d.images) if (i.caption) map[i.url] = i.caption
        captionsRef.current = map
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function set<K extends keyof GrafikSection>(key: K, val: GrafikSection[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const images = urls.map(url => ({ url, caption: captionsRef.current[url] || undefined }))
      const res = await fetch('/api/admin/reference-grafik', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.error) setError(data.error)
      else { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>

  return (
    <AdminForm
      title="Grafik"
      backHref="/admin/references"
      backLabel="Referenser"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
      previewHref="/sv/references#grafik"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div>
          <FieldLabel>Rubrik</FieldLabel>
          <input type="text" className="input" style={{ width: '100%' }} value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div>
          <FieldLabel>Årtal</FieldLabel>
          <input type="text" className="input" style={{ width: '100%' }} value={form.years} onChange={e => set('years', e.target.value)} placeholder="1966–2018" />
        </div>
      </div>

      <div>
        <FieldLabel>Ingress / beskrivning</FieldLabel>
        <textarea className="input" rows={3} style={{ width: '100%', resize: 'vertical' }} value={form.intro} onChange={e => set('intro', e.target.value)} />
      </div>

      <div>
        <FieldLabel>Fotograf (visas under galleriet)</FieldLabel>
        <input type="text" className="input" style={{ width: '100%', maxWidth: 420 }} value={form.photographer} onChange={e => set('photographer', e.target.value)} placeholder="t.ex. Jan Öqvist" />
      </div>

      <div>
        <FieldLabel>Bilder ({urls.length})</FieldLabel>
        <ImageListEditor images={urls} onChange={(next) => { setUrls(next); setDirty(true) }} label="Grafik" />
      </div>
    </AdminForm>
  )
}
