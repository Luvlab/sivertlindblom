'use client'

import { useState } from 'react'

type EntityType = 'text' | 'biography_entry' | 'exhibition' | 'public_work' | 'home'

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
 */
export default function TranslateButton({ entityType, entityId, disabled, disabledReason }: Props) {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function run() {
    if (!entityId || disabled) return
    setRunning(true)
    setStatus('idle')
    setError(null)
    setProgress({ done: 0, total: 0 })

    try {
      const res = await fetch('/api/admin/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_ids: [entityId],
          skip_existing: false,
        }),
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('Inget svar från servern')

      let hadError = false
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        for (const line of decoder.decode(value).split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const ev = JSON.parse(line.slice(6)) as { type: string; total?: number; done?: number; error?: string }
            if (ev.type === 'start') setProgress({ done: 0, total: ev.total ?? 0 })
            else if (ev.type === 'done') setProgress(p => ({ ...p, done: ev.done ?? p.done }))
            else if (ev.type === 'error') { hadError = true; setProgress(p => ({ ...p, done: ev.done ?? p.done })) }
          } catch { /* ignore parse errors */ }
        }
      }
      setStatus(hadError ? 'error' : 'done')
      if (hadError) setError('Vissa språk kunde inte översättas — försök igen om en stund.')
    } catch (e) {
      setStatus('error')
      setError(String(e))
    } finally {
      setRunning(false)
    }
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
