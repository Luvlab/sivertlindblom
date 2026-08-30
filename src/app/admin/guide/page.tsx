'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Source { title: string; href: string; imageUrl?: string }

interface KnowledgeVersion {
  id: string
  created_at: string
  chars: number
  source: 'manual' | 'autosave' | 'contribution' | 'restore' | 'system'
}

const VERSION_SOURCE_LABEL: Record<KnowledgeVersion['source'], string> = {
  manual: 'Manuell sparning',
  autosave: 'Autosparning',
  contribution: 'Före besökarbidrag',
  restore: 'Före återställning',
  system: 'Systembackup',
}

interface Contribution {
  id: string
  created_at: string
  kind: 'missing' | 'contribution'
  question: string | null
  detail: string
  answer: string | null
  status: 'pending' | 'added' | 'dismissed'
  country: string | null
  city: string | null
}

interface Chat {
  id: string
  created_at: string
  session_id: string | null
  ip: string | null
  country: string | null
  city: string | null
  user_agent: string | null
  locale: string | null
  question: string
  answer: string
  sources?: Source[] | null
}

/** Render assistant text, turning [label](url) markdown into clickable links. */
function renderRich(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  const linkStyle: React.CSSProperties = { color: 'var(--color-accent)', textDecoration: 'underline', textUnderlineOffset: '2px' }
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!m) return <span key={i}>{part}</span>
    const [, label, rawUrl] = m
    const abs = rawUrl.match(/^https?:\/\/[^/]+(\/(?:sv|en)\/[^\s)]*)$/i)
    const url = abs ? abs[1] : rawUrl
    if (url.startsWith('/')) return <Link key={i} href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{label}</Link>
    return <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={linkStyle}>{label}</a>
  })
}

interface Conversation {
  key: string
  ip: string | null
  country: string | null
  city: string | null
  userAgent: string | null
  locale: string | null
  first: string
  last: string
  chats: Chat[]
}

function fmt(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AdminGuide() {
  const [chats, setChats] = useState<Chat[]>([])
  const [stats, setStats] = useState({ total: 0, sessions: 0, ips: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Extra knowledge the guide always sees (e.g. a CV about Jan Öqvist).
  const [knowledge, setKnowledge] = useState('')
  const [kSaving, setKSaving] = useState(false)
  const [kSaved, setKSaved] = useState(false)
  const [kAutoSavedAt, setKAutoSavedAt] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const lastSavedRef = useRef('')

  // Version history of the knowledge text (every save is backed up server-side).
  const [versions, setVersions] = useState<KnowledgeVersion[]>([])
  const [showVersions, setShowVersions] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)

  // Visitor contributions / missing-info flags waiting for screening.
  const [contribs, setContribs] = useState<Contribution[]>([])
  const [contribBusy, setContribBusy] = useState<string | null>(null)

  function loadKnowledge() {
    fetch('/api/admin/guide-knowledge', { cache: 'no-store' })
      .then(r => r.json()).then((d: { text?: string }) => {
        const t = d.text ?? ''
        setKnowledge(t)
        lastSavedRef.current = t
      }).catch(() => {})
  }
  function loadVersions() {
    fetch('/api/admin/guide-knowledge?versions=1', { cache: 'no-store' })
      .then(r => r.json()).then((d: { versions?: KnowledgeVersion[] }) => setVersions(d.versions ?? [])).catch(() => {})
  }
  function loadContribs() {
    fetch('/api/admin/guide-contributions', { cache: 'no-store' })
      .then(r => r.json()).then((d: { contributions?: Contribution[] }) => setContribs(d.contributions ?? [])).catch(() => {})
  }
  useEffect(() => { loadKnowledge(); loadContribs() }, [])

  async function screenContrib(id: string, action: 'add' | 'dismiss') {
    setContribBusy(id)
    try {
      await fetch('/api/admin/guide-contributions', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      loadContribs()
      if (action === 'add') loadKnowledge() // textarea picks up the appended block
    } finally { setContribBusy(null) }
  }

  async function loadTxt(file: File | undefined) {
    if (!file) return
    const text = await file.text()
    setKnowledge(prev => (prev.trim() ? prev + '\n\n' : '') + text)
  }

  async function saveKnowledge(autosave = false) {
    setKSaving(true)
    try {
      await fetch('/api/admin/guide-knowledge', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: knowledge, autosave }) })
      lastSavedRef.current = knowledge
      if (autosave) {
        setKAutoSavedAt(new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }))
      } else {
        setKSaved(true); setTimeout(() => setKSaved(false), 3000)
      }
    } finally { setKSaving(false) }
  }

  // Autosave: 3 s after typing stops, if the text actually changed.
  useEffect(() => {
    if (knowledge === lastSavedRef.current) return
    const t = setTimeout(() => { saveKnowledge(true) }, 3000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledge])

  async function restoreVersion(id: string) {
    if (!confirm('Återställa denna version? Nuvarande text sparas i historiken först.')) return
    setRestoring(id)
    try {
      const res = await fetch('/api/admin/guide-knowledge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ restoreId: id }) })
      const d = await res.json() as { ok?: boolean; text?: string; error?: string }
      if (d.ok && typeof d.text === 'string') {
        setKnowledge(d.text)
        lastSavedRef.current = d.text
        loadVersions()
      } else if (d.error) alert(d.error)
    } finally { setRestoring(null) }
  }

  function load() {
    setLoading(true)
    fetch('/api/admin/guide-log', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: { chats?: Chat[]; stats?: typeof stats; error?: string }) => {
        if (d.error) setError(d.error)
        else { setChats(d.chats ?? []); setStats(d.stats ?? { total: 0, sessions: 0, ips: 0 }) }
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function clearLog() {
    if (!confirm('Radera hela chatt-loggen? Detta kan inte ångras.')) return
    await fetch('/api/admin/guide-log', { method: 'DELETE' })
    load()
  }

  // Group into conversations by session (fallback: by ip).
  const convs: Conversation[] = (() => {
    const map = new Map<string, Conversation>()
    // chats come newest-first; build then sort each conv chronologically
    for (const c of chats) {
      const key = c.session_id || `ip:${c.ip}` || c.id
      let conv = map.get(key)
      if (!conv) {
        conv = { key, ip: c.ip, country: c.country, city: c.city, userAgent: c.user_agent, locale: c.locale, first: c.created_at, last: c.created_at, chats: [] }
        map.set(key, conv)
      }
      conv.chats.push(c)
      if (c.created_at < conv.first) conv.first = c.created_at
      if (c.created_at > conv.last) conv.last = c.created_at
    }
    const list = [...map.values()]
    list.forEach(cv => cv.chats.sort((a, b) => a.created_at.localeCompare(b.created_at)))
    list.sort((a, b) => b.last.localeCompare(a.last))
    return list
  })()

  const stat: React.CSSProperties = { padding: '0.9rem 1.1rem', border: '1px solid var(--color-border)', borderRadius: 6, background: 'var(--color-bg-card)', minWidth: 120 }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: 900 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>
        AI-guide — chatthistorik
      </h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem' }}>
        Alla samtal besökare fört med guiden, grupperade per session, med IP och plats.
      </p>

      {/* Guide knowledge (extra background the AI always sees) */}
      <div style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: '1.25rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', margin: '0 0 0.25rem' }}>Guidens kunskap</h2>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', margin: '0 0 0.9rem' }}>
          Extra bakgrund som guiden alltid får med sig — t.ex. en CV om Jan Öqvist. Klistra in text eller ladda upp en .txt-fil. Guiden svarar utifrån detta om en besökare frågar.
        </p>
        <textarea
          className="input"
          rows={10}
          style={{ width: '100%', resize: 'vertical', fontSize: 'var(--fs-sm)', lineHeight: 1.6 }}
          value={knowledge}
          onChange={e => setKnowledge(e.target.value)}
          placeholder="Klistra in text om Jan Öqvist (eller annat guiden bör känna till)…"
        />
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept=".txt,text/plain" style={{ display: 'none' }} onChange={e => { loadTxt(e.target.files?.[0]); e.target.value = '' }} />
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>⬆ Ladda upp .txt</button>
          <button type="button" className="btn btn-primary" onClick={() => saveKnowledge()} disabled={kSaving}>{kSaving ? 'Sparar…' : 'Spara kunskap'}</button>
          <button type="button" className="btn" onClick={() => { if (!showVersions) loadVersions(); setShowVersions(!showVersions) }}>
            {showVersions ? 'Dölj historik' : '🕐 Historik'}
          </button>
          {kSaved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          {!kSaved && kAutoSavedAt && <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)' }}>Autosparad {kAutoSavedAt}</span>}
          <span style={{ color: 'var(--color-border)', fontSize: 'var(--fs-xs)', marginLeft: 'auto' }}>{knowledge.length} tecken</span>
        </div>
        {showVersions && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', margin: '0 0 0.6rem' }}>
              Varje sparning säkerhetskopieras automatiskt (de {'≤'}100 senaste behålls). Återställ en tidigare version — den nuvarande texten sparas i historiken först, så inget går förlorat.
            </p>
            {versions.length === 0 ? (
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontStyle: 'italic' }}>Ingen historik ännu.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', maxHeight: 220, overflowY: 'auto' }}>
                {versions.map(v => (
                  <div key={v.id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'baseline', fontSize: 'var(--fs-xs)', padding: '0.25rem 0' }}>
                    <span style={{ color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{fmt(v.created_at)}</span>
                    <span style={{ color: 'var(--color-muted)' }}>{VERSION_SOURCE_LABEL[v.source] ?? v.source}</span>
                    <span style={{ color: 'var(--color-border)' }}>{v.chars.toLocaleString('sv-SE')} tecken</span>
                    <button
                      type="button" className="btn"
                      style={{ marginLeft: 'auto', fontSize: 'var(--fs-2xs)', padding: '0.15rem 0.5rem' }}
                      disabled={restoring === v.id}
                      onClick={() => restoreVersion(v.id)}
                    >
                      {restoring === v.id ? 'Återställer…' : 'Återställ'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Visitor contributions awaiting screening */}
      {contribs.filter(c => c.status === 'pending').length > 0 && (
        <div style={{ border: '1px solid var(--color-accent)', borderRadius: 6, padding: '1.25rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', margin: '0 0 0.25rem' }}>
            Förslag från besökare <span style={{ color: 'var(--color-accent)' }}>({contribs.filter(c => c.status === 'pending').length})</span>
          </h2>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', margin: '0 0 1rem' }}>
            Guiden flaggar frågor den inte kunde svara på, och information besökare själva delar med sig av.
            Granska varje post — <strong>Lägg till</strong> skriver in den i guidens kunskap ovan (du kan sedan redigera texten fritt), <strong>Avfärda</strong> tar bort den från listan.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {contribs.filter(c => c.status === 'pending').map(c => (
              <div key={c.id} style={{ border: '1px solid var(--color-border)', borderRadius: 6, padding: '0.8rem 1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1rem', alignItems: 'baseline', fontSize: 'var(--fs-xs)', marginBottom: '0.4rem' }}>
                  <span style={{ color: c.kind === 'contribution' ? 'var(--color-accent)' : 'var(--color-muted)', fontWeight: 600 }}>
                    {c.kind === 'contribution' ? '💡 Bidrag från besökare' : '❓ Info saknas'}
                  </span>
                  <span style={{ color: 'var(--color-muted)' }}>{fmt(c.created_at)}</span>
                  {(c.city || c.country) && <span style={{ color: 'var(--color-muted)' }}>{[c.city, c.country].filter(Boolean).join(', ')}</span>}
                </div>
                {c.question && (
                  <div style={{ fontSize: 'var(--fs-sm)', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-accent)', marginRight: '0.4rem' }}>Fråga:</span>{c.question}
                  </div>
                )}
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', whiteSpace: 'pre-wrap' }}>{c.detail}</div>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.7rem' }}>
                  <button className="btn btn-primary" disabled={contribBusy === c.id} onClick={() => screenContrib(c.id, 'add')}>
                    {contribBusy === c.id ? 'Sparar…' : '✓ Lägg till i kunskapen'}
                  </button>
                  <button className="btn" disabled={contribBusy === c.id} onClick={() => screenContrib(c.id, 'dismiss')}>
                    Avfärda
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88', borderRadius: 4 }}>{error}</div>}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={stat}><div style={{ fontSize: 'var(--fs-2xl)', fontFamily: 'Georgia, serif' }}>{stats.total}</div><div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>frågor</div></div>
        <div style={stat}><div style={{ fontSize: 'var(--fs-2xl)', fontFamily: 'Georgia, serif' }}>{stats.sessions}</div><div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>samtal</div></div>
        <div style={stat}><div style={{ fontSize: 'var(--fs-2xl)', fontFamily: 'Georgia, serif' }}>{stats.ips}</div><div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>unika IP</div></div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button className="btn" onClick={load}>↻ Uppdatera</button>
        {chats.length > 0 && <button className="btn" onClick={clearLog} style={{ borderColor: '#c00', color: '#c66' }}>Radera loggen</button>}
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : convs.length === 0 ? (
        <p style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Inga samtal ännu.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {convs.map(cv => (
            <div key={cv.key} style={{ border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ padding: '0.7rem 1rem', background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1rem', alignItems: 'baseline', fontSize: 'var(--fs-xs)' }}>
                <span style={{ color: 'var(--color-text)', fontFamily: 'monospace' }}>{cv.ip ?? 'okänd IP'}</span>
                {(cv.city || cv.country) && <span style={{ color: 'var(--color-accent)' }}>{[cv.city, cv.country].filter(Boolean).join(', ')}</span>}
                {cv.locale && <span style={{ color: 'var(--color-muted)' }}>språk: {cv.locale}</span>}
                <span style={{ color: 'var(--color-muted)' }}>{fmt(cv.first)}</span>
                <span style={{ color: 'var(--color-muted)' }}>· {cv.chats.length} fråg{cv.chats.length === 1 ? 'a' : 'or'}</span>
              </div>
              <div style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {cv.chats.map(c => (
                  <div key={c.id}>
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', fontWeight: 600 }}>
                      <span style={{ color: 'var(--color-accent)', marginRight: '0.4rem' }}>Fråga:</span>{c.question}
                    </div>
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>
                      <span style={{ color: 'var(--color-accent)', marginRight: '0.4rem' }}>Guiden:</span>{renderRich(c.answer)}
                    </div>
                    {c.sources && c.sources.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.45rem' }}>
                        {c.sources.slice(0, 12).map((s, j) => (
                          <Link key={j} href={s.href} target="_blank" rel="noopener noreferrer" title={s.title} style={{ display: 'block', flexShrink: 0 }}>
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
                    <div style={{ fontSize: '0.6rem', color: 'var(--color-border)', marginTop: '0.2rem' }}>{fmt(c.created_at)}</div>
                  </div>
                ))}
              </div>
              {cv.userAgent && (
                <div style={{ padding: '0.4rem 1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.6rem', color: 'var(--color-muted)', wordBreak: 'break-all' }}>{cv.userAgent}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '2.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        Obs: att lagra besökares IP-adresser omfattas av GDPR. Ha gärna en kort integritetsnotis på sajten, och radera loggen med jämna mellanrum.
      </p>
    </div>
  )
}
