'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

/** Render assistant text, turning [label](url) markdown into clickable links. */
function renderRich(text: string, onNavigate: () => void): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  const linkStyle: React.CSSProperties = { color: 'var(--color-accent)', textDecoration: 'underline', textUnderlineOffset: '2px' }
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!m) return <span key={i}>{part}</span>
    const [, label, rawUrl] = m
    // The model sometimes prepends an invented host (e.g. https://…/sv/references/…)
    // to a URL we handed it as a relative path. Pull any of our own locale paths
    // back to a relative internal link so it navigates in-app instead of leaving to
    // a broken domain.
    const abs = rawUrl.match(/^https?:\/\/[^/]+(\/(?:sv|en)\/[^\s)]*)$/i)
    const url = abs ? abs[1] : rawUrl
    if (url.startsWith('/')) return <Link key={i} href={url} onClick={onNavigate} style={linkStyle}>{label}</Link>
    return <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{label}</a>
  })
}

interface Source { title: string; href: string; imageUrl?: string }
interface Msg { role: 'user' | 'assistant'; content: string; sources?: Source[] }

interface GuideDict {
  open: string; title: string; subtitle: string; placeholder: string
  greeting: string; s1: string; s2: string; s3: string; s4: string; s5: string
  error: string; send: string
}

const FALLBACK: Record<string, GuideDict> = {
  sv: {
    open: 'Fråga guiden', title: 'Hemsidans Guide',
    subtitle: 'Fråga om Sivert, verken och utställningarna',
    placeholder: 'Skriv en fråga…',
    greeting: 'Hej! Jag är guiden till Sivert Lindbloms konst. Fråga mig om ett verk, en utställning eller hans konstnärskap.',
    s1: 'Vem är Sivert Lindblom?', s2: 'Vilka arkitekter jobbade Sivert Lindblom med?',
    s3: 'När hade han sin första utställning?', s4: 'Berätta om Blasieholmstorg',
    s5: 'Vad är hans mest kända verk?', error: 'Något gick fel. Försök igen.', send: 'Skicka',
  },
  en: {
    open: 'Ask the guide', title: 'Website Guide',
    subtitle: 'Ask about Sivert, the works and exhibitions',
    placeholder: 'Type a question…',
    greeting: "Hello! I'm the guide to Sivert Lindblom's art. Ask me about a work, an exhibition, or his practice.",
    s1: 'Who is Sivert Lindblom?', s2: 'Which architects did Sivert Lindblom work with?',
    s3: 'When was his first exhibition?', s4: 'Tell me about Blasieholmstorg',
    s5: "What is his best-known work?", error: 'Something went wrong. Please try again.', send: 'Send',
  },
}

export default function MuseumGuide({ locale, guideDict }: { locale: string; guideDict?: GuideDict }) {
  const t: GuideDict = guideDict ?? FALLBACK[locale] ?? FALLBACK.sv
  const suggestions = [t.s1, t.s2, t.s3, t.s4, t.s5].filter(Boolean)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  // Close guide whenever the user navigates (header links, back button, guide links, etc.)
  useEffect(() => { setOpen(false) }, [pathname])
  // Close when logo is clicked even if already on home page (pathname won't change)
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('guide:close', close)
    return () => window.removeEventListener('guide:close', close)
  }, [])
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionId = useRef<string>('')

  useEffect(() => {
    try {
      let sid = sessionStorage.getItem('mg_sid')
      if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('mg_sid', sid) }
      sessionId.current = sid
      // Restore conversation history so it survives page navigations within this tab.
      const saved = sessionStorage.getItem('mg_history')
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[]
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
    } catch { /* private mode or parse error */ }
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    try { sessionStorage.setItem('mg_history', JSON.stringify(messages.slice(-40))) } catch { /* private mode */ }
  }, [messages])

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
        body: JSON.stringify({ messages: next, locale, sessionId: sessionId.current }),
      })
      const data = await res.json() as { reply?: string; error?: string; sources?: Source[] }
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || data.error || t.error, sources: data.sources }])
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t.error }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .mg-launch-label { display: none; }
          .mg-launch-btn { width: 54px !important; height: 54px !important; padding: 0 !important; justify-content: center !important; gap: 0 !important; }
          .mg-launch-icon { font-size: 1.5rem !important; }
        }
      `}</style>

      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t.open}
          className="mg-launch-btn"
          style={{
            position: 'fixed', bottom: '1.25rem', right: '1.25rem', zIndex: 900,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.7rem 1.1rem', borderRadius: 999,
            background: 'var(--color-accent)', color: '#0a0a0a', border: 'none',
            fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
          }}
        >
          <span className="mg-launch-icon" style={{ fontSize: '1.1rem', lineHeight: 1 }}>✦</span>
          <span className="mg-launch-label">{t.open}</span>
        </button>
      )}

      {/* Panel — fullscreen below the site header */}
      {open && (
        <div
          role="dialog"
          aria-label={t.title}
          style={{
            position: 'fixed', top: 'var(--header-h)', left: 0, right: 0, bottom: 0, zIndex: 850,
            display: 'flex', flexDirection: 'column',
            background: 'var(--color-bg-surface)', borderTop: '1px solid var(--color-border)',
            overflow: 'hidden', boxShadow: '0 -4px 24px rgba(0,0,0,0.25)',
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
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 820, margin: '0 auto' }}>
            {messages.length === 0 && (
              <>
                <Bubble role="assistant">{t.greeting}</Bubble>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => send(s)} style={{
                      fontSize: 'var(--fs-xs)', padding: '0.35rem 0.6rem', borderRadius: 999,
                      background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-accent)', cursor: 'pointer',
                    }}>{s}</button>
                  ))}
                </div>
              </>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
                <Bubble role={m.role}>
                  {m.role === 'assistant' ? renderRich(m.content, () => setOpen(false)) : m.content}
                </Bubble>
                {m.role === 'assistant' && m.sources && m.sources.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', paddingLeft: '0.1rem' }}>
                    {m.sources.slice(0, 12).map((s, j) => (
                      <Link key={j} href={s.href} onClick={() => setOpen(false)} title={s.title} style={{ display: 'block', flexShrink: 0 }}>
                        {s.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={s.imageUrl}
                            alt={s.title}
                            style={{
                              width: 60, height: 60, objectFit: 'cover', borderRadius: 6,
                              border: '1px solid var(--color-border)', display: 'block',
                              transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.75' }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
                          />
                        ) : (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center',
                            padding: '0.2rem 0.55rem', borderRadius: 6,
                            border: '1px solid var(--color-border)',
                            background: 'var(--color-bg-surface)',
                            color: 'var(--color-accent)',
                            fontSize: 'var(--fs-2xs)', lineHeight: 1.35,
                            maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', transition: 'opacity 0.15s',
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.opacity = '0.7' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.opacity = '1' }}
                          >
                            {s.title.length > 28 ? s.title.slice(0, 26) + '…' : s.title}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <Bubble role="assistant"><span style={{ opacity: 0.6 }}>…</span></Bubble>}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input) }}
            style={{ borderTop: '1px solid var(--color-border)', padding: '0.6rem' }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: 820, margin: '0 auto' }}>
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
            </div>
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
