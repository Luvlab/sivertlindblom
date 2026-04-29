'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'exhibition',      label: 'Utställning' },
  { value: 'public_exterior', label: 'Offentlig exteriör' },
  { value: 'public_interior', label: 'Offentlig interiör' },
  { value: 'scenography',     label: 'Scenografi' },
  { value: 'watercolor',      label: 'Akvarell' },
  { value: 'sculpture',       label: 'Skulptur' },
  { value: 'graphic',         label: 'Grafik' },
]

export default function NewWorkPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', category: 'exhibition', year_start: '', year_end: '',
    location: '', description: '', source_url: '', published: true,
  })
  const [imageUrls, setImageUrls] = useState([''])
  const [saving, setSaving] = useState(false)

  function f(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // TODO: POST to /api/admin/works with form + imageUrls
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    router.push('/admin/works')
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/works" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← Verk</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginTop: '0.75rem' }}>Nytt verk</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            Titel *
          </label>
          <input type="text" required className="input" value={form.title} onChange={f('title')} placeholder="Verkets titel" />
        </div>

        {/* Category + published */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              Kategori *
            </label>
            <select className="input" value={form.category} onChange={f('category')}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--fs-sm)', cursor: 'pointer', paddingBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
              style={{ accentColor: 'var(--color-accent)' }}
            />
            Publicerad
          </label>
        </div>

        {/* Years + Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>År (start)</label>
            <input type="number" className="input" value={form.year_start} onChange={f('year_start')} placeholder="1989" min={1900} max={2100} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>År (slut)</label>
            <input type="number" className="input" value={form.year_end} onChange={f('year_end')} placeholder="1991" min={1900} max={2100} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Plats</label>
            <input type="text" className="input" value={form.location} onChange={f('location')} placeholder="Stockholm" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Beskrivning</label>
          <textarea className="input" rows={5} value={form.description} onChange={f('description')} placeholder="Beskriv verket..." style={{ resize: 'vertical' }} />
        </div>

        {/* Source URL */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Källa URL</label>
          <input type="url" className="input" value={form.source_url} onChange={f('source_url')} placeholder="https://sivertlindblom.se/..." />
        </div>

        {/* Images */}
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            Bild-URL:er
          </label>
          {imageUrls.map((url, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="url"
                className="input"
                value={url}
                onChange={e => {
                  const next = [...imageUrls]
                  next[i] = e.target.value
                  setImageUrls(next)
                }}
                placeholder="https://sivertlindblom.se/wp-content/uploads/..."
              />
              {imageUrls.length > 1 && (
                <button type="button" className="btn" style={{ flexShrink: 0, padding: '0.5rem 0.75rem' }} onClick={() => setImageUrls(imageUrls.filter((_, j) => j !== i))}>×</button>
              )}
            </div>
          ))}
          <button type="button" className="btn" style={{ fontSize: 'var(--fs-xs)', marginTop: '0.5rem' }} onClick={() => setImageUrls([...imageUrls, ''])}>
            + Lägg till bild-URL
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar...' : 'Spara verk'}
          </button>
          <Link href="/admin/works">
            <button type="button" className="btn">Avbryt</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
