import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { buildSearchIndex } from '@/lib/search-index'
import SearchClient from './SearchClient'
import Link from 'next/link'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = (dict.search ?? {}) as Record<string, string>
  return { title: s.label ?? 'Search' }
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = (dict.search ?? {}) as Record<string, string>

  // Build the locale-aware index on the server
  const index = buildSearchIndex(locale, dict)

  // Translated type labels passed to the client so the UI speaks the right language
  const typeLabels = {
    exhibition:   s.type_exhibition  ?? 'Utställningar',
    text:         s.type_text        ?? 'Texter',
    'public-work': s.type_public_work ?? 'Offentliga arbeten',
    sculpture:    s.type_sculpture   ?? 'Skulpturer',
    biography:    s.type_biography   ?? 'Biografi',
  }

  // Translated UI strings
  const ui = {
    minChars:    s.min_chars    ?? 'Skriv minst 2 tecken för att söka…',
    noResults:   s.no_results   ?? 'Inga träffar',
    noResultsFor: s.no_results_for ?? 'Ingen post matchade',
    results:     s.results      ?? 'resultat totalt',
    hits:        s.hits         ?? 'träffar',
    hit:         s.hit          ?? 'träff',
  }

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ maxWidth: '72ch' }}>

        {/* Back link */}
        <Link href={`/${locale}`} className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <span className="back-link-label">{(dict.nav as any)?.home ?? 'Hem'}</span>
        </Link>

        {/* Heading */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
            {s.label ?? 'Sök'}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '0.5rem' }}>
            {s.title ?? 'Sök i hela arkivet'}
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {index.length} poster — {s.type_exhibition}, {s.type_text}, {s.type_sculpture}, {s.type_biography ?? 'Biografi'}.
          </p>
        </div>

        <SearchClient
          index={index}
          locale={locale}
          placeholder={s.placeholder ?? 'Sök utställningar, texter, skulpturer, biografi…'}
          typeLabels={typeLabels}
          ui={ui}
        />
      </div>
    </div>
  )
}
