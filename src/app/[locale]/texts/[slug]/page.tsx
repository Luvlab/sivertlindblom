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

  // Use locale-specific translation when available, fall back to original
  const body = text.bodies?.[locale] ?? text.body
  const isTranslated = text.bodies?.[locale] !== undefined && locale !== text.lang

  const typeLabel = (dict.texts as Record<string, string> | undefined)?.[text.type] ?? text.type
  const langLabel = LANG_LABELS[text.lang] || text.lang.toUpperCase()

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ maxWidth: '80ch' }}>
        {/* Back button */}
        <Link href={`/${locale}/texts`} className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.texts?.title ?? 'Texter'}</span>
        </Link>

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
        <div style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2.5rem' }}>
          <span>{text.author}</span>
          {text.authorBio && (
            <span style={{ color: 'var(--color-muted)', opacity: 0.7, marginLeft: '0.4rem', fontStyle: 'italic' }}>
              — {text.authorBio}
            </span>
          )}
          {text.publication && (
            <div style={{ marginTop: '0.25rem', fontSize: 'var(--fs-xs)' }}>
              <em>{text.publication}</em>
            </div>
          )}
        </div>

        <hr className="divider" style={{ marginBottom: '2.5rem' }} />

        {/* Original-language notice when no translation available */}
        {!isTranslated && locale !== text.lang && (
          <p style={{
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.08em',
            color: 'var(--color-muted)',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            padding: '0.6rem 1rem',
            marginBottom: '2rem',
          }}>
            {langLabel} — {(dict.texts as Record<string,string> | undefined)?.original_language ?? 'Originalspråk'}
          </p>
        )}

        {/* Body — double newlines split paragraphs; single newlines become <br> */}
        <div>
          {body.split('\n\n').map((para, i) => {
            const lines = para.split('\n')
            return (
              <p key={i} style={{ fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1.5em', color: 'var(--color-text)' }}>
                {lines.map((line, j) => (
                  <span key={j}>
                    {j > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            )
          })}
        </div>

        {/* Back link */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
          <Link href={`/${locale}/texts`} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.texts?.title ?? 'Texter'}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
