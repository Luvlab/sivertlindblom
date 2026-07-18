'use client'

import { useState, useEffect } from 'react'
import AdminForm from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import type { SculptureProject } from '@/lib/sculpture-projects'

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminSkulptur() {
  const [projects, setProjects] = useState<SculptureProject[]>([])
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/reference-sculpture', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: SculptureProject[] | { error: string }) => {
        if (Array.isArray(d)) setProjects(d)
        else if ('error' in d) setError(String(d.error))
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function update(i: number, patch: Partial<SculptureProject>) {
    setProjects(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p))
    setDirty(true)
  }
  function move(i: number, dir: -1 | 1) {
    setProjects(prev => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    setDirty(true)
  }
  function remove(i: number) {
    if (!confirm('Ta bort hela serien?')) return
    setProjects(prev => prev.filter((_, idx) => idx !== i))
    setDirty(true)
  }
  function add() {
    const title = 'Ny serie'
    setProjects(prev => [...prev, { slug: `ny-serie-${prev.length + 1}`, title, description: '', body: '', images: [], inTab: true }])
    setOpenIdx(projects.length)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/reference-sculpture', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
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

  const cell: React.CSSProperties = {
    background: 'var(--color-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)',
    fontSize: 'var(--fs-sm)', padding: '0.4rem 0.5rem', outline: 'none', width: '100%',
  }
  const labelStyle: React.CSSProperties = { fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.25rem', marginTop: '0.75rem' }

  return (
    <AdminForm
      title="Skulptur — serier"
      backHref="/admin/references"
      backLabel="Referenser"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
      previewHref="/sv/references#skulptur"
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem' }}>
        Skulpturserierna som visas under Referenser → Skulptur. Redigera rubrik, text och bilder, ändra ordning, och välj vilka som visas i undermenyn (”Visa i menyn”).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {projects.map((p, i) => {
          const open = openIdx === i
          const urls = p.images.map(im => im.url)
          const captions: Record<string, string> = {}
          for (const im of p.images) if (im.alt) captions[im.url] = im.alt
          return (
            <div key={i} style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', borderRadius: 2 }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem' }}>
                <button type="button" onClick={() => setOpenIdx(open ? null : i)} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontSize: '0.9rem', width: '1.2rem' }}>
                  {open ? '▾' : '▸'}
                </button>
                <span style={{ flex: 1, fontFamily: 'Georgia, serif', fontSize: 'var(--fs-base)' }}>{p.title || '(namnlös)'}</span>
                <label style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                  <input type="checkbox" checked={p.inTab !== false} onChange={e => update(i, { inTab: e.target.checked })} />
                  Visa i menyn
                </label>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{p.images.length} bilder</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} title="Upp" style={{ ...cell, width: 'auto', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === projects.length - 1} title="Ned" style={{ ...cell, width: 'auto', cursor: 'pointer', padding: '0.2rem 0.5rem' }}>↓</button>
                <button type="button" onClick={() => remove(i)} title="Ta bort" style={{ ...cell, width: 'auto', cursor: 'pointer', padding: '0.2rem 0.5rem', color: '#e66', borderColor: '#a33' }}>✕</button>
              </div>

              {open && (
                <div style={{ padding: '0 0.75rem 1rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Rubrik</label>
                      <input type="text" value={p.title} onChange={e => update(i, { title: e.target.value })} style={cell} />
                    </div>
                    <div>
                      <label style={labelStyle}>Årtal (valfritt)</label>
                      <input type="text" value={p.years ?? ''} onChange={e => update(i, { years: e.target.value })} placeholder="t.ex. 1966–" style={cell} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Länk-adress (slug)</label>
                      <input type="text" value={p.slug} onChange={e => update(i, { slug: slugify(e.target.value) })} style={{ ...cell, fontFamily: 'monospace', fontSize: '0.75rem' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Kort text (undermeny-kort)</label>
                      <input type="text" value={p.shortDesc ?? ''} onChange={e => update(i, { shortDesc: e.target.value })} placeholder="Kort beskrivning…" style={cell} />
                    </div>
                  </div>

                  <label style={labelStyle}>Ingress (visas överst på seriesidan)</label>
                  <textarea value={p.description} onChange={e => update(i, { description: e.target.value })} rows={2} style={{ ...cell, resize: 'vertical' }} />

                  <label style={labelStyle}>Brödtext</label>
                  <textarea value={p.body} onChange={e => update(i, { body: e.target.value })} rows={8} style={{ ...cell, resize: 'vertical', lineHeight: 1.6 }} />

                  <label style={labelStyle}>Bilder ({urls.length}) — bildtext = alt-text</label>
                  <ImageListEditor
                    images={urls}
                    onChange={(next) => {
                      const nextImages = next.map(u => ({ url: u, alt: captions[u] ?? '' }))
                      update(i, { images: nextImages })
                    }}
                    label="Bilder"
                    captions={captions}
                    onCaptionsChange={(nextCaps) => {
                      const nextImages = urls.map(u => ({ url: u, alt: nextCaps[u] ?? '' }))
                      update(i, { images: nextImages })
                    }}
                  />

                  <label style={labelStyle}>Länkar</label>
                  {(p.links ?? []).map((lnk, li) => (
                    <div key={li} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.4rem' }}>
                      <input type="text" value={lnk.label} placeholder="Etikett" onChange={e => update(i, { links: (p.links ?? []).map((l, k) => k === li ? { ...l, label: e.target.value } : l) })} style={{ ...cell, flex: 1 }} />
                      <input type="text" value={lnk.url} placeholder="https://…" onChange={e => update(i, { links: (p.links ?? []).map((l, k) => k === li ? { ...l, url: e.target.value } : l) })} style={{ ...cell, flex: 2, fontFamily: 'monospace', fontSize: '0.75rem' }} />
                      <button type="button" onClick={() => update(i, { links: (p.links ?? []).filter((_, k) => k !== li) })} style={{ ...cell, width: 'auto', cursor: 'pointer', color: '#e66' }}>✕</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => update(i, { links: [...(p.links ?? []), { label: '', url: '' }] })} className="btn" style={{ fontSize: 'var(--fs-xs)', marginTop: '0.25rem' }}>+ Länk</button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button type="button" onClick={add} className="btn" style={{ fontSize: 'var(--fs-sm)', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
        + Lägg till serie
      </button>
    </AdminForm>
  )
}
