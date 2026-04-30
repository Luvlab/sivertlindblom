import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { locales, defaultLocale, rtlLocales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import Header from '@/components/nav/Header'
import { getDictionary } from '@/i18n/getDictionary'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const OG_IMAGE =
  'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg'

export const metadata: Metadata = {
  metadataBase: new URL('https://sivertlindblom.se'),
  title: {
    default: 'Sivert Lindblom — Skulptör',
    template: '%s | Sivert Lindblom',
  },
  description:
    'Officiell webbplats för skulptören Sivert Lindblom (f. 1931). Skulptur, offentlig konst, akvareller och scenografi sedan 1963.',
  keywords: [
    'Sivert Lindblom', 'skulptör', 'sculptor', 'Stockholm', 'Blasieholmstorg',
    'offentlig konst', 'public art', 'akvareller', 'watercolours', 'scenografi',
  ],
  authors: [{ name: 'Sivert Lindblom' }],
  creator: 'Sivert Lindblom',
  openGraph: {
    title: 'Sivert Lindblom — Skulptör',
    description:
      'Skulptur, offentlig konst, akvareller och scenografi sedan 1963. Offentliga verk i Stockholm, New York, Malmö och Tokyo.',
    url: 'https://sivertlindblom.se',
    siteName: 'Sivert Lindblom',
    type: 'website',
    locale: 'sv_SE',
    alternateLocale: ['en_US', 'de_DE', 'fr_FR'],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 800,
        alt: 'Blasieholmstorg, Stockholm 1989 — Sivert Lindblom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sivert Lindblom — Skulptör',
    description:
      'Skulptur, offentlig konst, akvareller och scenografi sedan 1963.',
    images: [OG_IMAGE],
    creator: '@sivertlindblom',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale; redirect to default if invalid
  if (!locales.includes(locale as Locale)) {
    redirect(`/${defaultLocale}`)
  }

  const validLocale = locale as Locale
  const dict = await getDictionary(validLocale)
  const isRtl = rtlLocales.includes(validLocale)

  return (
    <html
      lang={validLocale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={inter.variable}
    >
      <body>
        <Header locale={validLocale} dict={dict} />
        <main className="main-content">{children}</main>
        <footer
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: '2rem clamp(1rem,4vw,5rem)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem 2rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 'var(--fs-xs)',
            color: 'var(--color-muted)',
            letterSpacing: '0.05em',
          }}
        >
          <span>
            © {new Date().getFullYear()} Sivert Lindblom. {dict.footer?.rights}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span>{dict.footer?.editor}: Jan Öqvist</span>
            <span style={{ opacity: 0.55 }}>
              web app by{' '}
              <a
                href="https://luvlab.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-muted)', textDecoration: 'underline', textDecorationColor: 'rgba(136,136,128,0.35)', textUnderlineOffset: '3px' }}
              >
                luvlab.io
              </a>
            </span>
          </span>
        </footer>
      </body>
    </html>
  )
}
