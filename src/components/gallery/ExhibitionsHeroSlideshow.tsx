'use client'

import { useEffect, useState } from 'react'

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
  const [idx,    setIdx]    = useState(0)      // bottom layer index
  const [fading, setFading] = useState(false)  // true while top is fading in

  // Client-side shuffle to avoid hydration mismatch
  useEffect(() => {
    if (images.length > 1) setDeck(shuffle(images))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (deck.length <= 1) return

    const timer = setInterval(() => {
      setFading(true)                                 // top layer fades in

      const swap = setTimeout(() => {
        setIdx(i => (i + 1) % deck.length)           // promote top → bottom
        setFading(false)                              // instantly hide top (no anim)
      }, FADE_MS + 50)

      return () => clearTimeout(swap)
    }, HOLD_MS)

    return () => clearInterval(timer)
  }, [deck])

  const base: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center 40%',
  }

  return (
    <>
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
    </>
  )
}
