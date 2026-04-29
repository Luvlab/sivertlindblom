'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── All available site images ────────────────────────────────────────────────
const ALL_IMAGES = [
  // Blasieholmstorg horses
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg', alt: 'Blasieholmstorg, Stockholm 1989' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg', alt: 'Hästar i brons, Blasieholmstorg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg', alt: 'Blasieholmstorg detalj' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg', alt: 'Blasieholmstorg natt' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg', alt: 'Blasieholmstorg panorama' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg', alt: 'Blasieholmstorg sidovy' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-75.jpg', alt: 'Blasieholmstorg närbild' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-68.jpg', alt: 'Blasieholmstorg kvällsbild' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-42.jpg', alt: 'Blasieholmstorg närbild 2' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-02.jpg', alt: 'Blasieholmstorg fontän' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-57.jpg', alt: 'Blasieholmstorg vinterbild' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-60.jpg', alt: 'Blasieholmstorg sommarbild' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-38.jpg', alt: 'Blasieholmstorg 1989' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20150129_131500.jpg',                     alt: 'Blasieholmstorg fotografering' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_181256.jpg',                     alt: 'Blasieholmstorg 2017' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_180728.jpg',                     alt: 'Häst på Blasieholmen' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_181022.jpg',                     alt: 'Blasieholmstorg höst' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2018/07/H%C3%A4st-p%C3%A5-Blasieholmen.jpg',     alt: 'Häst på Blasieholmen 2018' },
  // San Marco / Venice reference
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/San-Marco-h%C3%A4star.jpg',               alt: 'San Marco hästar, Venedig' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-1-.jpg',        alt: 'San Marco studie 1' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-2-.jpg',        alt: 'San Marco studie 2' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-3-.jpg',        alt: 'San Marco studie 3' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-4-.jpg',        alt: 'San Marco studie 4' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Triumf-Paris.jpg',                 alt: 'Sivert Lindblom i Paris' },
  // Archive / press images
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img307.jpg',   alt: 'Arkivbild' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img337.jpg',   alt: 'Arkivbild 2' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img338.jpg',   alt: 'Arkivbild 3' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img340.jpg',   alt: 'Arkivbild 4' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img342.jpg',   alt: 'Arkivbild 5' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img344.jpg',   alt: 'Arkivbild 6' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img345.jpg',   alt: 'Arkivbild 7' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img346.jpg',   alt: 'Arkivbild 8' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img347.jpg',   alt: 'Arkivbild 9' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img348.jpg',   alt: 'Arkivbild 10' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/05/img349.jpg',   alt: 'Arkivbild 11' },
  // Glyptoteket
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/04/Glyptoteket.jpg', alt: 'Glyptoteket, Köpenhamn' },
]

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DISPLAY_MS = 6000   // total time per slide
const FADE_MS   = 2000   // cross-fade duration

interface Props {
  /** Extra content rendered on top of the hero (title, buttons, etc.) */
  children?: React.ReactNode
}

export default function HeroSlideshow({ children }: Props) {
  // Shuffled image list, stable across re-renders
  const [images] = useState<typeof ALL_IMAGES>(() => shuffle(ALL_IMAGES))

  // Which two slots are "A" and "B" (we swap them to cross-fade)
  const [indexA, setIndexA]   = useState(0)
  const [indexB, setIndexB]   = useState(1)
  const [showA, setShowA]     = useState(true)  // true → A on top, false → B on top
  const [paused, setPaused]   = useState(false)

  const nextIdxRef = useRef(2)   // next image to load into the hidden slot
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setShowA((prev) => {
      const next = prev
      // Load next image into the slot that's about to go invisible
      if (next) {
        // A is currently showing → after flip B will show, so fill A with next image
        setIndexA(nextIdxRef.current % images.length)
      } else {
        setIndexB(nextIdxRef.current % images.length)
      }
      nextIdxRef.current += 1
      return !prev
    })
  }, [images.length])

  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(advance, DISPLAY_MS)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [advance, paused])

  const imgA = images[indexA]
  const imgB = images[indexB]

  // Current caption
  const current = showA ? imgA : imgB

  return (
    <section
      className="hero"
      aria-label="Sivert Lindblom — hero slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide A ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`a-${indexA}`}
        src={imgA.url}
        alt={imgA.alt}
        className="hero-image"
        style={{
          opacity: showA ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
          zIndex: showA ? 1 : 0,
        }}
      />

      {/* ── Slide B ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={`b-${indexB}`}
        src={imgB.url}
        alt={imgB.alt}
        className="hero-image"
        style={{
          opacity: showA ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
          zIndex: showA ? 0 : 1,
        }}
      />

      {/* Gradient overlay */}
      <div className="hero-bg" aria-hidden="true" style={{ zIndex: 2 }} />

      {/* Hero content (title, buttons, etc.) */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        {children}
      </div>

      {/* ── Dot indicators ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '6px',
          zIndex: 4,
        }}
      >
        {images.map((_, i) => {
          const active = i === (showA ? indexA : indexB)
          return (
            <button
              key={i}
              aria-label={`Bild ${i + 1}`}
              onClick={() => {
                // Jump to a specific slide
                if (showA) {
                  setIndexB(i)
                  setShowA(false)
                } else {
                  setIndexA(i)
                  setShowA(true)
                }
                nextIdxRef.current = (i + 1) % images.length
                // Restart timer
                if (intervalRef.current) clearInterval(intervalRef.current)
                intervalRef.current = setInterval(advance, DISPLAY_MS)
              }}
              style={{
                width: active ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: active ? 'var(--color-accent)' : 'rgba(255,255,255,0.35)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          )
        })}
      </div>

      {/* ── Caption ── */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          bottom: '3rem',
          right: '2rem',
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          writingMode: 'vertical-rl',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 4,
          maxHeight: '18ch',
          overflow: 'hidden',
        }}
      >
        <span style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.25)', display: 'block', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current.alt}
        </span>
      </div>

      {/* Preload next two images */}
      <link
        rel="preload"
        as="image"
        href={images[nextIdxRef.current % images.length]?.url}
      />
    </section>
  )
}
