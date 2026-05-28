'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import type { PublicWork } from '@/lib/public-works'

interface ContactSettings {
  contact_email: string
  contact_intro: string
  contact_hero_height_vh: string
  contact_hero_image: string
}

interface MediaImage {
  url: string
  alt: string
  work: string
}

const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

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
        type="button"
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
                {filtered.length} bilder — klicka för att välja
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
                    type="button"
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
            type="button"
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
          Bilden sparas i Media-databasen.
        </p>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AdminContact() {
  const [form, setForm] = useState<ContactSettings>({
    contact_email: '',
    contact_intro: '',
    contact_hero_height_vh: '100',
    contact_hero_image: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((s: Record<string, string>) => {
        setForm({
          contact_email: s.contact_email ?? '',
          contact_intro: s.contact_intro ?? '',
          contact_hero_height_vh: s.contact_hero_height_vh ?? '100',
          contact_hero_image: s.contact_hero_image ?? '',
        })
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const settingsRes = await fetch('/api/admin/settings')
      const current = await settingsRes.json() as Record<string, string>
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, ...form }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error ?? 'Fel vid sparning')
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Admin</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Kontakt</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          Kontaktuppgifter och introduktionstext som visas på kontaktsidan.
        </p>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Hero image picker */}
        <div>
          {lbl('Hero-bild (kontaktsidan)')}

          {form.contact_hero_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.contact_hero_image}
              alt="Hero-bild förhandsvisning"
              style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block', marginBottom: '0.75rem' }}
            />
          )}

          <MediaPicker onPick={img => setForm(f => ({ ...f, contact_hero_image: img.url }))} />
          <UploadZone onUploaded={url => setForm(f => ({ ...f, contact_hero_image: url }))} />

          <input
            type="url"
            className="input"
            style={{ width: '100%', fontSize: 'var(--fs-xs)', fontFamily: 'monospace', color: 'var(--color-muted)' }}
            value={form.contact_hero_image}
            onChange={e => setForm(f => ({ ...f, contact_hero_image: e.target.value }))}
            placeholder="https://…"
          />
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.35rem' }}>Bild-URL</p>
        </div>

        <div>
          {lbl('E-postadress')}
          <input
            type="email"
            className="input"
            style={{ width: '100%' }}
            value={form.contact_email}
            onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
            placeholder="info@sivertlindblom.se"
          />
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
            Visas på kontaktsidan och används för meddelandeformuläret.
          </p>
        </div>

        <div>
          {lbl('Introduktionstext (kontaktsidan)')}
          <textarea
            className="input"
            rows={4}
            style={{ width: '100%', resize: 'vertical' }}
            value={form.contact_intro}
            onChange={e => setForm(f => ({ ...f, contact_intro: e.target.value }))}
            placeholder="En kort text som visas överst på kontaktsidan…"
          />
        </div>

        <div>
          {lbl('Hjältebild höjd (dvh)')}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input
              type="range"
              min={40}
              max={150}
              step={5}
              value={form.contact_hero_height_vh}
              onChange={e => setForm(f => ({ ...f, contact_hero_height_vh: e.target.value }))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', minWidth: '3.5rem' }}>
              {form.contact_hero_height_vh} dvh
            </span>
          </div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
            100 = full skärmhöjd. Öka över 100 för att täcka bakom navigationen också.
          </p>
        </div>

        {/* Static info (read-only display) */}
        <div style={{ border: '1px solid var(--color-border)', borderRadius: 2, padding: '1.25rem', background: 'var(--color-bg-surface)' }}>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Övrig kontaktinfo (visas på sidan)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', gap: '0.6rem', fontSize: 'var(--fs-sm)' }}>
            <span style={{ color: 'var(--color-muted)' }}>Redaktör</span>
            <span>Jan Öqvist</span>
            <span style={{ color: 'var(--color-muted)' }}>Webb</span>
            <span>sivertlindblom.se</span>
          </div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.75rem' }}>
            Redaktörens namn och webbadress är hårdkodade i kontaktsidans mall.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar…' : 'Spara'}
          </button>
          {saved && <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)' }}>✓ Sparad</span>}
          <Link href="/sv/contact" target="_blank" style={{ marginLeft: 'auto', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
            ↗ Visa kontaktsidan
          </Link>
        </div>
      </form>
    </div>
  )
}
