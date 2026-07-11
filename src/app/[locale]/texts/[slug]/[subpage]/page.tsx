import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import { getTextSubpage, getAllTextSubpageParams } from '@/lib/data-server'
import { renderParagraphs } from '@/lib/render-text'

export async function generateStaticParams() {
  const pairs = await getAllTextSubpageParams()
  return locales.flatMap((locale) =>
    pairs.map(({ slug, subpage }) => ({ locale, slug, subpage })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subpage: string }>
}): Promise<Metadata> {
  const { slug, subpage } = await params
  const data = await getTextSubpage(slug, subpage)
  if (!data) return { title: 'Sida' }
  return { title: `${data.subpage.title} — ${data.text.title}` }
}

const YT_RE = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/

export default async function TextSubpage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; subpage: string }>
}) {
  const { locale, slug, subpage } = await params

  const data = await getTextSubpage(slug, subpage)
  if (!data) notFound()
  const { text, subpage: page } = data

  const heroImage = page.images[0]
  const galleryImages: LightboxImage[] = page.images.map((url, i) => ({
    url,
    alt: `${page.title} — bild ${i + 1}`,
  }))

  const backToText = `/${locale}/texts/${text.slug}`

  const films: Array<{ id: string; title?: string }> = []
  const primaryId = page.videoUrl?.match(YT_RE)?.[1]
  if (primaryId) films.push({ id: primaryId })
  for (const v of page.videos ?? []) {
    const id = v.url.match(YT_RE)?.[1]
    if (id && !films.some((f) => f.id === id)) films.push({ id, title: v.title })
  }

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {heroImage && (
        <div style={{ position: 'relative', height: '55vh', minHeight: 300, overflow: 'hidden', marginBottom: '4rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt={page.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 25%, rgba(10,10,10,0.92) 100%)' }} />
          <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
            <Link href={backToText} className="back-link" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <span className="back-link-arrow">←</span>
              <span className="back-link-label">{text.title}</span>
            </Link>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: '0.75rem 0 0', maxWidth: '26ch' }}>
              {page.title}
            </h1>
          </div>
        </div>
      )}

      {!heroImage && (
        <div className="page-pad" style={{ paddingTop: '2rem', marginBottom: '3rem' }}>
          <Link href={backToText} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{text.title}</span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: '0.75rem 0 0' }}>
            {page.title}
          </h1>
        </div>
      )}

      <div className="page-pad" style={{ paddingBottom: '4rem' }}>
        {page.body && (
          <div style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.85, maxWidth: '68ch', marginBottom: '3.5rem' }}>
            {renderParagraphs(page.body, { margin: 0, lineHeight: 1.85 })}
          </div>
        )}

        {films.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            {films.map((film) => (
              <div key={film.id} style={{ marginBottom: '2.5rem' }}>
                {film.title && (
                  <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-base)', color: 'var(--color-text)', margin: '0 0 0.75rem' }}>
                    {film.title}
                  </h3>
                )}
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 4, background: 'var(--color-bg-surface)', maxWidth: 880 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${film.id}?rel=0`}
                    title={film.title ?? page.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {galleryImages.length > (heroImage ? 1 : 0) && (
          <GalleryGrid images={heroImage ? galleryImages.slice(1) : galleryImages} aspectRatio="4/3" columns="sm" />
        )}

        <div style={{ marginTop: '3rem' }}>
          <Link href={backToText} className="back-link">
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{text.title}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
