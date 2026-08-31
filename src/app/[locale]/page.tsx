import Link from 'next/link'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import HeroSlideshow from '@/components/hero/HeroSlideshow'
import { getHeroConfig, getHomeContent } from '@/lib/data-server'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [dict, { slides: heroSlides, random: heroRandom }, home] = await Promise.all([
    getDictionary(locale as Locale),
    getHeroConfig(),
    getHomeContent(),
  ])

  // About text: DB value applies to Swedish only (Jan edits in sv).
  // Other locales always use their own locale file so no language gets Swedish text.
  const localeAbout = (dict.home?.about_text as string | undefined) || ''
  const aboutText = locale === 'sv'
    ? (home.aboutText || localeAbout)
    : localeAbout

  return (
    <>
      {/* HERO — full-viewport slideshow, bleeds behind transparent header */}
      <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      <HeroSlideshow slides={heroSlides} random={heroRandom}>
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
            // Optical alignment: at this size the serif S's side bearing pushes the
            // visible ink a few px right of the header logo; pull it back flush.
            marginLeft: '-0.05em',
          }}>
            {home.siteTitle}
          </h1>
          <p style={{
            fontSize: 'var(--fs-lg)',
            color: 'rgba(245,245,240,0.75)',
            maxWidth: '55ch',
            marginBottom: '2.5rem',
            whiteSpace: 'pre-wrap',
          }}>
            {home.tagline}
          </p>
          <style>{`
            @media (max-width: 640px) {
              .home-hero-cta { font-size: var(--fs-xs) !important; padding: 0.5rem 0.85rem !important; }
              .home-hero-actions { gap: 0.6rem !important; padding-right: 4.5rem; }
            }
          `}</style>
          <div className="home-hero-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingBottom: '0.5rem' }}>
            <Link href={`/${locale}/portfolio`} className="btn btn-primary home-hero-cta" style={{ fontSize: 'var(--fs-sm)' }}>
              {dict.home?.see_portfolio ?? 'Se portfolion'}
            </Link>
            <Link href={`/${locale}/biography`} className="btn home-hero-cta" style={{ fontSize: 'var(--fs-sm)' }}>
              {dict.home?.biography_btn ?? 'Biografi'}
            </Link>
          </div>
        </div>
      </HeroSlideshow>
      </div>

      {/* PRESS QUOTE + AUDIO */}
      <section style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '4rem clamp(1rem,4vw,5rem)',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          marginBottom: '1.5rem',
        }}>
          {dict.home?.press_label ?? 'Recension'}
        </p>
        <blockquote style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.55rem)',
          fontWeight: 400,
          lineHeight: 1.7,
          color: 'var(--color-text)',
          maxWidth: '75ch',
          margin: '0 auto 1.5rem',
          padding: 0,
          border: 'none',
        }}>
          {home.pressQuote}
        </blockquote>
        <p style={{
          fontSize: 'var(--fs-sm)',
          color: 'var(--color-text)',
          marginBottom: '0.25rem',
        }}>
          {home.pressAttribution}
        </p>
        <p style={{
          fontSize: 'var(--fs-xs)',
          letterSpacing: '0.08em',
          color: 'var(--color-muted)',
          marginBottom: '2rem',
        }}>
          {home.pressSource} · {home.pressDuration}
        </p>

        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio
          controls
          preload="none"
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '36px',
            accentColor: 'var(--color-accent)',
            marginBottom: '1.25rem',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <source src={home.audioUrl} type="audio/mpeg" />
        </audio>

        <a
          href={home.audioLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 'var(--fs-xs)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--color-accent-dim)',
            paddingBottom: '0.15em',
          }}
        >
          {dict.home?.press_listen ?? 'Lyssna på inslaget'} → Sveriges Radio
        </a>
      </section>

      {/* ABOUT strip */}
      <section style={{
        background: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        padding: '4rem clamp(1rem,4vw,5rem)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '2.5rem',
          maxWidth: '1200px',
        }}>
          <div>
            <p style={{
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '0.5rem',
            }}>{dict.home?.about_label ?? 'Om konstnären'}</p>
            <h2 style={{
              fontSize: 'var(--fs-2xl)',
              fontFamily: 'Georgia, serif',
              fontWeight: 400,
              marginBottom: 0,
            }}>
              {dict.home?.birth_year ?? 'f. 1931, Södermanland'}
            </h2>
          </div>

          <div className="about-bio-grid">
            <p style={{
              color: 'var(--color-muted)',
              fontSize: 'var(--fs-base)',
              lineHeight: 1.85,
              margin: 0,
              whiteSpace: 'pre-wrap',
            }}>
              {aboutText}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2rem 1.5rem',
            }}>
              {[
                { n: home.statNActive,    l: dict.home?.stat_active    ?? 'År aktiv' },
                { n: home.statNPublic,    l: dict.home?.stat_public    ?? 'Offentliga verk' },
                { n: home.statNCountries, l: dict.home?.stat_countries ?? 'Länder' },
                { n: home.statNBorn,      l: dict.home?.stat_born      ?? 'Födelseår' },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: 'var(--fs-3xl)', fontFamily: 'Georgia, serif', color: 'var(--color-accent)', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.4rem' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA — Alps image stripe */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '5rem clamp(1rem,4vw,5rem)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '280px',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={home.contactImage}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(100deg, rgba(10,10,10,0.78) 0%, rgba(10,10,10,0.48) 60%, rgba(10,10,10,0.32) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
            {dict.home?.contact_title ?? 'Kontakt'}
          </h2>
          <p style={{ color: 'rgba(245,245,240,0.68)', fontSize: 'var(--fs-sm)' }}>
            {dict.home?.contact_sub ?? 'Frågor om verk, utlåning eller samarbeten'}
          </p>
        </div>
        <Link href={`/${locale}/contact`} className="btn btn-primary" style={{ position: 'relative', zIndex: 1 }}>
          {dict.home?.contact_btn ?? 'Kontakta oss'}
        </Link>
      </section>
    </>
  )
}
