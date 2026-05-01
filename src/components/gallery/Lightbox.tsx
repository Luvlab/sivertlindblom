'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

export interface LightboxImage {
  url: string
  alt: string
  caption?: string
}

interface Props {
  images: LightboxImage[]
  startIndex: number
  onClose: () => void
}

const INTERVAL_MS = 5000

export default function Lightbox({ images, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)
  const [isPlaying, setIsPlaying] = useState(images.length > 1)
  const touchStartX = useRef<number | null>(null)
  const total = images.length

  // Auto-advance — only runs when isPlaying; pauses automatically via cleanup
  useEffect(() => {
    if (!isPlaying || total <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [isPlaying, total])

  // Manual navigation — pause autoplay
  const prev = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setIsPlaying(false)
    setIndex((i) => (i + 1) % total)
  }, [total])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
      else if (e.key === ' ') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next, onClose])

  // Preload adjacent images
  useEffect(() => {
    const prevIdx = (index - 1 + total) % total
    const nextIdx = (index + 1) % total
    ;[prevIdx, nextIdx].forEach((i) => {
      if (images[i]) {
        const img = new Image()
        img.src = images[i].url
      }
    })
  }, [index, images, total])

  const current = images[index]

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) > 50) {
      setIsPlaying(false)
      if (dx < 0) setIndex((i) => (i + 1) % total)
      else setIndex((i) => (i - 1 + total) % total)
    }
  }

  if (!current) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || 'Lightbox'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Counter */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.14em',
          fontVariant: 'small-caps',
          color: 'rgba(255,255,255,0.55)',
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {index + 1} / {total}
      </div>

      {/* Close button */}
      <button
        aria-label="Close"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '0.75rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.75)',
          fontSize: '2rem',
          lineHeight: 1,
          cursor: 'pointer',
          padding: '0.5rem',
          zIndex: 203,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#fff' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)' }}
      >
        ×
      </button>

      {/* Play / Pause button — only shown when multiple images */}
      {total > 1 && (
        <button
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          onClick={(e) => { e.stopPropagation(); setIsPlaying((p) => !p) }}
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '1rem',
            background: 'none',
            border: 'none',
            color: isPlaying ? 'rgba(255,255,255,0.75)' : 'var(--color-accent)',
            fontSize: '1.1rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '0.4rem 0.5rem',
            zIndex: 203,
            transition: 'color 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            /* Pause icon — two vertical bars */
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <rect x="0" y="0" width="4" height="16" rx="1"/>
              <rect x="10" y="0" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            /* Play icon — triangle */
            <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
              <polygon points="0,0 14,8 0,16"/>
            </svg>
          )}
          {/* Progress bar under the icon when playing */}
          {isPlaying && (
            <span
              key={`${index}-${isPlaying}`}
              style={{
                display: 'block',
                height: '2px',
                width: '32px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '1px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: '100%',
                  background: 'var(--color-accent)',
                  borderRadius: '1px',
                  transformOrigin: 'left center',
                  animation: `lightbox-progress ${INTERVAL_MS}ms linear forwards`,
                }}
              />
            </span>
          )}
        </button>
      )}

      {/* Prev arrow */}
      {total > 1 && (
        <button
          aria-label="Previous"
          onClick={(e) => { e.stopPropagation(); prev() }}
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '2px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '0.6rem 1rem',
            lineHeight: 1,
            zIndex: 201,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'var(--color-accent)'
            el.style.background = 'rgba(255,255,255,0.14)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.8)'
            el.style.background = 'rgba(255,255,255,0.07)'
          }}
        >
          ‹
        </button>
      )}

      {/* Next arrow */}
      {total > 1 && (
        <button
          aria-label="Next"
          onClick={(e) => { e.stopPropagation(); next() }}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '2px',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '0.6rem 1rem',
            lineHeight: 1,
            zIndex: 201,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'var(--color-accent)'
            el.style.background = 'rgba(255,255,255,0.14)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'rgba(255,255,255,0.8)'
            el.style.background = 'rgba(255,255,255,0.07)'
          }}
        >
          ›
        </button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current.url}
        alt={current.alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '95vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          display: 'block',
          userSelect: 'none',
        }}
      />

      {/* Caption */}
      {current.caption && (
        <p
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: 'var(--fs-sm)',
            textAlign: 'center',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            maxWidth: '80vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {current.caption}
        </p>
      )}

      {/* Progress bar keyframe animation */}
      <style>{`
        @keyframes lightbox-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
