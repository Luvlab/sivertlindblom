'use client'

import { useRef, useState } from 'react'
import { uploadFileDirect } from '@/lib/upload-direct'

export interface MediaItem { label: string; url: string }

function isVideo(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)
}

/**
 * Upload and manage a reorderable list of audio (mp3) and video (mp4) files.
 * Each renders inline on the public page as an <audio> or <video> player.
 */
export default function MediaListEditor({ media, onChange, label = 'Ljud & video (mp3, mp4)' }: {
  media: MediaItem[]
  onChange: (next: MediaItem[]) => void
  label?: string
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= media.length) return
    const next = [...media]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  async function handleFile(file: File | undefined) {
    if (!file) return
    const ok = file.type.startsWith('audio/') || file.type.startsWith('video/')
    if (file.type && !ok) { setErr('Endast ljud- eller videofiler (mp3, mp4…).'); return }
    setUploading(true)
    setErr(null)
    const d = await uploadFileDirect(file, { bucket: 'videos', folder: 'media' })
    if (d.url) onChange([...media, { label: file.name.replace(/\.[^.]+$/, ''), url: d.url }])
    else setErr(d.error ?? 'Uppladdningen misslyckades')
    setUploading(false)
  }

  const arrow = (i: number, dir: -1 | 1, disabled: boolean, glyph: string) => (
    <button type="button" aria-label={dir < 0 ? 'Flytta upp' : 'Flytta ner'} disabled={disabled}
      onClick={() => move(i, dir)}
      style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: disabled ? 'default' : 'pointer', lineHeight: 1, padding: '0 0.2rem', opacity: disabled ? 0.3 : 1 }}>{glyph}</button>
  )

  return (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {media.map((m, i) => (
        <div key={i} style={{ marginBottom: '0.6rem', border: '1px solid var(--color-border)', borderRadius: 3, padding: '0.5rem', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              {arrow(i, -1, i === 0, '▲')}
              {arrow(i, 1, i === media.length - 1, '▼')}
            </div>
            <span style={{ fontSize: '1rem' }}>{isVideo(m.url) ? '🎞️' : '🎵'}</span>
            <input
              className="input"
              style={{ flex: 1, minWidth: 0 }}
              value={m.label}
              onChange={e => onChange(media.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))}
              placeholder="Titel"
            />
            <button type="button" onClick={() => onChange(media.filter((_, idx) => idx !== i))} className="btn" style={{ fontSize: 'var(--fs-xs)', flexShrink: 0 }}>✕</button>
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            {isVideo(m.url)
              // eslint-disable-next-line jsx-a11y/media-has-caption
              ? <video controls preload="metadata" src={m.url} style={{ width: '100%', maxWidth: 360, maxHeight: 220, display: 'block', background: '#000', borderRadius: 2 }} />
              // eslint-disable-next-line jsx-a11y/media-has-caption
              : <audio controls src={m.url} style={{ width: '100%', maxWidth: 360, height: 34 }} />}
          </div>
        </div>
      ))}

      <input ref={fileRef} type="file" accept="audio/*,video/mp4,video/webm,video/quicktime" style={{ display: 'none' }}
        onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }} />
      <button type="button" className="btn" disabled={uploading} onClick={() => fileRef.current?.click()}>
        {uploading ? 'Laddar upp…' : '⬆ Ladda upp ljud/video'}
      </button>
      {err && <p style={{ color: '#f87', fontSize: 'var(--fs-xs)', marginTop: '0.4rem' }}>{err}</p>}
    </div>
  )
}
