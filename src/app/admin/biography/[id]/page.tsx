'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BioEntry {
  id: string
  entry_type: 'education' | 'position' | 'award' | 'public_commission' | 'group_exhibition' | 'publication' | 'personal'
  year_start?: number
  year_end?: number
  title: string
  description?: string
  location?: string
  sort_order: number
}

const TYPE_LABELS = {
  personal: 'Personligt', education: 'Utbildning', position: 'Tjänst/Uppdrag',
  award: 'Pris/Utmärkelse', public_commission: 'Offentligt uppdrag',
  group_exhibition: 'Grupputställning', publication: 'Publikation',
}

const inp: React.CSSProperties = { width: '100%' }
const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

export default function EditBioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<BioEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/biography/${id}`)
      .then(r => r.json())
      .then((d: BioEntry | { error: string }) => {
        if ('error' in d) setError(d.error)
        else setForm(d)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof BioEntry>(key: K, val: BioEntry[K]) {
    setForm(prev => prev ? { ...prev, [key]: val } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/biography/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { ok?: boolean; message?: string; error?: string }
      if (data.ok) { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error ?? data.message ?? 'Fel vid sparning')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}"?`)) return
    await fetch(`/api/admin/biography/${id}`, { method: 'DELETE' })
    router.push('/admin/biography')
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>{error ?? 'Hittades inte'}</div>

  return (
    <div style={{ padding: '3rem', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/biography" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Biografi</Link>
        {dirty && <span style={{ fontSize: 'var(--fs-xs)', color: '#f0a' }}>● Osparade ändringar</span>}
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '2rem' }}>Redigera biografipost</h1>

      {error && <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>{error}</div>}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            {lbl('Typ')}
            <select className="input" style={inp} value={form.entry_type} onChange={e => set('entry_type', e.target.value as BioEntry['entry_type'])}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            {lbl('År från')}
            <input className="input" type="number" style={inp} value={form.year_start ?? ''} onChange={e => set('year_start', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div>
            {lbl('År till')}
            <input className="input" type="number" style={inp} value={form.year_end ?? ''} onChange={e => set('year_end', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>

        <div>
          {lbl('Titel')}
          <input className="input" style={inp} value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>

        <div>
          {lbl('Plats')}
          <input className="input" style={inp} value={form.location ?? ''} onChange={e => set('location', e.target.value)} />
        </div>

        <div>
          {lbl('Beskrivning')}
          <textarea className="input" rows={4} style={{ ...inp, resize: 'vertical' }} value={form.description ?? ''} onChange={e => set('description', e.target.value)} />
        </div>

        <div>
          {lbl('Sorteringsordning')}
          <input className="input" type="number" style={{ width: 120 }} value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sparar…' : 'Spara post'}</button>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          <button type="button" onClick={handleDelete}
            style={{ marginLeft: 'auto', background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.5em 1em', fontSize: 'var(--fs-xs)' }}>
            Radera
          </button>
        </div>
      </form>
    </div>
  )
}
