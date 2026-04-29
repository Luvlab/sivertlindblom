'use client'

import { useState } from 'react'
import Link from 'next/link'

const MOCK_BIO = [
  { id:'1', entry_type:'personal',   year_start:1931, title:'Född i Husby-Rekarne, Södermanland' },
  { id:'2', entry_type:'education',  year_start:1945, year_end:1949, title:'Teknisk utbildning', location:'Eskilstuna' },
  { id:'3', entry_type:'education',  year_start:1958, year_end:1963, title:'Kungliga Konsthögskolan', location:'Stockholm' },
  { id:'4', entry_type:'position',   year_start:1957, year_end:1974, title:'Samarbete med arkitekt Peter Celsing' },
  { id:'5', entry_type:'position',   year_start:1991, title:'Professor i skulptur, Kungliga Konsthögskolan' },
  { id:'6', entry_type:'award',      year_start:1985, title:'Stenpriset, Sveriges Stenindustrifförbund' },
  { id:'7', entry_type:'award',      year_start:1995, title:'Sergelpriset', location:'Stockholm' },
  { id:'8', entry_type:'public_commission', year_start:1989, title:'Blasieholmstorg — Hästar i brons', location:'Stockholm' },
  { id:'9', entry_type:'public_commission', year_start:2002, title:'Gustav Adolfs torg, fontäner', location:'Malmö' },
  { id:'10',entry_type:'public_commission', year_start:2003, title:'Nobelmonument', location:'New York' },
]

const TYPE_LABELS: Record<string, string> = {
  personal:'Personligt', education:'Utbildning', position:'Tjänst/Uppdrag',
  award:'Pris/Utmärkelse', public_commission:'Offentligt uppdrag',
  group_exhibition:'Grupputställning', publication:'Publikation',
}

export default function AdminBiography() {
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const filtered = MOCK_BIO
    .filter(b => !filter || b.title.toLowerCase().includes(filter.toLowerCase()))
    .filter(b => !typeFilter || b.entry_type === typeFilter)

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Biografi</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{MOCK_BIO.length} poster</p>
        </div>
        <Link href="/admin/biography/new">
          <button className="btn btn-primary">+ Ny post</button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input type="search" className="input" placeholder="Sök..." value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 260 }} />
        <select className="input" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">Alla typer</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div>
        {filtered.map((b) => (
          <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto auto', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-border)', transition: 'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
              {b.year_start}{b.year_end ? `–${b.year_end}` : ''}
            </span>
            <div>
              <div style={{ fontSize: 'var(--fs-sm)' }}>{b.title}</div>
              {'location' in b && b.location && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{b.location}</div>}
            </div>
            <span className="badge">{TYPE_LABELS[b.entry_type]}</span>
            <Link href={`/admin/biography/${b.id}`}>
              <button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
