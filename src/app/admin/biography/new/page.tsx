'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{text}</label>
)

export default function NewBioPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    entry_type: 'personal', year_start: '', year_end: '',
    title: '', description: '', location: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const payload = {
        id: String(Date.now()),
        entry_type: form.entry_type,
        year_start: form.year_start ? Number(form.year_start) : undefined,
        year_end:   form.year_end   ? Number(form.year_end)   : undefined,
        title: form.title,
        description: form.description || undefined,
        location: form.location || undefined,
      }
      const res = await fetch('/api/admin/biography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json() as { id?: string; error?: string }
      if (data.error) {
        setError(data.error)
      } else {
        router.push('/admin/biography')
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 700 }}>
      <Link href="/admin/biography" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← Biografi</Link>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginTop: '0.75rem', marginBottom: '2rem' }}>Ny biografipost</h1>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          {lbl('Typ *')}
          <select className="input" style={{ width: '100%' }} value={form.entry_type} onChange={f('entry_type')}>
            {[
              ['personal',          'Personligt'],
              ['education',         'Utbildning'],
              ['position',          'Tjänst/Uppdrag'],
              ['award',             'Pris/Utmärkelse'],
              ['public_commission', 'Offentligt uppdrag'],
              ['group_exhibition',  'Grupputställning'],
              ['publication',       'Publikation'],
            ].map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          {lbl('Titel / Beskrivning *')}
          <input
            type="text"
            required
            className="input"
            style={{ width: '100%' }}
            value={form.title}
            onChange={f('title')}
            placeholder="Titel eller kort beskrivning"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            {lbl('År start')}
            <input type="number" className="input" style={{ width: '100%' }} value={form.year_start} onChange={f('year_start')} placeholder="1989" min={1900} max={2100} />
          </div>
          <div>
            {lbl('År slut')}
            <input type="number" className="input" style={{ width: '100%' }} value={form.year_end} onChange={f('year_end')} placeholder="1991" min={1900} max={2100} />
          </div>
          <div>
            {lbl('Plats')}
            <input type="text" className="input" style={{ width: '100%' }} value={form.location} onChange={f('location')} placeholder="Stockholm" />
          </div>
        </div>

        <div>
          {lbl('Utökad beskrivning')}
          <textarea
            className="input"
            rows={4}
            style={{ width: '100%', resize: 'vertical' }}
            value={form.description}
            onChange={f('description')}
            placeholder="Valfri utökad text..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar...' : 'Spara post'}
          </button>
          <Link href="/admin/biography">
            <button type="button" className="btn">Avbryt</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
