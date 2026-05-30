import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { locales, defaultLocale, rtlLocales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import Header from '@/components/nav/Header'
import SubNav from '@/components/nav/SubNav'
import BackgroundPrefetch from '@/components/BackgroundPrefetch'
import { getDictionary } from '@/i18n/getDictionary'
import { createAdminClient } from '@/lib/supabase/admin'
import { FALLBACK_SETTINGS } from '@/lib/db'
import type { SiteSettings } from '@/types'
import { getExhibitionSlugs, getPublicWorkSlugs, getTextSlugs } from '@/lib/data-server'
import { SCULPTURE_PROJECTS } from '@/lib/sculpture-projects'
import CopyrightYear from '@/components/CopyrightYear'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const DEFAULT_OG_IMAGE =
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg'

async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data, error } = await supabase.from('settings').select('key, value')
      if (!error && data?.length) {
        const raw: Record<string, string> = {}
        data.forEach(({ key, value }: { key: string; value: string }) => { raw[key] = value ?? '' })
        return { ...FALLBACK_SETTINGS, ...raw } as SiteSettings
      }
    }
  } catch {}
  return FALLBACK_SETTINGS
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()

  const title  = (s.og_title?.trim())        || 'Sivert Lindblom — Skulptör'
  const desc   = (s.og_description?.trim())  || 'Skulptur, offentlig konst, akvareller och scenografi sedan 1963. Offentliga verk i Stockholm, New York, Malmö och Tokyo.'
  const metaDesc = (s.meta_description?.trim()) || (s.og_description?.trim()) || 'Officiell webbplats för skulptören Sivert Lindblom (f. 1931). Skulptur, offentlig konst, akvareller och scenografi sedan 1963.'
  const image  = (s.og_image?.trim())        || DEFAULT_OG_IMAGE

  return {
    metadataBase: new URL('https://sivertlindblom.se'),
    title: {
      default: title,
      template: '%s | Sivert Lindblom',
    },
    description: metaDesc,
    keywords: [
      'Sivert Lindblom', 'skulptör', 'sculptor', 'Stockholm', 'Blasieholmstorg',
      'offentlig konst', 'public art', 'akvareller', 'watercolours', 'scenografi',
    ],
    authors: [{ name: 'Sivert Lindblom' }],
    creator: 'Sivert Lindblom',
    openGraph: {
      title,
      description: desc,
      url: 'https://sivertlindblom.se',
      siteName: 'Sivert Lindblom',
      type: 'website',
      locale: 'sv_SE',
      alternateLocale: ['en_US', 'de_DE', 'fr_FR'],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${title} — officiell webbplats`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [image],
      creator: '@sivertlindblom',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
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

  // Build prefetch URL list in page / content order.
  // Slug fetchers are cached (see data-server.ts) so this is essentially free.
  const [exhibitionSlugs, publicWorkSlugs, textSlugs] = await Promise.all([
    getExhibitionSlugs(),
    getPublicWorkSlugs(),
    getTextSlugs(),
  ])
  const l = validLocale
  const prefetchUrls = [
    // ── Main sections (nav order) ────────────────────────────
    `/${l}/portfolio`,
    `/${l}/texts`,
    `/${l}/biography`,
    `/${l}/references`,
    `/${l}/contact`,
    // ── Portfolio sub-sections ───────────────────────────────
    `/${l}/portfolio/exhibitions`,
    `/${l}/portfolio/public-works`,
    `/${l}/portfolio/watercolors`,
    `/${l}/portfolio/scenography`,
    `/${l}/portfolio/map`,
    // ── Exhibition detail pages (DB sort order = display order) ──
    ...exhibitionSlugs.map((s) => `/${l}/portfolio/exhibitions/${s}`),
    // ── Public-work detail pages ─────────────────────────────
    ...publicWorkSlugs.map((s) => `/${l}/portfolio/public-works/${s}`),
    // ── Text detail pages (newest first) ─────────────────────
    ...textSlugs.map((s) => `/${l}/texts/${s}`),
    // ── References sub-pages ─────────────────────────────────
    `/${l}/references/publicerat`,
    `/${l}/references/fotografier`,
    ...SCULPTURE_PROJECTS.map((p) => `/${l}/references/${p.slug}`),
  ]

  return (
    <html
      lang={validLocale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={inter.variable}
    >
      <body>
        <Header locale={validLocale} dict={dict} />
        <SubNav locale={validLocale} dict={dict} />
        <main className="main-content">{children}</main>
        <BackgroundPrefetch urls={prefetchUrls} />
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
            © <Suspense fallback="2026"><CopyrightYear /></Suspense> Sivert Lindblom. {dict.footer?.rights}
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
