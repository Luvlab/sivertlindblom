'use client'

import { useState, useEffect, useRef } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import type { OgonblickSection } from '@/lib/reference-ogonblick'

export default function AdminOgonblick() {
  const [intro, setIntro] = useState('')
  const [urls, setUrls] = useState<string[]>([])
  // Preserve captions by URL across edits (ImageListEditor only handles URLs).
  const captionsRef = useRef<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reference-ogonblick', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: OgonblickSection | { error: string }) => {
        if ('error' in d) { setError(String(d.error)); return }
        setIntro(d.intro ?? '')
        setUrls(d.images.map(i => i.url))
        const map: Record<string, string> = {}
        for (const i of d.images) if (i.caption) map[i.url] = i.caption
        captionsRef.current = map
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const images = urls.map(url => ({ url, caption: captionsRef.current[url] || undefined }))
      const res = await fetch('/api/admin/reference-ogonblick', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intro, images }),
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
      title="Ögonblick"
      backHref="/admin/references"
      backLabel="Referenser"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
      previewHref="/sv/references#ogonblick"
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem' }}>
        Personliga fotografier av Sivert — i ateljén, vid invigningar och i vardagen. Lägg till nya bilder från media, ta bort och ordna om.
      </p>

      <div>
        <FieldLabel>Ingress (visas ovanför galleriet)</FieldLabel>
        <textarea
          className="input"
          rows={3}
          style={{ width: '100%', resize: 'vertical' }}
          value={intro}
          onChange={e => { setIntro(e.target.value); setDirty(true) }}
          placeholder="Kort text om bilderna…"
        />
      </div>

      <div>
        <FieldLabel>Bilder ({urls.length})</FieldLabel>
        <ImageListEditor
          images={urls}
          onChange={(next) => { setUrls(next); setDirty(true) }}
          label="Ögonblick"
        />
      </div>
    </AdminForm>
  )
}
