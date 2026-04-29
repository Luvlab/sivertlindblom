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

export const metadata: Metadata = {
  title: {
    default: 'Sivert Lindblom — Skulptör',
    template: '%s | Sivert Lindblom',
  },
  description:
    'Official website of sculptor Sivert Lindblom (b. 1931). Sculpture, public art, watercolours and scenography since 1963.',
  openGraph: {
    title: 'Sivert Lindblom — Sculptor',
    description: 'Sculpture, public art, watercolours and scenography since 1963.',
    url: 'https://sivertlindblom.se',
    siteName: 'Sivert Lindblom',
    type: 'website',
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
            gap: '1rem',
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
          <span>
            {dict.footer?.editor}: Jan Öqvist
          </span>
        </footer>
      </body>
    </html>
  )
}
