'use client'

import { useState, useEffect } from 'react'

interface Settings {
  site_title: string
  site_subtitle: string
  hero_tagline: string
  contact_email: string
  about_short: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    site_title:    'Sivert Lindblom',
    site_subtitle: 'Skulptör · Konstnär · Stockholm',
    hero_tagline:  'Skulptur, offentlig konst, akvareller och scenografi sedan 1963',
    contact_email: 'info@sivertlindblom.se',
    about_short:   'Sivert Lindblom (f. 1931) är en av Sveriges mest betydande skulptörer. Han studerade vid Kungliga Konsthögskolan 1958–1963 och har sedan dess skapat ett omfattande verk av skulpturer, offentliga installationer, akvareller och scenografi.',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((d: Settings | { error: string }) => { if (!('error' in d)) setSettings(d) })
      .catch(() => {}) // silently fall back to defaults
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      const data = await res.json() as { ok?: boolean; message?: string; error?: string }
      if (data.ok) {
        setSaved(true)
        setSaveMsg(null)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setSaveMsg(data.message ?? null)
        setError(data.error ?? 'Fel vid sparning')
      }
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  const field = (key: keyof Settings, label: string, multiline = false) => (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</label>
      {multiline
        ? <textarea className="input" rows={4} value={settings[key]}
            onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
            style={{ resize: 'vertical', width: '100%' }} />
        : <input type="text" className="input" style={{ width: '100%' }} value={settings[key]}
            onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} />
      }
    </div>
  )

  return (
    <div style={{ padding: '3rem', maxWidth: 700 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.5rem' }}>Inställningar</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2.5rem' }}>
        Globala webbplatsinställningar — sparas i <code style={{ fontSize: 'var(--fs-xs)' }}>public/cms-data/settings.json</code>.
      </p>

      {error && (
        <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>
          {error}
          {saveMsg && <p style={{ marginTop: '0.5rem', color: '#aaa' }}>{saveMsg}</p>}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {field('site_title', 'Webbplatsens titel')}
        {field('site_subtitle', 'Undertitel')}
        {field('hero_tagline', 'Hero-tagline')}
        {field('contact_email', 'Kontakt e-post')}
        {field('about_short', 'Kort om konstnären', true)}

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sparar...' : 'Spara inställningar'}</button>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
        </div>
      </form>

      <hr className="divider" style={{ margin: '3rem 0' }} />

      <section>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '1rem' }}>Hur sparning fungerar</h2>
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', fontSize: 'var(--fs-sm)', lineHeight: 1.7 }}>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--color-text)' }}>Lokalt (npm run dev):</strong> Ändringar sparas direkt till <code style={{ fontSize: 'var(--fs-xs)' }}>public/cms-data/</code>. Committa dessa filer till git för att publicera på Vercel.
          </p>
          <p style={{ color: 'var(--color-muted)' }}>
            <strong style={{ color: 'var(--color-text)' }}>Vercel production:</strong> Filsystemet är skrivskyddat. Gör ändringar lokalt och pusha till git, eller konfigurera Supabase nedan.
          </p>
        </div>
      </section>
    </div>
  )
}
