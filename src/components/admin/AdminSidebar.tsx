'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/admin',            label: 'Dashboard',     icon: '◈' },
  { href: '/admin/works',      label: 'Verk',          icon: '▦' },
  { href: '/admin/texts',      label: 'Texter',        icon: '≡' },
  { href: '/admin/biography',  label: 'Biografi',      icon: '◉' },
  { href: '/admin/media',      label: 'Media',         icon: '▣' },
  { href: '/admin/settings',   label: 'Inställningar', icon: '⚙' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin-login')
    router.refresh()
  }

  return (
    <aside style={{
      width: 220,
      borderRight: '1px solid var(--color-border)',
      background: 'var(--color-bg-surface)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100dvh',
      flexShrink: 0,
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>CMS Admin</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>Sivert Lindblom</div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontSize: 'var(--fs-sm)',
                color: active ? 'var(--color-text)' : 'var(--color-muted)',
                background: active ? 'var(--color-bg-card)' : 'transparent',
                borderLeft: active ? `2px solid var(--color-accent)` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ color: 'var(--color-accent)', fontSize: '0.8em' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
  )
}
