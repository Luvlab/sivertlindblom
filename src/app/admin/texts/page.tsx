'use client'

import { useState } from 'react'
import Link from 'next/link'

const MOCK_TEXTS = [
  { id: '1', title: 'Text till katalog, Akvareller m.m.',              author: 'Peter Cornell',          text_type: 'essay',       year: 2012, language: 'sv', published: true },
  { id: '2', title: 'Förord, Skulptur, Lunds Konsthall',               author: 'Daniel Birnbaum',        text_type: 'preface',     year: 1993, language: 'sv', published: true },
  { id: '3', title: 'Text, Skulptur Arkitektur, Skissernas Museum',    author: 'Stefan Alenius',         text_type: 'essay',       year: 1993, language: 'sv', published: true },
  { id: '4', title: 'Om Sivert Lindblom, Kungl. Konstakademien',       author: 'Ingela Lind',            text_type: 'review',      year: 2012, language: 'sv', published: true },
  { id: '5', title: 'Blasieholms torg',                                author: 'Rebecka Tarschys',       text_type: 'review',      year: 1989, language: 'sv', published: true },
  { id: '6', title: 'Samtal med Sivert Lindblom',                      author: 'Beate Sydhoff',          text_type: 'interview',   year: 1967, language: 'sv', published: true },
  { id: '7', title: 'Katalogtext, Live Show, Moderna Museet',          author: 'Sivert Lindblom',        text_type: 'own_writing', year: 1974, language: 'sv', published: true },
  { id: '8', title: 'A Conversation with Sivert Lindblom',             author: 'Beate Sydhoff',          text_type: 'translated',  year: 1967, language: 'en', published: true },
  { id: '9', title: 'Intervju med Sivert Lindblom',                    author: 'Red.',                   text_type: 'interview',   year: 1983, language: 'sv', published: true },
]

const TYPE_LABELS: Record<string, string> = {
  essay: 'Essay', preface: 'Förord', review: 'Recension',
  interview: 'Intervju', own_writing: 'Egen text', translated: 'Översatt',
}

export default function AdminTexts() {
  const [filter, setFilter] = useState('')

  const filtered = MOCK_TEXTS.filter(t =>
    !filter || t.title.toLowerCase().includes(filter.toLowerCase()) || t.author?.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Texter</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{MOCK_TEXTS.length} texter i databasen</p>
        </div>
        <Link href="/admin/texts/new">
          <button className="btn btn-primary">+ Ny text</button>
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input type="search" className="input" placeholder="Sök texter, författare..." value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 320 }} />
      </div>

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
            {filtered.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '0.85rem 1rem 0.85rem 0', maxWidth: 300 }}>{t.title}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--color-muted)' }}>{t.author}</td>
                <td style={{ padding: '0.85rem 1rem' }}><span className="badge">{TYPE_LABELS[t.text_type]}</span></td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{t.year}</td>
                <td style={{ padding: '0.85rem 1rem' }}><span className="badge">{t.language.toUpperCase()}</span></td>
                <td style={{ padding: '0.85rem 0 0.85rem 1rem' }}>
                  <Link href={`/admin/texts/${t.id}`}><button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
