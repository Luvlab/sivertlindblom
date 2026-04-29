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

export default function Lightbox({ images, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex)
  const touchStartX = useRef<number | null>(null)
  const total = images.length

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
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
    // Only close if clicking the backdrop itself, not the image or controls
    if (e.target === e.currentTarget) onClose()
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx < -50) next()
    else if (dx > 50) prev()
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

      {/* Close button — highest z-index so arrows never cover it */}
      <button
        aria-label="Stäng"
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

      {/* Prev arrow — centered vertically, does not reach the top */}
      {total > 1 && (
        <button
          aria-label="Föregående"
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

      {/* Next arrow — centered vertically, does not reach the top */}
      {total > 1 && (
        <button
          aria-label="Nästa"
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
    </div>
  )
}
