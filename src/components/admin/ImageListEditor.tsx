'use client'

import { useRef, useState, useEffect, useMemo } from 'react'

interface ImageListEditorProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
}

interface VaultImage {
  url: string
  work: string
  alt: string
}

export default function ImageListEditor({ images, onChange, label = 'Bilder' }: ImageListEditorProps) {
  const [newUrl, setNewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Drag-and-drop reorder
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  // Inline URL edit per card
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState('')

  // Media vault browser
  const [vaultOpen, setVaultOpen] = useState(false)
  const [vaultImages, setVaultImages] = useState<VaultImage[]>([])
  const [vaultLoading, setVaultLoading] = useState(false)
  const [vaultFilter, setVaultFilter] = useState('')
  const [vaultLoaded, setVaultLoaded] = useState(false)

  // ── Reorder ────────────────────────────────────────────
  function handleDragStart(idx: number) { setDraggingIdx(idx) }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== dragOverIdx) setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (draggingIdx === null || draggingIdx === idx) return
    const next = [...images]
    const [removed] = next.splice(draggingIdx, 1)
    next.splice(idx, 0, removed)
    onChange(next)
    setDraggingIdx(null)
    setDragOverIdx(null)
  }
  function handleDragEnd() { setDraggingIdx(null); setDragOverIdx(null) }

  // ── Editing ────────────────────────────────────────────
  function startEdit(idx: number) {
    setEditingIdx(idx)
    setEditingUrl(images[idx])
  }
  function commitEdit() {
    if (editingIdx === null) return
    const next = [...images]
    const trimmed = editingUrl.trim()
    if (trimmed) next[editingIdx] = trimmed
    onChange(next)
    setEditingIdx(null)
  }
  function cancelEdit() { setEditingIdx(null); setEditingUrl('') }

  // ── CRUD ───────────────────────────────────────────────
  function removeImage(idx: number) {
    if (editingIdx === idx) { setEditingIdx(null) }
    onChange(images.filter((_, i) => i !== idx))
  }

  function addImage() {
    const trimmed = newUrl.trim()
    if (!trimmed) return
    onChange([...images, trimmed])
    setNewUrl('')
  }

  function shuffle() {
    const next = [...images]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    onChange(next)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setUploadError(null)
    const newUrls: string[] = []
    for (const file of files) {
      try {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('alt', file.name)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json() as { url?: string; error?: string }
        if (data.error) { setUploadError(`${file.name}: ${data.error}`); break }
        if (data.url) newUrls.push(data.url)
      } catch (err) { setUploadError(String(err)); break }
    }
    if (newUrls.length) onChange([...images, ...newUrls])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Media vault ────────────────────────────────────────
  async function openVault() {
    setVaultOpen(true)
    if (vaultLoaded) return
    setVaultLoading(true)
    try {
      const [worksRes, uploadsRes] = await Promise.all([
        fetch('/api/admin/public-works'),
        fetch('/api/admin/upload'),
      ])
      const worksData = await worksRes.json() as Array<{ title: string; images?: Array<{ url: string; alt?: string | null }> }>
      const uploadsData = await uploadsRes.json() as { files?: Array<{ url: string; name: string; alt?: string }> }

      const all: VaultImage[] = []
      if (Array.isArray(worksData)) {
        for (const w of worksData) {
          for (const img of w.images ?? []) {
            if (img.url) all.push({ url: img.url, work: w.title, alt: img.alt ?? '' })
          }
        }
      }
      if (uploadsData.files) {
        for (const f of uploadsData.files) {
          if (f.url) all.push({ url: f.url, work: 'Uppladdningar', alt: f.alt ?? f.name })
        }
      }
      setVaultImages(all)
      setVaultLoaded(true)
    } catch {
      // ignore — user sees empty grid
    } finally {
      setVaultLoading(false)
    }
  }

  // Close vault on Escape
  useEffect(() => {
    if (!vaultOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setVaultOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [vaultOpen])

  const vaultFiltered = useMemo(() => {
    if (!vaultFilter.trim()) return vaultImages
    const q = vaultFilter.toLowerCase()
    return vaultImages.filter(img =>
      img.work.toLowerCase().includes(q) ||
      img.alt.toLowerCase().includes(q) ||
      img.url.toLowerCase().includes(q)
    )
  }, [vaultImages, vaultFilter])

  const imageSet = useMemo(() => new Set(images), [images])

  function toggleVaultImage(url: string) {
    if (imageSet.has(url)) {
      onChange(images.filter(u => u !== url))
    } else {
      onChange([...images, url])
    }
  }

  // ── Shared button styles ───────────────────────────────
  const overlayBtn = (extra?: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute',
    padding: '0.2rem 0.4rem',
    fontSize: '0.65rem',
    lineHeight: 1,
    border: 'none',
    borderRadius: 2,
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'opacity 0.12s',
    ...extra,
  })

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', paddingTop: '0.25rem' }}>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label} ({images.length})
        </span>
        {images.length > 1 && (
          <button
            type="button"
            onClick={shuffle}
            style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '0.2em 0.6em', fontSize: 'var(--fs-xs)', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}
            title="Slumpa bildordningen"
          >
            ⇄ Slumpa
          </button>
        )}
      </div>

      {/* ── Thumbnail grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: '0.5rem',
        marginBottom: '1rem',
      }}>
        {images.map((url, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={e => handleDragOver(e, idx)}
            onDrop={e => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            style={{
              position: 'relative',
              border: dragOverIdx === idx && draggingIdx !== idx
                ? '2px solid var(--color-accent)'
                : editingIdx === idx
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              opacity: draggingIdx === idx ? 0.35 : 1,
              cursor: 'grab',
              transition: 'opacity 0.1s, border-color 0.1s',
            }}
          >
            {/* Image */}
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                  onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-border)', fontSize: '1.5rem' }}>□</div>
              )}
            </div>

            {/* Number badge — top-left */}
            <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.72)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.38rem', fontFamily: 'Georgia,serif', lineHeight: 1.4, pointerEvents: 'none' }}>
              {idx + 1}
            </div>

            {/* Remove — top-right */}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              style={overlayBtn({ top: 4, right: 4, background: 'rgba(160,30,30,0.82)', color: '#fff' })}
              title="Ta bort"
            >✕</button>

            {/* Edit — bottom-right */}
            <button
              type="button"
              onClick={() => editingIdx === idx ? cancelEdit() : startEdit(idx)}
              style={overlayBtn({
                bottom: editingIdx === idx ? undefined : 4,
                top: editingIdx === idx ? 4 : undefined,
                right: editingIdx === idx ? 24 : 4,
                background: editingIdx === idx ? 'rgba(201,169,76,0.9)' : 'rgba(40,40,40,0.82)',
                color: editingIdx === idx ? '#0a0a0a' : 'var(--color-muted)',
              })}
              title={editingIdx === idx ? 'Avbryt redigering' : 'Redigera URL'}
            >
              {editingIdx === idx ? '✕' : '✎'}
            </button>

            {/* Inline URL editor — shown below image when editing */}
            {editingIdx === idx && (
              <div style={{ padding: '0.4rem', borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
                <input
                  type="url"
                  value={editingUrl}
                  onChange={e => setEditingUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commitEdit() } if (e.key === 'Escape') cancelEdit() }}
                  autoFocus
                  style={{
                    width: '100%',
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.6rem',
                    fontFamily: 'monospace',
                    padding: '0.3rem 0.4rem',
                    marginBottom: '0.35rem',
                    outline: 'none',
                  }}
                  placeholder="https://…"
                />
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={commitEdit}
                    style={{ flex: 1, padding: '0.25em', fontSize: '0.65rem', background: 'var(--color-accent)', color: '#0a0a0a', border: 'none', cursor: 'pointer', borderRadius: 1 }}
                  >✓ Spara</button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    style={{ flex: 1, padding: '0.25em', fontSize: '0.65rem', background: 'none', color: 'var(--color-muted)', border: '1px solid var(--color-border)', cursor: 'pointer', borderRadius: 1 }}
                  >Avbryt</button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Drop zone when empty */}
        {images.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', border: '1px dashed var(--color-border)', color: 'var(--color-muted)', fontSize: 'var(--fs-xs)' }}>
            Inga bilder — lägg till nedan
          </div>
        )}
      </div>

      {/* ── Upload error ── */}
      {uploadError && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.5rem 0.75rem', fontSize: 'var(--fs-xs)', marginBottom: '0.5rem' }}>
          {uploadError}
        </div>
      )}

      {/* ── Add controls ── */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {/* URL paste */}
        <div style={{ display: 'flex', gap: '0.5rem', flex: '1 1 260px' }}>
          <input
            type="url"
            className="input"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
            placeholder="Klistra in bild-URL…"
            style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
          />
          <button
            type="button"
            className="btn"
            onClick={addImage}
            disabled={!newUrl.trim()}
            style={{ fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap' }}
          >+ URL</button>
        </div>

        {/* File upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{ fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap' }}
        >
          {uploading ? 'Laddar upp…' : '↑ Ladda upp'}
        </button>

        {/* Media vault */}
        <button
          type="button"
          className="btn"
          onClick={openVault}
          style={{
            fontSize: 'var(--fs-sm)',
            whiteSpace: 'nowrap',
            background: 'rgba(180,140,60,0.12)',
            color: 'var(--color-accent)',
            border: '1px solid rgba(180,140,60,0.35)',
          }}
        >
          ⊞ Mediavalv
        </button>
      </div>

      {/* ── Media vault modal ── */}
      {vaultOpen && (
        <div
          onClick={() => setVaultOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'stretch',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              display: 'flex', flexDirection: 'column',
              width: '100%', maxWidth: 1100, margin: '0 auto',
              maxHeight: '100%', overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.75rem 1rem',
              borderBottom: '1px solid var(--color-border)',
              flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'Georgia,serif', fontSize: 'var(--fs-base)', flex: 1 }}>
                Mediavalv
                {vaultLoaded && <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', marginLeft: '0.5rem' }}>
                  {vaultFiltered.length} bilder{vaultFilter ? ' (filtrerade)' : ` av ${vaultImages.length}`}
                </span>}
              </span>
              <input
                type="search"
                autoFocus
                value={vaultFilter}
                onChange={e => setVaultFilter(e.target.value)}
                placeholder="Sök verk, fotokrediter…"
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  padding: '0.35rem 0.6rem',
                  fontSize: 'var(--fs-sm)',
                  width: 260,
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                {images.length} valda
              </span>
              <button
                type="button"
                onClick={() => setVaultOpen(false)}
                style={{
                  background: 'none', border: 'none', color: 'var(--color-muted)',
                  fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1, padding: '0.2rem 0.4rem',
                }}
                title="Stäng (Esc)"
              >✕</button>
            </div>

            {/* Modal body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
              {vaultLoading ? (
                <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '3rem' }}>Laddar…</p>
              ) : vaultFiltered.length === 0 ? (
                <p style={{ color: 'var(--color-muted)', textAlign: 'center', padding: '3rem' }}>Inga bilder hittades</p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.5rem',
                }}>
                  {vaultFiltered.map((img, i) => {
                    const added = imageSet.has(img.url)
                    return (
                      <div
                        key={i}
                        onClick={() => toggleVaultImage(img.url)}
                        title={img.alt || img.work}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          border: added
                            ? '2px solid var(--color-accent)'
                            : '1px solid var(--color-border)',
                          background: 'var(--color-bg-surface)',
                          transition: 'border-color 0.1s, opacity 0.1s',
                        }}
                      >
                        <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt={img.alt}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1' }}
                          />
                        </div>

                        {/* Work label */}
                        <div style={{
                          padding: '0.3rem 0.4rem',
                          fontSize: '0.6rem',
                          color: 'var(--color-muted)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {img.alt || img.work}
                        </div>

                        {/* "Added" checkmark overlay */}
                        {added && (
                          <div style={{
                            position: 'absolute', top: 4, right: 4,
                            background: 'var(--color-accent)',
                            color: '#0a0a0a',
                            borderRadius: '50%',
                            width: 18, height: 18,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', fontWeight: 700,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          }}>✓</div>
                        )}

                        {/* Work name badge bottom-left */}
                        <div style={{
                          position: 'absolute', bottom: 24, left: 0, right: 0,
                          padding: '0.15rem 0.3rem',
                          background: 'rgba(0,0,0,0.65)',
                          fontSize: '0.55rem',
                          color: 'rgba(255,255,255,0.65)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                        }}>
                          {img.work}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--color-border)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                Klicka på en bild för att lägga till / ta bort • Esc stänger
              </span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setVaultOpen(false)}
                style={{ fontSize: 'var(--fs-sm)' }}
              >
                Klar ({images.length} bilder)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
