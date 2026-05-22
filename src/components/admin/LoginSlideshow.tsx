'use client'

import { useState, useEffect, useRef } from 'react'
import AdminLoginForm from './AdminLoginForm'

const SLIDES = [
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/07/H%C3%A4st-p%C3%A5-Blasieholmen.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Frescati-Klot.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/06/CampusTbana.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2019/05/20190506_182925.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/San-Marco-h%C3%A4star.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7851.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg',
]

const HOLD_MS = 6000
const FADE_MS = 1200

/**
 * Two-layer crossfade — base always opaque, overlay fades in on top.
 * After overlay reaches opacity:1 the base silently swaps to the new
 * image and the overlay instantly resets to opacity:0.  No black flash.
 */
export default function LoginSlideshow() {
  const [idx,    setIdx]    = useState(0)
  const [fading, setFading] = useState(false)
  const swapRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function advance(to?: number) {
    if (swapRef.current) clearTimeout(swapRef.current)
    setFading(true)
    swapRef.current = setTimeout(() => {
      setIdx(i => to ?? (i + 1) % SLIDES.length)
      setFading(false)
    }, FADE_MS + 50)
  }

  useEffect(() => {
    const timer = setInterval(() => advance(), HOLD_MS)
    return () => {
      clearInterval(timer)
      if (swapRef.current) clearTimeout(swapRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const baseUrl    = SLIDES[idx]
  const overlayUrl = SLIDES[(idx + 1) % SLIDES.length]

  const layerBase: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* Base — always visible, slow Ken-Burns zoom */}
      <div
        aria-hidden="true"
        style={{
          ...layerBase,
          backgroundImage: `url(${baseUrl})`,
          opacity: 1,
          transform: 'scale(1.06)',
          transition: `transform ${HOLD_MS * 2}ms ease-in-out`,
        }}
      />

      {/* Overlay — fades in over base, no background ever exposed */}
      <div
        aria-hidden="true"
        style={{
          ...layerBase,
          backgroundImage: `url(${overlayUrl})`,
          opacity: fading ? 1 : 0,
          transition: fading ? `opacity ${FADE_MS}ms ease-in-out` : 'none',
        }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Centered login card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            background: 'rgba(10, 10, 10, 0.75)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 4,
            padding: '2.5rem',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                border: '1px solid var(--color-accent)',
                borderRadius: 2,
                marginBottom: '1.25rem',
                color: 'var(--color-accent)',
                fontSize: 'var(--fs-xl)',
                fontFamily: 'Georgia, serif',
              }}
            >
              S
            </div>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.4rem' }}>
              CMS Admin
            </p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-2xl)', color: '#fff', marginBottom: '0.4rem' }}>
              Sivert Lindblom
            </h1>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'rgba(255,255,255,0.45)' }}>
              Logga in för att hantera innehållet
            </p>
          </div>
          <AdminLoginForm />
        </div>

        <p style={{ marginTop: '1.75rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.35)' }}>
          ←{' '}
          <a href="/sv" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
            Tillbaka till webbplatsen
          </a>
        </p>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '1.5rem' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Bild ${i + 1}`}
              onClick={() => advance(i)}
              style={{
                width: i === idx ? 20 : 6,
                height: 6,
                borderRadius: 3,
                border: 'none',
                background: i === idx ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
                cursor: 'pointer',
                padding: 0,
                transition: 'width 0.4s ease, background 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
