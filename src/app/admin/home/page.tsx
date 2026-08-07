'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import type { PublicWork } from '@/lib/public-works'
import { uploadImageFile } from '@/lib/upload-image'
import type { HomeContent } from '@/lib/data-server'
import { HOME_CONTENT_DEFAULTS } from '@/lib/data-server'

interface Slide {
  url: string
  alt: string
  focal?: string
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
            if (typeof url === 'string' && url) collected.push({ url, alt: '', work: text.title })
          }
        }
      }
      const uploadsData = await uploadsRes.json() as { files?: Array<{ url: string; alt: string }> } | { error: string }
      if (!('error' in uploadsData) && uploadsData.files) {
        for (const f of uploadsData.files) collected.push({ url: f.url, alt: f.alt ?? '', work: 'Uppladdningar' })
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
                      <img src={img.url} alt={img.alt} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--color-muted)', padding: '0.25rem 0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      const d = await uploadImageFile(file, uploadAlt)
      if (d.url) { onUploaded(d.url, uploadAlt); setUploadAlt('') }
      else setUploadErr(d.error ?? 'Uppladdning misslyckades')
    } catch (e) {
      setUploadErr(String(e))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div style={{ border: '1px solid var(--color-border)', marginBottom: '1rem', background: 'var(--color-bg-surface)' }}>
      <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
        ↑ Ladda upp ny bild
      </div>
      <div style={{ padding: '1rem' }}>
        {uploadErr && <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.5rem 0.75rem', fontSize: 'var(--fs-xs)', marginBottom: '0.75rem' }}>{uploadErr}</div>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Alt-text (valfri)</label>
            <input type="text" className="input" value={uploadAlt} onChange={e => setUploadAlt(e.target.value)} placeholder="Beskriv bilden" />
          </div>
          <button className="btn btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ whiteSpace: 'nowrap' }}>
            {uploading ? 'Laddar upp…' : '+ Välj fil'}
          </button>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith('image/')) upload(f) }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--color-accent)' : 'var(--color-border)'}`,
            borderRadius: 2, padding: '1.5rem', textAlign: 'center', cursor: 'pointer',
            color: dragOver ? 'var(--color-accent)' : 'var(--color-muted)',
            fontSize: 'var(--fs-xs)', transition: 'border-color 0.15s, color 0.15s',
            background: dragOver ? 'rgba(201,168,76,0.04)' : 'transparent',
          }}
        >
          {uploading ? '⏳ Laddar upp…' : 'Dra & släpp bild här, eller klicka'}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }} />
      </div>
    </div>
  )
}

// ── Section heading helper ───────────────────────────────────────────────────

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
      <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)', margin: 0 }}>{title}</h2>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '0.3rem', lineHeight: 1.5 }}>{hint}</p>}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AdminHome() {
  // ── Slideshow state ──────────────────────────────────────────────────────
  const [slides, setSlides] = useState<Slide[]>([])
  const [random, setRandom] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')

  const [loadingVault, setLoadingVault] = useState(false)
  const [vaultMode, setVaultMode] = useState(false)
  const savedSlidesRef = useRef<Slide[]>([])
  const savedRandomRef = useRef(true)

  const [previewing, setPreviewing] = useState(false)
  const [previewIdx, setPreviewIdx] = useState(0)
  const [previewOrder, setPreviewOrder] = useState<Slide[]>([])
  const previewTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState('')

  const [dims, setDims] = useState<Record<string, { w: number; h: number }>>({})
  function noteDims(url: string, el: HTMLImageElement) {
    const w = el.naturalWidth, h = el.naturalHeight
    if (!w || !h) return
    setDims(prev => prev[url] ? prev : { ...prev, [url]: { w, h } })
  }

  const [baseline, setBaseline] = useState<string>('')
  const currentState = JSON.stringify({ slides, random })
  const isDirty = !loading && baseline !== '' && currentState !== baseline

  // ── Content state (all other homepage sections) ──────────────────────────
  const [content, setContent] = useState<HomeContent>({ ...HOME_CONTENT_DEFAULTS })
  const [contentBaseline, setContentBaseline] = useState<string>('')
  const [savingContent, setSavingContent] = useState(false)
  const [contentMsg, setContentMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)
  const isContentDirty = !loading && contentBaseline !== '' && JSON.stringify(content) !== contentBaseline

  function setField(field: keyof HomeContent, value: string) {
    setContent(prev => ({ ...prev, [field]: value }))
  }

  // ── Load ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/home')
      .then(r => r.json())
      .then((d: { slides: Slide[]; random?: boolean; content?: Partial<HomeContent> } | { error: string }) => {
        if ('slides' in d) {
          setSlides(d.slides)
          setRandom(d.random ?? true)
          setBaseline(JSON.stringify({ slides: d.slides, random: d.random ?? true }))
          const loaded = { ...HOME_CONTENT_DEFAULTS, ...d.content }
          setContent(loaded)
          setContentBaseline(JSON.stringify(loaded))
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isDirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  // ── Preview ───────────────────────────────────────────────────────────────
  function startPreview() {
    if (slides.length === 0) return
    const order = random ? [...slides].sort(() => Math.random() - 0.5) : [...slides]
    setPreviewOrder(order); setPreviewIdx(0); setPreviewing(true)
  }
  useEffect(() => {
    if (!previewing || previewOrder.length === 0) return
    previewTimer.current = setInterval(() => setPreviewIdx(i => (i + 1) % previewOrder.length), 3000)
    return () => { if (previewTimer.current) clearInterval(previewTimer.current) }
  }, [previewing, previewOrder])

  // ── Save slideshow ────────────────────────────────────────────────────────
  async function save() {
    setSaving(true); setMessage(null)
    try {
      const r = await fetch('/api/admin/home', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slides, random }) })
      const d = await r.json() as { ok?: boolean; error?: string }
      if (d.ok) { setMessage({ type: 'ok', text: 'Slideshow sparad!' }); setBaseline(JSON.stringify({ slides, random })) }
      else setMessage({ type: 'error', text: d.error ?? 'Fel vid sparning' })
    } catch (e) { setMessage({ type: 'error', text: String(e) }) }
    finally { setSaving(false) }
  }

  // ── Save content ──────────────────────────────────────────────────────────
  async function saveContent() {
    setSavingContent(true); setContentMsg(null)
    try {
      const r = await fetch('/api/admin/home', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) })
      const d = await r.json() as { ok?: boolean; error?: string }
      if (d.ok) { setContentMsg({ type: 'ok', text: 'Innehåll sparat!' }); setContentBaseline(JSON.stringify(content)) }
      else setContentMsg({ type: 'error', text: d.error ?? 'Fel vid sparning' })
    } catch (e) { setContentMsg({ type: 'error', text: String(e) }) }
    finally { setSavingContent(false) }
  }

  // ── Slide helpers ─────────────────────────────────────────────────────────
  function removeSlide(i: number) { if (editingIdx === i) setEditingIdx(null); setSlides(prev => prev.filter((_, idx) => idx !== i)) }
  function updateSlide(i: number, field: 'url' | 'alt', value: string) { setSlides(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s)) }
  function addSlide() { if (!newUrl.trim()) return; setSlides(prev => [...prev, { url: newUrl.trim(), alt: newAlt.trim() }]); setNewUrl(''); setNewAlt('') }
  function addFromMedia(img: MediaImage) {
    setSlides(prev => { if (prev.some(s => s.url === img.url)) return prev; return [...prev, { url: img.url, alt: img.alt }] })
    setMessage({ type: 'ok', text: `Lade till: ${img.alt || img.work}` }); setTimeout(() => setMessage(null), 2500)
  }
  function onUploaded(url: string, alt: string) {
    setSlides(prev => [...prev, { url, alt }])
    setMessage({ type: 'ok', text: 'Bild uppladdad och tillagd i slideshow!' }); setTimeout(() => setMessage(null), 3000)
  }

  async function loadAllVaultMedia() {
    savedSlidesRef.current = [...slides]; savedRandomRef.current = random
    setLoadingVault(true); setMessage(null)
    try {
      const collected: Slide[] = []
      const [worksRes, textsRes, uploadsRes] = await Promise.all([fetch('/api/admin/public-works'), fetch('/api/admin/texts'), fetch('/api/admin/upload')])
      const worksData = await worksRes.json() as PublicWork[] | { error: string }
      if (!('error' in worksData)) for (const work of worksData) for (const img of work.images ?? []) collected.push({ url: img.url, alt: img.alt ?? '' })
      const textsData = await textsRes.json() as Array<{ title: string; images?: string[] }> | { error: string }
      if (!('error' in textsData)) for (const text of textsData) for (const url of text.images ?? []) if (typeof url === 'string' && url) collected.push({ url, alt: '' })
      const uploadsData = await uploadsRes.json() as { files?: Array<{ url: string; alt: string }> } | { error: string }
      if (!('error' in uploadsData) && uploadsData.files) for (const f of uploadsData.files) collected.push({ url: f.url, alt: f.alt ?? '' })
      const shuffled = [...collected]
      for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] }
      setSlides(shuffled); setRandom(true); setVaultMode(true)
      setMessage({ type: 'ok', text: `${shuffled.length} bilder laddade från mediavaulten.` }); setTimeout(() => setMessage(null), 8000)
    } catch (e) { setMessage({ type: 'error', text: String(e) }) }
    finally { setLoadingVault(false) }
  }

  function restoreList() { setSlides(savedSlidesRef.current); setRandom(savedRandomRef.current); setVaultMode(false); setMessage(null) }

  // ── Drag ──────────────────────────────────────────────────────────────────
  function handleDragStart(idx: number) { setDraggingIdx(idx) }
  function handleDragOver(e: React.DragEvent, idx: number) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (idx !== dragOverIdx) setDragOverIdx(idx) }
  function handleDrop(e: React.DragEvent, idx: number) {
    e.preventDefault(); if (draggingIdx === null || draggingIdx === idx) return
    const next = [...slides]; const [removed] = next.splice(draggingIdx, 1); next.splice(idx, 0, removed)
    setSlides(next); setDraggingIdx(null); setDragOverIdx(null)
  }
  function handleDragEnd() { setDraggingIdx(null); setDragOverIdx(null) }

  // ── Focal point ───────────────────────────────────────────────────────────
  function setFocal(idx: number, e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect()
    const x = Math.round(((e.clientX - r.left) / r.width) * 100)
    const y = Math.round(((e.clientY - r.top) / r.height) * 100)
    const clamp = (n: number) => Math.max(0, Math.min(100, n))
    setSlides(prev => prev.map((s, i) => i === idx ? { ...s, focal: `${clamp(x)}% ${clamp(y)}%` } : s))
  }
  function clearFocal(idx: number) {
    setSlides(prev => prev.map((s, i) => { if (i !== idx) return s; const { focal, ...rest } = s; void focal; return rest }))
  }
  function focalXY(focal?: string): { x: number; y: number } {
    const m = (focal ?? '').match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/)
    return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 50, y: 50 }
  }

  // ── Inline URL edit ───────────────────────────────────────────────────────
  function startEdit(idx: number) { setEditingIdx(idx); setEditingUrl(slides[idx].url) }
  function commitEdit(idx: number) { const t = editingUrl.trim(); if (t) updateSlide(idx, 'url', t); setEditingIdx(null) }
  function cancelEdit() { setEditingIdx(null); setEditingUrl('') }

  const overlayBtn = (extra?: React.CSSProperties): React.CSSProperties => ({
    position: 'absolute', padding: '0.2rem 0.4rem', fontSize: '0.65rem', lineHeight: 1,
    border: 'none', borderRadius: 2, cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'opacity 0.12s', ...extra,
  })

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--color-bg)', border: '1px solid var(--color-border)',
    color: 'var(--color-text)', fontSize: 'var(--fs-sm)', padding: '0.5rem 0.75rem', outline: 'none',
  }
  const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical', lineHeight: 1.6 }

  return (
    <div style={{ padding: 'clamp(1.5rem, 3vw, 3rem)', width: '100%', boxSizing: 'border-box' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — HERO SLIDESHOW
      ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Startsida</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Hero Slideshow</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{loading ? 'Laddar…' : `${slides.length} bilder i slideshow`}</p>
          {!loading && slides.length > 0 && (
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', marginTop: '0.35rem', maxWidth: '52ch', lineHeight: 1.6 }}>
              Tips: <strong style={{ color: 'var(--color-text)' }}>Klicka på motivet</strong> i en bild för att välja vad som ska synas. Klicka på ◎ för att återgå till mitten.
            </p>
          )}
        </div>
        {!loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setRandom(r => !r)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem',
              fontSize: 'var(--fs-xs)', letterSpacing: '0.06em', textTransform: 'uppercase',
              border: `1px solid ${random ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: random ? 'rgba(201,169,76,0.12)' : 'transparent',
              color: random ? 'var(--color-accent)' : 'var(--color-muted)', cursor: 'pointer', borderRadius: 2,
            }}>
              <span style={{ fontSize: '0.9em' }}>{random ? '⇄' : '→'}</span>
              {random ? 'Slumpad' : 'I ordning'}
            </button>
            <button className="btn btn-primary" onClick={save} disabled={saving} style={{
              fontSize: 'var(--fs-xs)', padding: '0.45rem 0.85rem', minWidth: 80,
              ...(isDirty ? { boxShadow: '0 0 0 2px var(--color-accent)' } : {}),
            }}>
              {saving ? 'Sparar…' : isDirty ? '● Spara' : 'Spara'}
            </button>
            {isDirty && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', whiteSpace: 'nowrap' }}>Osparade ändringar</span>}
            {vaultMode ? (
              <button type="button" onClick={restoreList} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem',
                fontSize: 'var(--fs-xs)', letterSpacing: '0.06em', textTransform: 'uppercase',
                border: '1px solid var(--color-accent)', background: 'rgba(201,169,76,0.12)',
                color: 'var(--color-accent)', cursor: 'pointer', borderRadius: 2,
              }}>↩ Tillbaka till listan</button>
            ) : (
              <button type="button" onClick={loadAllVaultMedia} disabled={loadingVault} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem',
                fontSize: 'var(--fs-xs)', letterSpacing: '0.06em', textTransform: 'uppercase',
                border: '1px solid var(--color-border)', background: 'transparent',
                color: loadingVault ? 'var(--color-muted)' : 'var(--color-text)',
                cursor: loadingVault ? 'default' : 'pointer', borderRadius: 2, opacity: loadingVault ? 0.6 : 1,
              }}>
                <span>🎲</span>{loadingVault ? 'Laddar…' : 'Hela mediavaulten'}
              </button>
            )}
            {slides.length > 0 && (
              <button type="button" onClick={() => previewing ? setPreviewing(false) : startPreview()} className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.45rem 0.85rem' }}>
                {previewing ? '✕ Stäng förhandsgranskning' : '▶ Förhandsgranska'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview */}
      {previewing && previewOrder.length > 0 && (
        <div style={{ marginBottom: '2rem', border: '1px solid var(--color-border)', background: '#000', position: 'relative', borderRadius: 2 }}>
          <div style={{ aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
            {previewOrder.map((slide, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={slide.url} alt={slide.alt} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: slide.focal || 'center',
                opacity: i === previewIdx ? 1 : 0, transition: 'opacity 0.8s ease-in-out', display: 'block',
              }} />
            ))}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', zIndex: 2,
            }}>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em' }}>{previewOrder[previewIdx]?.alt || '—'}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.45)', fontFamily: 'Georgia, serif' }}>{previewIdx + 1} / {previewOrder.length}</span>
            </div>
          </div>
          <div style={{ padding: '0.6rem 1rem', background: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setPreviewIdx(i => (i - 1 + previewOrder.length) % previewOrder.length)} style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: 'var(--fs-xs)' }}>←</button>
            <div style={{ flex: 1, display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {previewOrder.map((_, i) => (
                <button key={i} type="button" onClick={() => setPreviewIdx(i)} style={{
                  width: i === previewIdx ? 18 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
                  background: i === previewIdx ? 'var(--color-accent)' : 'var(--color-border)', transition: 'width 0.2s, background 0.2s',
                }} />
              ))}
            </div>
            <button type="button" onClick={() => setPreviewIdx(i => (i + 1) % previewOrder.length)} style={{ background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', padding: '0.2rem 0.6rem', cursor: 'pointer', fontSize: 'var(--fs-xs)' }}>→</button>
          </div>
        </div>
      )}

      {message && (
        <div style={{
          background: message.type === 'ok' ? '#0a2a0a' : '#2a0a0a',
          border: `1px solid ${message.type === 'ok' ? '#3a7a3a' : '#a33'}`,
          color: message.type === 'ok' ? '#6f6' : '#f88',
          padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem',
        }}>{message.text}</div>
      )}

      {loading ? <p style={{ color: 'var(--color-muted)' }}>Laddar…</p> : (
        <>
          {/* Slides grid */}
          {slides.length === 0 ? (
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', padding: '1rem 0', marginBottom: '2rem' }}>Inga bilder i slideshow. Lägg till nedan.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '2rem' }}>
              {slides.map((slide, i) => (
                <div key={i} draggable
                  onDragStart={() => handleDragStart(i)} onDragOver={e => handleDragOver(e, i)} onDrop={e => handleDrop(e, i)} onDragEnd={handleDragEnd}
                  style={{
                    position: 'relative', background: 'var(--color-bg-surface)', cursor: 'grab', transition: 'opacity 0.1s, border-color 0.1s',
                    border: dragOverIdx === i && draggingIdx !== i ? '2px solid var(--color-accent)' : editingIdx === i ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    opacity: draggingIdx === i ? 0.35 : 1,
                  }}
                >
                  <div onClick={e => setFocal(i, e)} title="Klicka på motivet" style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#111', position: 'relative', cursor: 'crosshair' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.url} alt={slide.alt} loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', objectPosition: slide.focal || 'center', pointerEvents: 'none' }}
                      onLoad={e => noteDims(slide.url, e.currentTarget)}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.1' }}
                    />
                    {slide.focal && (() => { const { x, y } = focalXY(slide.focal); return <span aria-hidden="true" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 16, height: 16, marginLeft: -8, marginTop: -8, border: '2px solid var(--color-accent)', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(0,0,0,0.55)', pointerEvents: 'none' }} /> })()}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', padding: '0.3rem 0.45rem', fontSize: '0.6rem', lineHeight: 1.4, borderTop: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
                    <span style={{ color: slide.focal ? 'var(--color-accent)' : 'var(--color-muted)', whiteSpace: 'nowrap' }}>◎ {slide.focal ?? 'mitten'}</span>
                    <span style={{ color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>{dims[slide.url] ? `${dims[slide.url].w}×${dims[slide.url].h}` : '…'}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.72)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.38rem', fontFamily: 'Georgia,serif', lineHeight: 1.4, pointerEvents: 'none' }}>{i + 1}</div>
                  <button type="button" onClick={() => removeSlide(i)} style={overlayBtn({ top: 4, right: 4, background: 'rgba(160,30,30,0.82)', color: '#fff' })} title="Ta bort">✕</button>
                  <button type="button" onClick={() => editingIdx === i ? cancelEdit() : startEdit(i)} style={overlayBtn({ top: editingIdx === i ? 4 : 28, right: editingIdx === i ? 24 : 4, background: editingIdx === i ? 'rgba(201,169,76,0.9)' : 'rgba(40,40,40,0.82)', color: editingIdx === i ? '#0a0a0a' : 'var(--color-muted)' })}>
                    {editingIdx === i ? '✕' : '✎'}
                  </button>
                  {slide.focal && <button type="button" onClick={() => clearFocal(i)} style={overlayBtn({ top: 28, left: 4, background: 'rgba(201,169,76,0.9)', color: '#0a0a0a' })} title="Återgå till mitten">◎</button>}
                  <div style={{ padding: '0.4rem' }}>
                    <input type="text" value={slide.alt} onChange={e => updateSlide(i, 'alt', e.target.value)} placeholder="Alt-text"
                      style={{ width: '100%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.6rem', padding: '0.3rem 0.4rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {editingIdx === i && (
                    <div style={{ padding: '0 0.4rem 0.4rem', borderTop: '1px solid var(--color-border)' }}>
                      <input type="url" value={editingUrl} onChange={e => setEditingUrl(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commitEdit(i) } if (e.key === 'Escape') cancelEdit() }}
                        autoFocus style={{ width: '100%', background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', fontSize: '0.6rem', fontFamily: 'monospace', padding: '0.3rem 0.4rem', marginBottom: '0.35rem', marginTop: '0.4rem', outline: 'none', boxSizing: 'border-box' }} placeholder="https://…"
                      />
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button type="button" onClick={() => commitEdit(i)} style={{ flex: 1, padding: '0.25em', fontSize: '0.65rem', background: 'var(--color-accent)', color: '#0a0a0a', border: 'none', cursor: 'pointer', borderRadius: 1 }}>✓ Spara</button>
                        <button type="button" onClick={cancelEdit} style={{ flex: 1, padding: '0.25em', fontSize: '0.65rem', background: 'none', color: 'var(--color-muted)', border: '1px solid var(--color-border)', cursor: 'pointer', borderRadius: 1 }}>Avbryt</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add slide */}
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-lg)', marginBottom: '1rem', color: 'var(--color-muted)' }}>Lägg till bild</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div><MediaPicker onPick={addFromMedia} /></div>
            <div><UploadZone onUploaded={onUploaded} /></div>
          </div>
          <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', marginBottom: '4rem' }}>
            <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid var(--color-border)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>🔗 Klistra in URL</div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Bild URL *</label>
                  <input type="url" className="input" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://…" onKeyDown={e => e.key === 'Enter' && addSlide()} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Alt-text</label>
                  <input type="text" className="input" value={newAlt} onChange={e => setNewAlt(e.target.value)} placeholder="Beskriv bilden" onKeyDown={e => e.key === 'Enter' && addSlide()} />
                </div>
                <button className="btn btn-primary" onClick={addSlide}>+ Lägg till</button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              CONTENT EDITOR — all non-slide homepage sections
          ══════════════════════════════════════════════════════════════════ */}
          <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '3rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Startsida</p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', margin: 0 }}>Text & innehåll</h2>
              <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginTop: '0.4rem' }}>Redigera alla texter, siffror och länkar på startsidan.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={saveContent} disabled={savingContent} style={{
                fontSize: 'var(--fs-xs)', padding: '0.45rem 0.85rem', minWidth: 100,
                ...(isContentDirty ? { boxShadow: '0 0 0 2px var(--color-accent)' } : {}),
              }}>
                {savingContent ? 'Sparar…' : isContentDirty ? '● Spara innehåll' : 'Spara innehåll'}
              </button>
              {isContentDirty && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>Osparade ändringar</span>}
            </div>
          </div>

          {contentMsg && (
            <div style={{
              background: contentMsg.type === 'ok' ? '#0a2a0a' : '#2a0a0a',
              border: `1px solid ${contentMsg.type === 'ok' ? '#3a7a3a' : '#a33'}`,
              color: contentMsg.type === 'ok' ? '#6f6' : '#f88',
              padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem',
            }}>{contentMsg.text}</div>
          )}

          {/* ── Hero text ── */}
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeading label="Sektion 1" title="Hero — namn & tagline" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: '1.5rem' }}>
              <Field label="Konstnärens namn (H1 i hero)">
                <input style={inputStyle} value={content.siteTitle} onChange={e => setField('siteTitle', e.target.value)} placeholder="Sivert Lindblom" />
              </Field>
              <Field label="Tagline" hint="Visas som undertext under namnet i hero-bilden.">
                <textarea style={{ ...textareaStyle, minHeight: 72 }} value={content.tagline} onChange={e => setField('tagline', e.target.value)} placeholder="Skulptur, offentlig konst…" />
              </Field>
            </div>
          </div>

          {/* ── Press quote + audio ── */}
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeading label="Sektion 2" title="Recension — citat & ljudklipp" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: '1.5rem' }}>
              <Field label="Citat (blockquote)" hint="Recensionscitatet som visas i kursiv stil.">
                <textarea style={{ ...textareaStyle, minHeight: 96 }} value={content.pressQuote} onChange={e => setField('pressQuote', e.target.value)} placeholder="»Någonting pågår…«" />
              </Field>
              <div>
                <Field label="Recensentens namn">
                  <input style={inputStyle} value={content.pressAttribution} onChange={e => setField('pressAttribution', e.target.value)} placeholder="Karsten Thurfjell" />
                </Field>
                <Field label="Källa (publikation & datum)">
                  <input style={inputStyle} value={content.pressSource} onChange={e => setField('pressSource', e.target.value)} placeholder="Kulturnytt, Sveriges Radio P1 · 4 aug 2016" />
                </Field>
                <Field label="Längd på klippet">
                  <input style={inputStyle} value={content.pressDuration} onChange={e => setField('pressDuration', e.target.value)} placeholder="3:20 min" />
                </Field>
              </div>
              <Field label="Ljudfil URL (mp3/ogg)" hint="Direktlänk till ljudfilen — visas i inbyggd audiospelare.">
                <input style={inputStyle} value={content.audioUrl} onChange={e => setField('audioUrl', e.target.value)} placeholder="https://…" type="url" />
              </Field>
              <Field label="Länk till artikeln" hint="Länken 'Lyssna på inslaget' pekar hit (öppnas i ny flik).">
                <input style={inputStyle} value={content.audioLink} onChange={e => setField('audioLink', e.target.value)} placeholder="https://sverigesradio.se/…" type="url" />
              </Field>
            </div>
          </div>

          {/* ── About ── */}
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeading label="Sektion 3" title="Om konstnären — bio & statistik" />
            <Field label="Biografitext" hint="Kortfattad presentation. Visas till vänster i Om-sektionen.">
              <textarea style={{ ...textareaStyle, minHeight: 120 }} value={content.aboutText} onChange={e => setField('aboutText', e.target.value)} placeholder="Sivert Lindblom (f. 1931) är en av Sveriges mest betydande skulptörer…" />
            </Field>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Statistikrutor (siffra + etikett)</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {([
                ['statNActive', 'År aktiv (siffra)', 'stat_active'],
                ['statNPublic', 'Offentliga verk (siffra)', 'stat_public'],
                ['statNCountries', 'Länder (siffra)', 'stat_countries'],
                ['statNBorn', 'Födelseår (siffra)', 'stat_born'],
              ] as const).map(([field, label]) => (
                <div key={field} style={{ border: '1px solid var(--color-border)', padding: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>{label}</label>
                  <input style={{ ...inputStyle, fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', textAlign: 'center', color: 'var(--color-accent)' }}
                    value={content[field]} onChange={e => setField(field, e.target.value)} placeholder="60+" />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '0.75rem', lineHeight: 1.5 }}>
              Etiketterna (t.ex. "År aktiv", "Länder") är flertsidiga och redigeras i lokaliseringsfiler.
            </p>
          </div>

          {/* ── Contact CTA ── */}
          <div style={{ marginBottom: '3rem' }}>
            <SectionHeading label="Sektion 4" title="Kontakt — bakgrundsbild" />
            <Field label="Bakgrundsbild URL" hint="Bilden som visas bakom kontakt-CTA-sektionen längst ner på startsidan.">
              <input style={inputStyle} value={content.contactImage} onChange={e => setField('contactImage', e.target.value)} placeholder="https://…" type="url" />
            </Field>
            {content.contactImage && (
              <div style={{ marginTop: '0.75rem', position: 'relative', maxWidth: 480, aspectRatio: '16/5', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={content.contactImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.48)' }} />
                <span style={{ position: 'absolute', bottom: 8, left: 12, fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em' }}>Förhandsgranskning</span>
              </div>
            )}
            <p style={{ fontSize: '0.68rem', color: 'var(--color-muted)', marginTop: '0.75rem', lineHeight: 1.5 }}>
              Titeln ("Kontakt") och texterna i denna sektion redigeras i lokaliseringsfiler.
            </p>
          </div>

          {/* Bottom save */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" onClick={saveContent} disabled={savingContent} style={{
              fontSize: 'var(--fs-sm)', padding: '0.6rem 1.5rem',
              ...(isContentDirty ? { boxShadow: '0 0 0 2px var(--color-accent)' } : {}),
            }}>
              {savingContent ? 'Sparar…' : '💾 Spara innehåll'}
            </button>
            {isContentDirty && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>Du har osparade ändringar</span>}
          </div>
        </>
      )}
    </div>
  )
}
