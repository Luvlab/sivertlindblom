import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import { getWorks, FALLBACK_WORKS } from '@/lib/scenography-data'
import { renderParagraphs } from '@/lib/render-text'

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    FALLBACK_WORKS.map((w) => ({ locale, slug: w.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const works = await getWorks()
  const work = works.find((w) => w.slug === slug)
  if (!work) return { title: 'Scenografi' }
  return { title: work.title }
}

export default async function ScenographyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const [dict, allWorks] = await Promise.all([
    getDictionary(locale as Locale),
    getWorks(),
  ])

  const idx = allWorks.findIndex((w) => w.slug === slug)
  if (idx === -1) notFound()

  const work = allWorks[idx]
  const prev = idx > 0 ? allWorks[idx - 1] : null
  const next = idx < allWorks.length - 1 ? allWorks[idx + 1] : null

  const heroImage = work.images[0]
  const galleryImages: LightboxImage[] = work.images.map((url, i) => ({
    url,
    alt: `${work.title} — bild ${i + 1}`,
  }))

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* Hero */}
      {heroImage ? (
        <div style={{ position: 'relative', height: '60vh', minHeight: 320, overflow: 'hidden', marginBottom: '3rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={work.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(10,10,10,0.92) 100%)' }} />
          <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
              {work.year ?? ''}{work.year && work.type ? ' · ' : ''}{work.type}
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3.5vw,3rem)', margin: 0, maxWidth: '26ch' }}>
              {work.title}
            </h1>
          </div>
        </div>
      ) : (
        <div style={{ background: '#111', minHeight: 320, display: 'flex', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div className="page-pad" style={{ paddingTop: 'calc(var(--header-h) + 3rem)', paddingBottom: '3rem', width: '100%' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>
              {work.year ?? ''}{work.year && work.type ? ' · ' : ''}{work.type}
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3.5vw,3rem)', margin: 0 }}>
              {work.title}
            </h1>
          </div>
        </div>
      )}

      <div className="page-pad">
        {/* Back link */}
        <Link
          href={`/${locale}/portfolio/scenography`}
          className="back-link"
          style={{ marginBottom: '2rem', display: 'inline-flex' }}
        >
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.portfolio?.cat_scenography ?? 'Scenografi'}</span>
        </Link>

        {/* Year + type */}
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
          {work.year ?? ''}{work.year && work.type ? ' · ' : ''}{work.type}
        </p>

        {/* Title (when no hero) */}
        {!heroImage && (
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', margin: '0 0 0.4rem' }}>
            {work.title}
          </h1>
        )}

        {/* Title shown below hero for context in page body */}
        {heroImage && (
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', margin: '0 0 0.4rem' }}>
            {work.title}
          </h1>
        )}

        {/* Venue */}
        {work.venue && (
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', margin: '0 0 1.75rem' }}>
            {work.venue}
          </p>
        )}

        {/* Description */}
        {work.description && (
          <div style={{
            color: 'var(--color-muted)',
            fontSize: 'var(--fs-base)',
            lineHeight: 1.85,
            maxWidth: '68ch',
            marginBottom: '3rem',
          }}>
            {renderParagraphs(work.description, { margin: 0, lineHeight: 1.85 })}
          </div>
        )}

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <GalleryGrid
              images={galleryImages}
              aspectRatio="4/3"
              columns="sm"
            />
          </section>
        )}

        {/* YouTube embed */}
        {work.video_url && (
          <div style={{ marginBottom: '3.5rem', maxWidth: '800px' }}>
            <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', borderRadius: 4, background: '#111' }}>
              <iframe
                src={`https://www.youtube.com/embed/${work.video_url}?rel=0`}
                title={work.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>
        )}

        {/* Prev / Next navigation */}
        <nav style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '2rem',
          marginBottom: '4rem',
        }}>
          <div>
            {prev && (
              <Link
                href={`/${locale}/portfolio/scenography/${prev.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  ← {prev.year}
                </p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{prev.title}</p>
              </Link>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {next && (
              <Link
                href={`/${locale}/portfolio/scenography/${next.slug}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  {next.year} →
                </p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{next.title}</p>
              </Link>
            )}
          </div>
        </nav>

        {/* Back link at bottom */}
        <Link href={`/${locale}/portfolio/scenography`} className="back-link" style={{ marginBottom: '4rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.portfolio?.cat_scenography ?? 'Scenografi'}</span>
        </Link>
      </div>
    </div>
  )
}
