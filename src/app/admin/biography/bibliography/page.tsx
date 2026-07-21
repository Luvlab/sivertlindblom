'use client'

import { useState, useEffect } from 'react'
import AdminForm from '@/components/admin/AdminForm'
import type { BibEntry } from '@/lib/bibliography'

interface TextOption { slug: string; title: string; year: number; author?: string }

export default function AdminBibliography() {
  const [entries, setEntries] = useState<BibEntry[]>([])
  const [texts, setTexts] = useState<TextOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/bibliography', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/admin/texts', { cache: 'no-store' }).then(r => r.json()),
    ])
      .then(([bib, txts]: [BibEntry[] | { error: string }, TextOption[] | { error: string }]) => {
        if (Array.isArray(bib)) setEntries(bib)
        else if ('error' in bib) setError(String(bib.error))
        if (Array.isArray(txts)) setTexts(txts)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function update(i: number, patch: Partial<BibEntry>) {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e))
    setDirty(true)
  }
  function remove(i: number) { setEntries(prev => prev.filter((_, idx) => idx !== i)); setDirty(true) }
  function move(i: number, dir: -1 | 1) {
    setEntries(prev => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    setDirty(true)
  }
  function add() {
    setEntries(prev => [...prev, { year: '', text: '' }])
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/bibliography', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.error) setError(data.error)
      else { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>

  const cell: React.CSSProperties = {
    background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)',
    fontSize: 'var(--fs-sm)', padding: '0.4rem 0.5rem', outline: 'none',
  }

  return (
    <AdminForm
      title="Litteraturförteckning"
      backHref="/admin/biography"
      backLabel="Biografi"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
      previewHref="/sv/biography#litteratur"
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem' }}>
        Litteraturförteckningen på biografisidan. Koppla en post till en text via ”Länkad text” — då blir posten klickbar och leder till texten. Lämna tom om posten inte har någon text i systemet.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {entries.map((entry, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '4.5rem 1fr auto', gap: '0.5rem', alignItems: 'start', padding: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', borderRadius: 2 }}>
            <input
              type="text"
              value={entry.year}
              onChange={e => update(i, { year: e.target.value })}
              placeholder="År"
              style={cell}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <textarea
                value={entry.text}
                onChange={e => update(i, { text: e.target.value })}
                rows={2}
                placeholder="Referens (titel, publikation, författare…)"
                style={{ ...cell, resize: 'vertical', width: '100%' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>Länkad text:</span>
                <select
                  value={entry.slug ?? ''}
                  onChange={e => update(i, { slug: e.target.value || undefined })}
                  style={{ ...cell, flex: '1 1 240px', minWidth: 0 }}
                >
                  <option value="">— ingen —</option>
                  {texts.map(t => (
                    <option key={t.slug} value={t.slug}>
                      {t.year} · {t.title}{t.author ? ` (${t.author})` : ''}
                    </option>
                  ))}
                </select>
                {entry.slug && (
                  <a href={`/sv/texts/${entry.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>
                    ↗ visa
                  </a>
                )}
              </div>
              <textarea
                value={entry.note ?? ''}
                onChange={e => update(i, { note: e.target.value })}
                rows={2}
                placeholder="Källa / faktatext (valfritt) — visas under posten på sidan"
                style={{ ...cell, resize: 'vertical', width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Flytta upp" style={{ ...cell, cursor: 'pointer', padding: '0.2rem 0.5rem' }}>↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === entries.length - 1} title="Flytta ned" style={{ ...cell, cursor: 'pointer', padding: '0.2rem 0.5rem' }}>↓</button>
              <button type="button" onClick={() => remove(i)} title="Ta bort" style={{ ...cell, cursor: 'pointer', padding: '0.2rem 0.5rem', color: '#e66', borderColor: '#a33' }}>✕</button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="btn"
        style={{ fontSize: 'var(--fs-sm)', alignSelf: 'flex-start', marginTop: '0.5rem' }}
      >
        + Lägg till post
      </button>
    </AdminForm>
  )
}
