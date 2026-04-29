import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sivertlindblom.se',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  // Allow external img tags (used in components for old-site images)
  // ESLint rule @next/next/no-img-element is suppressed inline where needed
}

export default nextConfig
