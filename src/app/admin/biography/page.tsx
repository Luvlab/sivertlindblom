'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const PORTRAIT_URL = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Portratt-SivertMattias.jpg'

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

  // Intro text (stored in settings as biography_intro)
  const [intro, setIntro] = useState('')
  const [introSaving, setIntroSaving] = useState(false)
  const [introSaved, setIntroSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/biography')
      .then(r => r.json())
      .then((data: BioCmsEntry[] | { error: string }) => {
        if ('error' in data) setError(data.error)
        else setItems(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))

    // Load intro text from settings
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((s: Record<string, string>) => { if (s.biography_intro) setIntro(s.biography_intro) })
      .catch(() => {})
  }, [])

  const saveIntro = useCallback(async () => {
    setIntroSaving(true)
    try {
      const settingsRes = await fetch('/api/admin/settings')
      const current = await settingsRes.json() as Record<string, string>
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, biography_intro: intro }),
      })
      setIntroSaved(true)
      setTimeout(() => setIntroSaved(false), 3000)
    } catch { /* ignore */ }
    finally { setIntroSaving(false) }
  }, [intro])

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

      {/* ── Page intro editor ── */}
      <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', marginBottom: '2.5rem', borderRadius: 2 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>Sidans introduktionstext</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {introSaved && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>✓ Sparad</span>}
            <button className="btn btn-primary" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }} onClick={saveIntro} disabled={introSaving}>
              {introSaving ? 'Sparar…' : 'Spara text'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem', alignItems: 'flex-start' }}>
          <textarea
            className="input"
            rows={5}
            value={intro}
            onChange={e => setIntro(e.target.value)}
            placeholder="Skriv en kort presentation av Sivert Lindblom som visas längst upp på biografisidan…"
            style={{ flex: 1, resize: 'vertical', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}
          />
          {/* Portrait preview */}
          <div style={{ flexShrink: 0, width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT_URL} alt="Sivert Lindblom" style={{ width: 100, height: 120, objectFit: 'cover', objectPosition: 'top center', borderRadius: 2, border: '1px solid var(--color-border)', display: 'block' }} />
            <span style={{ fontSize: '0.6rem', color: 'var(--color-muted)', textAlign: 'center' }}>Porträtt (visas till höger om texten)</span>
          </div>
        </div>
      </div>

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
