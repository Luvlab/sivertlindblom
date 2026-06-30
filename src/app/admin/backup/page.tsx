'use client'

import { useState } from 'react'
import { FieldLabel } from '@/components/admin/AdminForm'

export default function BackupPage() {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastExported, setLastExported] = useState<string | null>(null)

  async function handleDownload() {
    setDownloading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/backup', { cache: 'no-store' })
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const dateStr = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `sivertlindblom-backup-${dateStr}.json`
      a.click()
      URL.revokeObjectURL(url)
      setLastExported(new Date().toLocaleString('sv-SE'))
    } catch (err) {
      setError(String(err))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: 640 }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '2rem' }}>
        Säkerhetskopia
      </h1>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 2, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <FieldLabel>Exportera hela databasen</FieldLabel>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', margin: '0 0 1rem' }}>
            Laddar ned en JSON-fil med allt innehåll: offentliga arbeten, utställningar, undersidor, bilder och kartnålar. Filen kan sparas lokalt och användas för att återskapa innehåll om något går fel.
          </p>
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? 'Exporterar...' : '⬇ Ladda ned säkerhetskopia (JSON)'}
          </button>
        </div>

        {lastExported && (
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', margin: 0 }}>
            ✓ Exporterad {lastExported}
          </p>
        )}

        {error && (
          <p style={{ fontSize: 'var(--fs-sm)', color: '#f88', margin: 0 }}>
            ⚠ Fel: {error}
          </p>
        )}
      </div>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 2, padding: '1.5rem' }}>
        <FieldLabel>Vad ingår i exporten?</FieldLabel>
        <ul style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', paddingLeft: '1.2rem', margin: 0, lineHeight: 1.7 }}>
          <li>Alla offentliga arbeten (titlar, texter, år, platser, koordinater, filmer, länkar)</li>
          <li>Bilder kopplade till offentliga arbeten</li>
          <li>Undersidor till offentliga arbeten</li>
          <li>Alla utställningar (titlar, texter, år, platser, länkar)</li>
          <li>Bilder kopplade till utställningar</li>
          <li>Undersidor till utställningar</li>
          <li>Kartnålar</li>
        </ul>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-border)', margin: '1rem 0 0' }}>
          Obs: Bilder lagras i Supabase Storage och ingår inte i JSON-filen — bara bildlänkarna exporteras.
        </p>
      </div>
    </div>
  )
}
