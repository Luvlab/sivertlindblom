'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface FlipbookEntry {
  slug: string
  title: string
  subtitle: string | null
  location: string
  pdf_url: string | null
  published: boolean
}

const LOCATIONS: { key: string; label: string }[] = [
  { key: 'watercolors', label: 'Akvareller' },
  { key: 'ararat', label: 'ARARAT' },
  { key: 'publicerat', label: 'Publicerat' },
]

export default function AdminFlipbooks() {
  const [items, setItems] = useState<FlipbookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/flipbooks')
      .then(r => r.json())
      .then((d: FlipbookEntry[] | { error: string }) => { if (!('error' in d)) setItems(d) })
      .finally(() => setLoading(false))
  }, [])

  async function addEntry(location: string) {
    setCreating(location)
    try {
      const res = await fetch('/api/admin/flipbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Ny flipbook', location }),
      })
      const data = await res.json() as FlipbookEntry & { error?: string }
      if (res.ok && !data.error) setItems(prev => [...prev, data])
    } finally {
      setCreating(null)
    }
  }

  const thStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem 0.6rem 0', color: 'var(--color-muted)', fontWeight: 400,
    textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem', textAlign: 'left',
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Flipbooks</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          Bläddringsbara PDF:er (kataloger, tidskriftsartiklar, manuskript) som visas som sidvändningsböcker på sajten.
        </p>
      </div>

      {loading ? <p style={{ color: 'var(--color-muted)' }}>Laddar…</p> : (
        LOCATIONS.map(loc => {
          const rows = items.filter(i => i.location === loc.key)
          return (
            <section key={loc.key} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)' }}>{loc.label}</h2>
                <button className="btn" style={{ fontSize: '0.7rem' }} onClick={() => addEntry(loc.key)} disabled={creating === loc.key}>
                  {creating === loc.key ? 'Skapar…' : '+ Lägg till'}
                </button>
              </div>
              {rows.length === 0 ? (
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', fontStyle: 'italic' }}>Inga poster ännu.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <th style={thStyle}>Titel</th>
                      <th style={thStyle}>PDF</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.slug} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.75rem 0.75rem 0.75rem 0', fontSize: 'var(--fs-sm)' }}>
                          {r.title}
                          {r.subtitle && <span style={{ color: 'var(--color-muted)' }}> — {r.subtitle}</span>}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: 'var(--fs-xs)', color: r.pdf_url ? 'var(--color-accent)' : 'var(--color-muted)' }}>
                          {r.pdf_url ? '📄 Uppladdad' : 'Saknas'}
                        </td>
                        <td style={{ padding: '0.75rem', fontSize: 'var(--fs-xs)', color: r.published ? 'var(--color-accent)' : 'var(--color-muted)' }}>
                          {r.published ? 'Publicerad' : 'Dold'}
                        </td>
                        <td style={{ padding: '0.75rem 0 0.75rem 0.75rem' }}>
                          <Link href={`/admin/flipbooks/${r.slug}`}>
                            <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em' }}>Redigera</button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )
        })
      )}
    </div>
  )
}
