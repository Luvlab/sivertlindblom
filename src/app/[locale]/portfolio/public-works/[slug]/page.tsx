import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { PUBLIC_WORKS } from '@/lib/public-works'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    PUBLIC_WORKS.map((w) => ({ locale, slug: w.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const work = PUBLIC_WORKS.find((w) => w.slug === slug)
  if (!work) return {}
  return {
    title: work.title,
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

  const work = PUBLIC_WORKS.find((w) => w.slug === slug)
  if (!work) notFound()

  const images: LightboxImage[] = work.images.map((img) => ({
    url: img.url,
    alt: img.alt,
  }))

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '2rem' }}>
        {/* Back link above post */}
        <Link href={`/${locale}/portfolio/public-works`} className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.portfolio?.cat_public ?? 'Offentliga arbeten'}</span>
        </Link>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
          <Link href={`/${locale}/portfolio`} style={{ color: 'var(--color-muted)' }}>
            {dict.nav?.portfolio ?? 'Portfolio'}
          </Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <Link href={`/${locale}/portfolio/public-works`} style={{ color: 'var(--color-muted)' }}>
            {dict.portfolio?.cat_public ?? 'Offentliga arbeten'}
          </Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span style={{ color: 'var(--color-text)' }}>{work.title}</span>
        </nav>

        {/* Year badge + location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="badge" style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-dim)' }}>
            {work.year}
          </span>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {work.location}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1rem' }}>
          {work.title}
        </h1>

        {/* Description */}
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', maxWidth: '60ch', marginBottom: '2rem' }}>
          {work.description}
        </p>

        <hr className="divider" style={{ marginBottom: '2rem' }} />

        {/* Body */}
        <div style={{ maxWidth: '72ch', marginBottom: '3rem' }}>
          {work.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 'var(--fs-base)', lineHeight: 1.75, marginBottom: '1.25em', color: 'var(--color-text)' }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {images.length > 0 && (
        <div className="page-pad" style={{ paddingBottom: '4rem' }}>
          <GalleryGrid images={images} aspectRatio="4/3" columns="sm" />
        </div>
      )}

      {images.length === 0 && (
        <div className="page-pad" style={{ paddingBottom: '4rem' }}>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', fontStyle: 'italic' }}>
            {dict.portfolio?.no_images ?? 'Inga bilder tillgängliga för tillfället.'}
          </p>
        </div>
      )}

      {/* Back links */}
      <div className="page-pad" style={{ paddingBottom: '4rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
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
  )
}
