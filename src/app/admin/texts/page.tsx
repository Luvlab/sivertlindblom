'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import type { TextItem } from '@/lib/texts-data'

const TYPE_LABELS: Record<string, string> = {
  essay: 'Essay', preface: 'Förord', review: 'Recension',
  interview: 'Intervju', own_writing: 'Egen text', translated: 'Översatt', film: 'Film & TV',
}

const LANG_LABELS: Record<string, string> = { sv: 'SV', en: 'EN', de: 'DE', fr: 'FR', it: 'IT', hu: 'HU' }

export default function AdminTexts() {
  const [items, setItems] = useState<TextItem[]>([])
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Drag-to-reorder state
  const [savedOrder, setSavedOrder] = useState<string[]>([])
  const [liveOrder, setLiveOrder] = useState<string[]>([])
  const [orderDirty, setOrderDirty] = useState(false)
  const [orderSaving, setOrderSaving] = useState(false)
  const [orderSaved, setOrderSaved] = useState(false)
  const dragOverEl = useRef<HTMLTableRowElement | null>(null)

  useEffect(() => {
    fetch('/api/admin/texts')
      .then(r => r.json())
      .then((data: TextItem[] | { error: string }) => {
        if ('error' in data) setError(data.error)
        else setItems(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))

    fetch('/api/admin/texts-order')
      .then(r => r.json())
      .then((d: { order?: string[] }) => { if (Array.isArray(d.order)) setSavedOrder(d.order) })
      .catch(() => {})
  }, [])

  // Merge saved order with current items
  const isFiltering = !!(filter || typeFilter)

  const displayItems = useMemo<TextItem[]>(() => {
    const bySlug = new Map(items.map(it => [it.slug, it]))
    const byYearFallback = [...items].sort((a, b) => b.year - a.year)

    if (isFiltering) {
      return byYearFallback.filter(t =>
        (!filter || t.title.toLowerCase().includes(filter.toLowerCase()) || t.author.toLowerCase().includes(filter.toLowerCase())) &&
        (!typeFilter || t.type === typeFilter)
      )
    }

    // Build ordered list from liveOrder (updated by drag) or savedOrder
    const order = liveOrder.length > 0 ? liveOrder : savedOrder
    if (order.length === 0) return byYearFallback

    const result: TextItem[] = []
    const remaining = new Map(bySlug)
    for (const slug of order) {
      const item = remaining.get(slug)
      if (item) { result.push(item); remaining.delete(slug) }
    }
    // Append new items not yet in saved order
    for (const item of byYearFallback) {
      if (remaining.has(item.slug)) result.push(item)
    }
    return result
  }, [items, savedOrder, liveOrder, filter, typeFilter, isFiltering])

  function onDragStart(e: React.DragEvent<HTMLTableRowElement>, idx: number) {
    e.dataTransfer.setData('text/plain', String(idx))
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.45'
  }

  function onDragEnd(e: React.DragEvent<HTMLTableRowElement>) {
    e.currentTarget.style.opacity = ''
    if (dragOverEl.current) { dragOverEl.current.style.borderTop = ''; dragOverEl.current = null }
  }

  function onDragOver(e: React.DragEvent<HTMLTableRowElement>, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'))
    if (!isNaN(fromIdx) && fromIdx === idx) return
    if (dragOverEl.current && dragOverEl.current !== e.currentTarget) dragOverEl.current.style.borderTop = ''
    e.currentTarget.style.borderTop = '2px solid var(--color-accent)'
    dragOverEl.current = e.currentTarget
  }

  function onDrop(e: React.DragEvent<HTMLTableRowElement>, toIdx: number) {
    e.preventDefault()
    if (dragOverEl.current) { dragOverEl.current.style.borderTop = ''; dragOverEl.current = null }
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'))
    if (isNaN(fromIdx) || fromIdx === toIdx) return
    const newOrder = [...displayItems]
    const [moved] = newOrder.splice(fromIdx, 1)
    newOrder.splice(toIdx, 0, moved)
    const slugOrder = newOrder.map(it => it.slug).filter(Boolean)
    setLiveOrder(slugOrder)
    setOrderDirty(true)
  }

  async function saveOrder() {
    const order = liveOrder.length > 0 ? liveOrder : savedOrder
    setOrderSaving(true)
    try {
      await fetch('/api/admin/texts-order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      })
      setSavedOrder(order)
      setLiveOrder([])
      setOrderDirty(false)
      setOrderSaved(true)
      setTimeout(() => setOrderSaved(false), 2500)
    } finally { setOrderSaving(false) }
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Texter</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar...' : `${items.length} texter`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {orderDirty && (
            <button className="btn btn-primary" onClick={saveOrder} disabled={orderSaving}>
              {orderSaving ? 'Sparar…' : 'Spara ordning'}
            </button>
          )}
          {orderSaved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          <Link href="/admin/texts/new">
            <button className="btn btn-primary">+ Ny text</button>
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök titel, författare..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[['', 'Alla'], ...Object.entries(TYPE_LABELS)].map(([k, v]) => (
            <button
              key={k}
              onClick={() => setTypeFilter(k)}
              style={{
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.35em 0.9em',
                border: '1px solid',
                borderColor: typeFilter === k ? 'var(--color-accent)' : 'var(--color-border)',
                background: typeFilter === k ? 'var(--color-accent)' : 'transparent',
                color: typeFilter === k ? '#0a0a0a' : 'var(--color-muted)',
                cursor: 'pointer',
                borderRadius: 1,
                transition: 'all 0.12s',
              }}
            >
              {v}
            </button>
          ))}
        </div>
        {!isFiltering && (
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
            Dra raderna för att ändra ordning. Klicka "Spara ordning" för att spara.
          </p>
        )}
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)', padding: '2rem 0' }}>Laddar...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['', '', 'Titel', 'Författare', 'Typ', 'År', 'Språk', ''].map((h, i) => (
                  <th key={i} style={{ padding: '0.75rem 1rem 0.75rem 0', width: i === 0 ? 28 : i === 1 ? 56 : undefined, color: 'var(--color-muted)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)', textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayItems.map((t, idx) => (
                <tr
                  key={t.slug}
                  draggable={!isFiltering}
                  onDragStart={!isFiltering ? e => onDragStart(e, idx) : undefined}
                  onDragEnd={!isFiltering ? onDragEnd : undefined}
                  onDragOver={!isFiltering ? e => onDragOver(e, idx) : undefined}
                  onDrop={!isFiltering ? e => onDrop(e, idx) : undefined}
                  style={{ borderBottom: '1px solid var(--color-border)', cursor: isFiltering ? 'default' : 'grab' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.5rem 0.25rem', width: 28, color: 'var(--color-border)', userSelect: 'none' }}>
                    {!isFiltering && <span style={{ fontSize: 16, cursor: 'grab', display: 'inline-block', padding: '0 4px' }} title="Dra för att flytta">⠿</span>}
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', width: 56 }}>
                    {t.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.images[0]}
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

      {!loading && displayItems.length === 0 && (
        <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', textAlign: 'center', color: 'var(--color-muted)' }}>
          Inga texter hittades.
        </div>
      )}
    </div>
  )
}
