'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

const FADE_MS   = 3000   // crossfade duration
const HOLD_MS   = 12000  // interval between transition starts

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function ExhibitionsHeroSlideshow({ images }: { images: string[] }) {
  const [deck,   setDeck]   = useState(images)
  const [idx,    setIdx]    = useState(0)
  const [fading, setFading] = useState(false)

  const deckLenRef  = useRef(deck.length)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fadeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => { deckLenRef.current = deck.length }, [deck.length])

  // Client-side shuffle to avoid hydration mismatch
  useEffect(() => {
    if (images.length > 1) setDeck(shuffle(images))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (deckLenRef.current <= 1) return
    intervalRef.current = setInterval(() => {
      setFading(true)
      fadeTimer.current = setTimeout(() => {
        setIdx(i => (i + 1) % deckLenRef.current)
        setFading(false)
      }, FADE_MS + 50)
    }, HOLD_MS)
  }, [])

  useEffect(() => {
    startInterval()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (fadeTimer.current)   clearTimeout(fadeTimer.current)
    }
  }, [deck, startInterval])

  function jump(direction: 1 | -1) {
    if (fadeTimer.current)   clearTimeout(fadeTimer.current)
    setFading(false)
    setIdx(i => (i + direction + deckLenRef.current) % deckLenRef.current)
    startInterval()
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return
    jump(dx < 0 ? 1 : -1)
  }

  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 40%',
  }

  return (
    <div
      style={{ position: 'absolute', inset: 0 }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bottom — always opaque; provides the solid base */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={deck[idx]}
        alt="Sivert Lindblom — utställningar"
        style={{ ...base, opacity: 1 }}
      />
      {/* Top — fades in over FADE_MS, then instantly hides after swap */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={deck[(idx + 1) % deck.length]}
        alt=""
        aria-hidden="true"
        style={{
          ...base,
          opacity: fading ? 1 : 0,
          transition: fading ? `opacity ${FADE_MS}ms ease-in-out` : 'none',
        }}
      />
    </div>
  )
}
