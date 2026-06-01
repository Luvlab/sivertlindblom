import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import { getExhibitionSubpage, getAllSubpageParams } from '@/lib/data-server'
import { renderParagraphs } from '@/lib/render-text'

export async function generateStaticParams() {
  const pairs = await getAllSubpageParams()
  return locales.flatMap((locale) =>
    pairs.map(({ slug, subpage }) => ({ locale, slug, subpage }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subpage: string }>
}): Promise<Metadata> {
  const { slug, subpage } = await params
  const data = await getExhibitionSubpage(slug, subpage)
  if (!data) return { title: 'Sida' }
  return { title: `${data.subpage.title} — ${data.exhibition.title}` }
}

export default async function ExhibitionSubpage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subpage: string }>
}) {
  const { locale, slug, subpage } = await params

  const data = await getExhibitionSubpage(slug, subpage)
  if (!data) notFound()
  const { exhibition: ex, subpage: page } = data

  const heroImage = page.images[0]
  const galleryImages: LightboxImage[] = page.images.map((url, i) => ({
    url,
    alt: `${page.title} — bild ${i + 1}`,
  }))

  const backToExhibition = `/${locale}/portfolio/exhibitions/${ex.slug}`

  const ytMatch = page.videoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/)
  const youTubeId = ytMatch?.[1]

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* Hero */}
      {heroImage && (
        <div style={{ position: 'relative', height: '60vh', minHeight: 320, overflow: 'hidden', marginBottom: '4rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={page.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(10,10,10,0.92) 100%)' }} />
          <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
            <Link href={backToExhibition} className="back-link" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{ex.title}</span>
            </Link>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: '0.75rem 0 0', maxWidth: '26ch' }}>
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {/* No-hero fallback */}
      {!heroImage && (
        <div className="page-pad" style={{ paddingTop: '2rem', marginBottom: '3rem' }}>
          <Link href={backToExhibition} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{ex.title}</span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: '0.75rem 0 0' }}>
            {page.title}
          </h1>
        </div>
      )}

      <div className="page-pad">
        {/* Body text */}
        {page.body && (
          <div style={{
            color: 'var(--color-muted)',
            fontSize: 'var(--fs-base)',
            lineHeight: 1.85,
            maxWidth: '68ch',
            marginBottom: '3.5rem',
          }}>
            {renderParagraphs(page.body, { margin: 0, lineHeight: 1.85 })}
          </div>
        )}

        {/* Video embed */}
        {youTubeId && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 4, background: 'var(--color-bg-surface)', maxWidth: 880 }}>
              <iframe
                src={`https://www.youtube.com/embed/${youTubeId}?rel=0`}
                title={page.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>
        )}

        {/* Gallery */}
        {galleryImages.length > 1 && (
          <section style={{ marginBottom: '4rem' }}>
            <GalleryGrid images={galleryImages} aspectRatio="4/3" columns="sm" />
          </section>
        )}

        {/* Back link at bottom */}
        <Link href={backToExhibition} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{ex.title}</span>
        </Link>
      </div>
    </div>
  )
}
