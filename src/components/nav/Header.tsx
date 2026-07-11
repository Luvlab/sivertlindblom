'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FontSizeSlider from '../FontSizeSlider'
import LanguageSwitcher from './LanguageSwitcher'
import type { Locale } from '@/i18n/config'

interface NavNode { label: string; href: string; children?: NavNode[] }

interface HeaderProps {
  locale: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any
}

export default function Header({ locale, dict }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  const isAdmin = pathname?.startsWith('/admin')
  if (isAdmin) return null

  const p = (path: string) => `/${locale}${path}`

  // Navigation tree — mirrors the original site's dropdown hierarchy.
  // Every leaf href points to a page that already exists (no dead links).
  const NAV: NavNode[] = [
    {
      label: dict?.nav?.portfolio ?? 'Portfolio',
      href: p('/portfolio'),
      children: [
        { label: dict?.portfolio?.cat_exhibitions ?? 'Utställningar', href: p('/portfolio/exhibitions') },
        { label: dict?.portfolio?.cat_public ?? 'Offentliga arbeten', href: p('/portfolio/public-works') },
        { label: dict?.portfolio?.cat_scenography ?? 'Scenografier', href: p('/portfolio/scenography') },
        { label: dict?.portfolio?.cat_watercolors ?? 'Akvareller', href: p('/portfolio/watercolors') },
      ],
    },
    {
      label: dict?.nav?.references ?? 'Referenser',
      href: p('/references'),
      children: [
        {
          label: 'Skulptur',
          href: p('/references#skulptur'),
          children: [
            { label: 'Profiler', href: p('/references/profiler') },
            { label: 'Metamorfoser – sittare', href: p('/references/metamorfoser') },
            { label: 'Monoliter, blystoder och azteker', href: p('/references/monoliter') },
            { label: 'Azteker', href: p('/references/azteker') },
            { label: 'Tidiga skulpturer', href: p('/references/tidiga-skulpturer') },
            { label: 'Kofeser', href: p('/references/kofeser') },
            { label: 'Blyplattor', href: p('/references/blyplattor') },
            { label: 'Trädkonstruktioner', href: p('/references/tradkonstruktioner') },
            { label: 'Tornmodeller', href: p('/references/tornmodeller') },
            { label: 'Arbetsmodeller och förslag', href: p('/references/arbetsmodeller') },
          ],
        },
        { label: 'Grafik', href: p('/references/grafik') },
        { label: 'Fotografier – inspiration', href: p('/references#fotografi') },
        { label: 'Film och TV', href: p('/references#film-tv') },
        { label: 'Publicerat', href: p('/references/publicerat') },
        { label: 'Utmärkelser, priser och medaljer', href: p('/references#utmarkelser') },
        { label: 'Ögonblick', href: p('/references#ogonblick') },
      ],
    },
    { label: dict?.nav?.texts ?? 'Texter', href: p('/texts') },
    { label: dict?.nav?.biography ?? 'Biografi', href: p('/biography') },
    { label: dict?.nav?.contact ?? 'Kontakt', href: p('/contact') },
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
            style={{ display: 'flex', alignItems: 'stretch', gap: '2rem' }}
            className="hidden-mobile"
          >
            {NAV.map((item) => (
              <div
                key={item.href}
                style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <Link
                  href={item.href}
                  className={`nav-link${pathname?.startsWith(item.href.split('#')[0]) ? ' active' : ''}`}
                >
                  {item.label}
                  {item.children && <span aria-hidden style={{ marginLeft: '0.35em', fontSize: '0.7em', opacity: 0.7 }}>▾</span>}
                </Link>

                {/* Dropdown */}
                {item.children && openMenu === item.label && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      minWidth: 240,
                      background: '#0d0d0d',
                      border: '1px solid var(--color-border)',
                      borderRadius: 2,
                      padding: '0.4rem 0',
                      boxShadow: '0 10px 30px rgba(0,0,0,.55)',
                      zIndex: 100,
                    }}
                  >
                    {item.children.map((child) => (
                      <DropdownRow key={child.href} node={child} locale={locale} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href={`/${locale}/search`}
              aria-label="Sök"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', transition: 'color 0.15s', padding: '0.25rem' }}
              className="search-icon-btn"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7.5" cy="7.5" r="5.5" />
                <line x1="11.5" y1="11.5" x2="16" y2="16" />
              </svg>
            </Link>
            <LanguageSwitcher locale={locale} />
            <span className="hidden-mobile"><FontSizeSlider /></span>

            <button
              aria-label={open ? (dict?.common?.close_menu ?? 'Stäng meny') : (dict?.common?.open_menu ?? 'Öppna meny')}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
              className="show-mobile"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', display: 'flex', flexDirection: 'column', gap: '5px' }}
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
            <div key={item.href} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{ display: 'block', padding: '1rem 0', fontSize: 'var(--fs-2xl)', fontFamily: 'Georgia, serif', color: pathname?.startsWith(item.href.split('#')[0]) ? 'var(--color-accent)' : 'var(--color-text)' }}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <button
                    aria-label={`Visa undermeny för ${item.label}`}
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem' }}
                  >
                    {mobileExpanded === item.label ? '−' : '+'}
                  </button>
                )}
              </div>
              {item.children && mobileExpanded === item.label && (
                <div style={{ paddingBottom: '0.75rem' }}>
                  {item.children.map((child) => (
                    <div key={child.href}>
                      <Link
                        href={child.href}
                        onClick={() => setOpen(false)}
                        style={{ display: 'block', padding: '0.5rem 0 0.5rem 1rem', fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}
                      >
                        {child.label}
                      </Link>
                      {child.children && (
                        <div>
                          {child.children.map((gc) => (
                            <Link
                              key={gc.href}
                              href={gc.href}
                              onClick={() => setOpen(false)}
                              style={{ display: 'block', padding: '0.35rem 0 0.35rem 2rem', fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}
                            >
                              {gc.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {dict?.common?.language ?? 'Språk'}
            </p>
            <LanguageSwitcher locale={locale} />
          </div>
          <div style={{ paddingTop: '1.5rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              {dict?.common?.font_size ?? 'Textstorlek'}
            </p>
            <FontSizeSlider />
          </div>
        </div>
      </nav>
    </>
  )
}

/** A single row in a desktop dropdown; if it has children, they flyout to the right. */
function DropdownRow({ node, locale }: { node: NavNode; locale: Locale }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link
        href={node.href}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          padding: '0.5rem 1.1rem',
          fontSize: 'var(--fs-sm)',
          color: hover ? 'var(--color-accent)' : 'var(--color-text)',
          whiteSpace: 'nowrap',
          transition: 'color 0.12s',
        }}
      >
        {node.label}
        {node.children && <span aria-hidden style={{ fontSize: '0.7em', opacity: 0.6 }}>▸</span>}
      </Link>
      {node.children && hover && (
        <div
          style={{
            position: 'absolute',
            top: -5,
            left: '100%',
            minWidth: 230,
            background: '#0d0d0d',
            border: '1px solid var(--color-border)',
            borderRadius: 2,
            padding: '0.4rem 0',
            boxShadow: '0 10px 30px rgba(0,0,0,.55)',
            zIndex: 110,
          }}
        >
          {node.children.map((gc) => (
            <Link
              key={gc.href}
              href={gc.href}
              style={{ display: 'block', padding: '0.45rem 1.1rem', fontSize: 'var(--fs-sm)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}
              className="dropdown-flyout-link"
            >
              {gc.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
