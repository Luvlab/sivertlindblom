import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/nav/Header'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sivert Lindblom — Skulptör',
    template: '%s | Sivert Lindblom',
  },
  description:
    'Officiell webbplats för skulptören Sivert Lindblom (f. 1931). Skulptur, offentlig konst, akvareller och scenografi sedan 1963.',
  openGraph: {
    title: 'Sivert Lindblom — Skulptör',
    description: 'Skulptur, offentlig konst, akvareller och scenografi sedan 1963.',
    url: 'https://sivertlindblom.se',
    siteName: 'Sivert Lindblom',
    locale: 'sv_SE',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv" className={inter.variable}>
      <body>
        <Header />
        <main className="main-content">{children}</main>
        <footer style={{
          borderTop: '1px solid var(--color-border)',
          padding: '2rem clamp(1rem,4vw,5rem)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--fs-xs)',
          color: 'var(--color-muted)',
          letterSpacing: '0.05em',
        }}>
          <span>© {new Date().getFullYear()} Sivert Lindblom. Alla rättigheter förbehållna.</span>
          <span>Redaktör: Jan Öqvist</span>
        </footer>
      </body>
    </html>
  )
}
