'use client'

import { useState, useEffect, useRef } from 'react'

interface WatercolorItem {
  id?: string
  url: string
  alt: string
  sort_order: number
}

export default function AdminWatercolors() {
  const [items, setItems] = useState<WatercolorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [filter, setFilter] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag reorder
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/watercolors')
      .then(r => r.json())
      .then((d: WatercolorItem[] | { error: string }) => {
        if (!('error' in d)) setItems(d)
        else setError(String((d as { error: string }).error))
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true); setError(null)
    try {
      const res = await fetch('/api/admin/watercolors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (res.ok && !data.error) { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error ?? 'Fel')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  function addUrl() {
    const url = newUrl.trim()
    if (!url) return
    setItems(prev => [...prev, { url, alt: newAlt.trim(), sort_order: prev.length }])
    setNewUrl(''); setNewAlt(''); setDirty(true)
  }

  function removeItem(idx: number) {
    setItems(prev => prev.filter((_, i) => i !== idx))
    setDirty(true)
  }

  function updateAlt(idx: number, alt: string) {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, alt } : it))
    setDirty(true)
  }

  function handleDragStart(idx: number) { setDraggingIdx(idx) }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault(); e.dataTransfer.dropEffect = 'move'
    if (idx !== dragOverIdx) setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (draggingIdx === null || draggingIdx === idx) return
    const next = [...items]
    const [removed] = next.splice(draggingIdx, 1)
    next.splice(idx, 0, removed)
    setItems(next); setDirty(true)
    setDraggingIdx(null); setDragOverIdx(null)
  }
  function handleDragEnd() { setDraggingIdx(null); setDragOverIdx(null) }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true); setUploadError(null)
    const newItems: WatercolorItem[] = []
    for (const file of files) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('alt', file.name.replace(/\.[^.]+$/, ''))
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json() as { url?: string; error?: string }
        if (data.error) { setUploadError(`${file.name}: ${data.error}`); break }
        if (data.url) newItems.push({ url: data.url, alt: file.name.replace(/\.[^.]+$/, ''), sort_order: 0 })
      } catch (err) { setUploadError(String(err)); break }
    }
    if (newItems.length) { setItems(prev => [...prev, ...newItems]); setDirty(true) }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const filtered = items.filter(it =>
    !filter || it.alt.toLowerCase().includes(filter.toLowerCase()) || it.url.toLowerCase().includes(filter.toLowerCase())
  )

  const thStyle: React.CSSProperties = {
    padding: '0.5rem 0.5rem 0.5rem 0', color: 'var(--color-muted)',
    fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em',
    fontSize: '0.7rem', textAlign: 'left', whiteSpace: 'nowrap',
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>
            Akvareller
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {items.length} akvareller
            {dirty && <span style={{ marginLeft: '0.75rem', color: 'var(--color-accent)' }}>• ej sparad</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          {error && <span style={{ color: '#f88', fontSize: 'var(--fs-sm)', maxWidth: 260 }}>{error}</span>}
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !dirty}>
            {saving ? 'Sparar…' : 'Spara ändringar'}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input type="search" className="input" placeholder="Filtrera…" value={filter}
          onChange={e => setFilter(e.target.value)} style={{ maxWidth: 300 }} />
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : (
        <>
          {/* Thumbnail table — drag to reorder */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
              Dra för att ändra ordning · klicka på bildtext för att redigera
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.5rem',
            }}>
              {filtered.map((item, i) => {
                const realIdx = items.indexOf(item)
                return (
                  <div
                    key={`${item.url}-${i}`}
                    draggable
                    onDragStart={() => handleDragStart(realIdx)}
                    onDragOver={e => handleDragOver(e, realIdx)}
                    onDrop={e => handleDrop(e, realIdx)}
                    onDragEnd={handleDragEnd}
                    style={{
                      position: 'relative',
                      border: dragOverIdx === realIdx && draggingIdx !== realIdx
                        ? '2px solid var(--color-accent)'
                        : '1px solid var(--color-border)',
                      background: 'var(--color-bg-surface)',
                      opacity: draggingIdx === realIdx ? 0.3 : 1,
                      cursor: 'grab',
                      transition: 'opacity 0.1s',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#f0ede8', padding: '4px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.alt}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', pointerEvents: 'none' }}
                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1' }}
                      />
                    </div>

                    {/* Number badge */}
                    <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.35rem', lineHeight: 1.4, pointerEvents: 'none' }}>
                      {realIdx + 1}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(realIdx)}
                      style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(160,30,30,0.85)', color: '#fff', border: 'none', padding: '0.15rem 0.35rem', fontSize: '0.6rem', cursor: 'pointer', borderRadius: 2 }}
                    >✕</button>

                    {/* Editable alt caption */}
                    <input
                      type="text"
                      value={item.alt}
                      onChange={e => updateAlt(realIdx, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'block', width: '100%', boxSizing: 'border-box',
                        background: 'var(--color-bg-card)', border: 'none',
                        borderTop: '1px solid var(--color-border)',
                        color: 'var(--color-muted)', fontSize: '0.6rem',
                        padding: '0.3rem 0.4rem', fontFamily: 'inherit',
                        outline: 'none',
                      }}
                      placeholder="Alt-text…"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Add image */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Lägg till akvarell
            </p>

            {uploadError && (
              <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.5rem 0.75rem', fontSize: 'var(--fs-xs)', marginBottom: '0.75rem' }}>
                {uploadError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <input type="url" className="input" value={newUrl} onChange={e => setNewUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }}
                placeholder="Bild-URL…" style={{ flex: '2 1 220px', fontSize: 'var(--fs-sm)' }} />
              <input type="text" className="input" value={newAlt} onChange={e => setNewAlt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }}
                placeholder="Alt-text (Akvarell nr XX, YYYY)…" style={{ flex: '3 1 260px', fontSize: 'var(--fs-sm)' }} />
              <button className="btn" onClick={addUrl} disabled={!newUrl.trim()} style={{ fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap' }}>+ URL</button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileChange} />
              <button className="btn" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ fontSize: 'var(--fs-sm)' }}>
                {uploading ? 'Laddar upp…' : '↑ Ladda upp bilder'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
