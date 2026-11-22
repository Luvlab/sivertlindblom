'use client'

// The radio: one small play button in the lower left corner.
// A tap plays or pauses. Holding the button opens the playlist.
// The credit line is small and in the accent colour, and hides a few seconds after the button was last touched.
// The music is Aeon's slow cinematic instrumentals from the Breakin' Bread sync catalogue.
// The playlist and the random switch are set in the admin, under Radio.
// Nothing plays before the first tap.
// Any other recording or film on the site pauses the radio.

import { useCallback, useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import type { RadioTrack } from '@/lib/radio'

const ARTIST = 'Aeon "Step" Manahan'
const LABEL = "Breakin' Bread"
const LABEL_URL = 'https://breakinbread.com/synchronization'
/** How much of the music is AI, as Gordon gave it on 22 Nov 2026 (about 10 %). Shown, not hidden. */
const AI_NOTE = '10 % AI (Suno)'
const HOLD_MS = 550
const CREDIT_MS = 4000
// The site's own accent (the button colour), so the credit is not a second yellow (Gordon 2026-11-22).
const YELLOW = 'var(--color-accent)'

export default function RadioButton({ tracks, random = false, playLabel = 'Play', pauseLabel = 'Pause' }: { tracks: RadioTrack[]; random?: boolean; playLabel?: string; pauseLabel?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const creditTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const held = useRef(false)
  const failures = useRef(0)
  const creditBoxRef = useRef<HTMLSpanElement>(null)
  const creditTextRef = useRef<HTMLSpanElement>(null)

  const [index, setIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [credit, setCredit] = useState(false)
  const [menu, setMenu] = useState(false)

  const track = index === null ? null : tracks[index]
  const creditText = track ? `${track.title} · ${ARTIST} · ${LABEL} · ${AI_NOTE}` : `Radio · ${ARTIST} · ${LABEL}`

  const showCredit = useCallback(() => {
    setCredit(true)
    if (creditTimer.current) clearTimeout(creditTimer.current)
    creditTimer.current = setTimeout(() => setCredit(false), CREDIT_MS)
  }, [])

  // A credit line wider than the room scrolls by, slowly, then the usual timer fades it out after it has been read.
  useEffect(() => {
    if (!credit) return
    const box = creditBoxRef.current, text = creditTextRef.current
    if (!box || !text) return
    const room = box.clientWidth - 22 // the pill's side padding
    const overflow = text.scrollWidth - room
    if (overflow <= 4 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const SPEED = 38 // px per second: slow enough to read
    const delay = 900, duration = Math.round((overflow / SPEED) * 1000)
    const anim = text.animate([{ transform: 'translateX(0)' }, { transform: `translateX(-${overflow}px)` }], { duration, delay, easing: 'linear', fill: 'forwards' })
    if (creditTimer.current) clearTimeout(creditTimer.current)
    creditTimer.current = setTimeout(() => setCredit(false), delay + duration + 1800)
    return () => anim.cancel()
  }, [credit, creditText])

  const playIndex = useCallback((i: number) => {
    const audio = audioRef.current
    if (!audio) return
    const n = ((i % tracks.length) + tracks.length) % tracks.length
    setIndex(n)
    audio.src = tracks[n].url
    audio.play().catch(() => setPlaying(false))
    showCredit()
  }, [tracks, showCredit])

  /** The track after this one: the next in the list, or any other one when the order is random. */
  const nextIndex = useCallback((from: number | null) => {
    if (!random || tracks.length < 2) return from === null ? 0 : from + 1
    let n = Math.floor(Math.random() * (tracks.length - 1))
    if (from !== null && n >= from) n += 1
    return n
  }, [random, tracks.length])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (index === null) playIndex(nextIndex(null))
    else if (audio.paused) audio.play().catch(() => setPlaying(false))
    else audio.pause()
    showCredit()
  }, [index, playIndex, nextIndex, showCredit])

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
    navigator.mediaSession.setActionHandler('nexttrack', () => playIndex(nextIndex(index)))
    navigator.mediaSession.setActionHandler('previoustrack', () => playIndex((index ?? 0) - 1))
  }, [track, index, playIndex, nextIndex])

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

  // The radio steps aside for any other sound on the site (Gordon 2026-11-22: "when you play a recording … the radio should stop").
  // A recording or film on the page (audio/video) pauses it at once; a click into an embedded YouTube film does too,
  // because the page cannot hear an embed play, only see the click land in it.
  useEffect(() => {
    const pauseRadio = () => { const a = audioRef.current; if (a && !a.paused) a.pause() }
    const onPlay = (e: Event) => {
      const el = e.target
      if (el instanceof HTMLMediaElement && el !== audioRef.current) pauseRadio()
    }
    const onBlur = () => { setTimeout(() => { if (document.activeElement instanceof HTMLIFrameElement) pauseRadio() }, 0) }
    document.addEventListener('play', onPlay, true)
    window.addEventListener('blur', onBlur)
    return () => { document.removeEventListener('play', onPlay, true); window.removeEventListener('blur', onBlur) }
  }, [])

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

  // Same corner offsets as the guide button (MuseumGuide: bottom 1.25rem, 54 px on a phone), so the two sit on one row.
  const corner = '1.25rem'

  return (
    <>
      <style>{`
        .sl-radio-menu-btn { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .sl-radio-menu-btn:focus-visible { position: static; width: auto; height: auto; clip-path: none; }
        .sl-radio-btn:focus-visible, .sl-radio-item:focus-visible { outline: 2px solid var(--color-text); outline-offset: 2px; }
        .sl-radio-play { width: 44px; height: 44px; }
        @media (max-width: 640px) { .sl-radio-play { width: 54px; height: 54px; } }
        .sl-radio-item:hover { background: rgba(255,255,255,0.06); }
      `}</style>

      <audio
        ref={audioRef}
        className="sl-radio-audio"
        preload="none"
        onPlay={() => { setPlaying(true); failures.current = 0 }}
        onPause={() => setPlaying(false)}
        onEnded={() => playIndex(nextIndex(index))}
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
          className="sl-radio-btn sl-radio-play"
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
            // The same look as the guide button in the lower right corner.
            pointerEvents: 'auto', flex: 'none', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-accent)', color: '#0a0a0a', border: 'none',
            boxShadow: '0 6px 24px rgba(0,0,0,0.28)',
            cursor: 'pointer', touchAction: 'manipulation', userSelect: 'none', WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        >
          {playing ? <Pause size={18} fill="currentColor" aria-hidden /> : <Play size={18} fill="currentColor" aria-hidden style={{ marginLeft: 2 }} />}
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
          ref={creditBoxRef}
          className="sl-radio-credit"
          aria-live="polite"
          style={{
            color: YELLOW, fontSize: 'var(--fs-2xs)', letterSpacing: '0.04em', lineHeight: 1.3,
            background: 'rgba(10,10,10,0.72)', borderRadius: 999, padding: credit ? '0.25rem 0.7rem' : 0,
            opacity: credit ? 1 : 0, transition: 'opacity 0.4s', overflow: 'hidden', minWidth: 0,
          }}
        >
          {/* The whole line is shown: when it is wider than the room, it scrolls by (track and composer) before it fades out. */}
          <span ref={creditTextRef} style={{ display: 'inline-block', whiteSpace: 'nowrap', willChange: 'transform' }}>{credit ? creditText : ''}</span>
        </span>
      </div>

      {menu && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Radio"
          onKeyDown={onMenuKey}
          style={{
            position: 'fixed', left: '1.25rem', bottom: `calc(${corner} + 62px)`, zIndex: 901,
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
                color: i === index ? 'var(--color-accent)' : 'var(--color-text)',
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
