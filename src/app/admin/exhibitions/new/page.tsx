'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Exhibition } from '@/lib/exhibitions-data'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewExhibitionPage() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [form, setForm] = useState<Exhibition>({
    slug: '',
    title: '',
    year: currentYear,
    location: '',
    url: '',
    images: [],
    description: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  function update(key: keyof Exhibition, value: Exhibition[keyof Exhibition]) {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'title' && !dirty) {
        next.slug = slugify(String(value)) + '-' + next.year
      }
      return next
    })
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as Exhibition | { error: string }
      if ('error' in data) {
        setError(String(data.error))
        setSaving(false)
      } else {
        router.push('/admin/exhibitions')
      }
    } catch (err) {
      setError(String(err))
      setSaving(false)
    }
  }

  return (
    <AdminForm
      title="Ny utställning"
      backHref="/admin/exhibitions"
      backLabel="Utställningar"
      onSave={handleSave}
      saving={saving}
      error={error}
      saveLabel="Skapa utställning"
    >
      <div>
        <FieldLabel>Titel *</FieldLabel>
        <input type="text" required className="input" value={form.title} onChange={e => update('title', e.target.value)} placeholder="Utställningens titel" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <FieldLabel>År *</FieldLabel>
          <input type="number" required className="input" value={form.year} onChange={e => update('year', parseInt(e.target.value))} min={1900} max={2100} />
        </div>
        <div>
          <FieldLabel>Plats</FieldLabel>
          <input type="text" className="input" value={form.location} onChange={e => update('location', e.target.value)} placeholder="Stockholm" />
        </div>
      </div>

      <div>
        <FieldLabel>Slug (URL-identifierare)</FieldLabel>
        <input type="text" className="input" value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="utst-llning-2024" />
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
          placeholder="Kort beskrivning av utställningen..."
        />
      </div>

      <ImageListEditor
        images={form.images}
        onChange={imgs => update('images', imgs)}
      />
    </AdminForm>
  )
}
