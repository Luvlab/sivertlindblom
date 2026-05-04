'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { TextItem } from '@/lib/texts-data'

const TYPE_LABELS: Record<string, string> = {
  essay: 'Essay', preface: 'Förord', review: 'Recension',
  interview: 'Intervju', own_writing: 'Egen text', translated: 'Översatt',
}

const LANG_LABELS: Record<string, string> = { sv: 'SV', en: 'EN', de: 'DE', fr: 'FR', it: 'IT' }

export default function AdminTexts() {
  const [items, setItems] = useState<TextItem[]>([])
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/texts')
      .then(r => r.json())
      .then((data: TextItem[] | { error: string }) => {
        if ('error' in data) setError(data.error)
        else setItems(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items
    .filter(t => !filter ||
      t.title.toLowerCase().includes(filter.toLowerCase()) ||
      t.author.toLowerCase().includes(filter.toLowerCase())
    )
    .filter(t => !typeFilter || t.type === typeFilter)
    .sort((a, b) => b.year - a.year)

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Texter</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar...' : `${items.length} texter`}
          </p>
        </div>
        <Link href="/admin/texts/new">
          <button className="btn btn-primary">+ Ny text</button>
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
          placeholder="Sök titel, författare..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 280 }}
        />
        <select
          className="input"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ maxWidth: 200 }}
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Titel', 'Författare', 'Typ', 'År', 'Språk', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem 0.75rem 0', color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr
                  key={t.slug}
                  style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem 0.85rem 0', maxWidth: 320 }}>{t.title}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-muted)' }}>{t.author}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge">{TYPE_LABELS[t.type] ?? t.type}</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{t.year}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className="badge">{LANG_LABELS[t.lang] ?? t.lang.toUpperCase()}</span>
                  </td>
                  <td style={{ padding: '0.85rem 0 0.85rem 1rem' }}>
                    <Link href={`/admin/texts/${t.slug}`}>
                      <button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
          Inga texter hittades.
        </div>
      )}
    </div>
  )
}
