'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Exhibition } from '@/lib/exhibitions-data'

export default function AdminExhibitions() {
  const [items, setItems] = useState<Exhibition[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/exhibitions')
      .then(r => r.json())
      .then((data: Exhibition[] | { error: string }) => {
        if ('error' in data) {
          setError(String(data.error))
        } else {
          setItems(data)
        }
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(e =>
    !filter ||
    e.title.toLowerCase().includes(filter.toLowerCase()) ||
    e.location.toLowerCase().includes(filter.toLowerCase()) ||
    String(e.year).includes(filter)
  )

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Utställningar</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar...' : `${items.length} utställningar`}
          </p>
        </div>
        <Link href="/admin/exhibitions/new">
          <button className="btn btn-primary">+ Ny utställning</button>
        </Link>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök titel, plats, år..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['År', 'Titel', 'Plats', 'Bilder', ''].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem 0.75rem 0', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr
                key={e.slug}
                style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.1s' }}
                onMouseEnter={ev => (ev.currentTarget.style.background = 'var(--color-bg-card)')}
                onMouseLeave={ev => (ev.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.85rem 1rem 0.85rem 0', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', width: '4rem' }}>{e.year}</td>
                <td style={{ padding: '0.85rem 1rem', maxWidth: 340 }}>{e.title}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--color-muted)' }}>{e.location}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--color-muted)' }}>{e.images.length}</td>
                <td style={{ padding: '0.85rem 0 0.85rem 1rem' }}>
                  <Link href={`/admin/exhibitions/${e.slug}`}>
                    <button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
          Inga utställningar hittades.
        </div>
      )}
    </div>
  )
}
