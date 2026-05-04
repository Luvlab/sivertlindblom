'use client'

import Link from 'next/link'

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
}: AdminFormProps) {
  return (
    <div style={{ padding: '3rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href={backHref}
          style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--color-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          ← {backLabel}
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)' }}>
            {title}
          </h1>
          {dirty && (
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontStyle: 'italic' }}>
              Osparade ändringar
            </span>
          )}
        </div>
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
          {error}
        </div>
      )}

      <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <Link href={backHref}>
              <button type="button" className="btn">Avbryt</button>
            </Link>
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
