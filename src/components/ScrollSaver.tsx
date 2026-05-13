'use client'

import { useEffect, useRef } from 'react'

/**
 * Drop anywhere on a long list page.
 * - On mount: restores scroll from sessionStorage (keyed by storageKey).
 * - While visible: debounce-saves the scroll position every 200 ms.
 * So when the user navigates away and returns via the ← back link, they land
 * where they left off.
 */
export default function ScrollSaver({ storageKey }: { storageKey: string }) {
  const restored = useRef(false)

  useEffect(() => {
    // Restore once on mount
    if (!restored.current) {
      restored.current = true
      const saved = sessionStorage.getItem(storageKey)
      if (saved) {
        const y = parseInt(saved, 10)
        if (y > 0) {
          // Two rAFs ensure the page has fully rendered before we scroll
          requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, y)))
        }
      }
    }

    // Save on scroll (debounced 200 ms)
    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        sessionStorage.setItem(storageKey, String(window.scrollY))
      }, 200)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [storageKey])

  return null
}
