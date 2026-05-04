'use client'

import { useState } from 'react'
import { FieldLabel } from './AdminForm'

interface ImageListEditorProps {
  images: string[]
  onChange: (images: string[]) => void
  label?: string
}

export default function ImageListEditor({ images, onChange, label = 'Bilder (URL:er)' }: ImageListEditorProps) {
  const [newUrl, setNewUrl] = useState('')

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

  return (
    <div>
      <FieldLabel>{label} ({images.length})</FieldLabel>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {images.map((url, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', width: '1.5rem', flexShrink: 0, textAlign: 'right' }}>
              {idx + 1}
            </span>
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
            >
              ↑
            </button>
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
            >
              ↓
            </button>
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
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="url"
          className="input"
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImage() } }}
          placeholder="Lägg till bild-URL..."
          style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
        />
        <button
          type="button"
          className="btn"
          onClick={addImage}
          disabled={!newUrl.trim()}
          style={{ fontSize: 'var(--fs-sm)' }}
        >
          + Lägg till
        </button>
      </div>
    </div>
  )
}
