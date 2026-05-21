'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

const STATS = [
  { label: 'Startsida',           value: '—',   href: '/admin/home',         desc: 'Hero slideshow och startsidans innehåll' },
  { label: 'Utställningar',       value: '45',  href: '/admin/exhibitions',  desc: 'Solo- och grupputställningar 1961–2016' },
  { label: 'Offentliga arbeten',  value: '7',   href: '/admin/public-works', desc: 'Exteriörer och interiörer' },
  { label: 'Texter',              value: '32',  href: '/admin/texts',        desc: 'Essays, recensioner, intervjuer, egna texter' },
  { label: 'Biografi',            value: '10+', href: '/admin/biography',    desc: 'Kronologiposter och offentliga uppdrag' },
]

const QUICK_ACTIONS = [
  { href: '/admin/home',            label: 'Redigera startsida',    icon: '⌂' },
  { href: '/admin/exhibitions/new', label: 'Ny utställning',        icon: '+' },
  { href: '/admin/texts/new',       label: 'Ny text',               icon: '+' },
  { href: '/admin/biography/new',   label: 'Ny biografipost',       icon: '+' },
  { href: '/admin/settings',        label: 'Inställningar',         icon: '⚙' },
]

const OLD_SITE_LINKS = [
  { label: 'Startsida',        url: 'https://sivertlindblom.se' },
  { label: 'Portfolio',        url: 'https://sivertlindblom.se/portfolio/' },
  { label: 'Skulptur',         url: 'https://sivertlindblom.se/skulptur-grafik/' },
  { label: 'Texter',           url: 'https://sivertlindblom.se/biografi/texter/' },
  { label: 'Biografi',         url: 'https://sivertlindblom.se/biografi/' },
  { label: 'Publicerat',       url: 'https://sivertlindblom.se/biografi/publicerat/' },
  { label: 'Fotografier',      url: 'https://sivertlindblom.se/biografi/referens-och-inspirationsbilder/' },
]

type Tab = 'overview' | 'old-site'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')
  const [iframeUrl, setIframeUrl] = useState('https://sivertlindblom.se')
  const [inputUrl, setInputUrl] = useState('https://sivertlindblom.se')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '0.65rem 1.25rem',
    fontSize: 'var(--fs-sm)',
    fontWeight: 400,
    letterSpacing: '0.04em',
    border: 'none',
    borderBottom: tab === t ? '2px solid var(--color-accent)' : '2px solid transparent',
    background: 'transparent',
    color: tab === t ? 'var(--color-text)' : 'var(--color-muted)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  })

  function navigate(url: string) {
    setIframeUrl(url)
    setInputUrl(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        borderBottom: '1px solid var(--color-border)',
        padding: '0 2rem',
        background: 'var(--color-bg-surface)',
        flexShrink: 0,
      }}>
        <button style={tabStyle('overview')} onClick={() => setTab('overview')}>
          Översikt
        </button>
        <button style={tabStyle('old-site')} onClick={() => setTab('old-site')}>
          Gamla sajten
        </button>
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div style={{ padding: '3rem', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              CMS Admin
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>
              Hantera allt innehåll på Sivert Lindbloms webbplats.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {STATS.map((s) => (
              <Link key={s.href} href={s.href} style={{ display: 'block', textDecoration: 'none' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: 'var(--fs-4xl)', fontFamily: 'Georgia, serif', color: 'var(--color-accent)', lineHeight: 1, marginBottom: '0.5rem' }}>{s.value}</div>
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, marginBottom: '0.25rem' }}>{s.label}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '1.5rem' }}>Snabbåtgärder</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {QUICK_ACTIONS.map((a) => (
                <Link key={a.href} href={a.href}>
                  <button className="btn" style={{ fontSize: 'var(--fs-sm)' }}>
                    <span style={{ color: 'var(--color-accent)' }}>{a.icon}</span> {a.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            padding: '1.5rem',
            borderRadius: 2,
          }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '1rem' }}>Databas & Deploy</h2>
            <div style={{ display: 'grid', gap: '0.75rem', fontSize: 'var(--fs-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted)' }}>Supabase</span>
                <span style={{ color: 'var(--color-accent)' }}>● Ansluten</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted)' }}>Bildlagring</span>
                <span style={{ color: 'var(--color-accent)' }}>● 630 bilder på Supabase</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-muted)' }}>Deploy</span>
                <span>Vercel</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ color: 'var(--color-muted)' }}>Gamla servern</span>
                <span style={{ color: 'var(--color-muted)' }}>Inga beroenden kvar</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── OLD SITE TAB ── */}
      {tab === 'old-site' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>

          {/* Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-surface)',
            flexShrink: 0,
          }}>
            {/* Quick nav links */}
            <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
              {OLD_SITE_LINKS.map((l) => (
                <button
                  key={l.url}
                  onClick={() => navigate(l.url)}
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '0.3em 0.65em',
                    background: iframeUrl === l.url ? 'var(--color-accent)' : 'var(--color-bg-card)',
                    color: iframeUrl === l.url ? '#fff' : 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* URL bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); navigate(inputUrl) }}
              style={{ flex: 1, display: 'flex', gap: '0.5rem', minWidth: 0 }}
            >
              <input
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  padding: '0.35rem 0.75rem',
                  fontSize: 'var(--fs-xs)',
                  color: 'var(--color-text)',
                  fontFamily: 'monospace',
                  borderRadius: 2,
                  minWidth: 0,
                }}
              />
              <button type="submit" className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.35rem 0.9rem', flexShrink: 0 }}>
                Gå
              </button>
            </form>

            {/* Open in new tab */}
            <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 'var(--fs-xs)',
                color: 'var(--color-muted)',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                padding: '0.35rem 0.6rem',
                border: '1px solid var(--color-border)',
                borderRadius: 2,
              }}
            >
              ↗ Öppna
            </a>
          </div>

          {/* iframe */}
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            style={{ flex: 1, border: 'none', width: '100%', display: 'block' }}
            title="Gamla sivertlindblom.se"
          />
        </div>
      )}

    </div>
  )
}
