'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { ScenographyWork } from '@/app/api/admin/scenography/route'

export default function AdminScenography() {
  const [works, setWorks] = useState<ScenographyWork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/admin/scenography')
      .then(r => r.json())
      .then((d: ScenographyWork[] | { error: string }) => {
        if (!('error' in d)) setWorks(d)
        else setError(String((d as { error: string }).error))
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = works.filter(w =>
    !filter ||
    w.title.toLowerCase().includes(filter.toLowerCase()) ||
    w.venue.toLowerCase().includes(filter.toLowerCase()) ||
    String(w.year ?? '').includes(filter)
  )

  const thStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem 0.5rem 0',
    color: 'var(--color-muted)',
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: '0.7rem',
    textAlign: 'left',
    whiteSpace: 'nowrap',
  }

  const theater = filtered.filter(w => w.type === 'Teaterscenografi')
  const choreo = filtered.filter(w => w.type === 'Koreografi')

  function renderRows(list: ScenographyWork[]) {
    return list.map(w => (
      <tr key={w.slug} style={{ borderBottom: '1px solid var(--color-border)' }}>
        <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', width: 56 }}>
          {w.images[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={w.images[0].url}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              style={{ display: 'block', width: 48, height: 48, objectFit: 'cover', borderRadius: 2, background: 'var(--color-bg-card)' }}
              onError={ev => { (ev.target as HTMLImageElement).style.visibility = 'hidden' }}
            />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 2, background: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, opacity: 0.2 }}>□</span>
            </div>
          )}
        </td>
        <td style={{ padding: '0.75rem 0.75rem 0.75rem 0', fontSize: 'var(--fs-sm)' }}>
          {w.title}
          {!w.published && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', color: '#f88' }}>opublicerad</span>
          )}
        </td>
        <td style={{ padding: '0.75rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', width: 60 }}>
          {w.year ?? '—'}
        </td>
        <td style={{ padding: '0.75rem', color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          {w.venue || '—'}
        </td>
        <td style={{ padding: '0.75rem', width: 60, textAlign: 'center' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>
            {w.images.length} 🖼
          </span>
        </td>
        <td style={{ padding: '0.75rem 0 0.75rem 0.75rem' }}>
          <Link href={`/admin/scenography/${w.slug}`}>
            <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em' }}>
              Redigera
            </button>
          </Link>
        </td>
      </tr>
    ))
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>
            Scenografi
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {works.length} verk · {works.filter(w => w.type === 'Teaterscenografi').length} teater · {works.filter(w => w.type === 'Koreografi').length} koreografi
          </p>
        </div>
        <Link href="/admin/scenography/new">
          <button className="btn btn-primary">+ Nytt verk</button>
        </Link>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="search"
          className="input"
          placeholder="Filtrera…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : (
        <>
          {/* Teaterscenografi */}
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)' }}>Teaterscenografi</h2>
              <Link href="/admin/scenography/new?type=Teaterscenografi">
                <button className="btn" style={{ fontSize: '0.7rem' }}>+ Lägg till</button>
              </Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ ...thStyle, width: 56 }}></th>
                  <th style={thStyle}>Titel</th>
                  <th style={{ ...thStyle, width: 60 }}>År</th>
                  <th style={thStyle}>Scen / Koreograf</th>
                  <th style={{ ...thStyle, width: 60, textAlign: 'center' }}>Bilder</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {theater.length === 0
                  ? <tr><td colSpan={6} style={{ padding: '1rem 0', color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>Inga verk</td></tr>
                  : renderRows(theater)
                }
              </tbody>
            </table>
          </section>

          {/* Koreografi */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)' }}>Koreografi</h2>
              <Link href="/admin/scenography/new?type=Koreografi">
                <button className="btn" style={{ fontSize: '0.7rem' }}>+ Lägg till</button>
              </Link>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ ...thStyle, width: 56 }}></th>
                  <th style={thStyle}>Titel</th>
                  <th style={{ ...thStyle, width: 60 }}>År</th>
                  <th style={thStyle}>Scen / Koreograf</th>
                  <th style={{ ...thStyle, width: 60, textAlign: 'center' }}>Bilder</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {choreo.length === 0
                  ? <tr><td colSpan={6} style={{ padding: '1rem 0', color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>Inga verk</td></tr>
                  : renderRows(choreo)
                }
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  )
}
