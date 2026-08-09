'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface TranslationData {
  title: string | null
  content: string | null
  description: string | null
  author_bio: string | null
  machine_translated: boolean
  reviewed_by: string | null
}

export default function EditTranslationPage() {
  return (
    <Suspense fallback={<div style={{ padding: 'clamp(1rem,3vw,3rem)', color: 'var(--color-muted)' }}>Laddar…</div>}>
      <EditTranslationPageInner />
    </Suspense>
  )
}

function EditTranslationPageInner() {
  const params = useParams<{ entityType: string; entityId: string; locale: string }>()
  const router = useRouter()
  const { entityType, entityId, locale } = params

  const [form, setForm] = useState<TranslationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewerName, setReviewerName] = useState('')

  useEffect(() => {
    fetch(`/api/admin/translations?entity_type=${entityType}&entity_id=${encodeURIComponent(entityId)}&locale=${locale}`)
      .then(r => r.json())
      .then((rows: TranslationData[]) => {
        const row = rows[0]
        if (row) {
          setForm(row)
          setReviewerName(row.reviewed_by ?? '')
        }
        setLoading(false)
      })
      .catch(e => { setError(String(e)); setLoading(false) })
  }, [entityType, entityId, locale])

  function set<K extends keyof TranslationData>(key: K, val: TranslationData[K]) {
    setForm(prev => prev ? { ...prev, [key]: val } : prev)
  }

  async function handleSave(markReviewed: boolean) {
    if (!form) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: decodeURIComponent(entityId),
          locale,
          title: form.title,
          content: form.content,
          description: form.description,
          author_bio: form.author_bio,
          machine_translated: !markReviewed,
          reviewed_by: markReviewed ? (reviewerName || null) : null,
        }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        if (markReviewed) set('machine_translated', false)
      } else {
        setError(data.error ?? 'Fel vid sparning')
      }
    } finally {
      setSaving(false)
    }
  }

  async function retranslate() {
    if (!confirm('Skriv över den nuvarande översättningen med en ny maskinöversättning?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type: entityType, entity_id: decodeURIComponent(entityId), locale }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.ok) {
        window.location.reload()
      } else {
        setError(data.error ?? 'Fel vid översättning')
      }
    } finally {
      setSaving(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)',
    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem',
  }

  if (loading) return <div style={{ padding: 'clamp(1rem,3vw,3rem)', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: 'clamp(1rem,3vw,3rem)', color: 'var(--color-muted)' }}>{error ?? 'Översättning hittades inte'}</div>

  const decodedId = decodeURIComponent(entityId)

  return (
    <div style={{ padding: 'clamp(1rem,3vw,3rem)', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/admin/translations" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Översättningar</Link>
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
          {entityType} · {decodedId} · <strong>{locale.toUpperCase()}</strong>
        </span>
        {form.machine_translated && (
          <span style={{ fontSize: 'var(--fs-xs)', background: '#3a2000', color: '#f0a020', padding: '2px 8px', borderRadius: 2 }}>
            Maskinöversatt
          </span>
        )}
        {!form.machine_translated && (
          <span style={{ fontSize: 'var(--fs-xs)', background: '#002a00', color: '#3a3', padding: '2px 8px', borderRadius: 2 }}>
            Granskad av {form.reviewed_by ?? 'okänd'}
          </span>
        )}
      </div>

      {error && <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: 'var(--fs-sm)', color: '#f88', borderRadius: 2 }}>{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {form.title !== null && (
          <div>
            <label style={labelStyle}>Titel</label>
            <input className="input" style={{ width: '100%' }} value={form.title ?? ''} onChange={e => set('title', e.target.value)} />
          </div>
        )}

        {form.content !== null && (
          <div>
            <label style={labelStyle}>Text / innehåll</label>
            <textarea
              className="input"
              rows={18}
              style={{ width: '100%', fontFamily: 'Georgia, serif', fontSize: '0.9rem', lineHeight: 1.7, resize: 'vertical' }}
              value={form.content ?? ''}
              onChange={e => set('content', e.target.value)}
            />
          </div>
        )}

        {form.description !== null && (
          <div>
            <label style={labelStyle}>Beskrivning</label>
            <textarea
              className="input"
              rows={6}
              style={{ width: '100%', resize: 'vertical' }}
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        )}

        {form.author_bio !== null && (
          <div>
            <label style={labelStyle}>Kortbiografi om författaren</label>
            <input className="input" style={{ width: '100%' }} value={form.author_bio ?? ''} onChange={e => set('author_bio', e.target.value)} />
          </div>
        )}

        {/* Reviewer sign-off */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Granskad av (namn)</label>
            <input
              className="input"
              style={{ maxWidth: 320 }}
              placeholder="Ditt namn"
              value={reviewerName}
              onChange={e => setReviewerName(e.target.value)}
            />
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.3rem' }}>
              Fyll i namn och klicka "Spara som granskad" för att ta bort Maskinöversatt-märket.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => handleSave(false)}>
              {saving ? 'Sparar…' : 'Spara'}
            </button>
            <button type="button" className="btn" disabled={saving || !reviewerName} onClick={() => handleSave(true)}>
              ✓ Spara som granskad
            </button>
            <button type="button" className="btn" disabled={saving} onClick={retranslate} style={{ marginLeft: 'auto' }}>
              ↺ Ny maskinöversättning
            </button>
          </div>

          {saved && <p style={{ color: '#3a3', fontSize: 'var(--fs-xs)' }}>Sparad!</p>}
        </div>
      </div>
    </div>
  )
}
