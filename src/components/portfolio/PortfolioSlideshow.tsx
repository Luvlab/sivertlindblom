'use client'

import { useState, useEffect } from 'react'

interface Props {
  images: string[]
  alt: string
  objectFit?: 'cover' | 'contain'
  background?: string
  padding?: string
  /** ms between transitions, default 6000 */
  interval?: number
}

const FADE_MS = 900

export default function PortfolioSlideshow({
  images,
  alt,
  objectFit = 'cover',
  background = 'var(--color-bg-card)',
  padding = '0',
  interval = 6000,
}: Props) {
  const [idx,    setIdx]    = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (images.length < 2) return

    const timer = setInterval(() => {
      setFading(true)                                   // overlay fades in

      const swap = setTimeout(() => {
        setIdx(i => (i + 1) % images.length)           // promote overlay → base
        setFading(false)                                // instantly hide overlay
      }, FADE_MS + 50)

      return () => clearTimeout(swap)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit,
    padding,
    boxSizing: 'border-box',
    display: 'block',
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background, overflow: 'hidden' }}>
      {/* Base — always opaque; never exposes background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[idx]} alt={alt} style={{ ...base, opacity: 1 }} />
      {/* Overlay — fades in on top, then base takes over */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[(idx + 1) % images.length]}
        alt={alt}
        style={{
          ...base,
          opacity: fading ? 1 : 0,
          transition: fading ? `opacity ${FADE_MS}ms ease-in-out` : 'none',
        }}
      />
    </div>
  )
}
