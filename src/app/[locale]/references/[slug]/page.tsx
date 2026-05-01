import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { SCULPTURE_PROJECTS } from '@/lib/sculpture-projects'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    SCULPTURE_PROJECTS.map((p) => ({ locale, slug: p.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = SCULPTURE_PROJECTS.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function SculptureSeriesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale as Locale)

  const project = SCULPTURE_PROJECTS.find((p) => p.slug === slug)
  if (!project) notFound()

  const images: LightboxImage[] = project.images.map((img) => ({
    url: img.url,
    alt: img.alt,
  }))

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '2rem' }}>
        {/* Back button */}
        <Link href={`/${locale}/references`} className="back-link" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.subtitle ?? 'Skulptur & Grafik'}</span>
        </Link>

        {project.years && (
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
            {project.years}
          </p>
        )}

        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1rem' }}>
          {project.title}
        </h1>

        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', maxWidth: '60ch', marginBottom: '1.5rem' }}>
          {project.description}
        </p>

        <hr className="divider" style={{ marginBottom: '1.5rem' }} />

        <div style={{ maxWidth: '72ch' }}>
          {project.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontSize: 'var(--fs-base)', lineHeight: 1.75, marginBottom: '1.25em', color: 'var(--color-text)' }}>
              {para}
            </p>
          ))}
          {project.links && project.links.length > 0 && (
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {project.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: 'var(--fs-sm)',
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-accent-dim)',
                    paddingBottom: '0.2rem',
                    width: 'fit-content',
                  }}
                >
                  <span>{dict.references?.read_here ?? 'LÄS HÄR'}</span>
                  <span style={{ fontStyle: 'italic', color: 'var(--color-text)' }}>{link.label}</span>
                  <span>→</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="page-pad" style={{ paddingBottom: '4rem' }}>
          <GalleryGrid images={images} aspectRatio="3/2" columns="sm" />
        </div>
      )}

      {images.length === 0 && (
        <div className="page-pad" style={{ paddingBottom: '4rem' }}>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', fontStyle: 'italic' }}>
            {dict.references?.no_images ?? 'Inga bilder tillgängliga för tillfället.'}
          </p>
        </div>
      )}
    </div>
  )
}
