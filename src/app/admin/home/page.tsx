'use client'

import { useState, useEffect } from 'react'

interface Slide {
  url: string
  alt: string
}

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
    <div style={{ padding: '3rem', maxWidth: 900 }}>
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
          {/* Slide list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {slides.map((slide, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 1fr auto',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: 60, height: 40, overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.url}
                    alt={slide.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
                  />
                </div>

                {/* URL */}
                <input
                  type="url"
                  className="input"
                  value={slide.url}
                  onChange={e => updateSlide(i, 'url', e.target.value)}
                  placeholder="https://…"
                  style={{ fontSize: 'var(--fs-xs)' }}
                />

                {/* Alt */}
                <input
                  type="text"
                  className="input"
                  value={slide.alt}
                  onChange={e => updateSlide(i, 'alt', e.target.value)}
                  placeholder="Alt-text"
                  style={{ fontSize: 'var(--fs-xs)' }}
                />

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="btn"
                    style={{ padding: '0.3em 0.6em', fontSize: '0.7rem', opacity: i === 0 ? 0.3 : 1 }}
                    title="Flytta upp"
                  >↑</button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === slides.length - 1}
                    className="btn"
                    style={{ padding: '0.3em 0.6em', fontSize: '0.7rem', opacity: i === slides.length - 1 ? 0.3 : 1 }}
                    title="Flytta ned"
                  >↓</button>
                  <button
                    onClick={() => removeSlide(i)}
                    style={{ padding: '0.3em 0.6em', fontSize: '0.7rem', background: 'none', border: '1px solid #a33', color: '#e55', cursor: 'pointer' }}
                    title="Ta bort"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Add image */}
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            padding: '1.5rem',
            marginBottom: '2rem',
          }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-base)', marginBottom: '1rem' }}>
              Lägg till bild
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
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
                <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
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
              <button className="btn btn-primary" onClick={addSlide}>
                + Lägg till
              </button>
            </div>
          </div>

          {/* Save */}
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
