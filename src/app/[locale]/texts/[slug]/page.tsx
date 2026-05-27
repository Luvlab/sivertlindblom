import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { TEXTS_DATA } from '@/lib/texts-data'
import { getTextSlugs, getText, getTexts } from '@/lib/data-server'
import TextImageSlideshow from '@/components/TextImageSlideshow'
import { renderInlineLinks } from '@/lib/render-text'

export async function generateStaticParams() {
  const slugs = await getTextSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const text = TEXTS_DATA.find((t) => t.slug === slug)
    ?? await getText(slug)
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
  const [dict, allTexts] = await Promise.all([
    getDictionary(locale as Locale),
    getTexts(),
  ])

  const text = TEXTS_DATA.find((t) => t.slug === slug)
    ?? allTexts.find((t) => t.slug === slug)
    ?? await getText(slug)
  if (!text) notFound()

  // Prev / next within the same type group (already ordered newest-first)
  const sameType = allTexts.filter((t) => t.type === text.type)
  const idx = sameType.findIndex((t) => t.slug === slug)
  const prev = idx > 0 ? sameType[idx - 1] : null
  const next = idx < sameType.length - 1 ? sameType[idx + 1] : null

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

        {/* Article images + OCR text — side-by-side on desktop, stacked on mobile */}
        {text.images && text.images.length > 0 ? (
          <div className="article-scan-layout">
            {/* Images column — slideshow when multiple images */}
            <div className="article-scan-images">
              <TextImageSlideshow images={text.images} title={text.title} />
            </div>

            {/* OCR / body text column */}
            {body ? (
              <div className="article-scan-text">
                <p style={{
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  marginBottom: '1rem',
                }}>
                  OCR
                </p>
                {body.split('\n\n').map((para, i) => {
                  const lines = para.split('\n')
                  return (
                    <p key={i} style={{ fontSize: 'var(--fs-sm)', lineHeight: 1.75, marginBottom: '1.2em', color: 'var(--color-muted)' }}>
                      {lines.map((line, j) => (
                        <span key={j}>{j > 0 && <br />}{renderInlineLinks(line)}</span>
                      ))}
                    </p>
                  )
                })}
              </div>
            ) : (
              <div className="article-scan-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', fontStyle: 'italic' }}>
                  OCR-text saknas ännu
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Plain text body for essays/prefaces/etc. */
          <div>
            {body.split('\n\n').map((para, i) => {
              const lines = para.split('\n')
              return (
                <p key={i} style={{ fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '1.5em', color: 'var(--color-text)' }}>
                  {lines.map((line, j) => (
                    <span key={j}>
                      {j > 0 && <br />}
                      {renderInlineLinks(line)}
                    </span>
                  ))}
                </p>
              )
            })}
          </div>
        )}

        {/* Prev / Next + back nav */}
        <div style={{ marginTop: '4rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
          <nav style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Prev — newer in the same type */}
            <div>
              {prev && (
                <Link href={`/${locale}/texts/${prev.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                    ← {prev.year}
                  </p>
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 1.4 }}>{prev.author}</p>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{prev.title}</p>
                </Link>
              )}
            </div>
            {/* Next — older in the same type */}
            <div style={{ textAlign: 'right' }}>
              {next && (
                <Link href={`/${locale}/texts/${next.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                    {next.year} →
                  </p>
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 1.4 }}>{next.author}</p>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{next.title}</p>
                </Link>
              )}
            </div>
          </nav>

          <Link href={`/${locale}/texts#${text.type}`} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.texts?.title ?? 'Texter'}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
