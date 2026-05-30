'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { ScenographyWork } from '@/app/api/admin/scenography/route'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditScenographyPage() {
  return (
    <Suspense fallback={<div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>}>
      <EditScenographyPageInner />
    </Suspense>
  )
}

function EditScenographyPageInner() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [form, setForm] = useState<ScenographyWork | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/scenography/${slug}`)
      .then(r => r.json())
      .then((data: ScenographyWork | { error: string }) => {
        if ('error' in data) setError(String(data.error))
        else setForm(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [slug])

  function update<K extends keyof ScenographyWork>(key: K, value: ScenographyWork[K]) {
    setForm(prev => prev ? { ...prev, [key]: value } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/scenography/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as ScenographyWork | { error: string }
      if ('error' in data) setError(String(data.error))
      else {
        setSaved(true); setDirty(false)
        setTimeout(() => setSaved(false), 3000)
        // If slug changed, navigate to new URL
        if ((data as ScenographyWork).slug !== slug) {
          router.replace(`/admin/scenography/${(data as ScenographyWork).slug}`)
        }
      }
    } catch (err) { setError(String(err)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}"? Detta kan inte ångras.`)) return
    try {
      const res = await fetch(`/api/admin/scenography/${slug}`, { method: 'DELETE' })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.error) setError(data.error)
      else router.push('/admin/scenography')
    } catch (err) { setError(String(err)) }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem,3vw,3rem)', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: 'clamp(1rem,3vw,3rem)', color: '#f88' }}>{error || 'Hittades inte'}</div>

  return (
    <>
      <style>{`
        .sceno-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start; }
        @media(max-width: 780px) { .sceno-grid { grid-template-columns: 1fr; } }
      `}</style>

      <AdminForm
        title={form.title || 'Scenografiverk'}
        backHref="/admin/scenography"
        backLabel="Scenografi"
        onSave={handleSave}
        onDelete={handleDelete}
        saving={saving}
        saved={saved}
        error={error}
        dirty={dirty}
        deleteLabel="Radera verk"
        maxWidth="none"
      >
        <div className="sceno-grid">

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <FieldLabel>Titel *</FieldLabel>
              <input type="text" required className="input" style={{ width: '100%' }}
                value={form.title} onChange={e => update('title', e.target.value)} />
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
              <textarea className="input" rows={8} style={{ width: '100%', resize: 'vertical' }}
                value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Längre beskrivning av verket…" />
            </div>

          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div>
              <FieldLabel>Video URL (YouTube embed-ID)</FieldLabel>
              <input type="text" className="input" style={{ width: '100%' }}
                value={form.video_url} onChange={e => update('video_url', e.target.value)}
                placeholder="dQw4w9WgXcQ" />
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                Klistra in YouTube-ID:t (det som kommer efter watch?v=)
              </p>
            </div>

            <div>
              <FieldLabel>Slug (URL)</FieldLabel>
              <input type="text" className="input" style={{ width: '100%', fontFamily: 'monospace' }}
                value={form.slug} onChange={e => update('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                placeholder="coriolanus" />
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
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>— visas på sajten</span>
            </label>

          </div>

        </div>{/* /sceno-grid */}

        {/* Images — full width below columns */}
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
