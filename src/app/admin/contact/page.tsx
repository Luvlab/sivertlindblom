'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ContactSettings {
  contact_email: string
  contact_intro: string
  contact_hero_height_vh: string
}

const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

export default function AdminContact() {
  const [form, setForm] = useState<ContactSettings>({ contact_email: '', contact_intro: '' })
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

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar…</div>

  return (
    <div style={{ padding: '3rem', maxWidth: 680 }}>
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Admin</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Kontakt</h1>
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
