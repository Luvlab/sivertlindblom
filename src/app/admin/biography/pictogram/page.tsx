'use client'

import { useState, useEffect } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import type { PictogramSection } from '@/app/api/admin/biography-pictogram/route'

const DEFAULT_INTRO = `Sivert Lindblom har genom sitt konstnärliga arbete konsekvent utforskat formens grundläggande språk — den visuella grammatik som föregår och underbygger all symbolbildning.

Wikipedia återger hans biografi med hjälp av Bliss-symboler: ett piktografiskt system där varje ord ersätts av ett abstrakt tecken. Det oavsiktliga resultatet är slående: Siverts liv tecknas i just det slags symbolspråk han själv har ägnat sin konst åt att undersöka.

Bliss-systemet bygger på logiska, kombinerbara grundformer — cirklar, linjer, pilar, kvadrater — vars mening uppstår i relationen mellan tecknen. Sivert har arbetat på liknande sätt: former som i sig är enkla men som i kombination och kontext bär en tyngd och mångtydighet som inte låter sig reduceras till ett enda budskap.

Att se sin biografi i piktogramform är att möta sig själv som ett grammatiskt ting — ett subjekt vars liv kan kodas om till tecken, utan att meningen försvinner. Det är en påminnelse om att form alltid är mer än dekoration: form är tänkande.`

export default function AdminPictogram() {
  const [title, setTitle] = useState('Om Sivert som ett grammatiskt piktogram')
  const [intro, setIntro] = useState('')
  const [urls, setUrls] = useState<string[]>([])
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [credits, setCredits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/biography-pictogram', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: PictogramSection | { error: string }) => {
        if ('error' in d) { setError(String(d.error)); return }
        setTitle(d.title || 'Om Sivert som ett grammatiskt piktogram')
        setIntro(d.intro || DEFAULT_INTRO)
        setUrls(d.images.map(i => i.url))
        const cm: Record<string, string> = {}
        const rm: Record<string, string> = {}
        for (const i of d.images) {
          if (i.caption) cm[i.url] = i.caption
          if (i.credit) rm[i.url] = i.credit
        }
        setCaptions(cm)
        setCredits(rm)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function mark() { setDirty(true) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      const images = urls.map(url => ({
        url,
        caption: captions[url] || undefined,
        credit: credits[url] || undefined,
      }))
      const res = await fetch('/api/admin/biography-pictogram', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, intro, images }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.error) setError(data.error)
      else { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
    } catch (err) { setError(String(err)) }
    finally { setSaving(false) }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>

  return (
    <AdminForm
      title="Piktogram"
      backHref="/admin/biography"
      backLabel="Biografi"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={1000}
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem', marginBottom: '2rem' }}>
        Siverts biografi återgiven som ett visuellt piktogramsystem (Bliss-symboler, Wikipedia).
        Lägg till bilder, redigera rubrik och inledningstext. Sektionen publiceras på biografisidan när den är klar.
      </p>

      {/* Title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <FieldLabel>Rubrik</FieldLabel>
        <input
          type="text"
          value={title}
          onChange={e => { setTitle(e.target.value); mark() }}
          style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 3, color: 'var(--color-text)', fontSize: 'var(--fs-sm)' }}
        />
      </div>

      {/* Intro text */}
      <div style={{ marginBottom: '1.25rem' }}>
        <FieldLabel>Inledningstext</FieldLabel>
        <textarea
          value={intro}
          rows={12}
          onChange={e => { setIntro(e.target.value); mark() }}
          placeholder="Beskriv konceptet — Siverts formspråk i relation till piktogramsystemet…"
          style={{ width: '100%', padding: '0.6rem 0.75rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 3, color: 'var(--color-text)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>

      {/* Images */}
      <div style={{ marginBottom: '1.25rem' }}>
      <FieldLabel>Bilder</FieldLabel>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>
          Lägg till screenshot från Wikipedia-piktogrammet, fotografier av relaterade verk, och eventuella detaljbilder av Bliss-symbolerna.
          Kredit: <strong>ur Siverts bildarkiv</strong> för Wikipedia-bilderna.
        </p>
        <ImageListEditor
          images={urls}
          onChange={next => { setUrls(next); mark() }}
          captions={captions}
          onCaptionsChange={next => { setCaptions(next); mark() }}
          credits={credits}
          onCreditsChange={next => { setCredits(next); mark() }}
        />
      </div>

      {/* Live preview panel */}
      {(intro || urls.length > 0) && (
        <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 4 }}>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Förhandsgranskning
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-2xl)', marginBottom: '1.25rem' }}>
            {title}
          </h2>
          {intro && (
            <div style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.8, whiteSpace: 'pre-wrap', marginBottom: '2rem', maxWidth: '72ch' }}>
              {intro}
            </div>
          )}
          {urls.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {urls.map((url, i) => (
                <div key={i} style={{ flex: i === urls.length - 1 && urls.length > 1 ? '1 1 100%' : '1 1 calc(50% - 0.5rem)', minWidth: 200 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={captions[url] ?? ''} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 2 }} />
                  {(captions[url] || credits[url]) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem', gap: '1rem' }}>
                      {captions[url] && <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', flex: '1 1 auto' }}>{captions[url]}</p>}
                      {credits[url] && <p style={{ margin: 0, fontSize: 'var(--fs-2xs)', color: 'var(--color-muted)', opacity: 0.6, whiteSpace: 'nowrap', marginLeft: 'auto' }}>{credits[url]}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminForm>
  )
}
