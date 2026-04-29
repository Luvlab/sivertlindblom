'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── All available site images ────────────────────────────────────────────────
const ALL_IMAGES = [
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
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/San-Marco-h%C3%A4star.jpg',               alt: 'San Marco hästar, Venedig' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-1-.jpg',        alt: 'San Marco studie 1' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-2-.jpg',        alt: 'San Marco studie 2' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-3-.jpg',        alt: 'San Marco studie 3' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-4-.jpg',        alt: 'San Marco studie 4' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Triumf-Paris.jpg',                 alt: 'Sivert Lindblom i Paris' },
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
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/04/Glyptoteket.jpg', alt: 'Glyptoteket, Köpenhamn' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DISPLAY_MS = 6000  // hold time per slide
const FADE_MS    = 2000  // fade-out duration

interface Props {
  children?: React.ReactNode
}

/**
 * Cross-fade strategy — no black flash:
 *
 *   BACK  (z-index 0): always opacity:1  — the incoming image, always visible
 *   FRONT (z-index 1): the outgoing image
 *     • Normally opacity:1, transition-duration:0  (instant snap when resetting)
 *     • While fading: opacity:0, transition-duration:FADE_MS
 *
 * Cycle:
 *   1. FRONT shows img[n],   BACK shows img[n+1]  (hidden behind FRONT)
 *   2. setFading(true)  → FRONT fades out over 2 s, BACK (img[n+1]) becomes visible
 *   3. After 2 s: batch-update →
 *        setFrontIdx(n+1)   — FRONT now shows same image as BACK
 *        setFading(false)   — FRONT snaps back to opacity:1 instantly (transition:0)
 *        setBackIdx(n+2)    — BACK quietly loads the next image behind FRONT
 *   4. Wait 6 s, repeat from step 2
 *
 * Because BACK is always opacity:1, the background is never exposed.
 */
export default function HeroSlideshow({ children }: Props) {
  const [images]              = useState<typeof ALL_IMAGES>(() => shuffle(ALL_IMAGES))
  const [frontIdx, setFrontIdx] = useState(0)
  const [backIdx,  setBackIdx]  = useState(1)
  const [fading,   setFading]   = useState(false)
  const [paused,   setPaused]   = useState(false)

  const nextRef     = useRef(2)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fadeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Preload images so the BACK layer is always ready before the fade ──────
  // Fires once on mount: warm up the first 4 images immediately.
  useEffect(() => {
    images.slice(0, 4).forEach(({ url }) => {
      const img = new window.Image()
      img.src = url
    })
  }, [images])

  // Fires whenever backIdx advances: preload the image coming 1 and 2 steps
  // ahead so there are ~8–14 s to load before each is needed as the BACK layer.
  useEffect(() => {
    const one   = (backIdx + 1) % images.length
    const two   = (backIdx + 2) % images.length
    ;[one, two].forEach((i) => {
      const img = new window.Image()
      img.src = images[i].url
    })
  }, [backIdx, images])

  // Start the outgoing fade for the FRONT layer
  const startFade = useCallback(() => {
    setFading(true)

    // After the fade completes, reset FRONT to sit on top of BACK
    fadeTimer.current = setTimeout(() => {
      // Batch: FRONT adopts BACK's image, snaps to opaque, BACK loads next
      setFrontIdx(backIdx)          // same image → invisible "snap"
      setFading(false)              // transition-duration:0 → instant
      setBackIdx(nextRef.current % images.length)
      nextRef.current += 1
    }, FADE_MS)
  }, [backIdx, images.length])

  // Restart the display interval (called after manual jump too)
  const restartInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(startFade, DISPLAY_MS)
  }, [startFade])

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    restartInterval()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (fadeTimer.current)   clearTimeout(fadeTimer.current)
    }
  }, [paused, restartInterval])

  // Jump to a specific image immediately
  function jumpTo(i: number) {
    if (fadeTimer.current) clearTimeout(fadeTimer.current)
    setFading(false)
    setFrontIdx(i)
    setBackIdx((i + 1) % images.length)
    nextRef.current = (i + 2) % images.length
    restartInterval()
  }

  const frontImg  = images[frontIdx]
  const backImg   = images[backIdx]
  const activeIdx = fading ? backIdx : frontIdx   // which image the user sees

  return (
    <section
      className="hero"
      aria-label="Sivert Lindblom — hero slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── BACK layer — always opaque, new image sits here ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backImg.url}
        alt={backImg.alt}
        className="hero-image"
        style={{ zIndex: 0, opacity: 1 }}
      />

      {/* ── FRONT layer — fades OUT to reveal BACK, then snaps back ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frontImg.url}
        alt={frontImg.alt}
        className="hero-image"
        style={{
          zIndex: 1,
          opacity: fading ? 0 : 1,
          // transition only when fading OUT; instant (0ms) when resetting to 1
          transition: fading ? `opacity ${FADE_MS}ms ease-in-out` : 'none',
        }}
      />

      {/* Gradient overlay */}
      <div className="hero-bg" aria-hidden="true" style={{ zIndex: 2 }} />

      {/* Hero content */}
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
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Bild ${i + 1}`}
            onClick={() => jumpTo(i)}
            style={{
              width:      i === activeIdx ? 20 : 6,
              height:     6,
              borderRadius: 3,
              background: i === activeIdx
                ? 'var(--color-accent)'
                : 'rgba(255,255,255,0.35)',
              border:  'none',
              padding: 0,
              cursor:  'pointer',
              transition: 'width 0.3s ease, background 0.3s ease',
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* ── Caption ── */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position:    'absolute',
          bottom:      '3rem',
          right:       '2rem',
          fontSize:    'var(--fs-xs)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:       'rgba(255,255,255,0.4)',
          writingMode: 'vertical-rl',
          display:     'flex',
          alignItems:  'center',
          gap:         '0.5rem',
          zIndex:      4,
        }}
      >
        <span style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.25)', display: 'block', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '16ch' }}>
          {images[activeIdx].alt}
        </span>
      </div>
    </section>
  )
}
