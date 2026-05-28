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
  const [random, setRandom] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')

  // Load from vault
  const [loadingVault, setLoadingVault] = useState(false)
  const [vaultMode, setVaultMode]       = useState(false)   // true while vault set is active
  const savedSlidesRef = useRef<Slide[]>([])                 // snapshot before vault load
  const savedRandomRef = useRef(true)

  // Preview
  const [previewing, setPreviewing] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [previewOrder, setPreviewOrder] = useState<Slide[]>([])
  const previewTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Drag-and-drop reorder
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  // Inline URL edit per card
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState('')

  useEffect(() => {
    fetch('/api/admin/home')
      .then(r => r.json())
      .then((d: { slides: Slide[]; random?: boolean } | { error: string }) => {
        if ('slides' in d) {
          setSlides(d.slides)
          setRandom(d.random ?? true)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Preview logic ──────────────────────────────────────────────────────────
  function startPreview() {
    if (slides.length === 0) return
    const order = random
      ? [...slides].sort(() => Math.random() - 0.5)
      : [...slides]
    setPreviewOrder(order)
    setPreviewIdx(0)
    setPreviewing(true)
  }

  useEffect(() => {
    if (!previewing || previewOrder.length === 0) return
    previewTimer.current = setInterval(() => {
      setPreviewIdx(i => (i + 1) % previewOrder.length)
    }, 3000)
    return () => { if (previewTimer.current) clearInterval(previewTimer.current) }
  }, [previewing, previewOrder])

  async function save() {
    setSaving(true)
    setMessage(null)
    try {
      const r = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides, random }),
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
    if (editingIdx === i) setEditingIdx(null)
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

  async function loadAllVaultMedia() {
    // Snapshot the current curated list so we can restore it
    savedSlidesRef.current = [...slides]
    savedRandomRef.current = random
    setLoadingVault(true)
    setMessage(null)
    try {
      const collected: Slide[] = []
      const [worksRes, textsRes, uploadsRes] = await Promise.all([
        fetch('/api/admin/public-works'),
        fetch('/api/admin/texts'),
        fetch('/api/admin/upload'),
      ])
      const worksData = await worksRes.json() as PublicWork[] | { error: string }
      if (!('error' in worksData)) {
        for (const work of worksData) {
          for (const img of work.images ?? []) {
            collected.push({ url: img.url, alt: img.alt ?? '' })
          }
        }
      }
      const textsData = await textsRes.json() as Array<{ title: string; images?: string[] }> | { error: string }
      if (!('error' in textsData)) {
        for (const text of textsData) {
          for (const url of text.images ?? []) {
            if (typeof url === 'string' && url) collected.push({ url, alt: '' })
          }
        }
      }
      const uploadsData = await uploadsRes.json() as { files?: Array<{ url: string; alt: string }> } | { error: string }
      if (!('error' in uploadsData) && uploadsData.files) {
        for (const f of uploadsData.files) collected.push({ url: f.url, alt: f.alt ?? '' })
      }
      // Fisher-Yates shuffle
      const shuffled = [...collected]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setSlides(shuffled)
      setRandom(true)
      setVaultMode(true)
      setMessage({ type: 'ok', text: `${shuffled.length} bilder laddade från mediavaulten. Tryck Spara för att aktivera, eller Tillbaka till listan för att avbryta.` })
      setTimeout(() => setMessage(null), 8000)
    } catch (e) {
      setMessage({ type: 'error', text: String(e) })
    } finally {
      setLoadingVault(false)
    }
  }

  function restoreList() {
    setSlides(savedSlidesRef.current)
    setRandom(savedRandomRef.current)
    setVaultMode(false)
    setMessage(null)
  }

  // ── Drag handlers ──────────────────────────────────────────────────────────
  function handleDragStart(idx: number) { setDraggingIdx(idx) }
  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== dragOverIdx) setDragOverIdx(idx)
  }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (draggingIdx === null || draggingIdx === idx) return
    const next = [...slides]
    const [removed] = next.splice(draggingIdx, 1)
    next.splice(idx, 0, removed)
    setSlides(next)
    setDraggingIdx(null)
    setDragOverIdx(null)
  }
  function handleDragEnd() { setDraggingIdx(null); setDragOverIdx(null) }

  // ── Inline URL edit ────────────────────────────────────────────────────────
  function startEdit(idx: number) { setEditingIdx(idx); setEditingUrl(slides[idx].url) }
  function commitEdit(idx: number) {
    const trimmed = editingUrl.trim()
    if (trimmed) updateSlide(idx, 'url', trimmed)
    setEditingIdx(null)
  }
  function cancelEdit() { setEditingIdx(null); setEditingUrl('') }

  // ── Shared overlay button style ────────────────────────────────────────────
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
    <div style={{ padding: 'clamp(1.5rem, 3vw, 3rem)', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Startsida
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>
            Hero Slideshow
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar…' : `${slides.length} bilder i slideshow`}
          </p>
        </div>

        {/* Controls: random toggle + preview */}
        {!loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Random toggle */}
            <button
              type="button"
              onClick={() => setRandom(r => !r)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.45rem 0.85rem',
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: `1px solid ${random ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: random ? 'rgba(201,169,76,0.12)' : 'transparent',
                color: random ? 'var(--color-accent)' : 'var(--color-muted)',
                cursor: 'pointer',
                borderRadius: 2,
                transition: 'all 0.15s',
              }}
              title={random ? 'Slumpad ordning — klicka för sekventiell' : 'Sekventiell ordning — klicka för slumpad'}
            >
              <span style={{ fontSize: '0.9em' }}>{random ? '⇄' : '→'}</span>
              {random ? 'Slumpad' : 'I ordning'}
            </button>

            {/* Vault toggle: load vault OR restore curated list */}
            {vaultMode ? (
              <button
                type="button"
                onClick={restoreList}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-accent)',
                  background: 'rgba(201,169,76,0.12)',
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'all 0.15s',
                }}
                title="Återgå till den handplockade listan"
              >
                <span style={{ fontSize: '0.9em' }}>↩</span>
                Tillbaka till listan
              </button>
            ) : (
              <button
                type="button"
                onClick={loadAllVaultMedia}
                disabled={loadingVault}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.45rem 0.85rem',
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-border)',
                  background: 'transparent',
                  color: loadingVault ? 'var(--color-muted)' : 'var(--color-text)',
                  cursor: loadingVault ? 'default' : 'pointer',
                  borderRadius: 2,
                  opacity: loadingVault ? 0.6 : 1,
                  transition: 'all 0.15s',
                }}
                title="Ersätt slideshow med alla bilder från mediavaulten i slumpad ordning"
              >
                <span style={{ fontSize: '0.9em' }}>🎲</span>
                {loadingVault ? 'Laddar…' : 'Hela mediavaulten'}
              </button>
            )}

            {/* Preview button */}
            {slides.length > 0 && (
              <button
                type="button"
                onClick={() => previewing ? setPreviewing(false) : startPreview()}
                className="btn"
                style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 0.85rem' }}
              >
                {previewing ? '✕ Stäng förhandsgranskning' : '▶ Förhandsgranska'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Inline slideshow preview ── */}
      {previewing && previewOrder.length > 0 && (
        <div style={{ marginBottom: '2rem', border: '1px solid var(--color-border)', background: '#000', position: 'relative', borderRadius: 2 }}>
          {/* 16:9 preview */}
          <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
            {previewOrder.map((slide, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={slide.url}
                alt={slide.alt}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: i === previewIdx ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  display: 'block',
                }}
              />
            ))}
            {/* Caption + counter */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '1rem 1.25rem',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              zIndex: 2,
            }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>
                {previewOrder[previewIdx]?.alt || '—'}
              </span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.45)', fontFamily: 'Georgia, serif', letterSpacing: '0.05em' }}>
                {previewIdx + 1} / {previewOrder.length}
              </span>
            </div>
          </div>

          {/* Dot strip + prev/next */}
          <div style={{ padding: '0.6rem 1rem', background: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setPreviewIdx(i => (i - 1 + previewOrder.length) % previewOrder.length)}
              style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: 'var(--fs-xs)', flexShrink: 0 }}
            >←</button>
            <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {previewOrder.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewIdx(i)}
                  style={{
                    width: i === previewIdx ? 18 : 6,
                    height: 6,
                    borderRadius: 3,
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    background: i === previewIdx ? 'var(--color-accent)' : 'var(--color-border)',
                    transition: 'width 0.2s, background 0.2s',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPreviewIdx(i => (i + 1) % previewOrder.length)}
              style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: 'var(--fs-xs)', flexShrink: 0 }}
            >→</button>
          </div>
        </div>
      )}

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
          {/* ── Current slides grid ── */}
          {slides.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', padding: '1rem 0', marginBottom: '2rem' }}>
              Inga bilder i slideshow. Lägg till nedan.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '0.5rem',
              marginBottom: '2rem',
            }}>
              {slides.map((slide, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDrop={e => handleDrop(e, i)}
                  onDragEnd={handleDragEnd}
                  style={{
                    position: 'relative',
                    border: dragOverIdx === i && draggingIdx !== i
                      ? '2px solid var(--color-accent)'
                      : editingIdx === i
                        ? '2px solid var(--color-accent)'
                        : '1px solid var(--color-border)',
                    background: 'var(--color-bg-surface)',
                    opacity: draggingIdx === i ? 0.35 : 1,
                    cursor: 'grab',
                    transition: 'opacity 0.1s, border-color 0.1s',
                  }}
                >
                  {/* Image */}
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slide.url}
                      alt={slide.alt}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.1' }}
                    />
                  </div>

                  {/* Number badge — top-left */}
                  <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.72)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.38rem', fontFamily: 'Georgia,serif', lineHeight: 1.4, pointerEvents: 'none' }}>
                    {i + 1}
                  </div>

                  {/* Remove — top-right */}
                  <button
                    type="button"
                    onClick={() => removeSlide(i)}
                    style={overlayBtn({ top: 4, right: 4, background: 'rgba(160,30,30,0.82)', color: '#fff' })}
                    title="Ta bort"
                  >✕</button>

                  {/* Edit URL — bottom-right (or top-right area when editing) */}
                  <button
                    type="button"
                    onClick={() => editingIdx === i ? cancelEdit() : startEdit(i)}
                    style={overlayBtn({
                      bottom: editingIdx === i ? undefined : 4,
                      top: editingIdx === i ? 4 : undefined,
                      right: editingIdx === i ? 24 : 4,
                      background: editingIdx === i ? 'rgba(201,169,76,0.9)' : 'rgba(40,40,40,0.82)',
                      color: editingIdx === i ? '#0a0a0a' : 'var(--color-muted)',
                    })}
                    title={editingIdx === i ? 'Avbryt redigering' : 'Redigera URL'}
                  >
                    {editingIdx === i ? '✕' : '✎'}
                  </button>

                  {/* Alt-text input — always visible below image */}
                  <div style={{ padding: '0.4rem' }}>
                    <input
                      type="text"
                      value={slide.alt}
                      onChange={e => updateSlide(i, 'alt', e.target.value)}
                      placeholder="Alt-text"
                      style={{
                        width: '100%',
                        background: 'var(--color-bg)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        fontSize: '0.6rem',
                        padding: '0.3rem 0.4rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Inline URL editor — shown when ✎ is active */}
                  {editingIdx === i && (
                    <div style={{ padding: '0 0.4rem 0.4rem', borderTop: '1px solid var(--color-border)' }}>
                      <input
                        type="url"
                        value={editingUrl}
                        onChange={e => setEditingUrl(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); commitEdit(i) }
                          if (e.key === 'Escape') cancelEdit()
                        }}
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
                          marginTop: '0.4rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                        placeholder="https://…"
                      />
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          type="button"
                          onClick={() => commitEdit(i)}
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
            </div>
          )}

          {/* ── Add section ── */}
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-lg)', marginBottom: '1rem', color: 'var(--color-muted)' }}>
            Lägg till bild
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {/* 1. Media picker */}
            <div><MediaPicker onPick={addFromMedia} /></div>

            {/* 2. Upload */}
            <div><UploadZone onUploaded={onUploaded} /></div>
          </div>

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
