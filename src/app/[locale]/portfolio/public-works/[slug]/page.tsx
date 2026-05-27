import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { getPublicWork, getPublicWorkSlugs, getPublicWorks, getMapPinForWork } from '@/lib/data-server'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'

export async function generateStaticParams() {
  const slugs = await getPublicWorkSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = await getPublicWork(slug)
  if (!work) return {}
  return {
    title: `${work.title} — Sivert Lindblom`,
    description: work.description,
  }
}

export default async function PublicWorkDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale as Locale)

  const [work, allWorks, mapPin] = await Promise.all([
    getPublicWork(slug),
    getPublicWorks(),
    getMapPinForWork(slug),
  ])
  if (!work) notFound()

  // Prev / next within all public works that have slugs
  const withSlugs = allWorks.filter((w) => w.slug)
  const idx  = withSlugs.findIndex((w) => w.slug === slug)
  const prev = idx > 0                       ? withSlugs[idx - 1] : null
  const next = idx < withSlugs.length - 1   ? withSlugs[idx + 1] : null

  const heroImage = work.images[0]?.url ?? null

  const galleryImages: LightboxImage[] = work.images.map((img, i) => ({
    url: img.url,
    alt: img.alt ?? `${work.title} — bild ${i + 1}`,
  }))

  const googleMapsUrl = mapPin
    ? `https://www.google.com/maps?q=${mapPin.lat},${mapPin.lng}&z=16`
    : `https://www.google.com/maps/search/${encodeURIComponent(work.title + ' ' + work.location)}`

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* ── Hero — bleeds under the fixed header ── */}
      {heroImage && (
        <div style={{
          position: 'relative',
          height: '60vh',
          minHeight: 320,
          overflow: 'hidden',
          marginBottom: '4rem',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={work.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(10,10,10,0.92) 100%)' }} />
          <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
            <Link
              href={`/${locale}/portfolio/public-works`}
              className="back-link"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{dict.portfolio?.cat_public ?? 'Offentliga arbeten'}</span>
            </Link>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              {work.year} · {work.location}
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: 0, maxWidth: '26ch' }}>
              {work.title}
            </h1>
          </div>
        </div>
      )}

      {/* ── No-hero fallback ── */}
      {!heroImage && (
        <div className="page-pad" style={{ paddingTop: '2rem', marginBottom: '3rem' }}>
          <Link href={`/${locale}/portfolio/public-works`} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.portfolio?.cat_public ?? 'Offentliga arbeten'}</span>
          </Link>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            {work.year} · {work.location}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: 0 }}>
            {work.title}
          </h1>
        </div>
      )}

      <div className="page-pad">
        {/* Description */}
        {work.description && (
          <p style={{
            color: 'var(--color-muted)',
            fontSize: 'var(--fs-base)',
            lineHeight: 1.85,
            maxWidth: '68ch',
            marginBottom: '1.5rem',
          }}>
            {work.description}
          </p>
        )}

        {/* Body text */}
        {work.body && (
          <div style={{ maxWidth: '68ch', marginBottom: '1.5rem' }}>
            {work.body.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i} style={{ fontSize: 'var(--fs-base)', lineHeight: 1.85, marginBottom: '1.1em', color: 'var(--color-muted)' }}>
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Location button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            border: '1px solid var(--color-accent-dim)',
            padding: '0.4em 0.9em',
            textDecoration: 'none',
            marginBottom: '3.5rem',
          }}
        >
          ⊙ {dict.portfolio?.view_location ?? 'Visa platsen'}
        </a>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <GalleryGrid
              images={galleryImages}
              aspectRatio="4/3"
              columns="sm"
            />
          </section>
        )}

        {/* Prev / Next */}
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
              <Link href={`/${locale}/portfolio/public-works/${prev.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  ← {prev.year}
                </p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{prev.title}</p>
              </Link>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            {next && (
              <Link href={`/${locale}/portfolio/public-works/${next.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  {next.year} →
                </p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{next.title}</p>
              </Link>
            )}
          </div>
        </nav>

        {/* Back links */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingBottom: '4rem' }}>
          <Link href={`/${locale}/portfolio/public-works`} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.portfolio?.cat_public ?? 'Offentliga arbeten'}</span>
          </Link>
          <Link href={`/${locale}/portfolio/map`} className="back-link">
            <span className="back-link-arrow">⊙</span>
            <span className="back-link-label">{dict.portfolio?.map_label ?? 'Karta'}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
