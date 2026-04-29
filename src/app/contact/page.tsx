'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production: POST to /api/contact or Supabase edge function
    setSent(true)
  }

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Kontakt</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>Ta kontakt</h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '1rem', maxWidth: '55ch', fontSize: 'var(--fs-base)' }}>
          Frågor om verk, utlåning, utställningar eller samarbeten — fyll i formuläret nedan.
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '4rem', alignItems: 'start' }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '2rem' }}>Information</h2>
            {[
              { label: 'E-post', value: 'info@sivertlindblom.se', href: 'mailto:info@sivertlindblom.se' },
              { label: 'Redaktör', value: 'Jan Öqvist', href: null },
              { label: 'Webbplats', value: 'sivertlindblom.se', href: 'https://sivertlindblom.se' },
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

          {/* Form */}
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '2rem' }}>Meddelande</h2>

            {sent ? (
              <div style={{
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-accent-dim)',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <p style={{ fontSize: 'var(--fs-lg)', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>Tack!</p>
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>Ditt meddelande har skickats. Vi återkommer så snart som möjligt.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                    Namn
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ditt namn"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                    E-postadress
                  </label>
                  <input
                    type="email"
                    required
                    className="input"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="din@epost.se"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                    Ämne
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Angående..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
                    Meddelande
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="input"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Ditt meddelande..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Skicka meddelande
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
