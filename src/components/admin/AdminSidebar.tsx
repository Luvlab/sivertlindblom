'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/admin',                label: 'Dashboard',          icon: '◈' },
  { href: '/admin/home',           label: 'Startsida',          icon: '⌂' },
  { href: '/admin/exhibitions',    label: 'Utställningar',      icon: '◻' },
  { href: '/admin/public-works',   label: 'Offentliga arbeten', icon: '▦' },
  { href: '/admin/scenography',    label: 'Scenografi',         icon: '◳' },
  { href: '/admin/watercolors',    label: 'Akvareller',         icon: '◫' },
  { href: '/admin/references',     label: 'Referenser',         icon: '◧' },
  { href: '/admin/texts',          label: 'Texter',             icon: '≡' },
  { href: '/admin/biography',      label: 'Biografi',           icon: '◉' },
  { href: '/admin/map',            label: 'Karta',              icon: '◎' },
  { href: '/admin/contact',        label: 'Kontakt',            icon: '✉' },
  { href: '/admin/media',          label: 'Media',              icon: '▣' },
  { href: '/admin/seo',            label: 'SEO & Delning',      icon: '◈' },
  { href: '/admin/settings',       label: 'Inställningar',      icon: '⚙' },
  { href: '/admin/backup',         label: 'Säkerhetskopia',     icon: '⬇' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // No sidebar on login pages
  if (pathname?.startsWith('/admin/login') || pathname?.startsWith('/admin-login')) return null

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin-login')
    router.refresh()
  }

  function close() { setOpen(false) }

  return (
    <>
      {/* ── Mobile top bar (hidden on desktop via CSS) ── */}
      <div className="admin-mobile-bar">
        <button
          onClick={() => setOpen(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text)', fontSize: '1.3rem',
            padding: '0.2rem 0.5rem', lineHeight: 1, flexShrink: 0,
          }}
          aria-label="Öppna meny"
        >
          ☰
        </button>
        <span style={{
          fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)',
          color: 'var(--color-muted)', flex: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          Sivert Lindblom — Admin
        </span>
      </div>

      {/* ── Overlay (dims content behind open drawer) ── */}
      <div
        className={`admin-mobile-overlay${open ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Sidebar / drawer ── */}
      <aside className={`admin-sidebar-wrapper${open ? ' open' : ''}`}>

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
              CMS Admin
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
              Sivert Lindblom
            </div>
          </div>
          {/* Close button — only visible on mobile (show-mobile class) */}
          <button
            onClick={close}
            className="show-mobile"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-muted)', fontSize: '1.1rem', padding: '0.25rem',
              lineHeight: 1,
            }}
            aria-label="Stäng meny"
          >
            ✕
          </button>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '0.75rem 0', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1.5rem',
                  fontSize: 'var(--fs-sm)',
                  color: active ? 'var(--color-text)' : 'var(--color-muted)',
                  background: active ? 'var(--color-bg-card)' : 'transparent',
                  borderLeft: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ color: 'var(--color-accent)', fontSize: '0.8em', flexShrink: 0 }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer links */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          flexShrink: 0,
        }}>
          <Link
            href="/sv"
            style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            ← Tillbaka till sajten
          </Link>
          <button
            onClick={handleLogout}
            style={{
              fontSize: 'var(--fs-xs)',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              padding: 0,
            }}
          >
            Logga ut
          </button>
        </div>
      </aside>
    </>
  )
}
