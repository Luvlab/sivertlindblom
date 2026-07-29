'use client'

import { useState, useRef, useEffect } from 'react'

interface Msg { role: 'user' | 'assistant'; content: string }

const T = {
  sv: {
    open: 'Fråga guiden',
    title: 'Museiguiden',
    subtitle: 'Fråga om Sivert, verken och utställningarna',
    placeholder: 'Skriv en fråga…',
    greeting: 'Hej! Jag är guiden till Sivert Lindbloms konst. Fråga mig om ett verk, en utställning eller hans konstnärskap.',
    suggestions: ['Vem är Sivert Lindblom?', 'Berätta om Blasieholmstorg', 'Vad är hans mest kända verk?'],
    error: 'Något gick fel. Försök igen.',
    send: 'Skicka',
  },
  en: {
    open: 'Ask the guide',
    title: 'Museum guide',
    subtitle: 'Ask about Sivert, the works and exhibitions',
    placeholder: 'Type a question…',
    greeting: "Hello! I'm the guide to Sivert Lindblom's art. Ask me about a work, an exhibition, or his practice.",
    suggestions: ['Who is Sivert Lindblom?', 'Tell me about Blasieholmstorg', 'What is his best-known work?'],
    error: 'Something went wrong. Please try again.',
    send: 'Send',
  },
}

export default function MuseumGuide({ locale }: { locale: string }) {
  const t = locale === 'en' ? T.en : T.sv
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send(text: string) {
    const q = text.trim()
    if (!q || loading) return
    const next: Msg[] = [...messages, { role: 'user', content: q }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, locale }),
      })
      const data = await res.json() as { reply?: string; error?: string }
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || data.error || t.error }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t.error }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t.open}
          style={{
            position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 900,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.1rem', borderRadius: 999,
            background: 'var(--color-accent)', color: '#0a0a0a', border: 'none',
            fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
          }}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>✦</span>{t.open}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label={t.title}
          style={{
            position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 900,
            width: 'min(380px, calc(100vw - 2rem))', height: 'min(560px, calc(100vh - 2.5rem))',
            display: 'flex', flexDirection: 'column',
            background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
            borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-base)' }}>✦ {t.title}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem' }}>{t.subtitle}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--color-muted)', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1, padding: '0.15rem' }}>✕</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.length === 0 && (
              <>
                <Bubble role="assistant">{t.greeting}</Bubble>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                  {t.suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} style={{
                      fontSize: 'var(--fs-xs)', padding: '0.35rem 0.6rem', borderRadius: 999,
                      background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-accent)', cursor: 'pointer',
                    }}>{s}</button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m, i) => <Bubble key={i} role={m.role}>{m.content}</Bubble>)}
            {loading && <Bubble role="assistant"><span style={{ opacity: 0.6 }}>…</span></Bubble>}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            style={{ borderTop: '1px solid var(--color-border)', padding: '0.6rem', display: 'flex', gap: '0.5rem' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="input"
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()} style={{ flexShrink: 0 }}>
              {t.send}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

function Bubble({ role, children }: { role: 'user' | 'assistant'; children: React.ReactNode }) {
  const isUser = role === 'user'
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '85%',
      padding: '0.55rem 0.8rem',
      borderRadius: 12,
      borderBottomRightRadius: isUser ? 3 : 12,
      borderBottomLeftRadius: isUser ? 12 : 3,
      background: isUser ? 'var(--color-accent)' : 'var(--color-bg-card)',
      color: isUser ? '#0a0a0a' : 'var(--color-text)',
      border: isUser ? 'none' : '1px solid var(--color-border)',
      fontSize: 'var(--fs-sm)', lineHeight: 1.5, whiteSpace: 'pre-wrap',
    }}>
      {children}
    </div>
  )
}
