import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import { getExhibition, getExhibitions, getExhibitionSlugs } from '@/lib/data-server'

export async function generateStaticParams() {
  const slugs = await getExhibitionSlugs()
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ex = await getExhibition(slug)
  if (!ex) return { title: 'Exhibition' }
  return { title: `${ex.title} — Sivert Lindblom` }
}

export default async function ExhibitionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale as Locale)

  const [ex, allExhibitions] = await Promise.all([
    getExhibition(slug),
    getExhibitions(),
  ])
  if (!ex) notFound()

  const idx = allExhibitions.findIndex((e) => e.slug === slug)
  const prev = idx > 0 ? allExhibitions[idx - 1] : null
  const next = idx < allExhibitions.length - 1 ? allExhibitions[idx + 1] : null

  const heroImage = ex.images[0]
  const galleryImages: LightboxImage[] = ex.images.map((url, i) => ({
    url,
    alt: `${ex.title} — bild ${i + 1}`,
  }))

  return (
    <div>
      {/* Hero — bleeds under the fixed header, no top padding */}
      {heroImage && (
        <div style={{ position: 'relative', height: '60vh', minHeight: 320, overflow: 'hidden', marginBottom: '4rem', marginTop: 'calc(-1 * (var(--header-h) + 1.5rem))' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={ex.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(10,10,10,0.92) 100%)' }} />
          <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
            <Link
              href={`/${locale}/portfolio/exhibitions`}
              className="back-link"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{dict.portfolio?.cat_exhibitions ?? 'Utställningar'}</span>
            </Link>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
              {ex.year} · {ex.location}
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: 0, maxWidth: '26ch' }}>
              {ex.title}
            </h1>
          </div>
        </div>
      )}

      {/* No-hero fallback */}
      {!heroImage && (
        <div className="page-pad" style={{ paddingTop: '2rem', marginBottom: '3rem' }}>
          <Link href={`/${locale}/portfolio/exhibitions`} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.portfolio?.cat_exhibitions ?? 'Utställningar'}</span>
          </Link>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            {ex.year} · {ex.location}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: 0 }}>
            {ex.title}
          </h1>
        </div>
      )}

      <div className="page-pad">
        {/* Description */}
        {ex.description && ex.description !== 'TEXT kommer' && (
          <p style={{
            color: 'var(--color-muted)',
            fontSize: 'var(--fs-base)',
            lineHeight: 1.85,
            maxWidth: '68ch',
            marginBottom: '3.5rem',
          }}>
            {ex.description}
          </p>
        )}

        {/* Gallery */}
        {galleryImages.length > 1 && (
          <section style={{ marginBottom: '4rem' }}>
            <GalleryGrid
              images={galleryImages}
              aspectRatio="4/3"
              columns="sm"
            />
          </section>
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
                href={`/${locale}/portfolio/exhibitions/${prev.slug}`}
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
                href={`/${locale}/portfolio/exhibitions/${next.slug}`}
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
        <Link href={`/${locale}/portfolio/exhibitions`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.portfolio?.cat_exhibitions ?? 'Utställningar'}</span>
        </Link>
      </div>
    </div>
  )
}
