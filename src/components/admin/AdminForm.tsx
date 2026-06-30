'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AdminFormProps {
  title: string
  backHref: string
  backLabel: string
  children: React.ReactNode
  onSave: (e: React.FormEvent) => void
  onDelete?: () => void
  saving?: boolean
  saved?: boolean
  deleteLabel?: string
  saveLabel?: string
  dirty?: boolean
  error?: string | null
  /** Override the default max-width (800). Pass 'none' for full width. */
  maxWidth?: number | 'none'
}

export default function AdminForm({
  title,
  backHref,
  backLabel,
  children,
  onSave,
  onDelete,
  saving = false,
  saved = false,
  deleteLabel = 'Radera',
  saveLabel = 'Spara',
  dirty = false,
  error = null,
  maxWidth = 800,
}: AdminFormProps) {
  const router = useRouter()

  // Warn on browser refresh / tab close when there are unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  function handleBack() {
    if (!dirty || confirm('Du har osparade ändringar. Vill du lämna sidan utan att spara?')) {
      router.push(backHref)
    }
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: maxWidth === 'none' ? undefined : maxWidth }}>
      {/* Sticky save toolbar — top offset managed by .admin-form-toolbar CSS class (0 desktop, 3rem mobile) */}
      <div
        className="admin-form-toolbar"
        style={{
          background: '#0a0a0a',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.65rem 0',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: 'var(--fs-xs)',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          ← {backLabel}
        </button>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {saved && (
            <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>
          )}
          {/* Error in toolbar so it's visible even when scrolled down */}
          {error && !saved && (
            <span style={{ color: '#f88', fontSize: 'var(--fs-xs)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={error}>
              ⚠ Fel vid sparning
            </span>
          )}
          {dirty && !saved && !error && (
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontStyle: 'italic' }}>Osparade ändringar</span>
          )}
          <button
            form="admin-form"
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Sparar...' : saveLabel}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))' }}>
          {title}
        </h1>
      </div>

      {error && (
        <div style={{
          background: '#2a0a0a',
          border: '1px solid #a33',
          color: '#f88',
          padding: '0.75rem 1rem',
          fontSize: 'var(--fs-sm)',
          marginBottom: '1.5rem',
        }}>
          ⚠ Sparningen misslyckades: {error}
        </div>
      )}

      <form id="admin-form" onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Sparar...' : saveLabel}
            </button>
            <button type="button" className="btn" onClick={handleBack}>Avbryt</button>
            {saved && (
              <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>
                ✓ Sparad
              </span>
            )}
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              style={{
                background: 'none',
                border: '1px solid #a33',
                color: '#f88',
                padding: '0.4em 0.9em',
                fontSize: 'var(--fs-xs)',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {deleteLabel}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

// Reusable field label helper
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: 'block',
      fontSize: 'var(--fs-xs)',
      color: 'var(--color-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '0.4rem',
    }}>
      {children}
    </label>
  )
}
