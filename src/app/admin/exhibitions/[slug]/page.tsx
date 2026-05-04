'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import type { Exhibition } from '@/lib/exhibitions-data'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditExhibitionPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<Exhibition | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/exhibitions/${slug}`)
      .then(r => r.json())
      .then((data: Exhibition | { error: string }) => {
        if ('error' in data) {
          setError(String(data.error))
        } else {
          setForm(data)
        }
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [slug])

  function update(key: keyof Exhibition, value: Exhibition[keyof Exhibition]) {
    setForm(prev => prev ? { ...prev, [key]: value } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/exhibitions/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as Exhibition | { error: string }
      if ('error' in data) {
        setError(String(data.error))
      } else {
        setSaved(true)
        setDirty(false)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Radera utställningen "${form?.title}"? Detta kan inte ångras.`)) return
    try {
      const res = await fetch(`/api/admin/exhibitions/${slug}`, { method: 'DELETE' })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.error) {
        setError(data.error)
      } else {
        router.push('/admin/exhibitions')
      }
    } catch (err) {
      setError(String(err))
    }
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar...</div>
  if (!form) return <div style={{ padding: '3rem', color: '#f88' }}>{error || 'Hittades inte'}</div>

  return (
    <AdminForm
      title={form.title}
      backHref="/admin/exhibitions"
      backLabel="Utställningar"
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      deleteLabel="Radera utställning"
    >
      <div>
        <FieldLabel>Titel *</FieldLabel>
        <input type="text" required className="input" value={form.title} onChange={e => update('title', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <FieldLabel>År *</FieldLabel>
          <input type="number" required className="input" value={form.year} onChange={e => update('year', parseInt(e.target.value))} min={1900} max={2100} />
        </div>
        <div>
          <FieldLabel>Plats</FieldLabel>
          <input type="text" className="input" value={form.location} onChange={e => update('location', e.target.value)} />
        </div>
      </div>

      <div>
        <FieldLabel>Slug (URL-identifierare)</FieldLabel>
        <input type="text" className="input" value={form.slug} onChange={e => update('slug', e.target.value)} />
      </div>

      <div>
        <FieldLabel>Extern URL</FieldLabel>
        <input type="url" className="input" value={form.url} onChange={e => update('url', e.target.value)} placeholder="https://..." />
      </div>

      <div>
        <FieldLabel>Beskrivning</FieldLabel>
        <textarea
          className="input"
          rows={5}
          value={form.description}
          onChange={e => update('description', e.target.value)}
          style={{ resize: 'vertical' }}
        />
      </div>

      <ImageListEditor
        images={form.images}
        onChange={imgs => update('images', imgs)}
      />
    </AdminForm>
  )
}
