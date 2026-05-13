'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import type { PublicWork } from '@/lib/public-works'

interface Slide {
  url: string
  alt: string
}

interface MediaImage {
  url: string
  alt: string
  work: string
}

// ── Media Picker ────────────────────────────────────────────────────────────

function MediaPicker({ onPick }: { onPick: (img: MediaImage) => void }) {
  const [open, setOpen] = useState(false)
  const [mediaImages, setMediaImages] = useState<MediaImage[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const [mediaFilter, setMediaFilter] = useState('')

  async function loadMedia() {
    if (mediaImages.length > 0) return
    setLoadingMedia(true)
    try {
      const collected: MediaImage[] = []

      const [worksRes, textsRes, uploadsRes] = await Promise.all([
        fetch('/api/admin/public-works'),
        fetch('/api/admin/texts'),
        fetch('/api/admin/upload'),
      ])

      const worksData = await worksRes.json() as PublicWork[] | { error: string }
      if (!('error' in worksData)) {
        for (const work of worksData) {
          for (const img of work.images ?? []) {
            collected.push({ url: img.url, alt: img.alt ?? '', work: work.title })
          }
        }
      }

      const textsData = await textsRes.json() as Array<{ title: string; images?: string[] }> | { error: string }
      if (!('error' in textsData)) {
        for (const text of textsData) {
          for (const url of text.images ?? []) {
            if (typeof url === 'string' && url) {
              collected.push({ url, alt: '', work: text.title })
            }
          }
        }
      }

      const uploadsData = await uploadsRes.json() as { files?: Array<{ url: string; alt: string }> } | { error: string }
      if (!('error' in uploadsData) && uploadsData.files) {
        for (const f of uploadsData.files) {
          collected.push({ url: f.url, alt: f.alt ?? '', work: 'Uppladdningar' })
        }
      }

      setMediaImages(collected)
    } finally {
      setLoadingMedia(false)
    }
  }

  function toggle() {
    if (!open) loadMedia()
    setOpen(o => !o)
  }

  const filtered = useMemo(() => {
    if (!mediaFilter) return mediaImages
    const q = mediaFilter.toLowerCase()
    return mediaImages.filter(m =>
      m.work.toLowerCase().includes(q) || m.alt.toLowerCase().includes(q) || m.url.toLowerCase().includes(q)
    )
  }, [mediaImages, mediaFilter])

  return (
    <div style={{ border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
      <button
        onClick={toggle}
        style={{
          width: '100%', padding: '0.9rem 1.25rem', textAlign: 'left',
          background: open ? 'var(--color-bg-card)' : 'var(--color-bg-surface)',
          border: 'none', cursor: 'pointer', color: 'var(--color-text)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: 'var(--fs-sm)', fontFamily: 'Georgia, serif',
        }}
      >
        <span>🖼 Välj från Media ({mediaImages.length > 0 ? mediaImages.length : '…'})</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>{open ? '▲ Dölj' : '▼ Visa'}</span>
      </button>

      {open && (
        <div style={{ padding: '1rem', background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)' }}>
          <input
            type="search"
            className="input"
            placeholder="Sök verk, alt-text, URL…"
            value={mediaFilter}
            onChange={e => setMediaFilter(e.target.value)}
            style={{ maxWidth: 320, marginBottom: '0.75rem' }}
            autoFocus
          />
          {loadingMedia ? (
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>Laddar…</p>
          ) : (
            <>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
                {filtered.length} bilder — klicka för att lägga till i slideshow
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '0.5rem',
                maxHeight: 400,
                overflowY: 'auto',
              }}>
                {filtered.map((img, i) => (
                  <button
                    key={`${img.url}-${i}`}
                    onClick={() => { onPick(img); setOpen(false) }}
                    title={`${img.alt || img.work}\n${img.url}`}
                    style={{
                      padding: 0, border: '1px solid var(--color-border)',
                      background: 'var(--color-bg-card)', cursor: 'pointer',
                      overflow: 'hidden', textAlign: 'left',
                    }}
                  >
                    <div style={{ aspectRatio: '4/3', background: '#111', overflow: 'hidden' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <div style={{
                      fontSize: '0.6rem', color: 'var(--color-muted)', padding: '0.25rem 0.3rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {img.alt || img.work}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Upload Zone ─────────────────────────────────────────────────────────────

function UploadZone({ onUploaded }: { onUploaded: (url: string, alt: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState<string | null>(null)
  const [uploadAlt, setUploadAlt] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (!file) return
    setUploading(true)
    setUploadErr(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', uploadAlt)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await r.json() as { url?: string; alt?: string; error?: string }
      if (d.url) {
        onUploaded(d.url, uploadAlt)
        setUploadAlt('')
      } else {
        setUploadErr(d.error ?? 'Uppladdning misslyckades')
      }
    } catch (e) {
      setUploadErr(String(e))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) upload(file)
  }

  return (
    <div style={{ border: '1px solid var(--color-border)', marginBottom: '1rem', background: 'var(--color-bg-surface)' }}>
      <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
        ↑ Ladda upp ny bild
      </div>
      <div style={{ padding: '1rem' }}>
        {uploadErr && (
          <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.5rem 0.75rem', fontSize: 'var(--fs-xs)', marginBottom: '0.75rem' }}>
            {uploadErr}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              Alt-text (valfri)
            </label>
            <input
              type="text"
              className="input"
              value={uploadAlt}
              onChange={e => setUploadAlt(e.target.value)}
              placeholder="Beskriv bilden"
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{ whiteSpace: 'nowrap' }}
          >
            {uploading ? 'Laddar upp…' : '+ Välj fil'}
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'var(--color-border)'}`,
            borderRadius: 2,
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            color: dragOver ? 'var(--color-accent)' : 'var(--color-muted)',
            fontSize: 'var(--fs-xs)',
            transition: 'border-color 0.15s, color 0.15s',
            background: dragOver ? 'rgba(201,168,76,0.04)' : 'transparent',
          }}
        >
          {uploading ? '⏳ Laddar upp…' : 'Dra & släpp bild här, eller klicka'}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />

        <p style={{ fontSize: '0.65rem', color: 'var(--color-muted)', marginTop: '0.5rem' }}>
          Bilden sparas i Media-databasen och läggs till i slideshow.
        </p>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AdminHome() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')

  useEffect(() => {
    fetch('/api/admin/home')
      .then(r => r.json())
      .then((d: { slides: Slide[] } | { error: string }) => {
        if ('slides' in d) setSlides(d.slides)
      })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const r = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      })
      const d = await r.json() as { ok?: boolean; error?: string }
      if (d.ok) {
        setMessage({ type: 'ok', text: 'Sparad!' })
      } else {
        setMessage({ type: 'error', text: d.error ?? 'Fel vid sparning' })
      }
    } catch (e) {
      setMessage({ type: 'error', text: String(e) })
    } finally {
      setSaving(false)
    }
  }

  function removeSlide(i: number) {
    setSlides(prev => prev.filter((_, idx) => idx !== i))
  }

  function updateSlide(i: number, field: 'url' | 'alt', value: string) {
    setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s))
  }

  function addSlide() {
    if (!newUrl.trim()) return
    setSlides(prev => [...prev, { url: newUrl.trim(), alt: newAlt.trim() }])
    setNewUrl('')
    setNewAlt('')
  }

  function addFromMedia(img: MediaImage) {
    setSlides(prev => {
      if (prev.some(s => s.url === img.url)) return prev // no duplicates
      return [...prev, { url: img.url, alt: img.alt }]
    })
    setMessage({ type: 'ok', text: `Lade till: ${img.alt || img.work}` })
    setTimeout(() => setMessage(null), 2500)
  }

  function onUploaded(url: string, alt: string) {
    setSlides(prev => [...prev, { url, alt }])
    setMessage({ type: 'ok', text: 'Bild uppladdad och tillagd i slideshow!' })
    setTimeout(() => setMessage(null), 3000)
  }

  function moveUp(i: number) {
    if (i === 0) return
    setSlides(prev => {
      const arr = [...prev]
      ;[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]
      return arr
    })
  }

  function moveDown(i: number) {
    setSlides(prev => {
      if (i >= prev.length - 1) return prev
      const arr = [...prev]
      ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
      return arr
    })
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 960 }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Startsida
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>
          Hero Slideshow
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          {loading ? 'Laddar…' : `${slides.length} bilder i slideshow`}
        </p>
      </div>

      {message && (
        <div style={{
          background: message.type === 'ok' ? '#0a2a0a' : '#2a0a0a',
          border: `1px solid ${message.type === 'ok' ? '#3a7a3a' : '#a33'}`,
          color: message.type === 'ok' ? '#6f6' : '#f88',
          padding: '0.75rem 1rem',
          fontSize: 'var(--fs-sm)',
          marginBottom: '1.5rem',
        }}>
          {message.text}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : (
        <>
          {/* ── Current slides ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
            {slides.map((slide, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: 60, height: 40, overflow: 'hidden', background: '#111', flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.url}
                    alt={slide.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
                  />
                </div>

                <input
                  type="url"
                  className="input"
                  value={slide.url}
                  onChange={e => updateSlide(i, 'url', e.target.value)}
                  placeholder="https://…"
                  style={{ fontSize: 'var(--fs-xs)' }}
                />

                <input
                  type="text"
                  className="input"
                  value={slide.alt}
                  onChange={e => updateSlide(i, 'alt', e.target.value)}
                  placeholder="Alt-text"
                  style={{ fontSize: 'var(--fs-xs)' }}
                />

                <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                  <button onClick={() => moveUp(i)} disabled={i === 0} className="btn"
                    style={{ padding: '0.3em 0.5em', fontSize: '0.7rem', opacity: i === 0 ? 0.3 : 1 }} title="Flytta upp">↑</button>
                  <button onClick={() => moveDown(i)} disabled={i === slides.length - 1} className="btn"
                    style={{ padding: '0.3em 0.5em', fontSize: '0.7rem', opacity: i === slides.length - 1 ? 0.3 : 1 }} title="Flytta ned">↓</button>
                  <button onClick={() => removeSlide(i)}
                    style={{ padding: '0.3em 0.5em', fontSize: '0.7rem', background: 'none', border: '1px solid #a33', color: '#e55', cursor: 'pointer' }}
                    title="Ta bort">✕</button>
                </div>
              </div>
            ))}
            {slides.length === 0 && (
              <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', padding: '1rem 0' }}>
                Inga bilder i slideshow. Lägg till nedan.
              </p>
            )}
          </div>

          {/* ── Add section ── */}
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-lg)', marginBottom: '1rem', color: 'var(--color-muted)' }}>
            Lägg till bild
          </h2>

          {/* 1. Media picker */}
          <MediaPicker onPick={addFromMedia} />

          {/* 2. Upload */}
          <UploadZone onUploaded={onUploaded} />

          {/* 3. URL */}
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', marginBottom: '2rem' }}>
            <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
              🔗 Klistra in URL
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                    Bild URL *
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://…"
                    onKeyDown={e => e.key === 'Enter' && addSlide()}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                    Alt-text
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newAlt}
                    onChange={e => setNewAlt(e.target.value)}
                    placeholder="Beskriv bilden"
                    onKeyDown={e => e.key === 'Enter' && addSlide()}
                  />
                </div>
                <button className="btn btn-primary" onClick={addSlide}>+ Lägg till</button>
              </div>
            </div>
          </div>

          {/* ── Save ── */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={save}
              disabled={saving}
              style={{ minWidth: 120 }}
            >
              {saving ? 'Sparar…' : 'Spara'}
            </button>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
              {slides.length} bilder i slideshow
            </span>
          </div>
        </>
      )}
    </div>
  )
}
