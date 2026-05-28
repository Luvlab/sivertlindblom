'use client'

/**
 * Silently prefetches a list of URLs in order after the page is settled,
 * using requestIdleCallback (or setTimeout fallback) so prefetch work only
 * happens when the browser has nothing better to do.
 *
 * Render this from a server layout and pass the full ordered URL list.
 * The component is invisible — it only side-effects the router cache.
 */
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  /** Ordered list of hrefs to prefetch, highest priority first. */
  urls: string[]
}

export default function BackgroundPrefetch({ urls }: Props) {
  const router = useRouter()
  // Guard so we only schedule once even in StrictMode double-invoke
  const started = useRef(false)

  useEffect(() => {
    if (started.current || !urls.length) return
    started.current = true

    let idx = 0

    function prefetchNext() {
      if (idx >= urls.length) return
      try {
        router.prefetch(urls[idx++])
      } catch {
        // Silently ignore — prefetch is best-effort
      }
      if (typeof requestIdleCallback !== 'undefined') {
        // Only run during genuine idle time; 4 s deadline keeps us from
        // starving the queue on slow devices.
        requestIdleCallback(prefetchNext, { timeout: 4000 })
      } else {
        // Safari / older environments — small gap so we don't block paint
        setTimeout(prefetchNext, 100)
      }
    }

    // Wait until the initial render and any hydration work settles before
    // we start consuming bandwidth.
    const startTimer = setTimeout(prefetchNext, 1000)
    return () => clearTimeout(startTimer)

    // Intentionally no deps — urls and router are stable after mount and
    // we only want one prefetch pass per layout mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
