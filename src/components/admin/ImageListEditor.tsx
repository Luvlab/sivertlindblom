'use client'

import { useRef, useState } from 'react'
import { FieldLabel } from './AdminForm'

interface ImageListEditorProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
}

export default function ImageListEditor({ images, onChange, label = 'Bilder (URL:er)' }: ImageListEditorProps) {
  const [newUrl, setNewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  function addImage() {
    const trimmed = newUrl.trim()
    if (!trimmed) return
    onChange([...images, trimmed])
    setNewUrl('')
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx))
  }

  function moveUp(idx: number) {
    if (idx === 0) return
    const next = [...images]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  function moveDown(idx: number) {
    if (idx === images.length - 1) return
    const next = [...images]
    ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
    onChange(next)
  }

  function updateUrl(idx: number, val: string) {
    const next = [...images]
    next[idx] = val
    onChange(next)
  }

  function shuffle() {
    const next = [...images]
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    onChange(next)
  }

  function handleDragStart(idx: number) {
    setDraggingIdx(idx)
  }

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

  function handleDragEnd() {
    setDraggingIdx(null)
    setDragOverIdx(null)
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
        if (data.error) {
          setUploadError(`${file.name}: ${data.error}`)
          break
        }
        if (data.url) newUrls.push(data.url)
      } catch (err) {
        setUploadError(String(err))
        break
      }
    }

    if (newUrls.length) onChange([...images, ...newUrls])
    setUploading(false)
    // Reset file input so the same files can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {label} ({images.length})
        </span>
        {images.length > 1 && (
          <button
            type="button"
            onClick={shuffle}
            style={{
              background: 'none',
              border: '1px solid var(--color-border)',
              color: 'var(--color-muted)',
              padding: '0.2em 0.6em',
              fontSize: 'var(--fs-xs)',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
            title="Slumpa bildordningen"
          >
            ⇄ Slumpa ordning
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {images.map((url, idx) => (
          <div
            key={idx}
            onDragOver={e => handleDragOver(e, idx)}
            onDrop={e => handleDrop(e, idx)}
            style={{
              display: 'flex', gap: '0.5rem', alignItems: 'center',
              opacity: draggingIdx === idx ? 0.4 : 1,
              background: dragOverIdx === idx && draggingIdx !== idx ? 'rgba(201,168,76,0.08)' : 'transparent',
              borderRadius: 3,
              transition: 'background 0.1s, opacity 0.1s',
            }}
          >
            {/* Drag handle */}
            <span
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragEnd={handleDragEnd}
              style={{
                cursor: 'grab', color: 'var(--color-border)', fontSize: '0.9rem',
                flexShrink: 0, width: '1.25rem', textAlign: 'center',
                userSelect: 'none', touchAction: 'none',
              }}
              title="Dra för att ändra ordning"
            >
              ☰
            </span>
            <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', width: '1.5rem', flexShrink: 0, textAlign: 'right' }}>
              {idx + 1}
            </span>
            {/* Thumbnail preview */}
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 2, overflow: 'hidden', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
              {url ? (
                <img
                  src={url}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={ev => { (ev.target as HTMLImageElement).style.opacity = '0' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2, fontSize: 20 }}>□</div>
              )}
            </div>
            <input
              type="url"
              className="input"
              value={url}
              onChange={e => updateUrl(idx, e.target.value)}
              style={{ flex: 1, fontSize: 'var(--fs-xs)' }}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={() => moveUp(idx)}
              disabled={idx === 0}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                color: idx === 0 ? 'var(--color-border)' : 'var(--color-muted)',
                padding: '0.25em 0.5em',
                cursor: idx === 0 ? 'default' : 'pointer',
                fontSize: 'var(--fs-xs)',
              }}
              title="Flytta upp"
            >↑</button>
            <button
              type="button"
              onClick={() => moveDown(idx)}
              disabled={idx === images.length - 1}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                color: idx === images.length - 1 ? 'var(--color-border)' : 'var(--color-muted)',
                padding: '0.25em 0.5em',
                cursor: idx === images.length - 1 ? 'default' : 'pointer',
                fontSize: 'var(--fs-xs)',
              }}
              title="Flytta ner"
            >↓</button>
            <button
              type="button"
              onClick={() => removeImage(idx)}
              style={{
                background: 'none',
                border: '1px solid #a33',
                color: '#f88',
                padding: '0.25em 0.5em',
                cursor: 'pointer',
                fontSize: 'var(--fs-xs)',
              }}
              title="Ta bort"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Upload error */}
      {uploadError && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.5rem 0.75rem', fontSize: 'var(--fs-xs)', marginBottom: '0.5rem', borderRadius: 2 }}>
          {uploadError}
        </div>
      )}

      {/* Add via URL */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          type="url"
          className="input"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
          placeholder="Klistra in bild-URL..."
          style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
        />
        <button
          type="button"
          className="btn"
          onClick={addImage}
          disabled={!newUrl.trim()}
          style={{ fontSize: 'var(--fs-sm)', whiteSpace: 'nowrap' }}
        >
          + URL
        </button>
      </div>

      {/* Upload from disk */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
          {uploading ? 'Laddar upp…' : '↑ Ladda upp bilder'}
        </button>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
          Välj en eller flera filer från din dator
        </span>
      </div>
    </div>
  )
}
