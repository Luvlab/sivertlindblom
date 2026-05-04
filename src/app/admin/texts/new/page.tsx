'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{text}</label>
)

export default function NewTextPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '', author: '', authorBio: '', type: 'essay', publication: '',
    year: new Date().getFullYear(), lang: 'sv', body: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const slug = slugify(`${form.author.split(' ').pop()}-${form.year}`) || slugify(form.title) || String(Date.now())
      const payload = { ...form, year: Number(form.year), slug }
      const res = await fetch('/api/admin/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json() as { slug?: string; error?: string }
      if (data.error) {
        setError(data.error)
      } else {
        router.push('/admin/texts')
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 800 }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin/texts" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← Texter</Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginTop: '0.75rem' }}>Ny text</h1>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          {lbl('Titel *')}
          <input type="text" required className="input" style={{ width: '100%' }} value={form.title} onChange={f('title')} placeholder="Textens titel" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            {lbl('Typ *')}
            <select className="input" style={{ width: '100%' }} value={form.type} onChange={f('type')}>
              {[['essay','Essay'],['preface','Förord'],['review','Recension'],['interview','Intervju'],['own_writing','Egen text'],['translated','Översatt']].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            {lbl('Språk')}
            <select className="input" style={{ width: '100%' }} value={form.lang} onChange={f('lang')}>
              {[['sv','Svenska'],['en','English'],['de','Deutsch'],['fr','Français'],['it','Italiano']].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            {lbl('Författare')}
            <input type="text" className="input" style={{ width: '100%' }} value={form.author} onChange={f('author')} placeholder="Namn Efternamn" />
          </div>
          <div>
            {lbl('Kort bio om författaren')}
            <input type="text" className="input" style={{ width: '100%' }} value={form.authorBio} onChange={f('authorBio')} placeholder="T.ex. Konstkritiker, Moderna Museet" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <div>
            {lbl('Publikation')}
            <input type="text" className="input" style={{ width: '100%' }} value={form.publication} onChange={f('publication')} placeholder="Tidning / katalog / publikation" />
          </div>
          <div>
            {lbl('År')}
            <input type="number" className="input" style={{ width: '100%' }} value={form.year} onChange={f('year')} min={1900} max={2100} />
          </div>
        </div>

        <div>
          {lbl('Textinnehåll (brödtext)')}
          <textarea
            className="input"
            rows={10}
            style={{ width: '100%', resize: 'vertical' }}
            value={form.body}
            onChange={f('body')}
            placeholder="Skriv eller klistra in textens innehåll här…"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar...' : 'Spara text'}
          </button>
          <Link href="/admin/texts">
            <button type="button" className="btn">Avbryt</button>
          </Link>
        </div>
      </form>
    </div>
  )
}
