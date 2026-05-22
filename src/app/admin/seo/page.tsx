'use client'

import { useState, useEffect, useRef } from 'react'

interface SeoSettings {
  site_title: string
  og_title: string
  og_description: string
  og_image: string
  meta_description: string
}

const DEFAULTS: SeoSettings = {
  site_title:       'Sivert Lindblom',
  og_title:         '',
  og_description:   '',
  og_image:         'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',
  meta_description: '',
}

export default function AdminSeo() {
  const [s, setS] = useState<SeoSettings>(DEFAULTS)
  const [allSettings, setAllSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [error,  setError]  = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((d: Record<string, string>) => {
        if (!('error' in d)) {
          setAllSettings(d)
          setS({
            site_title:       d.site_title       || DEFAULTS.site_title,
            og_title:         d.og_title         || '',
            og_description:   d.og_description   || '',
            og_image:         d.og_image         || DEFAULTS.og_image,
            meta_description: d.meta_description || '',
          })
        }
      })
      .catch(() => {})
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const merged = { ...allSettings, ...s }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(data.error ?? 'Fel vid sparning')
      }
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  const displayTitle = s.og_title.trim() || `${s.site_title} — Skulptör`
  const displayDesc  = s.og_description.trim() || 'Skulptur, offentlig konst, akvareller och scenografi sedan 1963.'
  const displayMetaDesc = s.meta_description.trim() || s.og_description.trim() || 'Officiell webbplats för skulptören Sivert Lindblom (f. 1931). Skulptur, offentlig konst, akvareller och scenografi sedan 1963.'
  const imgUrl       = s.og_image.trim() || DEFAULTS.og_image

  return (
    <div style={{ padding: '3rem', maxWidth: 760 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>
        SEO &amp; Social delning
      </h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2.5rem' }}>
        Styr hur webbplatsen visas i Google och på sociala medier (Facebook, LinkedIn, X/Twitter, iMessage m.fl.)
      </p>

      {error && (
        <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88', borderRadius: 4 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* ── Meta description ──────────────────────────────── */}
        <section>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '0.25rem' }}>Google-beskrivning</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', marginBottom: '1rem' }}>
            Visas under sidtiteln i Google-sökresultat. Lämna tomt för att använda beskrivningstexten för sociala medier nedan.
          </p>
          <label style={labelStyle}>META DESCRIPTION</label>
          <textarea
            className="input"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            placeholder="Lämna tomt för att använda OG-beskrivningen"
            value={s.meta_description}
            onChange={e => setS(p => ({ ...p, meta_description: e.target.value }))}
          />
          <div style={{ fontSize: 'var(--fs-xs)', color: s.meta_description.length > 160 ? '#f87' : 'var(--color-muted)', marginTop: '0.4rem' }}>
            {s.meta_description.length} / 160 tecken (rekommenderat max)
          </div>
        </section>

        {/* ── Open Graph / Social ───────────────────────────── */}
        <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '0.25rem' }}>Open Graph — sociala medier</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', marginBottom: '1.5rem' }}>
            Används av Facebook, LinkedIn, X/Twitter, iMessage, Slack och andra tjänster när en länk delas.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>TITEL (lämna tomt för standard)</label>
              <input
                type="text"
                className="input"
                style={{ width: '100%' }}
                placeholder={`${s.site_title} — Skulptör`}
                value={s.og_title}
                onChange={e => setS(p => ({ ...p, og_title: e.target.value }))}
              />
              <div style={{ fontSize: 'var(--fs-xs)', color: s.og_title.length > 70 ? '#f87' : 'var(--color-muted)', marginTop: '0.4rem' }}>
                {s.og_title.length} / 70 tecken
              </div>
            </div>

            <div>
              <label style={labelStyle}>BESKRIVNING</label>
              <textarea
                className="input"
                rows={3}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Skulptur, offentlig konst, akvareller och scenografi sedan 1963. Offentliga verk i Stockholm, New York, Malmö och Tokyo."
                value={s.og_description}
                onChange={e => setS(p => ({ ...p, og_description: e.target.value }))}
              />
              <div style={{ fontSize: 'var(--fs-xs)', color: s.og_description.length > 200 ? '#f87' : 'var(--color-muted)', marginTop: '0.4rem' }}>
                {s.og_description.length} / 200 tecken
              </div>
            </div>

            <div>
              <label style={labelStyle}>BILD-URL (og:image)</label>
              <input
                type="url"
                className="input"
                style={{ width: '100%' }}
                placeholder="https://..."
                value={s.og_image}
                onChange={e => setS(p => ({ ...p, og_image: e.target.value }))}
              />
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
                Rekommenderad storlek: 1200×630 px. Bilden visas som förhandsgranskning vid länkdelning.
              </p>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar...' : 'Spara SEO-inställningar'}
          </button>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
        </div>
      </form>

      {/* ── Previews ──────────────────────────────────────── */}
      <hr className="divider" style={{ margin: '3rem 0' }} />

      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '1.5rem' }}>Förhandsgranskningar</h2>

      {/* Google preview */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: 'var(--fs-sm)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Google sökresultat</h3>
        <div style={{
          background: '#fff',
          border: '1px solid #dfe1e5',
          borderRadius: 8,
          padding: '1.25rem 1.5rem',
          fontFamily: 'Arial, sans-serif',
          maxWidth: 600,
        }}>
          <div style={{ fontSize: 12, color: '#202124', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 18, height: 18, background: '#e8eaed', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: '#4d5156' }}>sivertlindblom.se</span>
          </div>
          <div style={{ fontSize: 20, color: '#1a0dab', lineHeight: '1.3', marginBottom: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {displayTitle}
          </div>
          <div style={{ fontSize: 14, color: '#4d5156', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {displayMetaDesc}
          </div>
        </div>
      </div>

      {/* Social card preview */}
      <div>
        <h3 style={{ fontSize: 'var(--fs-sm)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Sociala medier (länkdelning)</h3>
        <div style={{
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          overflow: 'hidden',
          maxWidth: 500,
          background: 'var(--color-bg-card)',
        }}>
          {/* Image */}
          <div style={{ position: 'relative', width: '100%', paddingTop: '52.5%', background: '#111', overflow: 'hidden' }}>
            <img
              ref={imgRef}
              src={imgUrl}
              alt="OG preview"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={() => { if (imgRef.current) imgRef.current.style.opacity = '0.15' }}
              onLoad={()  => { if (imgRef.current) imgRef.current.style.opacity = '1' }}
            />
          </div>
          {/* Text */}
          <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
              SIVERTLINDBLOM.SE
            </div>
            <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, lineHeight: '1.4', marginBottom: '0.35rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
              {displayTitle}
            </div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {displayDesc}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.75rem' }}>
          Förhandsgranskning av hur länken ser ut när den delas på Facebook, LinkedIn, iMessage m.fl.
        </p>
      </div>

      <hr className="divider" style={{ margin: '3rem 0' }} />

      <section>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '1rem' }}>Tips</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>▸</span>
            <span><strong style={{ color: 'var(--color-text)' }}>Bild:</strong> Ladda upp en bild via Media-sidan och klistra in URL:en ovan. Optimalt format: JPEG, 1200×630 px, max 1 MB.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>▸</span>
            <span><strong style={{ color: 'var(--color-text)' }}>Testa:</strong> Använd <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>Facebook Sharing Debugger</a> eller <a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)' }}>X Card Validator</a> för att se hur sidan delas.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>▸</span>
            <span><strong style={{ color: 'var(--color-text)' }}>Cache:</strong> Sociala medier cachar länkförhandsvisningar. Använd debuggern ovan för att rensa cachen efter uppdatering.</span>
          </div>
        </div>
      </section>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--fs-xs)',
  color: 'var(--color-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginBottom: '0.4rem',
}
