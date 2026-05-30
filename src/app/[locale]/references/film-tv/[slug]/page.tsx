import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { FILMS, getYouTubeId } from '@/lib/films-data'

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    FILMS.map((f) => ({ locale, slug: f.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const film = FILMS.find((f) => f.slug === slug)
  if (!film) return {}
  return {
    title: film.title,
    description: film.desc,
  }
}

export default async function FilmDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale as Locale)

  const film = FILMS.find((f) => f.slug === slug)
  if (!film) notFound()

  const ytId = film.videoUrl ? getYouTubeId(film.videoUrl) : null
  const isExternalLink = film.videoUrl && !ytId

  return (
    <div className="section-gap">
      {/* Header */}
      <div className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
        <Link
          href={`/${locale}/references#film-tv`}
          className="back-link"
          style={{ marginBottom: '2rem', display: 'inline-flex' }}
        >
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.film_tv ?? 'Film & TV'}</span>
        </Link>

        <p style={{
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          marginBottom: '0.75rem',
        }}>
          {film.year}
        </p>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          marginBottom: '0.75rem',
          lineHeight: 1.15,
        }}>
          {film.title}
        </h1>

        {film.director && (
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '0.2rem' }}>
            {dict.references?.director ?? 'Regi'}: {film.director}
          </p>
        )}
        {film.venue && (
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '0.75rem' }}>
            {film.venue}
          </p>
        )}

        {film.desc && (
          <p style={{
            color: 'var(--color-text)',
            fontSize: 'var(--fs-base)',
            lineHeight: 1.75,
            maxWidth: '65ch',
            marginTop: '1rem',
            marginBottom: '1.5rem',
          }}>
            {film.desc}
          </p>
        )}

        {isExternalLink && film.videoUrl && (
          <a
            href={film.videoUrl}
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
              marginTop: '0.5rem',
            }}
          >
            ▶ {dict.references?.watch ?? 'Se filmen'} →
          </a>
        )}
      </div>

      {/* Primary YouTube embed — full viewport width */}
      {ytId && (
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          marginBottom: film.extraVideos && film.extraVideos.length > 0 ? '0.25rem' : '2rem',
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={film.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      )}

      {/* Extra videos */}
      {film.extraVideos && film.extraVideos.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
          {film.extraVideos.map((ev, i) => {
            const evId = getYouTubeId(ev)
            if (!evId) return null
            return (
              <div key={i} style={{ width: '100%', aspectRatio: '16/9', background: '#000' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${evId}`}
                  title={`${film.title} (del ${i + 2})`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* Back link */}
      <div className="page-pad" style={{ paddingBottom: '4rem' }}>
        <Link href={`/${locale}/references#film-tv`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.film_tv ?? 'Film & TV'}</span>
        </Link>
      </div>
    </div>
  )
}
