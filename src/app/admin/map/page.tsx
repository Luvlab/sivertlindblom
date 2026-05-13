'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any
  }
}

interface Pin {
  id: string
  title: string
  year: number
  city: string
  country: string
  lat: number
  lng: number
  type: 'exterior' | 'interior' | 'metro'
  slug?: string
  description?: string
}

const TYPE_COLORS: Record<string, string> = {
  exterior: '#c9a84c',
  interior: '#7a8fa6',
  metro: '#a084c9',
}

export default function AdminMap() {
  const [pins, setPins] = useState<Pin[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'map' | 'list'>('map')
  const [leafletReady, setLeafletReady] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null)
  const scriptsLoaded = useRef(0)

  const handleScriptLoad = () => {
    scriptsLoaded.current++
    if (scriptsLoaded.current >= 1) setLeafletReady(true)
  }

  // Poll for Leaflet if already cached
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.L) { setLeafletReady(true); return }
    const id = setInterval(() => { if (window.L) { setLeafletReady(true); clearInterval(id) } }, 100)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    fetch('/api/admin/map-pins')
      .then(r => r.json())
      .then((d: Pin[] | { error: string }) => { if (!('error' in d)) setPins(d) })
      .finally(() => setLoading(false))
  }, [])

  // Init/update Leaflet map
  useEffect(() => {
    if (!leafletReady || !mapRef.current || view !== 'map' || !pins.length) return
    const L = window.L
    if (!L) return

    if (!mapInstance.current) {
      const map = L.map(mapRef.current, { center: [56.5, 14.5], zoom: 4, zoomControl: true })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap', maxZoom: 19,
      }).addTo(map)
      mapInstance.current = map
    }

    // Clear and re-add all markers
    mapInstance.current.eachLayer((layer: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (layer._latlng) mapInstance.current.removeLayer(layer)
    })

    const bounds: [number, number][] = []
    pins.forEach(p => {
      const color = TYPE_COLORS[p.type] ?? '#c9a84c'
      const icon = L.divIcon({
        html: `<div style="width:10px;height:10px;background:${color};border:2px solid #0a0a0a;border-radius:50%;cursor:pointer;box-shadow:0 0 0 2px ${color}60"></div>`,
        className: '', iconSize: [10, 10], iconAnchor: [5, 5],
      })
      const marker = L.marker([p.lat, p.lng], { icon })
      marker.bindTooltip(`<b>${p.title}</b><br>${p.city}, ${p.country} (${p.year})`, {
        direction: 'top', offset: [0, -8], className: 'sculpture-tooltip', opacity: 0.95,
      })
      marker.addTo(mapInstance.current)
      bounds.push([p.lat, p.lng])
    })

    if (bounds.length > 1) {
      mapInstance.current.fitBounds(bounds, { padding: [40, 40] })
    }
  }, [leafletReady, pins, view])

  // Destroy map when switching to list
  useEffect(() => {
    if (view === 'list' && mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }
  }, [view])

  const filtered = pins.filter(p =>
    !filter || p.title.toLowerCase().includes(filter.toLowerCase()) || p.city.toLowerCase().includes(filter.toLowerCase())
  )

  const thStyle: React.CSSProperties = {
    padding: '0.75rem 0.75rem 0.75rem 0',
    color: 'var(--color-muted)', fontWeight: 400,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    fontSize: '0.7rem', textAlign: 'left', whiteSpace: 'nowrap',
  }

  const typeCounts = pins.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1; return acc
  }, {})

  return (
    <div style={{ padding: '3rem' }}>
      {/* Leaflet */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin="" onLoad={handleScriptLoad} strategy="afterInteractive" />

      <style>{`
        .sculpture-tooltip { background:#1a1a1a!important;border:1px solid #3a3a3a!important;color:#e8e8e4!important;font-family:Georgia,serif!important;font-size:11px!important;padding:4px 8px!important;border-radius:2px!important;box-shadow:0 2px 8px rgba(0,0,0,.5)!important;white-space:nowrap!important; }
        .sculpture-tooltip::before { display:none!important; }
        .leaflet-container { background:#111!important;font-family:Georgia,serif; }
        .leaflet-control-attribution { background:rgba(10,10,10,.8)!important;color:#666!important;font-size:10px!important; }
        .leaflet-control-zoom a { background:#1a1a1a!important;color:#e8e8e4!important;border-color:#333!important; }
        .leaflet-control-zoom a:hover { background:#2a2a2a!important; }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>Karta — Platser</h1>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
            {pins.length} kartnålar
            {Object.entries(typeCounts).map(([t, n]) => (
              <span key={t} style={{ marginLeft: '1rem' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[t], marginRight: '0.3rem', verticalAlign: 'middle' }} />
                {t} {n}
              </span>
            ))}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* View toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 1, overflow: 'hidden' }}>
            {(['map', 'list'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: '0.4rem 1rem', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.08em',
                background: view === v ? 'var(--color-accent)' : 'transparent',
                color: view === v ? '#0a0a0a' : 'var(--color-muted)',
                border: 'none', cursor: 'pointer',
              }}>{v === 'map' ? '⊕ Karta' : '≡ Lista'}</button>
            ))}
          </div>
          <Link href="/admin/map/new">
            <button className="btn btn-primary">+ Ny kartnål</button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input type="search" className="input" placeholder="Sök titel, stad…" value={filter}
          onChange={e => setFilter(e.target.value)} style={{ maxWidth: 300 }} />
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : view === 'map' ? (
        <>
          {/* Leaflet map */}
          <div ref={mapRef} style={{
            height: 520, background: '#111', borderRadius: 2, overflow: 'hidden',
            border: '1px solid var(--color-border)', marginBottom: '1.5rem',
          }} />
          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.5rem' }}>
            {Object.entries(TYPE_COLORS).map(([t, c]) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
                {t} ({typeCounts[t] ?? 0})
              </span>
            ))}
          </div>
        </>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={thStyle}>Titel</th>
                <th style={thStyle}>År</th>
                <th style={thStyle}>Stad</th>
                <th style={thStyle}>Land</th>
                <th style={thStyle}>Typ</th>
                <th style={thStyle}>Lat</th>
                <th style={thStyle}>Lng</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-bg-card)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.8rem 0.75rem 0.8rem 0' }}>{p.title}</td>
                  <td style={{ padding: '0.8rem 0.75rem', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{p.year}</td>
                  <td style={{ padding: '0.8rem 0.75rem', color: 'var(--color-muted)' }}>{p.city}</td>
                  <td style={{ padding: '0.8rem 0.75rem', color: 'var(--color-muted)' }}>{p.country}</td>
                  <td style={{ padding: '0.8rem 0.75rem' }}>
                    <span className="badge" style={{ color: TYPE_COLORS[p.type] }}>{p.type}</span>
                  </td>
                  <td style={{ padding: '0.8rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-muted)' }}>{p.lat.toFixed(4)}</td>
                  <td style={{ padding: '0.8rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-muted)' }}>{p.lng.toFixed(4)}</td>
                  <td style={{ padding: '0.8rem 0 0.8rem 0.75rem' }}>
                    <Link href={`/admin/map/${p.id}`}>
                      <button className="btn" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em' }}>Redigera</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-muted)' }}>Inga platser hittades.</p>
          )}
        </div>
      )}
    </div>
  )
}
