'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Replaces <main> in the admin layout.
 * Scrolls the content area back to the top every time the route changes,
 * since the scroll container is this element (not window).
 */
export default function AdminMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0
    }
  }, [pathname])

  return (
    <main ref={ref} className="admin-main">
      {children}
    </main>
  )
}
