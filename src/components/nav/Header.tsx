'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FontSizeSlider from '../FontSizeSlider'
import LanguageSwitcher from './LanguageSwitcher'
import type { Locale } from '@/i18n/config'

interface HeaderProps {
  locale: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any
}

export default function Header({ locale, dict }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  const NAV = [
    { label: dict?.nav?.portfolio ?? 'Portfolio', href: `/${locale}/portfolio` },
    { label: dict?.nav?.sculpture ?? 'Skulptur',  href: `/${locale}/references` },
    { label: dict?.nav?.texts ?? 'Texter',        href: `/${locale}/texts` },
    { label: dict?.nav?.biography ?? 'Biografi',  href: `/${locale}/biography` },
    { label: dict?.nav?.contact ?? 'Kontakt',     href: `/${locale}/contact` },
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
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${pathname?.startsWith(item.href) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: language switcher + font slider (desktop only) + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSwitcher locale={locale} />
            {/* Font slider hidden on mobile — accessible via the drawer instead */}
            <span className="hidden-mobile"><FontSizeSlider /></span>

            {/* Hamburger — mobile only */}
            <button
              aria-label={open ? 'Stäng meny' : 'Öppna meny'}
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
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '1rem 0',
                fontSize: 'var(--fs-2xl)',
                fontFamily: 'Georgia, serif',
                borderBottom: '1px solid var(--color-border)',
                color: pathname?.startsWith(item.href) ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              {item.label}
            </Link>
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
              Textstorlek
            </p>
            <FontSizeSlider />
          </div>
        </div>
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile   { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
      `}</style>
    </>
  )
}
