'use client'

import { useState } from 'react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_title:    'Sivert Lindblom',
    site_subtitle: 'Skulptör · Konstnär · Stockholm',
    hero_tagline:  'Skulptur, offentlig konst, akvareller och scenografi sedan 1963',
    contact_email: 'info@sivertlindblom.se',
    about_short:   'Sivert Lindblom (f. 1931) är en av Sveriges mest betydande skulptörer. Han studerade vid Kungliga Konsthögskolan 1958–1963 och har sedan dess skapat ett omfattande verk av skulpturer, offentliga installationer, akvareller och scenografi.',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // TODO: POST to /api/admin/settings
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (key: keyof typeof settings, label: string, multiline = false) => (
    <div>
      <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</label>
      {multiline
        ? <textarea className="input" rows={4} value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} style={{ resize: 'vertical' }} />
        : <input type="text" className="input" value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))} />
      }
    </div>
  )

  return (
    <div style={{ padding: '3rem', maxWidth: 700 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.5rem' }}>Inställningar</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2.5rem' }}>
        Webbplatsens globala inställningar, sparas i Supabase-tabellen <code style={{ fontSize: 'var(--fs-xs)' }}>settings</code>.
      </p>

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
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '1.5rem' }}>Supabase-konfiguration</h2>
        <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', fontSize: 'var(--fs-sm)' }}>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>Sätt dessa i <code style={{ fontSize: 'var(--fs-xs)' }}>.env.local</code>:</p>
          {[
            ['NEXT_PUBLIC_SUPABASE_URL', 'Din Supabase projekt-URL'],
            ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Din anon-nyckel'],
            ['SUPABASE_SERVICE_ROLE_KEY', 'Din service role-nyckel'],
          ].map(([k, desc]) => (
            <div key={k} style={{ marginBottom: '1rem' }}>
              <code style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', marginBottom: '0.2rem' }}>{k}</code>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{desc}</span>
            </div>
          ))}
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', marginTop: '1rem' }}>
            Kör sedan <code>supabase/schema.sql</code> i Supabase SQL Editor, följt av <code>supabase/seed.sql</code>.
          </p>
        </div>
      </section>
    </div>
  )
}
