import Link from 'next/link'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { FALLBACK_SETTINGS, HIGHLIGHT_IMAGES } from '@/lib/db'
import HeroSlideshow from '@/components/hero/HeroSlideshow'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  const settings = FALLBACK_SETTINGS

  const sections = [
    {
      href: `/${locale}/portfolio`,
      label: dict.nav?.portfolio ?? 'Portfolio',
      sub: `${dict.portfolio?.cat_exhibitions} · ${dict.portfolio?.cat_public} · ${dict.portfolio?.cat_scenography} · ${dict.portfolio?.cat_watercolors}`,
      count: '350+',
      desc: dict.portfolio?.desc_exhibitions ?? '',
    },
    {
      href: `/${locale}/references`,
      label: dict.nav?.sculpture ?? 'Skulptur',
      sub: 'Profiler · Monoliter · Tidiga verk · Grafik',
      count: '12',
      desc: dict.references?.intro ?? '',
    },
    {
      href: `/${locale}/texts`,
      label: dict.nav?.texts ?? 'Texter',
      sub: `${dict.texts?.essay} · ${dict.texts?.review} · ${dict.texts?.interview} · ${dict.texts?.own_writing}`,
      count: '80+',
      desc: dict.texts?.intro ?? '',
    },
    {
      href: `/${locale}/biography`,
      label: dict.nav?.biography ?? 'Biografi',
      sub: `${dict.biography?.education} · ${dict.biography?.public_commissions} · ${dict.biography?.award}`,
      count: '',
      desc: dict.biography?.intro ?? '',
    },
  ]

  return (
    <>
      {/* HERO — full-viewport slideshow */}
      <HeroSlideshow>
        <div className="hero-content page-pad">
          <p style={{
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1rem',
          }}>
            {dict.home?.sculptor ?? 'Skulptör · Stockholm'}
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
            {dict.home?.tagline ?? settings.hero_tagline}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/portfolio`} className="btn btn-primary" style={{ fontSize: 'var(--fs-sm)' }}>
              {dict.home?.see_portfolio ?? 'Se portfolion'}
            </Link>
            <Link href={`/${locale}/biography`} className="btn" style={{ fontSize: 'var(--fs-sm)' }}>
              {dict.home?.biography_btn ?? 'Biografi'}
            </Link>
          </div>
        </div>
      </HeroSlideshow>

      {/* ABOUT strip */}
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
          }}>{dict.home?.about_label ?? 'Om konstnären'}</p>
          <h2 style={{ fontSize: 'var(--fs-2xl)', fontFamily: 'Georgia, serif', marginBottom: '1rem' }}>
            {dict.home?.birth_year ?? 'f. 1931, Södermanland'}
          </h2>
        </div>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.8, maxWidth: '65ch' }}>
          {dict.home?.about_text ?? settings.about_short}
        </p>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { n: '60+', l: dict.home?.stat_active ?? 'År aktiv' },
            { n: '50+', l: dict.home?.stat_public ?? 'Offentliga verk' },
            { n: '30+', l: dict.home?.stat_countries ?? 'Länder' },
            { n: '1931', l: dict.home?.stat_born ?? 'Födelseår' },
          ].map((s) => (
            <div key={s.l}>
              <div style={{ fontSize: 'var(--fs-3xl)', fontFamily: 'Georgia, serif', color: 'var(--color-accent)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHT images */}
      <section className="section-gap" aria-label={dict.home?.selected_works ?? 'Utvalda verk'}>
        <div className="page-pad" style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
            {dict.home?.selected_works ?? 'Utvalda verk'}
          </p>
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
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION CARDS */}
      <section className="section-gap page-pad">
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '3rem' }}>
          {dict.home?.explore ?? 'Utforska webbplatsen'}
        </p>
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
                  {dict.common?.show ?? 'Visa'} →
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
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
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
            {dict.home?.contact_title ?? 'Kontakt'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {dict.home?.contact_sub ?? 'Frågor om verk, utlåning eller samarbeten'}
          </p>
        </div>
        <Link href={`/${locale}/contact`} className="btn btn-primary">
          {dict.home?.contact_btn ?? 'Kontakta oss'}
        </Link>
      </section>
    </>
  )
}
