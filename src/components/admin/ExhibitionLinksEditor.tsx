'use client'

import type { ExhibitionLink } from '@/lib/exhibitions-data'
import { isOldSiteUrl } from '@/lib/old-site-guard'

interface Props {
  links: ExhibitionLink[]
  onChange: (links: ExhibitionLink[]) => void
}

const cell: React.CSSProperties = { width: '100%' }

/**
 * Editor for an exhibition's list of links. Each link has a prefix (e.g. "LÄS"),
 * a label, a URL, and an external flag. Internal links (paths starting with "/")
 * are rendered with <Link>; external links open in a new tab.
 *
 * Old-site URLs (sivertlindblom.se) are flagged inline and will be stripped on
 * save — they must be imported as internal sub-pages instead.
 */
export default function ExhibitionLinksEditor({ links, onChange }: Props) {
  function setLink(i: number, patch: Partial<ExhibitionLink>) {
    onChange(links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)))
  }
  function add() {
    onChange([...links, { prefix: '', label: '', url: '', external: false }])
  }
  function remove(i: number) {
    onChange(links.filter((_, idx) => idx !== i))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= links.length) return
    const next = [...links]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {links.map((link, i) => {
        const oldSite = isOldSiteUrl(link.url)
        const isInternal = link.url.startsWith('/')
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${oldSite ? '#c00' : 'var(--color-border)'}`,
              background: oldSite ? '#2a0008' : 'transparent',
              padding: '0.85rem',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.6rem' }}>
              <div>
                <label style={lbl}>Prefix</label>
                <input className="input" style={cell} value={link.prefix ?? ''} placeholder="LÄS" onChange={e => setLink(i, { prefix: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Etikett</label>
                <input className="input" style={cell} value={link.label} placeholder="Beskrivande text" onChange={e => setLink(i, { label: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={lbl}>URL</label>
              <input className="input" style={cell} value={link.url} placeholder="/texts/... eller https://..." onChange={e => setLink(i, { url: e.target.value })} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={link.external === true} onChange={e => setLink(i, { external: e.target.checked })} style={{ accentColor: 'var(--color-accent)' }} />
                Extern länk (öppnas i ny flik)
              </label>
              {isInternal && !oldSite && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)' }}>↪ intern sida</span>}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.4rem' }}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={miniBtn}>↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === links.length - 1} style={miniBtn}>↓</button>
                <button type="button" onClick={() => remove(i)} style={{ ...miniBtn, color: '#c00', borderColor: '#c00' }}>Ta bort</button>
              </div>
            </div>
            {oldSite && (
              <p style={{ fontSize: 'var(--fs-xs)', color: '#f88', margin: 0 }}>
                ⚠ Länk till gamla sajten (sivertlindblom.se). Den tas bort vid sparning. Importera innehållet som en intern undersida nedan och länka dit i stället.
              </p>
            )}
          </div>
        )
      })}
      <button type="button" onClick={add} className="btn" style={{ alignSelf: 'flex-start' }}>+ Lägg till länk</button>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: '0.65rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }
const miniBtn: React.CSSProperties = { background: 'none', border: '1px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer', padding: '0.25em 0.6em', fontSize: 'var(--fs-xs)', borderRadius: 2 }
