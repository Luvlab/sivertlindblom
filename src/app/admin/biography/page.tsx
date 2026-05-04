'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BioCmsEntry {
  id: string
  entry_type: string
  year_start?: number
  year_end?: number
  title: string
  description?: string
  location?: string
}

const TYPE_LABELS: Record<string, string> = {
  personal: 'Personligt', education: 'Utbildning', position: 'Tjänst/Uppdrag',
  award: 'Pris/Utmärkelse', public_commission: 'Offentligt uppdrag',
  group_exhibition: 'Grupputställning', publication: 'Publikation',
}

export default function AdminBiography() {
  const [items, setItems] = useState<BioCmsEntry[]>([])
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/biography')
      .then(r => r.json())
      .then((data: BioCmsEntry[] | { error: string }) => {
        if ('error' in data) setError(data.error)
        else setItems(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items
    .filter(b => !filter || b.title.toLowerCase().includes(filter.toLowerCase()))
    .filter(b => !typeFilter || b.entry_type === typeFilter)
    .sort((a, b) => (b.year_start ?? 0) - (a.year_start ?? 0))

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Biografi</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar...' : `${items.length} poster`}
          </p>
        </div>
        <Link href="/admin/biography/new">
          <button className="btn btn-primary">+ Ny post</button>
        </Link>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <select
          className="input"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">Alla typer</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)', padding: '2rem 0' }}>Laddar...</p>
      ) : (
        <div>
          {filtered.map(b => (
            <div
              key={b.id}
              style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto auto', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-border)', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
                {b.year_start}{b.year_end ? `–${b.year_end}` : ''}
              </span>
              <div>
                <div style={{ fontSize: 'var(--fs-sm)' }}>{b.title}</div>
                {b.location && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{b.location}</div>
                )}
              </div>
              <span className="badge">{TYPE_LABELS[b.entry_type] ?? b.entry_type}</span>
              <Link href={`/admin/biography/${b.id}`}>
                <button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
          Inga poster hittades.
        </div>
      )}
    </div>
  )
}
