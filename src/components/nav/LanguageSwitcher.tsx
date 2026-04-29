'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, defaultLocale } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  locale: Locale
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
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

    // Build new path: strip old locale prefix, add new one
    const segments = pathname.split('/')
    // segments[0] is '', segments[1] is the locale
    const currentLocale = locales.find(
      (l) => segments[1] === l
    ) ?? defaultLocale
    const pathWithoutLocale = segments[1] === currentLocale
      ? '/' + segments.slice(2).join('/')
      : pathname

    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`

    router.push(newPath)
  }

  const currentCode = locale.toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={localeNames[locale]}
        aria-expanded={open}
        style={{
          background: 'none',
          border: '1px solid var(--color-border)',
          cursor: 'pointer',
          padding: '0.3em 0.6em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.08em',
          color: 'var(--color-muted)',
          transition: 'color 0.15s, border-color 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-text)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
        }}
      >
        <span>{currentCode}</span>
        <span style={{ fontSize: '0.6em', opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)',
            minWidth: 140,
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: l === locale ? 'var(--color-bg-surface)' : 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.6rem 1rem',
                fontSize: 'var(--fs-xs)',
                letterSpacing: '0.06em',
                color: l === locale ? 'var(--color-accent)' : 'var(--color-muted)',
                transition: 'background 0.1s, color 0.1s',
                borderBottom: '1px solid var(--color-border)',
              }}
              onMouseEnter={(e) => {
                if (l !== locale) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-surface)'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'
                }
              }}
              onMouseLeave={(e) => {
                if (l !== locale) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'none'
                  ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
                }
              }}
            >
              <span style={{ display: 'inline-block', width: '2rem', color: 'var(--color-accent)', fontFamily: 'monospace' }}>
                {l.toUpperCase()}
              </span>
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
