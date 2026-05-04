'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Pin {
  id: string
  title: string
  year: number
  city: string
  country: string
  lat: number
  lng: number
  type: 'exterior' | 'interior' | 'metro'
  slug?: string
  description?: string
}

const inp: React.CSSProperties = { width: '100%' }
const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

export default function EditMapPinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<Pin | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  const isNew = id === 'new'

  useEffect(() => {
    if (isNew) {
      setForm({ id: '', title: '', year: new Date().getFullYear(), city: '', country: 'Sweden', lat: 59.33, lng: 18.07, type: 'exterior', description: '' })
      setLoading(false)
      return
    }
    fetch(`/api/admin/map-pins/${id}`)
      .then(r => r.json())
      .then((d: Pin | { error: string }) => {
        if ('error' in d) setError(d.error)
        else setForm(d)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [id, isNew])

  function set<K extends keyof Pin>(key: K, val: Pin[K]) {
    setForm(prev => prev ? { ...prev, [key]: val } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const url = isNew ? '/api/admin/map-pins' : `/api/admin/map-pins/${id}`
      const method = isNew ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { ok?: boolean; message?: string; error?: string; id?: string }
      if (data.ok) {
        setSaved(true); setDirty(false)
        setTimeout(() => setSaved(false), 3000)
        if (isNew && data.id) router.replace(`/admin/map/${data.id}`)
      } else {
        setError(data.error ?? data.message ?? 'Fel vid sparning')
      }
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}" från kartan?`)) return
    await fetch(`/api/admin/map-pins/${id}`, { method: 'DELETE' })
    router.push('/admin/map')
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>{error ?? 'Hittades inte'}</div>

  return (
    <div style={{ padding: '3rem', maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/map" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Karta</Link>
        {dirty && <span style={{ fontSize: 'var(--fs-xs)', color: '#f0a' }}>● Osparade ändringar</span>}
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '2rem' }}>
        {isNew ? 'Ny kartnål' : 'Redigera kartnål'}
      </h1>

      {error && <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>{error}</div>}
      {saved && !error && (
        <div style={{ background: '#001a0a', border: '1px solid var(--color-accent)', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: 'var(--color-accent)' }}>
          ✓ Sparad — kartan uppdateras vid nästa rebuild
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          {lbl('Titel')}
          <input className="input" style={inp} value={form.title} onChange={e => set('title', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            {lbl('År')}
            <input className="input" type="number" style={inp} value={form.year} onChange={e => set('year', Number(e.target.value))} required />
          </div>
          <div>
            {lbl('Stad')}
            <input className="input" style={inp} value={form.city} onChange={e => set('city', e.target.value)} />
          </div>
          <div>
            {lbl('Land')}
            <input className="input" style={inp} value={form.country} onChange={e => set('country', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            {lbl('Latitud')}
            <input className="input" type="number" step="0.0001" style={inp} value={form.lat} onChange={e => set('lat', Number(e.target.value))} required />
          </div>
          <div>
            {lbl('Longitud')}
            <input className="input" type="number" step="0.0001" style={inp} value={form.lng} onChange={e => set('lng', Number(e.target.value))} required />
          </div>
          <div>
            {lbl('Typ')}
            <select className="input" style={inp} value={form.type} onChange={e => set('type', e.target.value as Pin['type'])}>
              <option value="exterior">Exteriör</option>
              <option value="interior">Interiör</option>
              <option value="metro">T-bana</option>
            </select>
          </div>
        </div>

        <div>
          {lbl('Slug (länk till detaljsida, valfri)')}
          <input className="input" style={inp} value={form.slug ?? ''} onChange={e => set('slug', e.target.value)} placeholder="t.ex. blasieholmstorg-1989" />
        </div>

        <div>
          {lbl('Beskrivning')}
          <textarea className="input" rows={3} style={{ ...inp, resize: 'vertical' }} value={form.description ?? ''} onChange={e => set('description', e.target.value)} />
        </div>

        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', padding: '1rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
          💡 Hitta koordinater: öppna <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>Google Maps</a>, högerklicka på platsen → klicka på koordinaterna för att kopiera.
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sparar…' : (isNew ? 'Skapa nål' : 'Spara nål')}</button>
          {!isNew && (
            <button type="button" onClick={handleDelete}
              style={{ marginLeft: 'auto', background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.5em 1em', fontSize: 'var(--fs-xs)' }}>
              Radera nål
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
