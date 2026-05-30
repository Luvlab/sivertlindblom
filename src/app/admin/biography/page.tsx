'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import LinkTextarea from '@/components/admin/LinkTextarea'

const DEFAULT_PORTRAIT = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Portratt-SivertMattias.jpg'

interface BioPhoto { url: string; caption: string }

const DEFAULT_PHOTOS: BioPhoto[] = [
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2012/12/Sivert-skulptor.jpg',        caption: 'Sivert Lindblom, skulptör' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Portratt-SivertMattias.jpg', caption: 'Porträtt. Foto: Mathias Johansson' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_135427.jpg',         caption: 'Konstakademien 2012. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-sten-kopia.jpg',       caption: 'Sivert med sten. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20130308_101452.jpg',         caption: 'Bergmans Konstgjuteri, Enskede 2013. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert571-kopia.jpg',         caption: 'Sivert vid Kejsar Konstantins hand, Capitolium museet, Rom' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2012/12/Sivert-skulpterar-1.jpg',     caption: 'Sivert skulpterar' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121101_151438.jpg',         caption: 'Ateljén. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/fotokarta-1963.jpg',          caption: 'Fotokort, 1963' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Eskilstuna-91.jpg',           caption: 'Eskilstuna. Foto: Lasse Larsson' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Eskilstuna-arb-161.jpg',      caption: 'I arbete, Eskilstuna. Foto: Lasse Larsson' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/DSC01888-kopia.jpg',          caption: 'Sivert Lindblom' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20120614_173855-kopia.jpg',   caption: 'Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7961.jpg',                caption: 'Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Siverts-exit.jpg',            caption: 'Siverts exit' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20130308_103958.jpg',         caption: 'Gjuteriet 2013. Foto: Jan Öqvist' },
]

interface BioCmsEntry {
  id: string
  entry_type: string
  year_start?: number
  year_end?: number
  title: string
  description?: string
  location?: string
}

const TYPE_LABELS: Record<string, string> = {
  personal: 'Personligt', education: 'Utbildning', position: 'Tjänst/Uppdrag',
  award: 'Pris/Utmärkelse', public_commission: 'Offentligt uppdrag',
  group_exhibition: 'Grupputställning', publication: 'Publikation',
}

export default function AdminBiography() {
  const [items, setItems] = useState<BioCmsEntry[]>([])
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Intro text + portrait (stored in settings)
  const [intro, setIntro] = useState('')
  const [portrait, setPortrait] = useState(DEFAULT_PORTRAIT)
  const [portraitUploading, setPortraitUploading] = useState(false)
  const [introSaving, setIntroSaving] = useState(false)
  const [introSaved, setIntroSaved] = useState(false)
  const portraitInputRef = useRef<HTMLInputElement>(null)

  // Fotografier section
  const [photos, setPhotos] = useState<BioPhoto[]>(DEFAULT_PHOTOS)
  const [photosSaving, setPhotosSaving] = useState(false)
  const [photosSaved, setPhotosSaved] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [newPhotoCaption, setNewPhotoCaption] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [editingCapIdx, setEditingCapIdx] = useState<number | null>(null)
  const [editingCapVal, setEditingCapVal] = useState('')

  useEffect(() => {
    fetch('/api/admin/biography')
      .then(r => r.json())
      .then((data: BioCmsEntry[] | { error: string }) => {
        if ('error' in data) setError(data.error)
        else setItems(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))

    // Load intro text, portrait, photos from settings
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then((s: Record<string, string>) => {
        if (s.biography_intro) setIntro(s.biography_intro)
        if (s.biography_portrait) setPortrait(s.biography_portrait)
        if (s.biography_photos) {
          try { setPhotos(JSON.parse(s.biography_photos)) } catch { /* ignore */ }
        }
      })
      .catch(() => {})
  }, [])

  const saveIntro = useCallback(async () => {
    setIntroSaving(true)
    try {
      const settingsRes = await fetch('/api/admin/settings')
      const current = await settingsRes.json() as Record<string, string>
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, biography_intro: intro, biography_portrait: portrait }),
      })
      setIntroSaved(true)
      setTimeout(() => setIntroSaved(false), 3000)
    } catch { /* ignore */ }
    finally { setIntroSaving(false) }
  }, [intro, portrait])

  const savePhotos = useCallback(async (list: BioPhoto[]) => {
    setPhotosSaving(true)
    try {
      const settingsRes = await fetch('/api/admin/settings')
      const current = await settingsRes.json() as Record<string, string>
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, biography_photos: JSON.stringify(list) }),
      })
      setPhotosSaved(true)
      setTimeout(() => setPhotosSaved(false), 3000)
    } catch { /* ignore */ }
    finally { setPhotosSaving(false) }
  }, [])

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', newPhotoCaption || file.name)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        const updated = [...photos, { url: data.url, caption: newPhotoCaption }]
        setPhotos(updated)
        setNewPhotoCaption('')
        await savePhotos(updated)
      }
    } catch { /* ignore */ }
    finally {
      setPhotoUploading(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  function removePhoto(idx: number) {
    const updated = photos.filter((_, i) => i !== idx)
    setPhotos(updated)
  }

  function commitCaption(idx: number) {
    const updated = photos.map((p, i) => i === idx ? { ...p, caption: editingCapVal } : p)
    setPhotos(updated)
    setEditingCapIdx(null)
  }

  async function handlePortraitUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPortraitUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('alt', 'Sivert Lindblom portrait')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        setPortrait(data.url)
        // Auto-save immediately
        const settingsRes = await fetch('/api/admin/settings')
        const current = await settingsRes.json() as Record<string, string>
        await fetch('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...current, biography_portrait: data.url }),
        })
      }
    } catch { /* ignore */ }
    finally {
      setPortraitUploading(false)
      if (portraitInputRef.current) portraitInputRef.current.value = ''
    }
  }

  const filtered = items
    .filter(b => !filter || b.title.toLowerCase().includes(filter.toLowerCase()))
    .filter(b => !typeFilter || b.entry_type === typeFilter)
    .sort((a, b) => (b.year_start ?? 0) - (a.year_start ?? 0))

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Biografi</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {loading ? 'Laddar...' : `${items.length} poster`}
          </p>
        </div>
        <Link href="/admin/biography/new">
          <button className="btn btn-primary">+ Ny post</button>
        </Link>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* ── Page intro editor ── */}
      <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', marginBottom: '2.5rem', borderRadius: 2 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>Sidans introduktionstext</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {introSaved && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>✓ Sparad</span>}
            <button className="btn btn-primary" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }} onClick={saveIntro} disabled={introSaving}>
              {introSaving ? 'Sparar…' : 'Spara text'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', padding: '1.25rem', alignItems: 'flex-start' }}>
          <LinkTextarea
            value={intro}
            onChange={setIntro}
            rows={5}
            placeholder="Skriv en kort presentation av Sivert Lindblom som visas längst upp på biografisidan…"
            style={{ flex: 1 }}
          />
          {/* Portrait preview + upload */}
          <div style={{ flexShrink: 0, width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portrait}
              alt="Sivert Lindblom"
              style={{ width: 160, height: 200, objectFit: 'cover', objectPosition: 'top center', borderRadius: 2, border: '1px solid var(--color-border)', display: 'block' }}
            />
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePortraitUpload}
            />
            <button
              type="button"
              className="btn"
              style={{ fontSize: '0.65rem', padding: '0.3em 0.8em', width: '100%' }}
              onClick={() => portraitInputRef.current?.click()}
              disabled={portraitUploading}
            >
              {portraitUploading ? 'Laddar upp…' : '↑ Byt porträtt'}
            </button>
            <span style={{ fontSize: '0.6rem', color: 'var(--color-muted)', textAlign: 'center' }}>Porträtt (visas på biografisidan)</span>
          </div>
        </div>
      </div>

      {/* ── Fotografier ── */}
      <div style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', marginBottom: '2.5rem', borderRadius: 2 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>Fotografier ({photos.length} bilder)</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {photosSaved && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>✓ Sparad</span>}
            <button
              className="btn btn-primary"
              style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}
              onClick={() => savePhotos(photos)}
              disabled={photosSaving}
            >
              {photosSaving ? 'Sparar…' : 'Spara ordning'}
            </button>
          </div>
        </div>

        {/* Photo grid */}
        <div style={{ padding: '1rem 1.25rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            {photos.map((p, i) => (
              <div key={i} style={{ position: 'relative', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.caption}
                  style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }}
                />
                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(160,30,30,0.85)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.65rem', padding: '0.15rem 0.35rem', lineHeight: 1 }}
                  title="Ta bort"
                >✕</button>
                {/* Caption edit */}
                {editingCapIdx === i ? (
                  <div style={{ padding: '0.35rem' }}>
                    <input
                      className="input"
                      autoFocus
                      value={editingCapVal}
                      onChange={e => setEditingCapVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitCaption(i); if (e.key === 'Escape') setEditingCapIdx(null) }}
                      style={{ width: '100%', fontSize: '0.65rem', padding: '0.2em 0.4em' }}
                    />
                    <button type="button" onClick={() => commitCaption(i)} style={{ marginTop: 3, fontSize: '0.6rem', background: 'var(--color-accent)', color: '#0a0a0a', border: 'none', cursor: 'pointer', padding: '0.15em 0.5em', width: '100%' }}>✓</button>
                  </div>
                ) : (
                  <div
                    onClick={() => { setEditingCapIdx(i); setEditingCapVal(p.caption) }}
                    style={{ padding: '0.3rem 0.4rem', fontSize: '0.65rem', color: 'var(--color-muted)', cursor: 'text', minHeight: '1.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title="Klicka för att redigera bildtext"
                  >
                    {p.caption || <em style={{ opacity: 0.45 }}>Bildtext…</em>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload new photo */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <input
              type="text"
              className="input"
              placeholder="Bildtext (valfri)…"
              value={newPhotoCaption}
              onChange={e => setNewPhotoCaption(e.target.value)}
              style={{ flex: 1, minWidth: 160, fontSize: 'var(--fs-sm)' }}
            />
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: 'var(--fs-xs)', padding: '0.4em 1em', whiteSpace: 'nowrap' }}
              onClick={() => photoInputRef.current?.click()}
              disabled={photoUploading}
            >
              {photoUploading ? 'Laddar upp…' : '↑ Ladda upp foto'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <select
          className="input"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">Alla typer</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)', padding: '2rem 0' }}>Laddar...</p>
      ) : (
        <div>
          {filtered.map(b => (
            <div
              key={b.id}
              style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto auto', gap: '1rem', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--color-border)', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>
                {b.year_start}{b.year_end ? `–${b.year_end}` : ''}
              </span>
              <div>
                <div style={{ fontSize: 'var(--fs-sm)' }}>{b.title}</div>
                {b.location && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{b.location}</div>
                )}
              </div>
              <span className="badge">{TYPE_LABELS[b.entry_type] ?? b.entry_type}</span>
              <Link href={`/admin/biography/${b.id}`}>
                <button className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.3em 0.8em' }}>Redigera</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', textAlign: 'center', color: 'var(--color-muted)' }}>
          Inga poster hittades.
        </div>
      )}
    </div>
  )
}
