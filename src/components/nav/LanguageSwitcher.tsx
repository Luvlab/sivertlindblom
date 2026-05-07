'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { locales, defaultLocale } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  locale: Locale
}

const NATIVE_NAMES: Record<Locale, string> = {
  sv: 'Svenska',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  zh: '中文',
  ja: '日本語',
  ar: 'العربية',
  pt: 'Português',
  ru: 'Русский',
  nl: 'Nederlands',
  pl: 'Polski',
  ko: '한국어',
  th: 'ภาษาไทย',
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(newLocale: Locale) {
    setOpen(false)
    const segments = pathname.split('/')
    const currentLocale = locales.find(l => segments[1] === l) ?? defaultLocale
    const pathWithoutLocale =
      segments[1] === currentLocale
        ? '/' + segments.slice(2).join('/')
        : pathname
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
    router.push(newPath)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={NATIVE_NAMES[locale]}
        aria-expanded={open}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.3em 0.4em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}
      >
        <span style={{
          fontSize: 'var(--fs-base)',
          letterSpacing: '0.08em',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}>
          {locale.toUpperCase()}
        </span>
        <span style={{ fontSize: '0.55em', color: 'var(--color-muted)', opacity: 0.6 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Dropdown — matches app dark theme */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            minWidth: 190,
            zIndex: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                textAlign: 'left',
                border: 'none',
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                padding: '0.6rem 1rem',
                background: l === locale ? 'var(--color-bg-surface)' : 'transparent',
                transition: 'background 0.12s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-surface)')}
              onMouseLeave={e => (e.currentTarget.style.background = l === locale ? 'var(--color-bg-surface)' : 'transparent')}
            >
              <span style={{
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.1em',
                fontWeight: 700,
                color: l === locale ? 'var(--color-accent)' : 'var(--color-muted)',
                minWidth: '2rem',
                fontFamily: 'inherit',
              }}>
                {l.toUpperCase()}
              </span>
              <span style={{
                fontSize: 'var(--fs-sm)',
                color: l === locale ? 'var(--color-text)' : 'var(--color-muted)',
                fontWeight: l === locale ? 500 : 400,
              }}>
                {NATIVE_NAMES[l]}
              </span>
              {l === locale && (
                <span style={{ marginLeft: 'auto', color: 'var(--color-accent)', fontSize: 'var(--fs-xs)' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
