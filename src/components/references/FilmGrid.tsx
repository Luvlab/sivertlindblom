'use client'
import { useState } from 'react'
import Link from 'next/link'
import { FILMS, getYouTubeId, ytThumb, type FilmEntry } from '@/lib/films-data'

interface Props {
  locale: string
}

export default function FilmGrid({ locale }: Props) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '3px',
    }}>
      {FILMS.map((f) => {
        const ytId = f.videoUrl ? getYouTubeId(f.videoUrl) : null
        const thumb = ytId ? ytThumb(ytId) : null
        return (
          <FilmCard
            key={f.slug}
            film={f}
            thumb={thumb}
            href={`/${locale}/references/film-tv/${f.slug}`}
          />
        )
      })}
    </div>
  )
}

function FilmCard({
  film,
  thumb,
  href,
}: {
  film: FilmEntry
  thumb: string | null
  href: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        background: '#0d0d0d',
        outline: hovered ? '2px solid var(--color-accent)' : '2px solid transparent',
        outlineOffset: '-2px',
      }}
    >
      {thumb ? (
        <img
          src={thumb}
          alt={film.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            opacity: hovered ? 1 : 0.75,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.35s ease, opacity 0.25s ease',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-surface)',
        }}>
          <span style={{ color: 'var(--color-muted)', fontSize: '2.5rem', opacity: 0.3 }}>▶</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
        transition: 'background 0.25s ease',
        pointerEvents: 'none',
      }} />

      {/* Play badge */}
      {thumb && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${hovered ? 1.1 : 0.9})`,
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          pointerEvents: 'none',
        }}>
          <span style={{ color: '#fff', fontSize: '1rem', marginLeft: '0.15rem' }}>▶</span>
        </div>
      )}

      {/* Text overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '2rem 0.875rem 0.75rem',
        pointerEvents: 'none',
      }}>
        <div style={{
          color: 'var(--color-accent)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '0.2rem',
        }}>
          {film.year}
        </div>
        <div style={{
          color: '#fff',
          fontSize: 'var(--fs-sm)',
          fontWeight: 500,
          lineHeight: 1.3,
        }}>
          {film.title}
        </div>
        {(film.director ?? film.venue) && (
          <div style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.7rem',
            marginTop: '0.2rem',
          }}>
            {film.director ?? film.venue}
          </div>
        )}
      </div>
    </Link>
  )
}
