'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'

const NAV_ITEMS = [
  { href: '/admin',                label: 'Dashboard',          icon: '◈' },
  { href: '/admin/home',           label: 'Startsida',          icon: '⌂' },
  { href: '/admin/portfolio',      label: 'Portfolio-bilder',   icon: '▤' },
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
  { href: '/admin/guide',          label: 'AI-guide (logg)',    icon: '✦' },
  { href: '/admin/settings',       label: 'Inställningar',      icon: '⚙' },
  { href: '/admin/backup',         label: 'Säkerhetskopia',     icon: '⬇' },
]

interface SearchResult {
  label: string
  sublabel?: string
  href: string
  section: string
}

type TextItem = { slug: string; title: string; author?: string; year?: number }
type Exhibition = { slug: string; title: string; year?: number; location?: string }
type BioEntry = { id: string; title: string; year_start?: number; entry_type?: string }
type PublicWork = { slug?: string; title: string; year?: string; location?: string }

function useSearch(q: string) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    const q = query.toLowerCase()
    const hits: SearchResult[] = []

    try {
      const [textsRes, exhRes, bioRes, pwRes] = await Promise.allSettled([
        fetch('/api/admin/texts').then(r => r.json()) as Promise<TextItem[]>,
        fetch('/api/admin/exhibitions').then(r => r.json()) as Promise<Exhibition[]>,
        fetch('/api/admin/biography').then(r => r.json()) as Promise<BioEntry[]>,
        fetch('/api/admin/public-works').then(r => r.json()) as Promise<PublicWork[]>,
      ])

      if (textsRes.status === 'fulfilled' && Array.isArray(textsRes.value)) {
        textsRes.value
          .filter((t: TextItem) => t.title?.toLowerCase().includes(q) || t.author?.toLowerCase().includes(q))
          .slice(0, 4)
          .forEach((t: TextItem) => hits.push({ label: t.title, sublabel: t.author, href: `/admin/texts/${t.slug}`, section: 'Text' }))
      }
      if (exhRes.status === 'fulfilled' && Array.isArray(exhRes.value)) {
        exhRes.value
          .filter((e: Exhibition) => e.title?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q))
          .slice(0, 4)
          .forEach((e: Exhibition) => hits.push({ label: e.title, sublabel: e.location, href: `/admin/exhibitions/${e.slug}`, section: 'Utst.' }))
      }
      if (bioRes.status === 'fulfilled' && Array.isArray(bioRes.value)) {
        bioRes.value
          .filter((b: BioEntry) => b.title?.toLowerCase().includes(q))
          .slice(0, 4)
          .forEach((b: BioEntry) => hits.push({ label: b.title, sublabel: b.year_start ? String(b.year_start) : undefined, href: `/admin/biography/${b.id}`, section: 'Bio' }))
      }
      if (pwRes.status === 'fulfilled' && Array.isArray(pwRes.value)) {
        pwRes.value
          .filter((w: PublicWork) => w.title?.toLowerCase().includes(q) || w.location?.toLowerCase().includes(q))
          .slice(0, 3)
          .forEach((w: PublicWork) => hits.push({ label: w.title, sublabel: w.location, href: w.slug ? `/admin/public-works/${w.slug}` : '/admin/public-works', section: 'Offk.' }))
      }
    } catch { /* ignore */ }

    setResults(hits.slice(0, 10))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!q) { setResults([]); setLoading(false); return }
    setLoading(true)
    timerRef.current = setTimeout(() => search(q), 280)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [q, search])

  return { results, loading }
}

function GlobalSearch({ onClose }: { onClose?: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const { results, loading } = useSearch(q)
  const inputRef = useRef<HTMLInputElement>(null)

  const open = q.length > 0

  function go(href: string) {
    router.push(href)
    setQ('')
    setActiveIdx(-1)
    onClose?.()
  }

  function onKey(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, -1)) }
    if (e.key === 'Enter' && activeIdx >= 0 && results[activeIdx]) go(results[activeIdx].href)
    if (e.key === 'Escape') { setQ(''); setActiveIdx(-1) }
  }

  return (
    <div style={{ position: 'relative', padding: '0 1rem 0.5rem' }}>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '0.7rem', pointerEvents: 'none' }}>⌕</span>
        <input
          ref={inputRef}
          type="search"
          value={q}
          onChange={e => { setQ(e.target.value); setActiveIdx(-1) }}
          onKeyDown={onKey}
          placeholder="Sök innehåll…"
          style={{
            width: '100%',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 2,
            padding: '0.45rem 0.6rem 0.45rem 1.8rem',
            fontSize: 'var(--fs-xs)',
            color: 'var(--color-text)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {loading && (
          <span style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)', fontSize: '0.65rem' }}>…</span>
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '1rem',
          right: '1rem',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          zIndex: 999,
          maxHeight: 320,
          overflowY: 'auto',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}>
          {results.length === 0 && !loading ? (
            <div style={{ padding: '0.75rem 0.9rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
              Inga träffar för &ldquo;{q}&rdquo;
            </div>
          ) : results.map((r, i) => (
            <button
              key={`${r.href}-${i}`}
              onClick={() => go(r.href)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                width: '100%',
                padding: '0.55rem 0.9rem',
                background: i === activeIdx ? 'var(--color-bg-surface)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <span style={{ fontSize: '0.6rem', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0, minWidth: 32 }}>
                {r.section}
              </span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.label}
              </span>
              {r.sublabel && (
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', flexShrink: 0 }}>{r.sublabel}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

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
      {/* ── Mobile top bar ── */}
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

      {/* ── Overlay ── */}
      <div
        className={`admin-mobile-overlay${open ? ' open' : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* ── Sidebar / drawer ── */}
      <aside className={`admin-sidebar-wrapper${open ? ' open' : ''}`}>

        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem 0.75rem',
          borderBottom: '1px solid var(--color-border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                CMS Admin
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
                Sivert Lindblom
              </div>
            </div>
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

          {/* ── Global search ── */}
          <GlobalSearch onClose={close} />
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

        {/* Footer */}
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
