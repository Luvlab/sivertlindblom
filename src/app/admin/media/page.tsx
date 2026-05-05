'use client'

import { useState } from 'react'

const SAMPLE_IMAGES = [
  { id:'1', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg', alt:'Blasieholmstorg 01', work:'Blasieholmstorg' },
  { id:'2', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg', alt:'Blasieholmstorg 31', work:'Blasieholmstorg' },
  { id:'3', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg', alt:'Blasieholmstorg 48', work:'Blasieholmstorg' },
  { id:'4', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg', alt:'Blasieholmstorg 43', work:'Blasieholmstorg' },
  { id:'5', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg', alt:'Blasieholmstorg 71', work:'Blasieholmstorg' },
  { id:'6', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg', alt:'Blasieholmstorg 33', work:'Blasieholmstorg' },
  { id:'7', url:'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/San-Marco-hastar.jpg',               alt:'San Marco hästar',  work:'Blasieholmstorg' },
]

export default function AdminMedia() {
  const [newUrl, setNewUrl] = useState('')
  const [newAlt, setNewAlt] = useState('')
  const [images, setImages] = useState(SAMPLE_IMAGES)

  function addImage() {
    if (!newUrl.trim()) return
    setImages(prev => [...prev, { id: String(Date.now()), url: newUrl, alt: newAlt, work: '—' }])
    setNewUrl('')
    setNewAlt('')
  }

  return (
    <div style={{ padding: '3rem' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.5rem' }}>Media</h1>
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem' }}>{images.length} bilder</p>

      {/* Add image URL */}
      <div style={{ background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--fs-base)', marginBottom: '1rem' }}>Lägg till bild via URL</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Bild URL *</label>
            <input type="url" className="input" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://sivertlindblom.se/wp-content/uploads/..." />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Alt-text</label>
            <input type="text" className="input" value={newAlt} onChange={e => setNewAlt(e.target.value)} placeholder="Beskriv bilden" />
          </div>
          <button className="btn btn-primary" onClick={addImage}>Lägg till</button>
        </div>
      </div>

      {/* Image grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-bg-surface)' }}>
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div style={{ padding: '0.75rem' }}>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.alt || '—'}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{img.work}</div>
              <button onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))} style={{ marginTop: '0.5rem', fontSize: 'var(--fs-xs)', color: '#e55', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Ta bort
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
