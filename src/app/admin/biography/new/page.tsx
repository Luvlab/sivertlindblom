'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewBioPage() {
  const router = useRouter()
  const [form, setForm] = useState({ entry_type:'personal', year_start:'', year_end:'', title:'', description:'', location:'' })
  const [saving, setSaving] = useState(false)
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(p => ({ ...p, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    setSaving(false)
    router.push('/admin/biography')
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 700 }}>
      <Link href="/admin/biography" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>← Biografi</Link>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginTop: '0.75rem', marginBottom: '2rem' }}>Ny biografipost</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Typ *</label>
          <select className="input" value={form.entry_type} onChange={f('entry_type')}>
            {[['personal','Personligt'],['education','Utbildning'],['position','Tjänst/Uppdrag'],['award','Pris/Utmärkelse'],['public_commission','Offentligt uppdrag'],['group_exhibition','Grupputställning'],['publication','Publikation']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Titel/Beskrivning *</label>
          <input type="text" required className="input" value={form.title} onChange={f('title')} placeholder="Titel eller beskrivning" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>År start</label>
            <input type="number" className="input" value={form.year_start} onChange={f('year_start')} placeholder="1989" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>År slut</label>
            <input type="number" className="input" value={form.year_end} onChange={f('year_end')} placeholder="1991" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Plats</label>
            <input type="text" className="input" value={form.location} onChange={f('location')} placeholder="Stockholm" />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Utökad beskrivning</label>
          <textarea className="input" rows={4} value={form.description} onChange={f('description')} placeholder="Valfri utökad text..." style={{ resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Sparar...' : 'Spara post'}</button>
          <Link href="/admin/biography"><button type="button" className="btn">Avbryt</button></Link>
        </div>
      </form>
    </div>
  )
}
