'use client'

import { useState, useEffect } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import InlineUploadButton from '@/components/admin/InlineUploadButton'
import ExhibitionLinksEditor from '@/components/admin/ExhibitionLinksEditor'
import type { ExhibitionLink } from '@/lib/exhibitions-data'
import type { FilmEntry } from '@/lib/reference-film'

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }

export default function AdminFilmTv() {
  const [films, setFilms] = useState<FilmEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reference-film', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: FilmEntry[] | { error: string }) => {
        if (Array.isArray(d)) setFilms(d)
        else setError(String(d.error))
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function setFilm(i: number, patch: Partial<FilmEntry>) {
    setFilms(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f))
    setDirty(true)
  }
  function add() {
    setFilms(prev => [...prev, { slug: '', year: new Date().getFullYear(), title: '' }])
    setDirty(true)
  }
  function remove(i: number) {
    if (!confirm('Ta bort den här filmen?')) return
    setFilms(prev => prev.filter((_, idx) => idx !== i))
    setDirty(true)
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= films.length) return
    setFilms(prev => { const n = [...prev]; [n[i], n[j]] = [n[j], n[i]]; return n })
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/reference-film', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ films }),
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
      title="Film & TV"
      backHref="/admin/references"
      backLabel="Referenser"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={900}
      previewHref="/sv/references#film-tv"
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem' }}>
        Filmklipp och TV-inslag. Klistra in en YouTube-, SVT- eller annan video-URL i varje rad.
      </p>

      {films.map((f, i) => (
        <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 2, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 6rem', gap: '0.6rem' }}>
            <div>
              <label style={lbl}>Titel</label>
              <input className="input" style={{ width: '100%' }} value={f.title} onChange={e => setFilm(i, { title: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>År</label>
              <input className="input" type="number" style={{ width: '100%' }} value={f.year || ''} onChange={e => setFilm(i, { year: Number(e.target.value) || 0 })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <div>
              <label style={lbl}>Regissör (valfri)</label>
              <input className="input" style={{ width: '100%' }} value={f.director ?? ''} onChange={e => setFilm(i, { director: e.target.value })} />
            </div>
            <div>
              <label style={lbl}>Plats / kanal (valfri)</label>
              <input className="input" style={{ width: '100%' }} value={f.venue ?? ''} onChange={e => setFilm(i, { venue: e.target.value })} placeholder="t.ex. SVT Play" />
            </div>
          </div>
          <div>
            <label style={lbl}>Video-URL — eller ladda upp en mp4</label>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="input" style={{ flex: 1, minWidth: 200 }} value={f.videoUrl ?? ''} onChange={e => setFilm(i, { videoUrl: e.target.value })} placeholder="https://youtu.be/… eller ladda upp en mp4 →" />
              <InlineUploadButton accept="video/mp4,video/webm,video/quicktime" bucket="videos" folder="films" label="⬆ mp4" onUploaded={url => setFilm(i, { videoUrl: url })} />
            </div>
          </div>
          <div>
            <label style={lbl}>Startbild (valfri) — URL eller ladda upp</label>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input className="input" style={{ flex: 1, minWidth: 200 }} value={f.poster ?? ''} onChange={e => setFilm(i, { poster: e.target.value })} placeholder="Bild i startrutan (används när filmen saknar YouTube/uppladdad video)" />
              <InlineUploadButton accept="image/*" bucket="images" folder="film-posters" label="⬆ Bild" onUploaded={url => setFilm(i, { poster: url })} />
            </div>
            {f.poster && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={f.poster} alt="" style={{ marginTop: '0.4rem', maxHeight: 70, borderRadius: 2, border: '1px solid var(--color-border)' }} />
            )}
          </div>
          <div>
            <label style={lbl}>Beskrivning (valfri)</label>
            <textarea className="input" rows={2} style={{ width: '100%', resize: 'vertical' }} value={f.desc ?? ''} onChange={e => setFilm(i, { desc: e.target.value })} />
          </div>
          <div>
            <label style={lbl}>Länkar (intern sida börjar med /, extern med https://)</label>
            <ExhibitionLinksEditor
              links={(f.links ?? []) as ExhibitionLink[]}
              onChange={links => setFilm(i, { links: links as FilmEntry['links'] })}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.25em 0.6em' }}>↑</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === films.length - 1} className="btn" style={{ fontSize: 'var(--fs-xs)', padding: '0.25em 0.6em' }}>↓</button>
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.25em 0.6em', fontSize: 'var(--fs-xs)', borderRadius: 2 }}>Ta bort</button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add} className="btn" style={{ alignSelf: 'flex-start' }}>+ Ny film</button>
    </AdminForm>
  )
}
