import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { TEXTS_DATA } from '@/lib/texts-data'

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    TEXTS_DATA.map((t) => ({ locale, slug: t.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const text = TEXTS_DATA.find((t) => t.slug === slug)
  if (!text) return {}
  return {
    title: text.title,
    description: `${text.author} — ${text.publication}`,
  }
}

const TYPE_LABELS: Record<string, string> = {
  essay:       'Essay',
  preface:     'Förord',
  review:      'Recension',
  interview:   'Intervju',
  own_writing: 'Egen text',
  translated:  'Översatt',
}

const LANG_LABELS: Record<string, string> = {
  sv: 'SV', en: 'EN', de: 'DE', fr: 'FR', it: 'IT',
}

export default async function TextDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale as Locale)

  const text = TEXTS_DATA.find((t) => t.slug === slug)
  if (!text) notFound()

  const typeLabel = (dict.texts as Record<string, string> | undefined)?.[text.type] ?? TYPE_LABELS[text.type] ?? text.type
  const langLabel = LANG_LABELS[text.lang] || text.lang.toUpperCase()

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ maxWidth: '80ch' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <Link href={`/${locale}/texts`} style={{ color: 'var(--color-muted)' }}>
            {dict.texts?.title ?? 'Texter'}
          </Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--color-text)' }}>{text.title}</span>
        </nav>

        {/* Eyebrow: type label + year + lang badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            {typeLabel}
          </span>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <span style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.08em', color: 'var(--color-muted)', fontFamily: 'Georgia, serif' }}>
            {text.year}
          </span>
          <span className="badge">{langLabel}</span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.5rem,3.5vw,2.5rem)', marginBottom: '0.75rem' }}>
          {text.title}
        </h1>

        {/* Author + publication */}
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2.5rem' }}>
          {text.author}
          {text.publication && (
            <>
              <span style={{ margin: '0 0.4rem', color: 'var(--color-border)' }}>—</span>
              <em>{text.publication}</em>
            </>
          )}
        </p>

        <hr className="divider" style={{ marginBottom: '2.5rem' }} />

        {/* Body */}
        <div>
          {text.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1.5em', color: 'var(--color-text)' }}>
              {para}
            </p>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
          <Link href={`/${locale}/texts`} style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ← {dict.texts?.title ?? 'Texter'}
          </Link>
        </div>
      </div>
    </div>
  )
}
