import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard' }

const STATS = [
  { label: 'Verk',         value: '71',  href: '/admin/works',     desc: 'Utställningar, offentliga arbeten, scenografi, akvareller' },
  { label: 'Texter',       value: '23',  href: '/admin/texts',     desc: 'Essays, recensioner, intervjuer, egna texter' },
  { label: 'Biografi',     value: '45+', href: '/admin/biography', desc: 'Kronologiposter och offentliga uppdrag' },
  { label: 'Bilder',       value: '60+', href: '/admin/media',     desc: 'Uppladdade bilder och externa URL:er' },
]

const QUICK_ACTIONS = [
  { href: '/admin/works/new',     label: 'Lägg till verk',      icon: '+' },
  { href: '/admin/texts/new',     label: 'Lägg till text',      icon: '+' },
  { href: '/admin/biography/new', label: 'Ny biografipost',     icon: '+' },
  { href: '/admin/settings',      label: 'Redigera inställningar', icon: '⚙' },
]

export default function AdminDashboard() {
  return (
    <div style={{ padding: '3rem' }}>
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

      {/* Supabase status */}
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
            <span style={{ color: process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_') ? 'var(--color-accent)' : '#888' }}>
              {process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your_') ? '● Ansluten' : '○ Ej konfigurerad'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-muted)' }}>Deploy</span>
            <span>Vercel</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span style={{ color: 'var(--color-muted)' }}>Schema</span>
            <code style={{ fontSize: 'var(--fs-xs)' }}>supabase/schema.sql</code>
          </div>
        </div>
      </div>
    </div>
  )
}
