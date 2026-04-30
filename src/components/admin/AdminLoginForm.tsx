'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })

        if (res.ok) {
          router.push('/admin')
          router.refresh()
        } else {
          const data = await res.json().catch(() => ({}))
          setError(data.error ?? 'Fel lösenord. Försök igen.')
        }
      } catch {
        setError('Nätverksfel. Kontrollera din anslutning.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Lösenord
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoFocus
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 2,
            color: 'var(--color-text)',
            fontSize: 'var(--fs-base)',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(200,60,60,0.1)',
          border: '1px solid rgba(200,60,60,0.3)',
          borderRadius: 2,
          color: '#e06060',
          fontSize: 'var(--fs-sm)',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !password}
        className="btn"
        style={{ width: '100%', justifyContent: 'center', opacity: isPending ? 0.6 : 1 }}
      >
        {isPending ? 'Loggar in...' : 'Logga in'}
      </button>
    </form>
  )
}
