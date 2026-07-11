'use client'

import { useState, useEffect, useRef } from 'react'

interface LinkablePage { group: string; title: string; path: string }

interface Props {
  /** Called with the chosen page's internal path and title. */
  onSelect: (page: { path: string; title: string }) => void
}

// Module-level cache so we only fetch the page list once per session.
let CACHE: LinkablePage[] | null = null

/**
 * A small "pick an existing page" button that opens a searchable list of every
 * internal page on the new site (exhibitions, public works, texts, subpages…).
 * Selecting one fills in the correct internal path — no hand-typed URLs.
 */
export default function InternalPagePicker({ onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState<LinkablePage[]>(CACHE ?? [])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || CACHE) return
    setLoading(true)
    fetch('/api/admin/linkable-pages', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { pages?: LinkablePage[] }) => { CACHE = d.pages ?? []; setPages(CACHE) })
      .catch(() => setPages([]))
      .finally(() => setLoading(false))
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const needle = q.trim().toLowerCase()
  const filtered = needle
    ? pages.filter(p => p.title.toLowerCase().includes(needle) || p.path.toLowerCase().includes(needle) || p.group.toLowerCase().includes(needle))
    : pages
  const shown = filtered.slice(0, 60)

  return (
    <div ref={boxRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="btn"
        style={{ fontSize: 'var(--fs-xs)', padding: '0.35em 0.8em', whiteSpace: 'nowrap' }}
      >
        🔗 Välj befintlig sida
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 200,
            top: '100%',
            left: 0,
            marginTop: '0.35rem',
            width: 'min(420px, 90vw)',
            background: '#0d0d0d',
            border: '1px solid var(--color-border)',
            borderRadius: 3,
            boxShadow: '0 12px 40px rgba(0,0,0,.6)',
            padding: '0.6rem',
          }}
        >
          <input
            autoFocus
            className="input"
            placeholder="Sök titel eller sökväg…"
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{ width: '100%', marginBottom: '0.5rem' }}
          />
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {loading && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', padding: '0.5rem' }}>Laddar sidor…</p>}
            {!loading && shown.length === 0 && <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', padding: '0.5rem' }}>Inga sidor hittades.</p>}
            {shown.map((p) => (
              <button
                key={p.path}
                type="button"
                onClick={() => { onSelect({ path: p.path, title: p.title }); setOpen(false); setQ('') }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  padding: '0.5rem 0.4rem',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <span style={{ display: 'block', fontSize: 'var(--fs-sm)' }}>{p.title}</span>
                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-muted)' }}>
                  <span style={{ color: 'var(--color-accent)' }}>{p.group}</span> · {p.path}
                </span>
              </button>
            ))}
            {filtered.length > shown.length && (
              <p style={{ fontSize: '0.65rem', color: 'var(--color-muted)', padding: '0.5rem 0.4rem' }}>
                Visar {shown.length} av {filtered.length} — sök för att smalna av.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
