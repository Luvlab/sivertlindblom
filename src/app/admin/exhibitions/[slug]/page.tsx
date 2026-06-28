'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import type { Exhibition, ExhibitionLink, ExhibitionSubpage } from '@/lib/exhibitions-data'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import LinkTextarea from '@/components/admin/LinkTextarea'
import ExhibitionLinksEditor from '@/components/admin/ExhibitionLinksEditor'
import SubpageManager from '@/components/admin/SubpageManager'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditExhibitionPage() {
  return (
    <Suspense fallback={<div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>}>
      <EditExhibitionPageInner />
    </Suspense>
  )
}

function EditExhibitionPageInner() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [form, setForm] = useState<Exhibition | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warnings, setWarnings] = useState<string[]>([])
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/exhibitions/${slug}`)
      .then(r => r.json())
      .then((data: Exhibition | { error: string }) => {
        if ('error' in data) {
          setError(String(data.error))
        } else {
          setForm(data)
        }
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [slug])

  function update(key: keyof Exhibition, value: Exhibition[keyof Exhibition]) {
    setForm(prev => prev ? { ...prev, [key]: value } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError(null)
    setWarnings([])
    try {
      const res = await fetch(`/api/admin/exhibitions/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as (Exhibition & { warnings?: string[] }) | { error: string }
      if ('error' in data) {
        setError(String(data.error))
      } else {
        if (data.warnings?.length) {
          setWarnings(data.warnings)
          // Reflect the stripped links back into the form
          setForm(prev => prev ? { ...prev, url: data.url, links: data.links } : prev)
        }
        setSaved(true)
        setDirty(false)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Dölj utställningen "${form?.title}" från sajten? Posten tas bort från sajten men raderas inte — du kan ta tillbaka den genom att öppna den och spara igen.`)) return
    try {
      const res = await fetch(`/api/admin/exhibitions/${slug}`, { method: 'DELETE' })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.error) {
        setError(data.error)
      } else {
        router.push('/admin/exhibitions')
      }
    } catch (err) {
      setError(String(err))
    }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar...</div>
  if (!form) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: '#f88' }}>{error || 'Hittades inte'}</div>

  return (
    <AdminForm
      title={form.title}
      backHref="/admin/exhibitions"
      backLabel="Utställningar"
      onSave={handleSave}
      onDelete={handleDelete}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      deleteLabel="Dölj utställning"
      maxWidth="none"
    >
      <div>
        <FieldLabel>Titel *</FieldLabel>
        <input type="text" required className="input" value={form.title} onChange={e => update('title', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
        <div>
          <FieldLabel>År *</FieldLabel>
          <input type="number" required className="input" value={form.year} onChange={e => update('year', parseInt(e.target.value))} min={1900} max={2100} />
        </div>
        <div>
          <FieldLabel>Plats</FieldLabel>
          <input type="text" className="input" value={form.location} onChange={e => update('location', e.target.value)} />
        </div>
      </div>

      <div>
        <FieldLabel>Slug (URL-identifierare)</FieldLabel>
        <input type="text" className="input" value={form.slug} onChange={e => update('slug', e.target.value)} />
      </div>

      {warnings.length > 0 && (
        <div style={{ background: '#2a0008', border: '1px solid #c00', padding: '0.85rem 1rem', borderRadius: 2 }}>
          <p style={{ fontSize: 'var(--fs-sm)', color: '#f88', margin: '0 0 0.5rem', fontWeight: 600 }}>⚠ Länkar till gamla sajten togs bort vid sparning:</p>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: 'var(--fs-xs)', color: '#f88' }}>
            {warnings.map((w, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{w}</li>)}
          </ul>
        </div>
      )}

      <div>
        <FieldLabel>Beskrivning</FieldLabel>
        <LinkTextarea
          value={form.description}
          onChange={v => update('description', v)}
          rows={5}
        />
      </div>

      <div>
        <FieldLabel>Brödtext (valfri, visas efter beskrivningen)</FieldLabel>
        <LinkTextarea
          value={form.body ?? ''}
          onChange={v => update('body', v)}
          rows={8}
          hint="Dubbelt radbrytning = nytt stycke. Markera text + 🔗 för intern/extern länk."
        />
      </div>

      <div>
        <FieldLabel>Länkar (texter, recensioner, kataloger, video…)</FieldLabel>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', margin: '0 0 0.6rem' }}>
          Flera länkar tillåtna. Interna sidor börjar med <code>/</code> (t.ex. <code>/texts/…</code>). Inga länkar får gå till gamla sajten (sivertlindblom.se) — importera innehållet som undersida i stället.
        </p>
        <ExhibitionLinksEditor
          links={form.links ?? []}
          onChange={links => update('links', links as ExhibitionLink[])}
        />
      </div>

      <div>
        <FieldLabel>Fotograf (visas under galleriet)</FieldLabel>
        <input type="text" className="input" value={form.photographerCredit ?? ''} onChange={e => update('photographerCredit', e.target.value)} />
      </div>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: 2, padding: '0.85rem 1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={form.showInPublicWorks ?? false}
            onChange={e => update('showInPublicWorks', e.target.checked)}
          />
          <span style={{ fontSize: 'var(--fs-sm)' }}>Visa även under Offentliga arbeten</span>
        </label>
        {form.showInPublicWorks && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.75rem', paddingLeft: '1.6rem' }}>
            <div>
              <FieldLabel>Kategori</FieldLabel>
              <select
                className="input"
                value={form.publicSubcategory ?? 'exterior'}
                onChange={e => update('publicSubcategory', e.target.value as 'exterior' | 'interior')}
              >
                <option value="exterior">Exteriör</option>
                <option value="interior">Interiör</option>
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', alignSelf: 'flex-end', paddingBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={form.publicTemporary ?? false}
                onChange={e => update('publicTemporary', e.target.checked)}
              />
              <span style={{ fontSize: 'var(--fs-sm)' }}>Tillfällig placering (annars permanent)</span>
            </label>
          </div>
        )}
      </div>

      <ImageListEditor
        images={form.images}
        onChange={imgs => update('images', imgs)}
      />

      <div>
        <FieldLabel>Undersidor (interna extrasidor)</FieldLabel>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', margin: '0 0 0.6rem' }}>
          Skapa, redigera och spara extrasidor som hör till projektet. Länka till dem från Länkar ovan med sökvägen <code>/portfolio/exhibitions/{form.slug}/&lt;slug&gt;</code>.
        </p>
        <SubpageManager
          subpages={form.subpages ?? []}
          exhibitionSlug={form.slug}
          onChange={subpages => update('subpages', subpages as ExhibitionSubpage[])}
        />
      </div>
    </AdminForm>
  )
}
