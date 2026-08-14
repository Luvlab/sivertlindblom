import { notFound } from 'next/navigation'
import Link from 'next/link'
import PdfDownloads from '@/components/pdf/PdfDownloads'
import MediaPlayers from '@/components/MediaPlayers'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { TEXTS_DATA } from '@/lib/texts-data'
import { getTextSlugs, getText, getTexts } from '@/lib/data-server'
import { getTranslation } from '@/lib/translations'
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
  sv: 'SV', en: 'EN', de: 'DE', fr: 'FR', it: 'IT', hu: 'HU',
}

export default async function TextDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const isSwedish = locale === 'sv'
  const [dict, allTexts, dbTranslation] = await Promise.all([
    getDictionary(locale as Locale),
    getTexts(),
    isSwedish ? Promise.resolve(null) : getTranslation('text', slug, locale),
  ])

  // DB is authoritative (that's where Jan edits images/body). The legacy
  // TEXTS_DATA is only a fallback + source of translations/video the DB lacks.
  // Previously TEXTS_DATA was checked first, which shadowed DB-added images.
  const dbText = allTexts.find((t) => t.slug === slug) ?? await getText(slug)
  const staticText = TEXTS_DATA.find((t) => t.slug === slug)
  const text = dbText
    ? {
        ...staticText,
        ...dbText,
        // Never blank content the DB happens not to have:
        body: dbText.body || staticText?.body || '',
        images: dbText.images?.length ? dbText.images : (staticText?.images ?? []),
        // Legacy-only fields the DB row doesn't carry:
        bodies: staticText?.bodies ?? dbText.bodies,
        videoUrl: dbText.videoUrl ?? staticText?.videoUrl,
      }
    : staticText
  if (!text) notFound()

  // Prev / next within the same type group (already ordered newest-first)
  const sameType = allTexts.filter((t) => t.type === text.type)
  const idx = sameType.findIndex((t) => t.slug === slug)
  const prev = idx > 0 ? sameType[idx - 1] : null
  const next = idx < sameType.length - 1 ? sameType[idx + 1] : null

  // Translation priority:
  // 1. DB translation (machine or human) for non-Swedish locales
  // 2. Admin-edited body (Swedish source)
  // 3. Legacy static translations in TEXTS_DATA.bodies
  const hasAdminBody = !!(text.body && text.body.trim())
  const translatedBody = dbTranslation?.content ?? null
  const translatedTitle = dbTranslation?.title ?? null
  const body = translatedBody ?? (hasAdminBody ? text.body : (text.bodies?.[locale] ?? ''))
  const displayTitle = translatedTitle ?? text.title
  const isMachineTranslated = !!(dbTranslation?.machine_translated)
  const isTranslated = !!translatedBody || (!hasAdminBody && text.bodies?.[locale] !== undefined && locale !== text.lang)

  const typeLabel = (dict.texts as Record<string, string> | undefined)?.[text.type] ?? text.type
  const langLabel = LANG_LABELS[text.lang] || text.lang.toUpperCase()
  const showOcr = text.showOcr === true

  const hasImages = !!(text.images && text.images.length > 0)
  const useRightColLayout = hasImages && !showOcr

  function renderBody(fontSize = 'var(--fs-base)') {
    if (!body) return null
    return body.split('\n\n').map((para, i) => (
      <p key={i} style={{ fontSize, lineHeight: 1.8, marginBottom: '1.5em', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>
        {renderInlineLinks(para)}
      </p>
    ))
  }

  function renderVideo() {
    if (!text?.videoUrl) return null
    const ytMatch = text.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
    const ytId = ytMatch?.[1]
    return (
      <div style={{ marginBottom: '2.5rem' }}>
        {ytId ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 4, background: 'var(--color-bg-surface)' }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0`}
              title={text.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        ) : (
          <a href={text.videoUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)', paddingBottom: '0.1em' }}>
            <span style={{ fontSize: '1.1em' }}>▶</span>
            {dict.texts?.watch_film ?? 'SE FILMEN'} →
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ maxWidth: useRightColLayout ? '1160px' : '80ch' }}>
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
          {displayTitle}
        </h1>

        {/* Author + publication */}
        <div style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2.5rem' }}>
          <span>{text.author}</span>
          {text.authorBio && (
            <span style={{ color: 'var(--color-muted)', marginLeft: '0.4rem' }}>
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

        {/* Machine-translated badge */}
        {isMachineTranslated && (
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.08em', color: '#c07820', background: '#2a1800', border: '1px solid #5a3000', padding: '0.5rem 1rem', marginBottom: '2rem' }}>
            {(dict.texts as Record<string,string> | undefined)?.machine_translated ?? 'Maskinöversatt — ännu ej granskad av mänsklig översättare.'}
          </p>
        )}

        {/* Original-language notice when no translation available */}
        {!isTranslated && locale !== text.lang && (
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.08em', color: 'var(--color-muted)', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', padding: '0.6rem 1rem', marginBottom: '2rem' }}>
            {langLabel} — {(dict.texts as Record<string,string> | undefined)?.original_language ?? 'Originalspråk'}
          </p>
        )}

        {/* ── Main content ── */}
        {useRightColLayout ? (
          /* Desktop two-column: text left, images right */
          <>
            <style>{`
              .text-detail-grid {
                display: grid;
                grid-template-columns: minmax(0, 1fr) 300px;
                gap: 3rem;
                align-items: start;
              }
              @media (max-width: 860px) {
                .text-detail-grid {
                  grid-template-columns: 1fr;
                }
                .text-detail-images {
                  order: -1;
                }
              }
            `}</style>
            <div className="text-detail-grid">
              {/* Left column: video + body */}
              <div>
                {renderVideo()}
                {showOcr ? (
                  <>
                    <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem' }}>OCR</p>
                    {renderBody('var(--fs-sm)')}
                    {!body && <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', fontStyle: 'italic' }}>OCR-text saknas ännu</p>}
                  </>
                ) : (
                  renderBody()
                )}
              </div>

              {/* Right column: images — sticky on desktop */}
              <div className="text-detail-images" style={{ position: 'sticky', top: '5rem' }}>
                <TextImageSlideshow images={text.images ?? []} title={text.title} />
              </div>
            </div>
          </>
        ) : showOcr && hasImages ? (
          /* OCR mode without right-col (shouldn't happen but safe fallback) */
          <div className="article-scan-layout">
            <div className="article-scan-images">
              <TextImageSlideshow images={text.images ?? []} title={text.title} />
            </div>
            <div className="article-scan-text">
              <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '1rem' }}>OCR</p>
              {body ? renderBody('var(--fs-sm)') : (
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', fontStyle: 'italic' }}>OCR-text saknas ännu</p>
              )}
            </div>
          </div>
        ) : (
          /* No images: single column text */
          <div>
            {renderVideo()}
            {renderBody()}
          </div>
        )}

        {/* PDF downloads + flip-book */}
        {text.pdfs && text.pdfs.length > 0 && <PdfDownloads pdfs={text.pdfs} />}

        {/* Uploaded audio/video (reorderable) */}
        <MediaPlayers media={text.media} />
        {(!text.media || text.media.length === 0) && text.audioUrl && (
          <div style={{ marginTop: '2rem' }}>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls preload="none" src={text.audioUrl} style={{ width: '100%', maxWidth: 480, height: 40, accentColor: 'var(--color-accent)' }} />
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
