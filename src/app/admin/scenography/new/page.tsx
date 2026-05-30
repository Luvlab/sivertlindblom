'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ScenographyWork } from '@/app/api/admin/scenography/route'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import LinkTextarea from '@/components/admin/LinkTextarea'
import { Suspense } from 'react'

function NewScenographyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultType = (searchParams.get('type') ?? 'Teaterscenografi') as ScenographyWork['type']

  const [form, setForm] = useState<Omit<ScenographyWork, 'id'>>({
    slug: '',
    title: '',
    year: null,
    venue: '',
    type: defaultType,
    description: '',
    video_url: '',
    sort_order: 0,
    published: true,
    images: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // Auto-generate slug from title
  function handleTitleChange(title: string) {
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase()
        .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
        .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 80),
    }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.slug) { setError('Slug krävs'); return }
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/scenography/${form.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as ScenographyWork | { error: string }
      if ('error' in data) setError(String(data.error))
      else router.push(`/admin/scenography/${(data as ScenographyWork).slug}`)
    } catch (err) { setError(String(err)) }
    finally { setSaving(false) }
  }

  return (
    <>
      <style>{`
        .sceno-new-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        @media(max-width: 780px) { .sceno-new-grid { grid-template-columns: 1fr; } }
      `}</style>

      <AdminForm
        title="Nytt scenografiverk"
        backHref="/admin/scenography"
        backLabel="Scenografi"
        onSave={handleSave}
        saving={saving}
        error={error}
        saveLabel="Skapa verk"
        maxWidth="none"
      >
        <div className="sceno-new-grid">

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <FieldLabel>Titel *</FieldLabel>
              <input type="text" required className="input" style={{ width: '100%' }}
                value={form.title} onChange={e => handleTitleChange(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <FieldLabel>År</FieldLabel>
                <input type="number" className="input" style={{ width: '100%' }}
                  value={form.year ?? ''} onChange={e => update('year', e.target.value ? Number(e.target.value) : null)}
                  placeholder="1970" />
              </div>
              <div>
                <FieldLabel>Typ</FieldLabel>
                <select className="input" style={{ width: '100%' }}
                  value={form.type} onChange={e => update('type', e.target.value as ScenographyWork['type'])}>
                  <option value="Teaterscenografi">Teaterscenografi</option>
                  <option value="Koreografi">Koreografi</option>
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Scen / Koreograf / Venue</FieldLabel>
              <input type="text" className="input" style={{ width: '100%' }}
                value={form.venue} onChange={e => update('venue', e.target.value)}
                placeholder="Dramaten, Stockholm. Regi: Alf Sjöberg" />
            </div>

            <div>
              <FieldLabel>Beskrivning</FieldLabel>
              <LinkTextarea
                value={form.description}
                onChange={v => update('description', v)}
                rows={8}
                placeholder="Längre beskrivning av verket…"
              />
            </div>

          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <FieldLabel>Video URL (YouTube embed-ID)</FieldLabel>
              <input type="text" className="input" style={{ width: '100%' }}
                value={form.video_url} onChange={e => update('video_url', e.target.value)}
                placeholder="dQw4w9WgXcQ" />
            </div>

            <div>
              <FieldLabel>Slug (URL) *</FieldLabel>
              <input type="text" required className="input" style={{ width: '100%', fontFamily: 'monospace' }}
                value={form.slug}
                onChange={e => update('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                placeholder="coriolanus" />
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                Auto-genereras från titeln — kan redigeras
              </p>
            </div>

            <div>
              <FieldLabel>Sorteringsordning</FieldLabel>
              <input type="number" className="input" style={{ width: '100%' }}
                value={form.sort_order} onChange={e => update('sort_order', Number(e.target.value))} />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => update('published', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--color-accent)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>Publicerad</span>
            </label>

          </div>

        </div>

        {/* Images */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          <ImageListEditor
            images={form.images.map(img => img.url)}
            onChange={urls => update('images', urls.map(url => ({ url, alt: '' })))}
            label="Bilder till verket"
          />
        </div>

      </AdminForm>
    </>
  )
}

export default function NewScenographyPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', color: 'var(--color-muted)' }}>Laddar…</div>}>
      <NewScenographyForm />
    </Suspense>
  )
}
