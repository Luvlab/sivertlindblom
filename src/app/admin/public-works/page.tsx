'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WorkEntry {
  title: string
  year: number
  location: string
  slug?: string
  section: 'exterior' | 'interior'
}

export default function AdminPublicWorks() {
  const [works, setWorks] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/public-works')
      .then(r => r.json())
      .then((d: WorkEntry[] | { error: string }) => { if (!('error' in d)) setWorks(d) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = works.filter(w =>
    !filter || w.title.toLowerCase().includes(filter.toLowerCase()) || w.location.toLowerCase().includes(filter.toLowerCase())
  )

  function updateField(idx: number, key: keyof WorkEntry, val: string | number) {
    setWorks(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: val }
      return next
    })
  }

  function addEntry(section: 'exterior' | 'interior') {
    setWorks(prev => [...prev, { title: 'Ny post', year: new Date().getFullYear(), location: '', section }])
  }

  function removeEntry(idx: number) {
    if (!confirm('Ta bort denna post?')) return
    setWorks(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/public-works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(works),
      })
      const data = await res.json() as { ok?: boolean; message?: string; error?: string }
      if (data.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error ?? data.message ?? 'Fel')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  const exteriors = works.map((w, i) => ({ ...w, _idx: i })).filter(w => w.section === 'exterior')
  const interiors = works.map((w, i) => ({ ...w, _idx: i })).filter(w => w.section === 'interior')

  const thStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem 0.6rem 0', color: 'var(--color-muted)', fontWeight: 400,
    textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem', textAlign: 'left',
  }

  function renderRows(list: (WorkEntry & { _idx: number })[]) {
    return list.map(w => (
      <tr key={w._idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
        {editing === w._idx ? (
          <>
            <td style={{ padding: '0.5rem 0.75rem 0.5rem 0' }}>
              <input className="input" style={{ width: '100%', fontSize: 'var(--fs-sm)' }}
                value={w.title} onChange={e => updateField(w._idx, 'title', e.target.value)} />
            </td>
            <td style={{ padding: '0.5rem 0.75rem', width: 80 }}>
              <input className="input" type="number" style={{ width: '100%', fontSize: 'var(--fs-sm)' }}
                value={w.year} onChange={e => updateField(w._idx, 'year', Number(e.target.value))} />
            </td>
            <td style={{ padding: '0.5rem 0.75rem' }}>
              <input className="input" style={{ width: '100%', fontSize: 'var(--fs-sm)' }}
                value={w.location} onChange={e => updateField(w._idx, 'location', e.target.value)} />
            </td>
            <td style={{ padding: '0.5rem 0.75rem' }}>
              <input className="input" style={{ width: '100%', fontSize: 'var(--fs-sm)' }}
                value={w.slug ?? ''} onChange={e => updateField(w._idx, 'slug', e.target.value)} placeholder="valfri-slug" />
            </td>
            <td style={{ padding: '0.5rem 0 0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
              <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.3em 0.7em', marginRight: 6 }}
                onClick={() => setEditing(null)}>✓</button>
              <button onClick={() => removeEntry(w._idx)}
                style={{ background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.3em 0.6em', fontSize: '0.7rem' }}>✕</button>
            </td>
          </>
        ) : (
          <>
            <td style={{ padding: '0.75rem 0.75rem 0.75rem 0', fontSize: 'var(--fs-sm)' }}>{w.title}</td>
            <td style={{ padding: '0.75rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{w.year}</td>
            <td style={{ padding: '0.75rem', color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{w.location || '—'}</td>
            <td style={{ padding: '0.75rem', color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{w.slug || '—'}</td>
            <td style={{ padding: '0.75rem 0 0.75rem 0.75rem' }}>
              <button className="btn" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em' }}
                onClick={() => setEditing(w._idx)}>Redigera</button>
            </td>
          </>
        )}
      </tr>
    ))
  }

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Offentliga arbeten</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{works.length} poster</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          {error && <span style={{ color: '#f88', fontSize: 'var(--fs-sm)' }}>{error}</span>}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Sparar…' : 'Spara alla ändringar'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input type="search" className="input" placeholder="Filtrera…" value={filter}
          onChange={e => setFilter(e.target.value)} style={{ maxWidth: 300 }} />
      </div>

      {loading ? <p style={{ color: 'var(--color-muted)' }}>Laddar…</p> : (
        <>
          {/* Exteriors */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)' }}>Exteriörer</h2>
              <button className="btn" style={{ fontSize: '0.7rem' }} onClick={() => addEntry('exterior')}>+ Lägg till</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={thStyle}>Titel</th>
                  <th style={{ ...thStyle, width: 80 }}>År</th>
                  <th style={thStyle}>Plats</th>
                  <th style={thStyle}>Slug</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>{renderRows(filtered.map((w, i) => ({ ...w, _idx: works.indexOf(w) })).filter(w => w.section === 'exterior'))}</tbody>
            </table>
          </section>

          {/* Interiors */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)' }}>Interiörer</h2>
              <button className="btn" style={{ fontSize: '0.7rem' }} onClick={() => addEntry('interior')}>+ Lägg till</button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={thStyle}>Titel</th>
                  <th style={{ ...thStyle, width: 80 }}>År</th>
                  <th style={thStyle}>Plats</th>
                  <th style={thStyle}>Slug</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>{renderRows(filtered.map((w) => ({ ...w, _idx: works.indexOf(w) })).filter(w => w.section === 'interior'))}</tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}
