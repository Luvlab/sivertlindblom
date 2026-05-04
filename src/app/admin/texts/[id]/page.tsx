'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TextItem {
  slug: string
  type: 'essay' | 'preface' | 'review' | 'interview' | 'own_writing' | 'translated'
  year: number
  title: string
  author: string
  authorBio?: string
  publication: string
  lang: string
  body: string
}

const TYPE_LABELS = {
  essay: 'Essay', preface: 'Förord', review: 'Recension',
  interview: 'Intervju', own_writing: 'Egen text', translated: 'Översatt',
}

const inp: React.CSSProperties = { width: '100%' }
const label = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

export default function EditTextPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<TextItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/texts/${id}`)
      .then(r => r.json())
      .then((d: TextItem | { error: string }) => {
        if ('error' in d) setError(d.error)
        else setForm(d)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [id])

  function set<K extends keyof TextItem>(key: K, val: TextItem[K]) {
    setForm(prev => prev ? { ...prev, [key]: val } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/texts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { ok?: boolean; message?: string; error?: string }
      if (data.ok) { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error ?? data.message ?? 'Fel vid sparning')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}"? Detta kan inte ångras.`)) return
    await fetch(`/api/admin/texts/${id}`, { method: 'DELETE' })
    router.push('/admin/texts')
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>{error ?? 'Hittades inte'}</div>

  return (
    <div style={{ padding: '3rem', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link href="/admin/texts" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Texter</Link>
        {dirty && <span style={{ fontSize: 'var(--fs-xs)', color: '#f0a' }}>● Osparade ändringar</span>}
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '2rem' }}>
        Redigera text
      </h1>

      {error && <div style={{ background: '#3a0010', border: '1px solid #c00', padding: '1rem', marginBottom: '1.5rem', fontSize: 'var(--fs-sm)', color: '#f88' }}>{error}</div>}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            {label('Titel')}
            <input className="input" style={inp} value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div>
            {label('Slug')}
            <input className="input" style={inp} value={form.slug} onChange={e => set('slug', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div>
            {label('Författare')}
            <input className="input" style={inp} value={form.author} onChange={e => set('author', e.target.value)} />
          </div>
          <div>
            {label('Typ')}
            <select className="input" style={inp} value={form.type} onChange={e => set('type', e.target.value as TextItem['type'])}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            {label('År')}
            <input className="input" type="number" style={inp} value={form.year} onChange={e => set('year', Number(e.target.value))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div>
            {label('Publikation')}
            <input className="input" style={inp} value={form.publication} onChange={e => set('publication', e.target.value)} />
          </div>
          <div>
            {label('Språk')}
            <select className="input" style={inp} value={form.lang} onChange={e => set('lang', e.target.value)}>
              {['sv','en','de','fr','it','nl','es','pl','pt','ru','ja','ko','zh','ar','th'].map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>
        </div>

        <div>
          {label('Kort bio om författaren')}
          <input className="input" style={inp} value={form.authorBio ?? ''} onChange={e => set('authorBio', e.target.value)} />
        </div>

        <div>
          {label('Brödtext (markdown / ny rad = ny rad)')}
          <textarea
            className="input"
            style={{ ...inp, resize: 'vertical', minHeight: 400, fontFamily: 'Georgia, serif', fontSize: '0.9rem', lineHeight: 1.7 }}
            value={form.body}
            onChange={e => set('body', e.target.value)}
          />
          <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
            Dubbelt radbrytning = nytt stycke. Enkelt radbrytning = ny rad i samma stycke.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar…' : 'Spara text'}
          </button>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          <button type="button" onClick={handleDelete}
            style={{ marginLeft: 'auto', background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.5em 1em', fontSize: 'var(--fs-xs)' }}>
            Radera text
          </button>
        </div>
      </form>
    </div>
  )
}
