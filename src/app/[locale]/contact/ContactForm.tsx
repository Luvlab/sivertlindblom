'use client'

import { useState } from 'react'

interface ContactDict {
  message_title?: string
  name?: string
  email?: string
  subject?: string
  message?: string
  name_ph?: string
  email_ph?: string
  subject_ph?: string
  message_ph?: string
  send?: string
  sent_title?: string
  sent_body?: string
}

export default function ContactForm({ dict }: { dict?: ContactDict }) {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '2rem' }}>
        {dict?.message_title ?? 'Meddelande'}
      </h2>

      {sent ? (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-accent-dim)',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 'var(--fs-lg)', fontFamily: 'Georgia, serif', marginBottom: '0.5rem' }}>
            {dict?.sent_title ?? 'Tack!'}
          </p>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {dict?.sent_body ?? 'Ditt meddelande har skickats. Vi återkommer så snart som möjligt.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              {dict?.name ?? 'Namn'}
            </label>
            <input
              type="text"
              required
              className="input"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder={dict?.name_ph ?? 'Ditt namn'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              {dict?.email ?? 'E-postadress'}
            </label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder={dict?.email_ph ?? 'din@epost.se'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              {dict?.subject ?? 'Ämne'}
            </label>
            <input
              type="text"
              required
              className="input"
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder={dict?.subject_ph ?? 'Angående...'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              {dict?.message ?? 'Meddelande'}
            </label>
            <textarea
              required
              rows={6}
              className="input"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder={dict?.message_ph ?? 'Ditt meddelande...'}
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            {dict?.send ?? 'Skicka meddelande'}
          </button>
        </form>
      )}
    </div>
  )
}
