import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sivert Lindblom',
    short_name: 'SL',
    description:
      'Official website of sculptor Sivert Lindblom — public art, watercolours, and scenography.',
    start_url: '/sv',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    lang: 'sv',
    dir: 'ltr',
    categories: ['art'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        purpose: 'maskable' as any,
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        purpose: 'any' as any,
      },
    ],
    screenshots: [],
    related_applications: [],
    prefer_related_applications: false,
  }
}
