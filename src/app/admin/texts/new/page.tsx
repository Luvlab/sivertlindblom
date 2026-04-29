'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewTextPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', author: '', text_type: 'essay', publication: '',
    year: '', language: 'sv', content: '', source_url: '', published: true,
  })
  const [saving, setSaving] = useState(false)

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    router.push('/admin/texts')
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/texts" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← Texter</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginTop: '0.75rem' }}>Ny text</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Titel *</label>
          <input type="text" required className="input" value={form.title} onChange={f('title')} placeholder="Textens titel" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Författare</label>
            <input type="text" className="input" value={form.author} onChange={f('author')} placeholder="Namn Efternamn" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Typ *</label>
            <select className="input" value={form.text_type} onChange={f('text_type')}>
              {[['essay','Essay'],['preface','Förord'],['review','Recension'],['interview','Intervju'],['own_writing','Egen text'],['translated','Översatt']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Publikation</label>
            <input type="text" className="input" value={form.publication} onChange={f('publication')} placeholder="Tidning / katalog" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>År</label>
            <input type="number" className="input" value={form.year} onChange={f('year')} placeholder="1993" min={1900} max={2100} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Språk</label>
            <select className="input" value={form.language} onChange={f('language')}>
              {[['sv','Svenska'],['en','English'],['de','Deutsch'],['fr','Français'],['it','Italiano']].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Innehåll</label>
          <textarea className="input" rows={8} value={form.content} onChange={f('content')} placeholder="Textens innehåll..." style={{ resize: 'vertical' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Källa URL</label>
          <input type="url" className="input" value={form.source_url} onChange={f('source_url')} placeholder="https://..." />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--fs-sm)', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} style={{ accentColor: 'var(--color-accent)' }} />
          Publicerad
        </label>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sparar...' : 'Spara text'}</button>
          <Link href="/admin/texts"><button type="button" className="btn">Avbryt</button></Link>
        </div>
      </form>
    </div>
  )
}
