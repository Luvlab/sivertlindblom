'use client'

// The radio: one small play button in the lower left corner.
// A tap plays or pauses. Holding the button opens the playlist.
// The credit line is small and yellow, and hides a few seconds after the button was last touched.
// The music is Aeon's slow cinematic instrumentals from the Breakin' Bread sync catalogue.
// Nothing plays before the first tap.

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import tracks from '@/lib/radio-tracks.json'

const ARTIST = 'Aeon'
const LABEL = "Breakin' Bread"
const LABEL_URL = 'https://breakinbread.com/synchronization'
/** How the tracks are labelled on Breakin' Bread. Shown, not hidden. */
const AI_NOTE = '50 % AI (Suno)'
const HOLD_MS = 550
const CREDIT_MS = 4000
const YELLOW = '#f2d230'

export default function RadioButton({ playLabel = 'Play', pauseLabel = 'Pause' }: { playLabel?: string; pauseLabel?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const creditTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const held = useRef(false)
  const failures = useRef(0)

  const [index, setIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [credit, setCredit] = useState(false)
  const [menu, setMenu] = useState(false)

  const track = index === null ? null : tracks[index]

  const showCredit = useCallback(() => {
    setCredit(true)
    if (creditTimer.current) clearTimeout(creditTimer.current)
    creditTimer.current = setTimeout(() => setCredit(false), CREDIT_MS)
  }, [])

  const playIndex = useCallback((i: number) => {
    const audio = audioRef.current
    if (!audio) return
    const n = ((i % tracks.length) + tracks.length) % tracks.length
    setIndex(n)
    audio.src = tracks[n].url
    audio.play().catch(() => setPlaying(false))
    showCredit()
  }, [showCredit])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (index === null) playIndex(Math.floor(Math.random() * tracks.length))
    else if (audio.paused) audio.play().catch(() => setPlaying(false))
    else audio.pause()
    showCredit()
  }, [index, playIndex, showCredit])

  const openMenu = useCallback(() => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    setMenu(true)
  }, [])

  const closeMenu = useCallback((returnFocus = true) => {
    setMenu(false)
    if (returnFocus) buttonRef.current?.focus()
    showCredit()
  }, [showCredit])

  // Lock screen and headset controls, where the browser has them.
  useEffect(() => {
    if (!track || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: ARTIST, album: LABEL })
    navigator.mediaSession.setActionHandler('nexttrack', () => playIndex((index ?? 0) + 1))
    navigator.mediaSession.setActionHandler('previoustrack', () => playIndex((index ?? 0) - 1))
  }, [track, index, playIndex])

  // The open playlist: focus the current track, close on Escape or a touch outside.
  useEffect(() => {
    if (!menu) return
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')
    items?.[index ?? 0]?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu() }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t)) closeMenu(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [menu, index, closeMenu])

  useEffect(() => () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (creditTimer.current) clearTimeout(creditTimer.current)
  }, [])

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])
    const at = items.indexOf(document.activeElement as HTMLButtonElement)
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (at + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[to]?.focus()
  }

  const corner = 'calc(1.25rem + env(safe-area-inset-bottom, 0px))'
  const creditText = track ? `${track.title} · ${ARTIST} · ${LABEL} · ${AI_NOTE}` : `Radio · ${ARTIST} · ${LABEL}`

  return (
    <>
      <style>{`
        .sl-radio-menu-btn { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .sl-radio-menu-btn:focus-visible { position: static; width: auto; height: auto; clip-path: none; }
        .sl-radio-btn:focus-visible, .sl-radio-item:focus-visible { outline: 2px solid ${YELLOW}; outline-offset: 2px; }
        .sl-radio-item:hover { background: rgba(255,255,255,0.06); }
      `}</style>

      <audio
        ref={audioRef}
        className="sl-radio-audio"
        preload="none"
        onPlay={() => { setPlaying(true); failures.current = 0 }}
        onPause={() => setPlaying(false)}
        onEnded={() => playIndex((index ?? 0) + 1)}
        onError={() => {
          // A file that will not load: try the next one, but never loop for ever.
          if (index === null || ++failures.current > 3) { setPlaying(false); return }
          playIndex(index + 1)
        }}
      />

      <div style={{ position: 'fixed', left: '1.25rem', bottom: corner, zIndex: 900, display: 'flex', alignItems: 'center', gap: '0.6rem', maxWidth: 'calc(100vw - 6.5rem)', pointerEvents: 'none' }}>
        <button
          ref={buttonRef}
          type="button"
          className="sl-radio-btn"
          aria-label={`Radio: ${playing ? pauseLabel : playLabel}`}
          aria-pressed={playing}
          onClick={() => { if (held.current) { held.current = false; return } toggle() }}
          onPointerDown={() => {
            held.current = false
            showCredit()
            if (holdTimer.current) clearTimeout(holdTimer.current)
            holdTimer.current = setTimeout(() => { held.current = true; openMenu() }, HOLD_MS)
          }}
          onPointerUp={() => { if (holdTimer.current) clearTimeout(holdTimer.current) }}
          onPointerLeave={() => { if (holdTimer.current) clearTimeout(holdTimer.current) }}
          onPointerCancel={() => { if (holdTimer.current) clearTimeout(holdTimer.current) }}
          onContextMenu={(e) => { e.preventDefault(); openMenu() }}
          onFocus={showCredit}
          onKeyDown={(e) => { if (e.key === 'ArrowUp') { e.preventDefault(); openMenu() } }}
          style={{
            pointerEvents: 'auto', flex: 'none', width: 40, height: 40, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,10,10,0.72)', color: playing ? YELLOW : 'var(--color-text)',
            border: `1px solid ${playing ? YELLOW : 'rgba(245,245,240,0.35)'}`,
            cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none', backdropFilter: 'blur(6px)',
          }}
        >
          {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden style={{ marginLeft: 2 }} />}
        </button>

        <button
          type="button"
          className="sl-radio-menu-btn sl-radio-btn"
          aria-haspopup="menu"
          aria-expanded={menu}
          onClick={() => (menu ? closeMenu() : openMenu())}
          style={{ pointerEvents: 'auto', background: 'rgba(10,10,10,0.72)', color: YELLOW, border: `1px solid ${YELLOW}`, borderRadius: 999, padding: '0.2rem 0.6rem', fontSize: 'var(--fs-2xs)', cursor: 'pointer' }}
        >
          Radio
        </button>

        <span
          className="sl-radio-credit"
          aria-live="polite"
          style={{
            color: YELLOW, fontSize: 'var(--fs-2xs)', letterSpacing: '0.04em', lineHeight: 1.3,
            background: 'rgba(10,10,10,0.72)', borderRadius: 999, padding: credit ? '0.25rem 0.7rem' : 0,
            opacity: credit ? 1 : 0, transition: 'opacity 0.4s', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
          }}
        >
          {credit ? creditText : ''}
        </span>
      </div>

      {menu && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Radio"
          onKeyDown={onMenuKey}
          style={{
            position: 'fixed', left: '1.25rem', bottom: `calc(${corner} + 48px)`, zIndex: 901,
            width: 'min(19rem, calc(100vw - 2.5rem))', maxHeight: 'min(60vh, 26rem)', overflowY: 'auto',
            background: 'rgba(10,10,10,0.94)', border: '1px solid var(--color-border)', borderRadius: 10,
            padding: '0.35rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          }}
        >
          {tracks.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="menuitemradio"
              aria-checked={i === index}
              className="sl-radio-item"
              onClick={() => { playIndex(i); closeMenu() }}
              style={{
                display: 'block', width: '100%', textAlign: 'start', background: 'none', border: 'none', borderRadius: 6,
                padding: '0.5rem 0.65rem', fontSize: 'var(--fs-xs)', cursor: 'pointer',
                color: i === index ? YELLOW : 'var(--color-text)',
              }}
            >
              {t.title}
            </button>
          ))}
          <p style={{ margin: 0, padding: '0.55rem 0.65rem 0.35rem', borderTop: '1px solid var(--color-border)', marginTop: '0.35rem', fontSize: 'var(--fs-2xs)', color: YELLOW, letterSpacing: '0.04em' }}>
            {ARTIST} ·{' '}
            <a href={LABEL_URL} target="_blank" rel="noopener noreferrer" style={{ color: YELLOW, textDecoration: 'underline', textUnderlineOffset: '2px' }}>{LABEL}</a>
            {' '}· {AI_NOTE}
          </p>
        </div>
      )}
    </>
  )
}
