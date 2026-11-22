'use client'

// Radio: the playlist for the play button in the lower left corner of the public site.
// The list is what the editor has chosen: which tracks play, in what order, and whether the order is random.
// Tracks are added from Breakin' Bread's sync catalogue and the rest of its public library (search, listen, add).

import { useEffect, useRef, useState } from 'react'

type Row = { id: string; title: string; url: string; on: boolean }
type Lib = { id: string; title: string; url: string; artist: string; source: 'sync' | 'bb' }

export default function AdminRadio() {
  const [rows, setRows] = useState<Row[]>([])
  const [library, setLibrary] = useState<Lib[]>([])
  const [q, setQ] = useState('')
  const [src, setSrc] = useState<'all' | 'sync' | 'bb'>('all')
  const [enabled, setEnabled] = useState(true)
  const [random, setRandom] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [listening, setListening] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetch('/api/admin/radio')
      .then((r) => r.json())
      .then((d: { rows?: Row[]; library?: Lib[]; enabled?: boolean; random?: boolean; error?: string }) => {
        if (d.error || !d.rows) { setError('Spellistan kunde inte hämtas.'); return }
        setRows(d.rows); setLibrary(d.library ?? []); setEnabled(d.enabled !== false); setRandom(!!d.random); setLoaded(true)
      })
      .catch(() => setError('Spellistan kunde inte hämtas.'))
  }, [])

  const onCount = rows.filter((r) => r.on).length

  function move(i: number, by: number) {
    const to = i + by
    if (to < 0 || to >= rows.length) return
    setRows((p) => { const n = [...p]; const [r] = n.splice(i, 1); n.splice(to, 0, r); return n })
    setStatus(`${rows[i].title} flyttad till plats ${to + 1}.`)
  }

  function listen(r: { id: string; url: string }) {
    const audio = audioRef.current
    if (!audio) return
    if (listening === r.id) { audio.pause(); setListening(null); return }
    audio.src = r.url
    audio.play().then(() => setListening(r.id)).catch(() => setListening(null))
  }

  async function save() {
    setSaving(true); setError(null); setStatus('')
    try {
      const res = await fetch('/api/admin/radio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, random, rows: rows.map(({ id, on }) => ({ id, on })) }),
      })
      const d = await res.json() as { ok?: boolean; error?: string }
      if (d.ok) setStatus('Sparat. Ändringen syns på webbplatsen direkt.')
      else setError(d.error ?? 'Fel vid sparning.')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  const small: React.CSSProperties = { background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: 4, padding: '0.3rem 0.6rem', fontSize: 'var(--fs-xs)', cursor: 'pointer' }
  const check: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'var(--fs-sm)', cursor: 'pointer' }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: 820 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.5rem' }}>Radio</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', lineHeight: 1.6 }}>
        Bakgrundsmusiken bakom spelknappen nere till vänster på webbplatsen. Musiken är Aeon Manahans instrumentala filmmusik från Breakin&apos; Breads katalog. Välj vilka spår som ska spelas och i vilken ordning.
      </p>

      {error && <div role="alert" style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>{error}</div>}

      <audio ref={audioRef} preload="none" onEnded={() => setListening(null)} onPause={() => setListening(null)} />

      {loaded && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
            <label style={check}><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Visa spelknappen på webbplatsen</label>
            <label style={check}><input type="checkbox" checked={random} onChange={(e) => setRandom(e.target.checked)} /> Slumpvis ordning</label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)', margin: 0, marginInlineEnd: 'auto' }}>Spellista: {onCount} av {rows.length} spår spelas</h2>
          </div>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--color-border)' }}>
            {rows.map((r, i) => (
              <li key={r.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.8rem', borderTop: i ? '1px solid var(--color-border)' : 'none', background: r.on ? 'var(--color-bg-surface)' : 'transparent' }}>
                <label style={{ ...check, flex: '1 1 14rem', minWidth: 0, color: r.on ? 'var(--color-text)' : 'var(--color-muted)' }}>
                  <input type="checkbox" checked={r.on} onChange={(e) => setRows((p) => p.map((x) => (x.id === r.id ? { ...x, on: e.target.checked } : x)))} />
                  <span style={{ overflowWrap: 'anywhere' }}>{i + 1}. {r.title}</span>
                </label>
                <button type="button" style={small} aria-pressed={listening === r.id} aria-label={`${listening === r.id ? 'Stoppa' : 'Lyssna på'} ${r.title}`} onClick={() => listen(r)}>{listening === r.id ? 'Stoppa' : 'Lyssna'}</button>
                <button type="button" style={small} disabled={i === 0} aria-label={`Flytta upp ${r.title}`} onClick={() => move(i, -1)}>Upp</button>
                <button type="button" style={small} disabled={i === rows.length - 1} aria-label={`Flytta ner ${r.title}`} onClick={() => move(i, 1)}>Ner</button>
                <button type="button" style={small} aria-label={`Ta bort ${r.title}`} onClick={() => { setRows((p) => p.filter((x) => x.id !== r.id)); setStatus(`${r.title} borttagen. Spara för att ändringen ska gälla.`) }}>Ta bort</button>
              </li>
            ))}
          </ol>


          {rows.length === 0 && <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', margin: '0.75rem 0' }}>Spellistan är tom. Lägg till spår från biblioteket nedan.</p>}

          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)', margin: '2.5rem 0 0.75rem' }}>Bibliotek: lägg till spår</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', margin: '0 0 1rem', lineHeight: 1.6 }}>
            Alla spår i Breakin&apos; Breads synk-katalog och bibliotek ({library.length} spår). Sök, lyssna och lägg till. Tryck sedan Spara spellistan.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '0.75rem' }}>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sök titel eller artist" aria-label="Sök i biblioteket"
              style={{ flex: '1 1 14rem', background: 'var(--color-bg-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 4, padding: '0.5rem 0.7rem', fontSize: 'var(--fs-sm)' }} />
            {(['all', 'sync', 'bb'] as const).map((k) => (
              <button key={k} type="button" style={{ ...small, borderColor: src === k ? 'var(--color-accent)' : 'var(--color-border)' }} aria-pressed={src === k} onClick={() => setSrc(k)}>
                {k === 'all' ? 'Alla' : k === 'sync' ? 'Synk' : 'Breakin\' Bread'}
              </button>
            ))}
          </div>
          {(() => {
            const inList = new Set(rows.map((r) => r.id))
            const term = q.trim().toLowerCase()
            const found = library.filter((t) => !inList.has(t.id) && (src === 'all' || t.source === src) && (!term || `${t.title} ${t.artist}`.toLowerCase().includes(term)))
            const shown = found.slice(0, 80)
            return (
              <>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, border: '1px solid var(--color-border)' }}>
                  {shown.map((t, i) => (
                    <li key={t.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.8rem', borderTop: i ? '1px solid var(--color-border)' : 'none' }}>
                      <span style={{ flex: '1 1 14rem', minWidth: 0, fontSize: 'var(--fs-sm)', overflowWrap: 'anywhere' }}>{t.title}<span style={{ color: 'var(--color-muted)' }}> · {t.artist}{t.source === 'sync' ? ' · synk' : ''}</span></span>
                      <button type="button" style={small} aria-pressed={listening === t.id} aria-label={`${listening === t.id ? 'Stoppa' : 'Lyssna på'} ${t.title}`} onClick={() => listen(t)}>{listening === t.id ? 'Stoppa' : 'Lyssna'}</button>
                      <button type="button" style={small} aria-label={`Lägg till ${t.title}`} onClick={() => { setRows((p) => [...p, { id: t.id, title: t.title, url: t.url, on: true }]); setStatus(`${t.title} tillagd längst ner i spellistan. Spara för att ändringen ska gälla.`) }}>Lägg till</button>
                    </li>
                  ))}
                </ul>
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', margin: '0.5rem 0 0' }}>{found.length === 0 ? 'Inga spår hittades.' : `Visar ${shown.length} av ${found.length}. Sök för att hitta fler.`}</p>
              </>
            )
          })()}

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem 0', marginTop: '1rem', position: 'sticky', bottom: 0, background: '#0a0a0a', borderTop: '1px solid var(--color-border)' }}>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>{saving ? 'Sparar...' : 'Spara spellistan'}</button>
            <span role="status" style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>{status}</span>
          </div>
        </>
      )}
    </div>
  )
}
