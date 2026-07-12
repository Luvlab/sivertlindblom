'use client'

import { useState, useEffect, useRef } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import type { FotografiSection } from '@/lib/reference-fotografi'

export default function AdminFotografi() {
  const [photographer, setPhotographer] = useState('')
  const [urls, setUrls] = useState<string[]>([])
  // Preserve captions by URL across edits (ImageListEditor only handles URLs).
  const captionsRef = useRef<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reference-fotografi', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: FotografiSection | { error: string }) => {
        if ('error' in d) { setError(String(d.error)); return }
        setPhotographer(d.photographer ?? '')
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
      const res = await fetch('/api/admin/reference-fotografi', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photographer, images }),
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
      title="Fotografier – inspiration"
      backHref="/admin/references"
      backLabel="Referenser"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
      previewHref="/sv/references#fotografi"
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem' }}>
        Bilderna i sektionen ”Fotografier – inspiration” på referenssidan. Lägg till, ta bort och ordna om — precis som i övriga bildhanterare.
      </p>

      <div>
        <FieldLabel>Fotograf (visas under galleriet)</FieldLabel>
        <input
          type="text"
          className="input"
          style={{ width: '100%', maxWidth: 420 }}
          value={photographer}
          onChange={e => { setPhotographer(e.target.value); setDirty(true) }}
          placeholder="t.ex. Jan Öqvist"
        />
      </div>

      <div>
        <FieldLabel>Bilder ({urls.length})</FieldLabel>
        <ImageListEditor
          images={urls}
          onChange={(next) => { setUrls(next); setDirty(true) }}
          label="Fotografier"
        />
      </div>
    </AdminForm>
  )
}
