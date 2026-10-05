'use client'

import { useState } from 'react'
import { locales } from '@/i18n/config'

type EntityType = 'text' | 'biography_entry' | 'exhibition' | 'public_work' | 'home' | 'sculpture_project' | 'scenography' | 'watercolors' | 'contact' | 'reference_fotografi' | 'biography'

const TARGET_LOCALES = locales.filter((l) => l !== 'sv')

interface Props {
  entityType: EntityType
  entityId: string
  /** Shown as a hint before the button — e.g. "Spara innan du översätter." */
  disabled?: boolean
  disabledReason?: string
}

/**
 * Self-serve "translate this to every language" button for a single admin
 * edit page. Re-translates unconditionally (skip_existing: false) since the
 * point is to pick up whatever was just written or changed — an existing
 * translation for this entity is expected to go stale on every save.
 *
 * One request per locale (not one request for all 15): a single long-lived
 * request covering every locale can run past Vercel's function time limit
 * for longer entries and get killed mid-stream, which is exactly the "some
 * languages couldn't be translated" error Jan hit on long scenography texts.
 * Looping client-side keeps each request to one Gemini call, well under any
 * timeout, while still retrying individual locale failures a couple of times.
 */
export default function TranslateButton({ entityType, entityId, disabled, disabledReason }: Props) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function translateLocale(locale: string): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_ids: [entityId],
          locales: [locale],
          skip_existing: false,
        }),
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return false

      let ok = true
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value).split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const ev = JSON.parse(line.slice(6)) as { type: string; error?: string }
            if (ev.type === 'error') ok = false
          } catch { /* ignore parse errors */ }
        }
      }
      return ok
    } catch {
      return false
    }
  }

  async function run() {
    if (!entityId || disabled) return
    setRunning(true)
    setStatus('idle')
    setError(null)
    setProgress({ done: 0, total: TARGET_LOCALES.length })

    let hadError = false
    for (const locale of TARGET_LOCALES) {
      // One retry per locale — a lone transient Gemini error shouldn't force
      // Jan to re-run the whole thing for every other language again.
      let ok = await translateLocale(locale)
      if (!ok) ok = await translateLocale(locale)
      if (!ok) hadError = true
      setProgress((p) => ({ ...p, done: p.done + 1 }))
    }

    setStatus(hadError ? 'error' : 'done')
    if (hadError) setError('Vissa språk kunde inte översättas — försök igen om en stund.')
    setRunning(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <button
        type="button"
        className="btn"
        disabled={running || disabled}
        onClick={run}
        title={disabled ? disabledReason : undefined}
      >
        {running
          ? `Översätter… (${progress.done}/${progress.total})`
          : '🌐 Översätt till alla språk'}
      </button>
      {disabled && disabledReason && (
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{disabledReason}</span>
      )}
      {status === 'done' && (
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>✓ Översatt till alla språk</span>
      )}
      {status === 'error' && (
        <span style={{ fontSize: 'var(--fs-xs)', color: '#f88' }}>{error}</span>
      )}
    </div>
  )
}
