import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { buildSearchIndex } from '@/lib/search-index'
import SearchClient from './SearchClient'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sök' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  // Build the index on the server — it's a pure function over static data
  const index = buildSearchIndex()

  const total = index.length
  const searchPlaceholder = (dict.search as Record<string,string> | undefined)?.placeholder
    ?? 'Sök utställningar, texter, skulpturer, biografi…'

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ maxWidth: '72ch' }}>

        {/* Back link */}
        <Link href={`/${locale}`} className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.home ?? 'Hem'}</span>
        </Link>

        {/* Heading */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
            {(dict.search as Record<string,string> | undefined)?.label ?? 'Sök'}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '0.5rem' }}>
            {(dict.search as Record<string,string> | undefined)?.title ?? 'Sök i hela arkivet'}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {total} poster indexerade — utställningar, texter, skulpturer, offentliga arbeten och biografi.
          </p>
        </div>

        <SearchClient index={index} locale={locale} placeholder={searchPlaceholder} />
      </div>
    </div>
  )
}
