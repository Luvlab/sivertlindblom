'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FontSizeSlider from '../FontSizeSlider'
import LanguageSwitcher from './LanguageSwitcher'
import type { Locale } from '@/i18n/config'

interface SubItem { label: string; href: string }
interface NavItem  { label: string; href: string; sub?: SubItem[] }

interface HeaderProps {
  locale: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any
}

export default function Header({ locale, dict }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [openSub, setOpenSub] = useState<string | null>(null) // mobile accordion
  const [hovered, setHovered] = useState<string | null>(null)  // desktop dropdown
  const pathname = usePathname()

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  const NAV: NavItem[] = [
    {
      label: dict?.nav?.portfolio ?? 'Portfolio',
      href: `/${locale}/portfolio`,
      sub: [
        { label: dict?.portfolio?.cat_exhibitions ?? 'Utställningar ett urval', href: `/${locale}/portfolio/exhibitions` },
        { label: dict?.portfolio?.cat_public      ?? 'Offentliga arbeten',      href: `/${locale}/portfolio/public-works` },
        { label: dict?.portfolio?.cat_scenography ?? 'Scenografier',            href: `/${locale}/portfolio/scenography` },
        { label: dict?.portfolio?.cat_watercolors ?? 'Akvareller',              href: `/${locale}/portfolio/watercolors` },
      ],
    },
    {
      label: dict?.nav?.references ?? dict?.nav?.sculpture ?? 'Referenser',
      href: `/${locale}/references`,
      sub: [
        { label: 'Skulptur',                                href: `/${locale}/references#skulptur` },
        { label: 'Grafik',                                  href: `/${locale}/references#grafik` },
        { label: dict?.references?.fotografier ?? 'Fotografi', href: `/${locale}/references#fotografi` },
        { label: dict?.references?.film_tv     ?? 'Film & TV', href: `/${locale}/references#film-tv` },
        { label: dict?.references?.publicerat  ?? 'Publicerat', href: `/${locale}/references#publicerat` },
        { label: 'Utmärkelser',                             href: `/${locale}/references#utmarkelser` },
        { label: 'Ögonblick',                               href: `/${locale}/references#ogonblick` },
      ],
    },
    {
      label: dict?.nav?.texts ?? 'Texter',
      href: `/${locale}/texts`,
      sub: [
        { label: dict?.texts?.others_texts ?? 'Andras texter', href: `/${locale}/texts#andras_texter` },
        { label: dict?.texts?.own_writing  ?? 'Egna texter',   href: `/${locale}/texts#own_writing` },
        { label: dict?.texts?.interview    ?? 'Intervjuer',    href: `/${locale}/texts#interview` },
        { label: dict?.texts?.translated   ?? 'Översatt text', href: `/${locale}/texts#translated` },
        { label: dict?.texts?.review       ?? 'Recensioner',   href: `/${locale}/texts#review` },
      ],
    },
    {
      label: dict?.nav?.biography ?? 'Biografi',
      href: `/${locale}/biography`,
      sub: [
        { label: dict?.biography?.timeline          ?? 'Biografi',                      href: `/${locale}/biography#biografi` },
        { label: dict?.biography?.public_commissions ?? 'Offentliga uppdrag i urval',   href: `/${locale}/biography#offentliga-uppdrag` },
        { label: dict?.biography?.group_exhibitions  ?? 'Grupputställningar i urval',   href: `/${locale}/biography#grupputstallningar` },
        { label: 'Litteraturförteckning i urval',                                        href: `/${locale}/biography#litteratur` },
        { label: dict?.biography?.photographs        ?? 'Bilder på Sivert',             href: `/${locale}/biography#fotografier` },
      ],
    },
    { label: dict?.nav?.contact ?? 'Kontakt', href: `/${locale}/contact` },
  ]

  return (
    <>
      <header className="site-header page-pad">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo / wordmark */}
          <Link
            href={`/${locale}`}
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'var(--fs-lg)',
              letterSpacing: '0.04em',
              color: 'var(--color-text)',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setOpen(false)}
          >
            Sivert Lindblom
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Huvudnavigation"
            style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
            className="hidden-mobile"
          >
            {NAV.map((item) => (
              <div
                key={item.href}
                className="nav-item-wrap"
                onMouseEnter={() => item.sub && setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link
                  href={item.href}
                  className={`nav-link${pathname?.startsWith(item.href) ? ' active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  {item.label}
                  {item.sub && (
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ opacity: 0.5, marginTop: '1px' }}>
                      <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>

                {/* Desktop dropdown */}
                {item.sub && hovered === item.href && (
                  <div className="nav-dropdown">
                    {item.sub.map((s) => (
                      <Link key={s.href} href={s.href} className="nav-dropdown-item" onClick={() => setHovered(null)}>
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side: search + language switcher + font slider (desktop only) + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search icon */}
            <Link
              href={`/${locale}/search`}
              aria-label="Sök"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-muted)',
                transition: 'color 0.15s',
                padding: '0.25rem',
              }}
              className="search-icon-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="7.5" r="5.5" />
                <line x1="11.5" y1="11.5" x2="16" y2="16" />
              </svg>
            </Link>
            <LanguageSwitcher locale={locale} />
            {/* Font slider hidden on mobile — accessible via the drawer instead */}
            <span className="hidden-mobile"><FontSizeSlider /></span>

            {/* Hamburger — mobile only */}
            <button
              aria-label={open ? (dict?.common?.close_menu ?? 'Stäng meny') : (dict?.common?.open_menu ?? 'Öppna meny')}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="show-mobile"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <span style={{ display: 'block', width: 22, height: 1.5, background: open ? 'transparent' : 'var(--color-text)', transition: 'all 0.25s', transform: open ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--color-text)', transition: 'all 0.25s', transform: open ? 'rotate(-45deg)' : 'none', marginTop: open ? '-7px' : '0' }} />
              {!open && <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--color-text)', transition: 'all 0.25s' }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <nav
        id="mobile-nav"
        className={`mobile-nav${open ? ' open' : ''}`}
        aria-label="Mobilnavigation"
        aria-hidden={!open}
      >
        <div className="page-pad" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {NAV.map((item) => (
            <div key={item.href}>
              {/* Top-level row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)' }}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    padding: '1rem 0',
                    fontSize: 'var(--fs-2xl)',
                    fontFamily: 'Georgia, serif',
                    color: pathname?.startsWith(item.href) ? 'var(--color-accent)' : 'var(--color-text)',
                    flex: 1,
                  }}
                >
                  {item.label}
                </Link>
                {item.sub && (
                  <button
                    onClick={() => setOpenSub(openSub === item.href ? null : item.href)}
                    aria-label="Visa undermeny"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '1rem 0 1rem 1rem',
                      color: 'var(--color-muted)',
                    }}
                  >
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: openSub === item.href ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Sub-items accordion */}
              {item.sub && openSub === item.href && (
                <div>
                  {item.sub.map((s) => (
                    <Link key={s.href} href={s.href} className="mobile-sub-item" onClick={() => setOpen(false)}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Language switcher in mobile menu */}
          <div style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {dict?.common?.language ?? 'Språk'}
            </p>
            <LanguageSwitcher locale={locale} />
          </div>

          {/* Font slider in mobile menu too */}
          <div style={{ paddingTop: '1.5rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {dict?.common?.font_size ?? 'Textstorlek'}
            </p>
            <FontSizeSlider />
          </div>
        </div>
      </nav>

      {/* hidden-mobile / show-mobile defined in globals.css */}
    </>
  )
}
