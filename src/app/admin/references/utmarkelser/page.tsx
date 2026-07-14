'use client'

import { useState, useEffect } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import type { UtmarkelserSection, PrizeEntry } from '@/lib/reference-utmarkelser'

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }

export default function AdminUtmarkelser() {
  const [intro, setIntro] = useState('')
  const [prizes, setPrizes] = useState<PrizeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reference-utmarkelser', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: UtmarkelserSection | { error: string }) => {
        if ('error' in d) { setError(String(d.error)); return }
        setIntro(d.intro ?? '')
        setPrizes(d.prizes ?? [])
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function setPrize(i: number, patch: Partial<PrizeEntry>) {
    setPrizes(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p))
    setDirty(true)
  }
  function add() {
    setPrizes(prev => [...prev, { year: '', title: '', images: [] }])
    setDirty(true)
  }
  function remove(i: number) {
    if (!confirm('Ta bort den här utmärkelsen?')) return
    setPrizes(prev => prev.filter((_, idx) => idx !== i))
    setDirty(true)
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= prizes.length) return
    setPrizes(prev => { const n = [...prev]; [n[i], n[j]] = [n[j], n[i]]; return n })
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/reference-utmarkelser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intro, prizes }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.error) setError(data.error)
      else { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>

  return (
    <AdminForm
      title="Utmärkelser, priser och medaljer"
      backHref="/admin/references"
      backLabel="Referenser"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
      previewHref="/sv/references#utmarkelser"
    >
      <div>
        <FieldLabel>Ingress</FieldLabel>
        <textarea className="input" rows={2} style={{ width: '100%', resize: 'vertical' }} value={intro} onChange={e => { setIntro(e.target.value); setDirty(true) }} />
      </div>

      {prizes.map((p, i) => (
        <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 2, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '6rem 1fr', gap: '0.6rem' }}>
            <div>
              <label style={lbl}>År</label>
              <input className="input" style={{ width: '100%' }} value={p.year} onChange={e => setPrize(i, { year: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Titel</label>
              <input className="input" style={{ width: '100%' }} value={p.title} onChange={e => setPrize(i, { title: e.target.value })} />
            </div>
          </div>
          <div>
            <label style={lbl}>Underrubrik (valfri)</label>
            <input className="input" style={{ width: '100%' }} value={p.sub ?? ''} onChange={e => setPrize(i, { sub: e.target.value })} />
          </div>
          <div>
            <label style={lbl}>Beskrivning (valfri)</label>
            <textarea className="input" rows={2} style={{ width: '100%', resize: 'vertical' }} value={p.desc ?? ''} onChange={e => setPrize(i, { desc: e.target.value })} />
          </div>
          <div>
            <label style={lbl}>Citat (valfri)</label>
            <input className="input" style={{ width: '100%' }} value={p.quote ?? ''} onChange={e => setPrize(i, { quote: e.target.value })} />
          </div>
          <div>
            <label style={lbl}>Bilder på medaljen ({p.images.length})</label>
            <ImageListEditor images={p.images} onChange={imgs => setPrize(i, { images: imgs })} label={`Bilder — ${p.title || 'utmärkelse'}`} />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.25em 0.6em' }}>↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === prizes.length - 1} className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.25em 0.6em' }}>↓</button>
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.25em 0.6em', fontSize: 'var(--fs-xs)', borderRadius: 2 }}>Ta bort</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="btn" style={{ alignSelf: 'flex-start' }}>+ Ny utmärkelse</button>
    </AdminForm>
  )
}
