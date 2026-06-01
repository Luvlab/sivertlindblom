'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

declare global {
  interface Window { L: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface WorkEntry {
  title: string
  year: string
  location: string
  slug?: string
  category: 'exterior' | 'interior' | 'scenography'
  lat?: number | null
  lng?: number | null
  images?: { url: string; alt: string }[]
}

function Thumb({ src }: { src?: string }) {
  if (!src) {
    return (
      <div style={{ width: 48, height: 48, borderRadius: 2, background: 'var(--color-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 18, opacity: 0.2 }}>□</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      style={{ display: 'block', width: 48, height: 48, objectFit: 'cover', borderRadius: 2, background: 'var(--color-bg-card)' }}
      onError={ev => { (ev.target as HTMLImageElement).style.visibility = 'hidden' }}
    />
  )
}

export default function AdminPublicWorks() {
  const router = useRouter()
  const [works, setWorks] = useState<WorkEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [leafletReady, setLeafletReady] = useState(false)

  // Callback ref for map container
  const [mapEl, setMapEl] = useState<HTMLDivElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null)
  const worksRef = useRef<WorkEntry[]>([])

  // Poll for Leaflet (cached script case)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.L) { setLeafletReady(true); return }
    const t = setInterval(() => { if (window.L) { setLeafletReady(true); clearInterval(t) } }, 100)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    fetch('/api/admin/public-works')
      .then(r => r.json())
      .then((d: WorkEntry[] | { error: string }) => {
        if (!('error' in d)) {
          setWorks(d)
          worksRef.current = d
        }
      })
      .finally(() => setLoading(false))
  }, [])

  // Keep ref in sync
  useEffect(() => { worksRef.current = works }, [works])

  // Init overview map
  useEffect(() => {
    if (!leafletReady || !mapEl || mapInstance.current) return
    const L = window.L

    const map = L.map(mapEl, { center: [59.3, 18.07], zoom: 5, zoomControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map)
    mapInstance.current = map
    requestAnimationFrame(() => map.invalidateSize())

    // Place pins for all works with coordinates
    const withCoords = worksRef.current.filter(w => typeof w.lat === 'number' && typeof w.lng === 'number')
    withCoords.forEach(w => {
      const icon = L.divIcon({
        html: `<div style="width:14px;height:14px;background:#2bbcd4;border:2px solid #fff;border-radius:50%;cursor:pointer;box-shadow:0 0 0 3px rgba(43,188,212,.4),0 2px 8px rgba(0,0,0,.6)"></div>`,
        className: '', iconSize: [14, 14], iconAnchor: [7, 7],
      })
      const marker = L.marker([w.lat!, w.lng!], { icon, title: w.title })
      marker.addTo(map)
      L.circle([w.lat!, w.lng!], { radius: 500, color: '#2bbcd4', fillColor: '#2bbcd4', fillOpacity: 0.07, weight: 1, opacity: 0.2, interactive: false }).addTo(map)
      if (w.slug) {
        marker.on('click', () => router.push(`/admin/public-works/${w.slug}`))
      }
      marker.bindTooltip(w.title, { permanent: false, direction: 'top', offset: [0, -10] })
    })

    if (withCoords.length > 0) {
      const bounds = L.latLngBounds(withCoords.map(w => [w.lat!, w.lng!]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
    }

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [leafletReady, mapEl]) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = works.filter(w =>
    !filter || w.title.toLowerCase().includes(filter.toLowerCase()) || w.location.toLowerCase().includes(filter.toLowerCase())
  )

  function addEntry(category: 'exterior' | 'interior') {
    setWorks(prev => [...prev, { title: 'Ny post', year: String(new Date().getFullYear()), location: '', category }])
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/public-works', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(works),
      })
      const data = await res.json() as { error?: string; message?: string }
      if (res.ok && !data.error) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
      else setError(data.error ?? data.message ?? 'Fel')
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  const thStyle: React.CSSProperties = {
    padding: '0.6rem 0.75rem 0.6rem 0', color: 'var(--color-muted)', fontWeight: 400,
    textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem', textAlign: 'left',
  }

  function renderRows(list: (WorkEntry & { _idx: number })[]) {
    return list.map(w => (
      <tr key={w._idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
        <td style={{ padding: '0.5rem 0.75rem 0.5rem 0', width: 56 }}>
          <Thumb src={w.images?.[0]?.url} />
        </td>
        <td style={{ padding: '0.75rem 0.75rem 0.75rem 0', fontSize: 'var(--fs-sm)' }}>
          {w.title}
          {w.lat && w.lng && (
            <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', color: 'var(--color-accent)', opacity: 0.7 }} title={`${w.lat.toFixed(4)}, ${w.lng.toFixed(4)}`}>📍</span>
          )}
        </td>
        <td style={{ padding: '0.75rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{w.year}</td>
        <td style={{ padding: '0.75rem', color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{w.location || '—'}</td>
        <td style={{ padding: '0.75rem 0 0.75rem 0.75rem' }}>
          {w.slug
            ? (
              <Link href={`/admin/public-works/${w.slug}`}>
                <button className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em' }}>Redigera</button>
              </Link>
            ) : (
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>ingen slug</span>
            )
          }
        </td>
      </tr>
    ))
  }

  const worksWithIdx = works.map((w, i) => ({ ...w, _idx: i }))
  const filteredWithIdx = filtered.map(w => ({ ...w, _idx: works.indexOf(w) }))

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin="" strategy="afterInteractive" onLoad={() => setLeafletReady(true)} />
      <style>{`
        .leaflet-container{background:#111!important;cursor:default!important;}
        .leaflet-control-attribution{background:rgba(10,10,10,.8)!important;color:#666!important;font-size:10px!important;}
        .leaflet-control-zoom a{background:#1a1a1a!important;color:#e8e8e4!important;border-color:#333!important;}
        .leaflet-control-zoom a:hover{background:#2a2a2a!important;}
        .leaflet-tooltip{background:#1a1a1a!important;border:1px solid #333!important;color:#e8e8e4!important;font-size:11px!important;padding:3px 8px!important;}
        .leaflet-tooltip-top:before{border-top-color:#333!important;}
      `}</style>

      <div style={{ padding: 'clamp(1rem, 3vw, 3rem)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Offentliga arbeten</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
              {works.length} poster · {works.filter(w => w.lat && w.lng).length} med koordinater
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
            {error && <span style={{ color: '#f88', fontSize: 'var(--fs-sm)' }}>{error}</span>}
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Sparar…' : 'Spara alla ändringar'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <input type="search" className="input" placeholder="Filtrera…" value={filter}
            onChange={e => setFilter(e.target.value)} style={{ maxWidth: 300 }} />
        </div>

        {loading ? <p style={{ color: 'var(--color-muted)' }}>Laddar…</p> : (
          <>
            {/* Exteriors */}
            <section style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)' }}>Exteriörer</h2>
                <button className="btn" style={{ fontSize: '0.7rem' }} onClick={() => addEntry('exterior')}>+ Lägg till</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ ...thStyle, width: 56 }}></th>
                    <th style={thStyle}>Titel</th>
                    <th style={{ ...thStyle, width: 80 }}>År</th>
                    <th style={thStyle}>Plats</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>{renderRows(filteredWithIdx.filter(w => w.category === 'exterior'))}</tbody>
              </table>
            </section>

            {/* Interiors */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)' }}>Interiörer</h2>
                <button className="btn" style={{ fontSize: '0.7rem' }} onClick={() => addEntry('interior')}>+ Lägg till</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ ...thStyle, width: 56 }}></th>
                    <th style={thStyle}>Titel</th>
                    <th style={{ ...thStyle, width: 80 }}>År</th>
                    <th style={thStyle}>Plats</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>{renderRows(filteredWithIdx.filter(w => w.category === 'interior'))}</tbody>
              </table>
            </section>
          </>
        )}

        {/* ── Overview map — always last, after all works ── */}
        {!loading && (
          <div style={{ marginTop: '3rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', marginBottom: '2rem' }} />
            <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              Karta — klicka på en nål för att redigera
            </p>
            <div ref={setMapEl} style={{
              height: 420, width: '100%', background: '#111',
              border: '1px solid var(--color-border)', borderRadius: 2, overflow: 'hidden',
            }} />
          </div>
        )}
      </div>
    </>
  )
}
