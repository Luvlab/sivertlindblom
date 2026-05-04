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
  // Two slots always in DOM — we alternate which one is "top"
  const [slots, setSlots] = useState<[string, string]>([
    images[0] ?? '',
    images[1] ?? images[0] ?? '',
  ])
  const [topSlot, setTopSlot] = useState<0 | 1>(0)
  const idxRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (images.length < 2) return

    const tick = () => {
      timerRef.current = setTimeout(() => {
        const nextIdx = (idxRef.current + 1) % images.length
        idxRef.current = nextIdx
        const backSlot = topSlot === 0 ? 1 : 0

        // Write next image src into the back slot first, then flip
        setSlots((prev) => {
          const s: [string, string] = [prev[0], prev[1]]
          s[backSlot] = images[nextIdx]
          return s
        })

        // Two rAFs ensure the src update has painted before we transition opacity
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTopSlot(backSlot as 0 | 1)
          })
        })
      }, interval)
    }

    tick()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // topSlot changing restarts the timer for the next cycle
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topSlot, images.length, interval])

  const imgStyle = (slotIdx: 0 | 1): React.CSSProperties => ({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit,
    padding,
    boxSizing: 'border-box',
    display: 'block',
    opacity: topSlot === slotIdx ? 1 : 0,
    transition: 'opacity 0.9s ease',
    zIndex: topSlot === slotIdx ? 1 : 0,
  })

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background, overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slots[0]} alt={alt} style={imgStyle(0)} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slots[1]} alt={alt} style={imgStyle(1)} />
    </div>
  )
}
