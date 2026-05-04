'use client'

import { useState, useEffect } from 'react'
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

export default function AdminMap() {
  const [pins, setPins] = useState<Pin[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/map-pins')
      .then(r => r.json())
      .then((d: Pin[] | { error: string }) => { if (!('error' in d)) setPins(d) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = pins.filter(p =>
    !filter || p.title.toLowerCase().includes(filter.toLowerCase()) || p.city.toLowerCase().includes(filter.toLowerCase())
  )

  const thStyle: React.CSSProperties = {
    padding: '0.75rem 0.75rem 0.75rem 0',
    color: 'var(--color-muted)', fontWeight: 400,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    fontSize: '0.7rem', textAlign: 'left', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Karta — Platser</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{pins.length} kartnålar</p>
        </div>
        <Link href="/admin/map/new">
          <button className="btn btn-primary">+ Ny kartnål</button>
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input type="search" className="input" placeholder="Sök titel, stad…" value={filter}
          onChange={e => setFilter(e.target.value)} style={{ maxWidth: 300 }} />
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={thStyle}>Titel</th>
                <th style={thStyle}>År</th>
                <th style={thStyle}>Stad</th>
                <th style={thStyle}>Land</th>
                <th style={thStyle}>Typ</th>
                <th style={thStyle}>Lat</th>
                <th style={thStyle}>Lng</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.8rem 0.75rem 0.8rem 0' }}>{p.title}</td>
                  <td style={{ padding: '0.8rem 0.75rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{p.year}</td>
                  <td style={{ padding: '0.8rem 0.75rem', color: 'var(--color-muted)' }}>{p.city}</td>
                  <td style={{ padding: '0.8rem 0.75rem', color: 'var(--color-muted)' }}>{p.country}</td>
                  <td style={{ padding: '0.8rem 0.75rem' }}>
                    <span className="badge">{p.type}</span>
                  </td>
                  <td style={{ padding: '0.8rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-muted)' }}>{p.lat.toFixed(4)}</td>
                  <td style={{ padding: '0.8rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-muted)' }}>{p.lng.toFixed(4)}</td>
                  <td style={{ padding: '0.8rem 0 0.8rem 0.75rem' }}>
                    <Link href={`/admin/map/${p.id}`}>
                      <button className="btn" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em' }}>Redigera</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)' }}>Inga platser hittades.</p>
          )}
        </div>
      )}
    </div>
  )
}
