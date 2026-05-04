'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

const MOCK_WORKS = [
  { id: '1', title: 'Blasieholmstorg — Hästar i brons', category: 'public_exterior', year_start: 1989, location: 'Stockholm', published: true },
  { id: '2', title: 'Gustav Adolfs torg, fontäner',    category: 'public_exterior', year_start: 2002, location: 'Malmö',     published: true },
  { id: '3', title: 'Nobelmonument',                   category: 'public_exterior', year_start: 2003, location: 'New York',  published: true },
  { id: '4', title: 'Sergels torg — Sergel monumentet',category: 'public_exterior', year_start: 1998, location: 'Stockholm', published: true },
  { id: '5', title: 'Vandalorum',                      category: 'exhibition',      year_start: 2016, location: 'Värnamo',  published: true },
  { id: '6', title: 'Kungl. Konstakademien',           category: 'exhibition',      year_start: 2012, location: 'Stockholm', published: true },
  { id: '7', title: 'Lunds Konsthall',                 category: 'exhibition',      year_start: 1993, location: 'Lund',      published: true },
  { id: '8', title: 'Moderna Museet — Live Show',      category: 'exhibition',      year_start: 1974, location: 'Stockholm', published: true },
  { id: '9', title: 'Akvareller 1975–2012',            category: 'watercolor',      year_start: 1975, location: '',          published: true },
  { id: '10',title: 'Nobel Forum',                     category: 'public_interior', year_start: 1993, location: 'Solna',     published: true },
]

const CAT_LABELS: Record<string, string> = {
  exhibition:      'Utställning',
  public_exterior: 'Offentlig exteriör',
  public_interior: 'Offentlig interiör',
  scenography:     'Scenografi',
  watercolor:      'Akvarell',
  sculpture:       'Skulptur',
  graphic:         'Grafik',
}

export default function AdminWorks() {
  const [filter, setFilter] = useState('')
  const [cat, setCat] = useState('')

  const filtered = MOCK_WORKS
    .filter(w => !filter || w.title.toLowerCase().includes(filter.toLowerCase()))
    .filter(w => !cat || w.category === cat)

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Verk</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{MOCK_WORKS.length} verk i databasen</p>
        </div>
        <Link href="/admin/works/new">
          <button className="btn btn-primary">+ Nytt verk</button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök verk..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select
          className="input"
          value={cat}
          onChange={e => setCat(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">Alla kategorier</option>
          {Object.entries(CAT_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem 0.75rem 0', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>Titel</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>Kategori</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>År</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>Plats</th>
              <th style={{ padding: '0.75rem 1rem', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>Status</th>
              <th style={{ padding: '0.75rem 0 0.75rem 1rem', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.9rem 1rem 0.9rem 0' }}>{w.title}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span className="badge">{CAT_LABELS[w.category] || w.category}</span>
                </td>
                <td style={{ padding: '0.9rem 1rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{w.year_start}</td>
                <td style={{ padding: '0.9rem 1rem', color: 'var(--color-muted)' }}>{w.location || '—'}</td>
                <td style={{ padding: '0.9rem 1rem' }}>
                  <span style={{ color: w.published ? 'var(--color-accent)' : 'var(--color-muted)', fontSize: 'var(--fs-xs)' }}>
                    {w.published ? '● Publicerad' : '○ Utkast'}
                  </span>
                </td>
                <td style={{ padding: '0.9rem 0 0.9rem 1rem' }}>
                  <Link href={`/admin/works/${w.id}`}>
                    <button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
          Inga verk hittades.
        </div>
      )}
    </div>
  )
}
