'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { Locale } from '@/i18n/config'

interface SubItem { label: string; href: string }

interface Props {
  locale: Locale
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any
}

export default function SubNav({ locale, dict }: Props) {
  const pathname = usePathname()
  const [hash, setHash] = useState('')

  useEffect(() => {
    setHash(window.location.hash)
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  if (!pathname) return null
  if (pathname.startsWith('/admin')) return null

  // Note: references, texts, and biography use TabsLayout for in-page navigation —
  // no SubNav duplication needed for those routes.
  const SECTIONS: { prefix: string; items: SubItem[] }[] = [
    {
      prefix: `/${locale}/portfolio`,
      items: [
        { label: dict?.portfolio?.cat_exhibitions ?? 'Utställningar', href: `/${locale}/portfolio/exhibitions` },
        { label: dict?.portfolio?.cat_public      ?? 'Offentliga arbeten', href: `/${locale}/portfolio/public-works` },
        { label: dict?.portfolio?.cat_scenography ?? 'Scenografier', href: `/${locale}/portfolio/scenography` },
        { label: dict?.portfolio?.cat_watercolors ?? 'Akvareller', href: `/${locale}/portfolio/watercolors` },
      ],
    },
  ]

  const section = SECTIONS.find((s) => pathname.startsWith(s.prefix))
  if (!section) return null

  function isActive(item: SubItem): boolean {
    const [path, h] = item.href.split('#')
    if (h) {
      // Hash-based tab: highlight by hash; default to first item when no hash set yet
      const matchesPath = pathname === path
      if (!matchesPath) return false
      if (!hash) return section!.items.indexOf(item) === 0
      return hash === `#${h}`
    }
    // Path-based: highlight by path prefix
    return pathname.startsWith(item.href)
  }

  return (
    <div className="sub-nav" aria-label="Undersektioner">
      <nav className="sub-nav-inner page-pad">
        {section.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sub-nav-item${isActive(item) ? ' active' : ''}`}
            onClick={() => {
              const [, h] = item.href.split('#')
              if (h) setHash(`#${h}`)
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
