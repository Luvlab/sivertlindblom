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
    {
      prefix: `/${locale}/references`,
      items: [
        { label: 'Skulptur',                                    href: `/${locale}/references#skulptur` },
        { label: 'Grafik',                                      href: `/${locale}/references#grafik` },
        { label: dict?.references?.fotografier ?? 'Fotografier', href: `/${locale}/references#fotografi` },
        { label: dict?.references?.film_tv     ?? 'Film & TV',  href: `/${locale}/references#film-tv` },
        { label: dict?.references?.publicerat  ?? 'Publicerat', href: `/${locale}/references#publicerat` },
        { label: 'Utmärkelser',                                  href: `/${locale}/references#utmarkelser` },
        { label: 'Ögonblick',                                    href: `/${locale}/references#ogonblick` },
      ],
    },
    {
      prefix: `/${locale}/texts`,
      items: [
        { label: dict?.texts?.others_texts ?? 'Andras texter', href: `/${locale}/texts#andras_texter` },
        { label: dict?.texts?.own_writing  ?? 'Egna texter',   href: `/${locale}/texts#own_writing` },
        { label: dict?.texts?.interview    ?? 'Intervjuer',    href: `/${locale}/texts#interview` },
        { label: dict?.texts?.review       ?? 'Recensioner',   href: `/${locale}/texts#review` },
        { label: dict?.texts?.translated   ?? 'Översatt text', href: `/${locale}/texts#translated` },
      ],
    },
    {
      prefix: `/${locale}/biography`,
      items: [
        { label: dict?.biography?.timeline           ?? 'Biografi',                    href: `/${locale}/biography#biografi` },
        { label: dict?.biography?.public_commissions ?? 'Offentliga uppdrag',          href: `/${locale}/biography#offentliga-uppdrag` },
        { label: dict?.biography?.group_exhibitions  ?? 'Grupputställningar',          href: `/${locale}/biography#grupputstallningar` },
        { label: 'Litteraturförteckning',                                               href: `/${locale}/biography#litteratur` },
        { label: dict?.biography?.photographs        ?? 'Bilder på Sivert',            href: `/${locale}/biography#fotografier` },
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
