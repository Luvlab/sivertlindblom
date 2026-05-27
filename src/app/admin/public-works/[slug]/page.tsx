'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import type { PublicWork } from '@/lib/public-works'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditPublicWorkPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<PublicWork | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/public-works/${slug}`)
      .then(r => r.json())
      .then((data: PublicWork | { error: string }) => {
        if ('error' in data) setError(String(data.error))
        else setForm(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [slug])

  function update(key: keyof PublicWork, value: PublicWork[keyof PublicWork]) {
    setForm(prev => prev ? { ...prev, [key]: value } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/public-works/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as PublicWork | { error: string }
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
    if (!confirm(`Radera "${form?.title}"? Detta kan inte ångras.`)) return
    try {
      const res = await fetch(`/api/admin/public-works/${slug}`, { method: 'DELETE' })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.error) setError(data.error)
      else router.push('/admin/public-works')
    } catch (err) {
      setError(String(err))
    }
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar...</div>
  if (!form) return <div style={{ padding: '3rem', color: '#f88' }}>{error || 'Hittades inte'}</div>

  return (
    <AdminForm
      title={form.title}
      backHref="/admin/public-works"
      backLabel="Offentliga arbeten"
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      deleteLabel="Radera verk"
    >
      <div>
        <FieldLabel>Titel *</FieldLabel>
        <input
          type="text"
          required
          className="input"
          value={form.title}
          onChange={e => update('title', e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <FieldLabel>År</FieldLabel>
          <input
            type="text"
            className="input"
            value={form.year}
            onChange={e => update('year', e.target.value)}
            placeholder="t.ex. 1989 eller 1987–91"
          />
        </div>
        <div>
          <FieldLabel>Plats</FieldLabel>
          <input
            type="text"
            className="input"
            value={form.location}
            onChange={e => update('location', e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Kategori</FieldLabel>
          <select
            className="input"
            value={form.category}
            onChange={e => update('category', e.target.value as 'exterior' | 'interior')}
          >
            <option value="exterior">Exteriör</option>
            <option value="interior">Interiör</option>
          </select>
        </div>
      </div>

      <div>
        <FieldLabel>Slug (URL)</FieldLabel>
        <input
          type="text"
          className="input"
          value={form.slug}
          onChange={e => update('slug', e.target.value)}
        />
      </div>

      <div>
        <FieldLabel>Kort beskrivning</FieldLabel>
        <textarea
          className="input"
          rows={3}
          value={form.description}
          onChange={e => update('description', e.target.value)}
          style={{ resize: 'vertical' }}
          placeholder="Visas i meta och eventuellt i listvy"
        />
      </div>

      <div>
        <FieldLabel>Brödtext (svenska)</FieldLabel>
        <textarea
          className="input"
          rows={6}
          value={form.body ?? ''}
          onChange={e => update('body', e.target.value)}
          style={{ resize: 'vertical' }}
          placeholder="Längre beskrivning — visas på detaljsidan"
        />
      </div>

      <ImageListEditor
        images={form.images.map(img => (typeof img === 'string' ? img : img.url))}
        onChange={urls =>
          update('images', urls.map(url => ({ url, alt: '' })))
        }
      />
    </AdminForm>
  )
}
