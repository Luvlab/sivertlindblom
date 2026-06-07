'use client'

import { useState } from 'react'
import type { ExhibitionSubpage } from '@/lib/exhibitions-data'
import ImageListEditor from '@/components/admin/ImageListEditor'
import LinkTextarea from '@/components/admin/LinkTextarea'

interface Props {
  subpages: ExhibitionSubpage[]
  /** Parent exhibition slug — used to show the resulting internal link path. */
  exhibitionSlug: string
  onChange: (subpages: ExhibitionSubpage[]) => void
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }

/** Extract an 11-char YouTube video id from common URL shapes (watch, youtu.be, embed, shorts). */
function ytId(url: string): string | null {
  const m = (url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

/**
 * CRUD manager for an exhibition's internal "extra pages" (sub-pages). Each
 * sub-page holds re-hosted content (title, body, images) that used to live on
 * the old WordPress site, so internal links can point here instead of off-site.
 */
export default function SubpageManager({ subpages, exhibitionSlug, onChange }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function setSub(i: number, patch: Partial<ExhibitionSubpage>) {
    onChange(subpages.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }
  function add() {
    onChange([...subpages, { slug: '', title: '', body: '', images: [], sortOrder: subpages.length, published: true }])
    setOpenIdx(subpages.length)
  }
  function remove(i: number) {
    if (!confirm('Ta bort den här undersidan? Innehållet raderas vid sparning.')) return
    onChange(subpages.filter((_, idx) => idx !== i))
    setOpenIdx(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {subpages.map((sp, i) => {
        const open = openIdx === i
        const effSlug = sp.slug?.trim() || slugify(sp.title) || 'sida'
        const path = `/portfolio/exhibitions/${exhibitionSlug}/${effSlug}`
        return (
          <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.85rem' }}>
              <button type="button" onClick={() => setOpenIdx(open ? null : i)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', fontSize: 'var(--fs-sm)', flex: 1, textAlign: 'left' }}>
                {open ? '▾' : '▸'} {sp.title || '(namnlös undersida)'}
                <span style={{ display: 'block', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.15rem' }}>{path} · {sp.images.length} bilder</span>
              </button>
              {sp.published === false && <span style={{ fontSize: 'var(--fs-xs)', color: '#f0a' }}>dold</span>}
              <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.25em 0.6em', fontSize: 'var(--fs-xs)', borderRadius: 2 }}>Ta bort</button>
            </div>
            {open && (
              <div style={{ borderTop: '1px solid var(--color-border)', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={lbl}>Titel</label>
                    <input className="input" style={{ width: '100%' }} value={sp.title} onChange={e => setSub(i, { title: e.target.value })} />
                  </div>
                  <div>
                    <label style={lbl}>Slug</label>
                    <input className="input" style={{ width: '100%' }} value={sp.slug} placeholder={slugify(sp.title)} onChange={e => setSub(i, { slug: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={lbl}>Brödtext</label>
                  <LinkTextarea value={sp.body} onChange={v => setSub(i, { body: v })} rows={8} hint="Dubbelt radbrytning = nytt stycke." />
                </div>
                <div>
                  <label style={lbl}>Video (YouTube-URL, valfri)</label>
                  <input className="input" style={{ width: '100%' }} value={sp.videoUrl ?? ''} placeholder="https://youtu.be/…" onChange={e => setSub(i, { videoUrl: e.target.value })} />
                  {(() => {
                    const vid = ytId(sp.videoUrl ?? '')
                    if (vid) {
                      return (
                        <div style={{ marginTop: '0.6rem' }}>
                          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>✓ Förhandsvisning</span>
                          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2, marginTop: '0.35rem', maxWidth: 480, background: '#000' }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${vid}`}
                              title="Förhandsvisning av film"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            />
                          </div>
                        </div>
                      )
                    }
                    if ((sp.videoUrl ?? '').trim()) {
                      return (
                        <p style={{ fontSize: 'var(--fs-xs)', color: '#f0a', marginTop: '0.4rem' }}>
                          Ogiltig YouTube-URL — klistra in t.ex. https://youtu.be/XXXXXXXXXXX eller https://www.youtube.com/watch?v=XXXXXXXXXXX
                        </p>
                      )
                    }
                    return null
                  })()}
                </div>
                <div>
                  <label style={lbl}>Bilder</label>
                  <ImageListEditor images={sp.images} onChange={imgs => setSub(i, { images: imgs })} label="Undersidans bilder" />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={sp.published !== false} onChange={e => setSub(i, { published: e.target.checked })} style={{ accentColor: 'var(--color-accent)' }} />
                  Publicerad (synlig på sajten)
                </label>
              </div>
            )}
          </div>
        )
      })}
      <button type="button" onClick={add} className="btn" style={{ alignSelf: 'flex-start' }}>+ Ny undersida</button>
    </div>
  )
}
