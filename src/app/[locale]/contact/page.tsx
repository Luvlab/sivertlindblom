import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import ContactForm from './ContactForm'

export const metadata: Metadata = { title: 'Contact' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const ALPS_IMAGE = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/contact/siverts-alper.jpg'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div>
      {/* Hero — Alps background, full viewport height */}
      <div style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        marginBottom: '4rem',
        marginTop: 'calc(-1 * (var(--header-h) + var(--subnav-h) + 1.5rem))',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ALPS_IMAGE}
          alt="Schweiziska alper — Sivert Lindblom"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }}
        />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.28) 40%, rgba(0,0,0,0.78) 100%)' }} />

        {/* Title block */}
        <div className="page-pad" style={{ position: 'absolute', bottom: '5rem', left: 0, right: 0 }}>
          <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
            {dict.nav?.contact ?? 'Kontakt'}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', margin: 0 }}>
            {dict.contact?.title ?? 'Ta kontakt'}
          </h1>
          {dict.contact?.intro && (
            <p style={{ color: 'rgba(255,255,255,0.72)', marginTop: '0.75rem', maxWidth: '55ch', fontSize: 'var(--fs-base)' }}>
              {dict.contact.intro}
            </p>
          )}
        </div>

        {/* Scroll-down arrow */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.3rem',
          opacity: 0.7,
          animation: 'scrollDrop 2.4s ease-in-out infinite',
        }}>
          <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ display: 'block' }}>
            <line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="4,14 10,21 16,14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </div>
      </div>

      <div className="section-gap" style={{ paddingTop: 0 }}>
      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '2rem' }}>
              {dict.contact?.info_title ?? 'Information'}
            </h2>
            {[
              { label: dict.contact?.email ?? 'E-post', value: 'info@sivertlindblom.se', href: 'mailto:info@sivertlindblom.se' },
              { label: dict.contact?.editor ?? 'Redaktör', value: 'Jan Öqvist', href: null },
            ].map((item) => (
              <div key={item.label} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.label}</div>
                {item.href
                  ? <a href={item.href} style={{ fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}>{item.value}</a>
                  : <div style={{ fontSize: 'var(--fs-base)' }}>{item.value}</div>
                }
              </div>
            ))}
          </div>

          {/* Form (client component) */}
          <ContactForm dict={dict.contact} />
        </div>
      </div>

      <hr className="divider" />

      {/* Errata och kommentarer — from sivertlindblom.se/biografi/errata-och-kommentarer-till-hemsida/ */}
      <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '72ch' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>
          Errata och kommentarer till hemsidan
        </h2>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2rem' }}>
          Funderingar
        </p>

        <p style={{ fontSize: 'var(--fs-base)', color: 'var(--color-text)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Till den som kommit in på Siverts hemsida och har några frågor, råd eller funderingar till hur den kan förbättras eller justeras kan kontakta mig:
        </p>

        <p style={{ fontSize: 'var(--fs-base)', fontFamily: 'Georgia, serif', color: 'var(--color-accent)', marginBottom: '2rem' }}>
          Jan Öqvist
        </p>

        <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-lg)', marginBottom: '1.25rem' }}>
          Allmänna kommentarer
        </h3>

        {[
          'Beskrivande texter ska tillkomma och komplettera en del av de offentliga arbeten som Sivert har utfört.',
          'Fotografers namn ska, i den mån de är kända, skrivas in. Svårigheter med vilka de enskilda fotograferna är har naturliga orsaker. Mest beroende på att en del bilderna är gåvor, gamla och tagna av okända fotografer och skickade till Sivert under årens lopp.',
          'Dock är merparten av bilddokumentationen tagna ur Siverts eget bildarkiv. I de fall där inget står nämnt ska de ses som tagna av Sivert själv.',
          'Känner någon fotograf igen sin bild och meddelar mig så kommer namnet att infogas i bildgalleriet.',
        ].map((p, i) => (
          <p key={i} style={{ fontSize: 'var(--fs-base)', color: 'var(--color-muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
            {p}
          </p>
        ))}

        <p style={{ fontSize: 'var(--fs-base)', color: 'var(--color-text)', lineHeight: 1.8, marginTop: '2rem' }}>
          Med vänliga hälsningar<br />
          <span style={{ fontFamily: 'Georgia, serif', color: 'var(--color-accent)' }}>Jan Öqvist</span>{' '}
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>(web-ansvarig)</span>
        </p>
      </section>
      </div>
    </div>
  )
}
