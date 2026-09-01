'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  src: string
  /** aria-label for the play/pause button, e.g. "Spela upp inslaget". */
  playLabel?: string
  pauseLabel?: string
}

const BAR_COUNT = 220
const BAR_GAP_RATIO = 0.35 // gap as a fraction of each bar's slot width

function formatTime(s: number): string {
  if (!Number.isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

/** Downsample raw PCM samples to BAR_COUNT peak values, normalized 0–1. */
function computePeaks(channelData: Float32Array, bars: number): number[] {
  const blockSize = Math.max(1, Math.floor(channelData.length / bars))
  const peaks: number[] = []
  let max = 0
  for (let i = 0; i < bars; i++) {
    const start = i * blockSize
    let peak = 0
    for (let j = 0; j < blockSize && start + j < channelData.length; j++) {
      const v = Math.abs(channelData[start + j])
      if (v > peak) peak = v
    }
    peaks.push(peak)
    if (peak > max) max = peak
  }
  if (max === 0) return peaks
  return peaks.map((p) => p / max)
}

/**
 * A full-width audio player with a real waveform (decoded from the actual
 * audio data client-side) so listeners can see amplitude and playback
 * position at a glance, instead of the native browser control's thin bar.
 */
export default function AudioWaveformPlayer({ src, playLabel = 'Spela', pauseLabel = 'Pausa' }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const peaksRef = useRef<number[] | null>(null)
  const rafRef = useRef<number | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [peaksReady, setPeaksReady] = useState(false)
  const [hoverX, setHoverX] = useState<number | null>(null)

  // Decode the audio file client-side to build a real waveform. Best-effort:
  // if fetch/decode fails (e.g. no CORS), the player still works via the
  // native <audio> element — it just falls back to a flat progress bar.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AudioCtx()
        const res = await fetch(src)
        const buf = await res.arrayBuffer()
        const decoded = await ctx.decodeAudioData(buf)
        if (cancelled) return
        peaksRef.current = computePeaks(decoded.getChannelData(0), BAR_COUNT)
        setPeaksReady(true)
        ctx.close().catch(() => {})
      } catch {
        // Fallback: no waveform data, just the progress fill.
        if (!cancelled) setPeaksReady(false)
      }
    })()
    return () => { cancelled = true }
  }, [src])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const dpr = window.devicePixelRatio || 1
    const width = container.clientWidth
    const height = container.clientHeight
    if (width === 0 || height === 0) return
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)

    const progress = duration > 0 ? currentTime / duration : 0
    const hoverFraction = hoverX !== null ? hoverX / width : null
    const peaks = peaksRef.current
    const mid = height / 2

    if (peaks && peaks.length > 0) {
      const slot = width / peaks.length
      const barWidth = Math.max(1, slot * (1 - BAR_GAP_RATIO))
      for (let i = 0; i < peaks.length; i++) {
        const x = i * slot
        const barFraction = (i + 0.5) / peaks.length
        const played = barFraction <= progress
        const h = Math.max(2, peaks[i] * height)
        ctx.fillStyle = played
          ? getComputedColor('--color-accent', '#c9a35a')
          : getComputedColor('--color-border', '#3a3a3a')
        ctx.fillRect(x, mid - h / 2, barWidth, h)
      }
    } else {
      // Fallback: flat progress track when waveform data isn't available.
      ctx.fillStyle = getComputedColor('--color-border', '#3a3a3a')
      ctx.fillRect(0, mid - 1, width, 2)
      ctx.fillStyle = getComputedColor('--color-accent', '#c9a35a')
      ctx.fillRect(0, mid - 1, width * progress, 2)
    }

    // Hover position indicator (scrub preview)
    if (hoverFraction !== null) {
      ctx.fillStyle = getComputedColor('--color-text', '#f5f5f0')
      ctx.globalAlpha = 0.35
      ctx.fillRect(hoverFraction * width - 0.5, 0, 1, height)
      ctx.globalAlpha = 1
    }
  }, [currentTime, duration, hoverX])

  function getComputedColor(varName: string, fallback: string): string {
    if (typeof window === 'undefined') return fallback
    const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    return v || fallback
  }

  // Redraw on relevant state changes and on container resize.
  useEffect(() => {
    draw()
  }, [draw, peaksReady])

  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => draw())
    ro.observe(container)
    return () => ro.disconnect()
  }, [draw])

  // Smooth playhead animation while playing (rAF, independent of timeupdate's ~4Hz rate)
  useEffect(() => {
    if (!isPlaying) return
    const tick = () => {
      const el = audioRef.current
      if (el) setCurrentTime(el.currentTime)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isPlaying])

  function togglePlay() {
    const el = audioRef.current
    if (!el) return
    if (el.paused) el.play().catch(() => {})
    else el.pause()
  }

  function seekToClientX(clientX: number) {
    const container = containerRef.current
    const el = audioRef.current
    if (!container || !el || !duration) return
    const rect = container.getBoundingClientRect()
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    el.currentTime = fraction * duration
    setCurrentTime(el.currentTime)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setHoverX(Math.min(rect.width, Math.max(0, e.clientX - rect.left)))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const el = audioRef.current
    if (!el || !duration) return
    if (e.key === 'ArrowRight') { e.preventDefault(); el.currentTime = Math.min(duration, el.currentTime + 5); setCurrentTime(el.currentTime) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); el.currentTime = Math.max(0, el.currentTime - 5); setCurrentTime(el.currentTime) }
    else if (e.key === ' ') { e.preventDefault(); togglePlay() }
  }

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        preload="none"
        src={src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => { if (!isPlaying) setCurrentTime(e.currentTarget.currentTime) }}
        style={{ display: 'none' }}
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? pauseLabel : playLabel}
        style={{
          flexShrink: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid var(--color-accent-dim)',
          background: 'transparent',
          color: 'var(--color-accent)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-bg-card)' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
      >
        {isPlaying ? (
          <svg width="13" height="15" viewBox="0 0 13 15" fill="currentColor">
            <rect x="0" y="0" width="4" height="15" rx="1" />
            <rect x="9" y="0" width="4" height="15" rx="1" />
          </svg>
        ) : (
          <svg width="13" height="15" viewBox="0 0 13 15" fill="currentColor" style={{ marginLeft: 2 }}>
            <polygon points="0,0 13,7.5 0,15" />
          </svg>
        )}
      </button>

      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Uppspelningsposition"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration) || 0}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${formatTime(currentTime)} av ${formatTime(duration)}`}
        onKeyDown={handleKeyDown}
        onClick={(e) => seekToClientX(e.clientX)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverX(null)}
        style={{
          flex: '1 1 auto',
          minWidth: 0,
          height: 48,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>

      <div style={{
        flexShrink: 0,
        fontSize: 'var(--fs-2xs)',
        color: 'var(--color-muted)',
        fontVariantNumeric: 'tabular-nums',
        minWidth: '5.5ch',
        textAlign: 'right',
      }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}
