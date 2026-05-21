'use client'

import { useState, useEffect } from 'react'
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

export default function LoginSlideshow() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev]       = useState<number | null>(null)
  const [fading, setFading]   = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setPrev(current)
      setFading(true)
      setCurrent((c) => (c + 1) % SLIDES.length)
      // clear fading flag after transition completes
      setTimeout(() => {
        setPrev(null)
        setFading(false)
      }, 1200)
    }, 6000)
    return () => clearInterval(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current])

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>

      {/* ── Slideshow layers ─────────────────────────────────── */}
      {SLIDES.map((src, i) => {
        const isActive  = i === current
        const isPrev    = i === prev

        return (
          <div
            key={src}
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: isActive ? 1 : isPrev && fading ? 0 : 0,
              transition: isActive
                ? 'opacity 1.2s ease-in-out'
                : isPrev && fading
                ? 'opacity 1.2s ease-in-out'
                : 'none',
              // Ken-Burns: active slide slowly zooms in
              transform: isActive ? 'scale(1.06)' : 'scale(1)',
              transformOrigin: 'center center',
              transitionProperty: isActive ? 'opacity, transform' : 'opacity',
              transitionDuration: isActive ? '1.2s, 8s' : '1.2s',
              transitionTimingFunction: isActive ? 'ease-in-out, ease-in-out' : 'ease-in-out',
            }}
          />
        )
      })}

      {/* ── Dark overlay ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* ── Centered login card ──────────────────────────────── */}
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
          {/* Brand */}
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

          {/* Form */}
          <AdminLoginForm />
        </div>

        {/* Back link */}
        <p style={{ marginTop: '1.75rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.35)' }}>
          ←{' '}
          <a href="/sv" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
            Tillbaka till webbplatsen
          </a>
        </p>

        {/* Slide indicator dots */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '1.5rem' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Bild ${i + 1}`}
              onClick={() => { setPrev(current); setFading(true); setCurrent(i); setTimeout(() => { setPrev(null); setFading(false) }, 1200) }}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                border: 'none',
                background: i === current ? 'var(--color-accent)' : 'rgba(255,255,255,0.25)',
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
