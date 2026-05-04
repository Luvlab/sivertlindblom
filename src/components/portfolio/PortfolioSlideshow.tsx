'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  images: string[]
  alt: string
  objectFit?: 'cover' | 'contain'
  background?: string
  padding?: string
  /** ms between fades, default 3500 */
  interval?: number
}

export default function PortfolioSlideshow({
  images,
  alt,
  objectFit = 'cover',
  background = 'var(--color-bg-card)',
  padding = '0',
  interval = 3500,
}: Props) {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState<number | null>(null)
  const [fading, setFading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (images.length < 2) return

    const start = () => {
      timerRef.current = setTimeout(() => {
        const nextIdx = (current + 1) % images.length
        setNext(nextIdx)
        setFading(true)

        // After transition completes, swap current → next
        setTimeout(() => {
          setCurrent(nextIdx)
          setNext(null)
          setFading(false)
          start()
        }, 800)
      }, interval)
    }

    start()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, images.length, interval])

  const imgStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit,
    display: 'block',
    padding,
    boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background, overflow: 'hidden' }}>
      {/* Current image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={alt}
        style={{ ...imgStyle, opacity: fading ? 0 : 1, transition: 'opacity 0.8s ease' }}
      />
      {/* Next image fades in */}
      {next !== null && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={images[next]}
          alt={alt}
          style={{ ...imgStyle, opacity: fading ? 1 : 0, transition: 'opacity 0.8s ease' }}
        />
      )}
    </div>
  )
}
