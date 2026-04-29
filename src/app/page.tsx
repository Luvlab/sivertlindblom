'use client'

import Link from 'next/link'
import { HIGHLIGHT_IMAGES, FALLBACK_SETTINGS } from '@/lib/db'

export default function HomePage() {
  const settings = FALLBACK_SETTINGS
  const hero = HIGHLIGHT_IMAGES[0]

  const sections = [
    {
      href: '/portfolio',
      label: 'Portfolio',
      sub: 'Utställningar · Offentliga arbeten · Scenografi · Akvareller',
      count: '350+',
      desc: 'Fyra decennier av utställningar i Sverige och internationellt.',
    },
    {
      href: '/references',
      label: 'Skulptur',
      sub: 'Profiler · Monoliter · Tidiga verk · Grafik',
      count: '12',
      desc: 'Referensmaterial: skulpturserier, grafik och fotografier.',
    },
    {
      href: '/texts',
      label: 'Texter',
      sub: 'Essays · Recensioner · Intervjuer · Egna texter',
      count: '80+',
      desc: 'Kritiska texter av Peter Cornell, Daniel Birnbaum m.fl. och konstnärens egna skrifter.',
    },
    {
      href: '/biography',
      label: 'Biografi',
      sub: 'Utbildning · Uppdrag · Utmärkelser',
      count: '',
      desc: 'Biografi, offentliga uppdrag, grupputställningar och litteraturförteckning.',
    },
  ]

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero" aria-label="Sivert Lindblom — startsida">
        {/* Background image — Blasieholmstorg horses */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-image"
          src={hero.url}
          alt={hero.alt}
          fetchPriority="high"
        />
        <div className="hero-bg" aria-hidden="true" />

        <div className="hero-content page-pad">
          <p style={{
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1rem',
          }}>
            Skulptör · Stockholm
          </p>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 400,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1.05,
            margin: '0 0 1.5rem',
            maxWidth: '14ch',
          }}>
            {settings.site_title}
          </h1>
          <p style={{
            fontSize: 'var(--fs-lg)',
            color: 'rgba(245,245,240,0.75)',
            maxWidth: '55ch',
            marginBottom: '2.5rem',
          }}>
            {settings.hero_tagline}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/portfolio" className="btn btn-primary" style={{ fontSize: 'var(--fs-sm)' }}>
              Se portfolion
            </Link>
            <Link href="/biography" className="btn" style={{ fontSize: 'var(--fs-sm)' }}>
              Biografi
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '2rem',
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          writingMode: 'vertical-rl',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.3)', display: 'block' }} />
          Scroll
        </div>
      </section>

      {/* ── ABOUT strip ─────────────────────────────────────── */}
      <section style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '3rem clamp(1rem,4vw,5rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '2rem',
        alignItems: 'center',
      }}>
        <div>
          <p style={{
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '0.5rem',
          }}>Om konstnären</p>
          <h2 style={{ fontSize: 'var(--fs-2xl)', fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>
            f. 1931, Södermanland
          </h2>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.8, maxWidth: '65ch' }}>
          {settings.about_short}
        </p>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { n: '60+', l: 'År aktiv' },
            { n: '50+', l: 'Offentliga verk' },
            { n: '30+', l: 'Länder' },
            { n: '1931', l: 'Födelseår' },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontSize: 'var(--fs-3xl)', fontFamily: 'Georgia, serif', color: 'var(--color-accent)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HIGHLIGHT images ─────────────────────────────────── */}
      <section className="section-gap" aria-label="Utvalda verk">
        <div className="page-pad" style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>Utvalda verk</p>
          <h2 style={{ fontSize: 'var(--fs-3xl)', fontFamily: 'Georgia, serif' }}>Blasieholmstorg, Stockholm 1989</h2>
        </div>
        <div className="auto-grid" style={{ gap: '2px' }}>
          {HIGHLIGHT_IMAGES.slice(0, 6).map((img, i) => (
            <div key={i} style={{ aspectRatio: i === 0 ? '16/9' : '4/3', overflow: 'hidden', gridColumn: i === 0 ? 'span 2' : 'span 1' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                loading={i < 2 ? 'eager' : 'lazy'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)' }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION CARDS ────────────────────────────────────── */}
      <section className="section-gap page-pad">
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '3rem' }}>Utforska webbplatsen</p>
        <div className="auto-grid-wide">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <article className="card" style={{ padding: '2rem', height: '100%', minHeight: 200 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', margin: 0 }}>{s.label}</h3>
                  {s.count && (
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{s.count}</span>
                  )}
                </div>
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>{s.sub}</p>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7 }}>{s.desc}</p>
                <div style={{ marginTop: '1.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Visa →
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────── */}
      <section style={{
        margin: '0 clamp(1rem,4vw,5rem) 5rem',
        border: '1px solid var(--color-border)',
        padding: '3rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-bg-surface)',
      }}>
        <div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>Kontakt</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>Frågor om verk, utlåning eller samarbeten</p>
        </div>
        <Link href="/contact" className="btn btn-primary">Kontakta oss</Link>
      </section>
    </>
  )
}
