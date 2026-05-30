/**
 * Sivert Lindblom — Service Worker
 *
 * Strategy:
 *  • Static assets (JS/CSS/_next/**) → cache-first, background revalidate
 *  • Image assets (Supabase, wp photos) → cache-first (long-lived)
 *  • Navigation (HTML pages) → network-first, fall back to cache
 *  • API routes & admin → always network (skip SW entirely)
 *
 * When a new SW activates it broadcasts "SW_UPDATED" so the app can
 * show an "Update available" banner.
 */

const CACHE_VERSION = 'v3'
const STATIC_CACHE  = `sivert-static-${CACHE_VERSION}`
const IMAGE_CACHE   = `sivert-images-${CACHE_VERSION}`
const PAGE_CACHE    = `sivert-pages-${CACHE_VERSION}`

// Hard-coded shell pages to pre-cache on install
const PRECACHE_URLS = ['/sv', '/en']

// ── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())          // activate immediately
  )
})

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const knownCaches = [STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE]
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => !knownCaches.includes(k))
            .map(k => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all open tabs that a new version is ready
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }))
        })
      })
  )
})

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle GET
  if (request.method !== 'GET') return

  // Skip admin panel, API routes, OAuth, analytics
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/webpack-hmr')
  ) return

  // ── Images (Supabase storage, WP uploads) ──────────────────────────────
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname === 'sivertlindblom.se' ||
    request.destination === 'image'
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
    return
  }

  // ── Next.js static assets (_next/static/**) ────────────────────────────
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // ── Navigation (HTML pages) ────────────────────────────────────────────
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, PAGE_CACHE))
    return
  }

  // Everything else → network only
})

// ── Strategies ───────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request)
    return cached ?? new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/html' } })
  }
}

// ── Messages ─────────────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
