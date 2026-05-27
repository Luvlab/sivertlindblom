'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'

declare global {
  interface Window { L: any } // eslint-disable-line @typescript-eslint/no-explicit-any
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

const lbl = (text: string) => (
  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{text}</label>
)

export default function EditMapPinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<Pin | null>(null)
  const [allPins, setAllPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [leafletReady, setLeafletReady] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const formRef = useRef(form)
  formRef.current = form

  const isNew = id === 'new'

  // Poll for Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.L) { setLeafletReady(true); return }
    const t = setInterval(() => { if (window.L) { setLeafletReady(true); clearInterval(t) } }, 100)
    return () => clearInterval(t)
  }, [])

  // Load this pin + all pins for context
  useEffect(() => {
    const loadAll = fetch('/api/admin/map-pins').then(r => r.json())
    const loadOne = isNew
      ? Promise.resolve({ id: '', title: '', year: new Date().getFullYear(), city: '', country: 'Sweden', lat: 59.33, lng: 18.07, type: 'exterior' as const, description: '' })
      : fetch(`/api/admin/map-pins/${id}`).then(r => r.json())

    Promise.all([loadOne, loadAll])
      .then(([one, all]) => {
        if ('error' in one) setError(one.error)
        else setForm(one)
        if (Array.isArray(all)) setAllPins(all)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // Init map once Leaflet + form are ready
  useEffect(() => {
    if (!leafletReady || !form || !mapRef.current || mapInstance.current) return
    const L = window.L

    const map = L.map(mapRef.current, {
      center: [form.lat || 56.5, form.lng || 14.5],
      zoom: form.lat ? 10 : 4,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map)
    mapInstance.current = map

    // Add context pins (all others, small dots)
    allPins
      .filter(p => p.id !== id)
      .forEach(p => {
        const c = TYPE_COLORS[p.type] ?? '#c9a84c'
        const icon = L.divIcon({
          html: `<div style="width:8px;height:8px;background:${c};border:1px solid #0a0a0a;border-radius:50%;opacity:0.5"></div>`,
          className: '', iconSize: [8, 8], iconAnchor: [4, 4],
        })
        const m = L.marker([p.lat, p.lng], { icon })
        m.bindTooltip(`${p.title} (${p.year})`, { direction: 'top', offset: [0, -6], className: 'sculpture-tooltip', opacity: 0.85 })
        m.addTo(map)
      })

    // Active draggable marker
    const activeColor = TYPE_COLORS[form.type] ?? '#c9a84c'
    const activeIcon = L.divIcon({
      html: `<div id="active-pin" style="width:16px;height:16px;background:${activeColor};border:2px solid #fff;border-radius:50%;cursor:grab;box-shadow:0 0 0 3px ${activeColor}60,0 2px 8px rgba(0,0,0,.6)"></div>`,
      className: '', iconSize: [16, 16], iconAnchor: [8, 8],
    })
    const marker = L.marker([form.lat, form.lng], { icon: activeIcon, draggable: true, zIndexOffset: 1000 })
    marker.addTo(map)
    markerRef.current = marker

    // Drag end → update form
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      setForm(prev => prev ? { ...prev, lat: +lat.toFixed(6), lng: +lng.toFixed(6) } : prev)
      setDirty(true)
    })

    // Click on map → move marker + update form
    map.on('click', (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const { lat, lng } = e.latlng
      marker.setLatLng([lat, lng])
      setForm(prev => prev ? { ...prev, lat: +lat.toFixed(6), lng: +lng.toFixed(6) } : prev)
      setDirty(true)
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [leafletReady, form?.lat, form?.lng]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update marker position when lat/lng fields are manually edited
  useEffect(() => {
    if (!markerRef.current || !form) return
    const { lat: mLat, lng: mLng } = markerRef.current.getLatLng()
    if (Math.abs(mLat - form.lat) > 0.0001 || Math.abs(mLng - form.lng) > 0.0001) {
      markerRef.current.setLatLng([form.lat, form.lng])
      mapInstance.current?.panTo([form.lat, form.lng])
    }
  }, [form?.lat, form?.lng])

  function set<K extends keyof Pin>(key: K, val: Pin[K]) {
    setForm(prev => prev ? { ...prev, [key]: val } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError(null)
    try {
      const url = isNew ? '/api/admin/map-pins' : `/api/admin/map-pins/${id}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { ok?: boolean; error?: string; id?: string }
      if (data.ok) {
        setSaved(true); setDirty(false)
        setTimeout(() => setSaved(false), 3000)
        if (isNew && data.id) router.replace(`/admin/map/${data.id}`)
      } else {
        setError(data.error ?? 'Fel vid sparning')
      }
    } catch (e) { setError(String(e)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}" från kartan?`)) return
    await fetch(`/api/admin/map-pins/${id}`, { method: 'DELETE' })
    router.push('/admin/map')
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar…</div>
  if (!form) return <div style={{ padding: '3rem', color: '#f88' }}>{error ?? 'Hittades inte'}</div>

  return (
    <div>
      {/* Leaflet */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin="" onLoad={() => setLeafletReady(true)} strategy="afterInteractive" />
      <style>{`
        .sculpture-tooltip{background:#1a1a1a!important;border:1px solid #3a3a3a!important;color:#e8e8e4!important;font-family:Georgia,serif!important;font-size:11px!important;padding:4px 8px!important;border-radius:2px!important;white-space:nowrap!important;}
        .sculpture-tooltip::before{display:none!important;}
        .leaflet-container{background:#111!important;cursor:crosshair!important;}
        .leaflet-control-attribution{background:rgba(10,10,10,.8)!important;color:#666!important;font-size:10px!important;}
        .leaflet-control-zoom a{background:#1a1a1a!important;color:#e8e8e4!important;border-color:#333!important;}
        .leaflet-control-zoom a:hover{background:#2a2a2a!important;}
      `}</style>

      {/* Sticky toolbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#0a0a0a', borderBottom: '1px solid var(--color-border)',
        padding: '0.75rem 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <Link href="/admin/map" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Karta</Link>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {saved && <span style={{ color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>✓ Sparad</span>}
          {dirty && !saved && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontStyle: 'italic' }}>Osparade ändringar</span>}
          <button form="pin-form" type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Sparar…' : isNew ? 'Skapa nål' : 'Spara nål'}
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem 3rem', maxWidth: 900 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '2rem' }}>
          {isNew ? 'Ny kartnål' : 'Redigera kartnål'}
        </h1>

        {error && (
          <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form id="pin-form" onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Interactive map */}
          <div>
            {lbl('Placera nålen på kartan — klicka för att sätta, dra för att flytta')}
            <div ref={mapRef} style={{
              height: 440,
              background: '#111',
              border: '1px solid var(--color-border)',
              borderRadius: 2,
              overflow: 'hidden',
            }} />
            <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.4rem' }}>
              Koordinater uppdateras automatiskt. Övriga nålar visas som små prickar för referens.
            </p>
          </div>

          {/* Lat / Lng display + manual override */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              {lbl('Latitud')}
              <input
                className="input"
                type="number"
                step="0.000001"
                style={{ width: '100%', fontFamily: 'monospace' }}
                value={form.lat}
                onChange={e => set('lat', Number(e.target.value))}
                required
              />
            </div>
            <div>
              {lbl('Longitud')}
              <input
                className="input"
                type="number"
                step="0.000001"
                style={{ width: '100%', fontFamily: 'monospace' }}
                value={form.lng}
                onChange={e => set('lng', Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            {lbl('Titel')}
            <input className="input" style={{ width: '100%' }} value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              {lbl('År')}
              <input className="input" type="number" style={{ width: '100%' }} value={form.year} onChange={e => set('year', Number(e.target.value))} required />
            </div>
            <div>
              {lbl('Stad')}
              <input className="input" style={{ width: '100%' }} value={form.city} onChange={e => set('city', e.target.value)} />
            </div>
            <div>
              {lbl('Land')}
              <input className="input" style={{ width: '100%' }} value={form.country} onChange={e => set('country', e.target.value)} />
            </div>
            <div>
              {lbl('Typ')}
              <select className="input" style={{ width: '100%' }} value={form.type} onChange={e => set('type', e.target.value as Pin['type'])}>
                <option value="exterior">Exteriör</option>
                <option value="interior">Interiör</option>
                <option value="metro">T-bana</option>
              </select>
            </div>
          </div>

          <div>
            {lbl('Slug (länk till detaljsida, valfri)')}
            <input className="input" style={{ width: '100%' }} value={form.slug ?? ''} onChange={e => set('slug', e.target.value)} placeholder="t.ex. blasieholmstorg-1989" />
          </div>

          <div>
            {lbl('Beskrivning')}
            <textarea className="input" rows={3} style={{ width: '100%', resize: 'vertical' }} value={form.description ?? ''} onChange={e => set('description', e.target.value)} />
          </div>

          {!isNew && (
            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                onClick={handleDelete}
                style={{ background: 'none', border: '1px solid #c00', color: '#c00', cursor: 'pointer', padding: '0.5em 1em', fontSize: 'var(--fs-xs)' }}
              >
                Radera nål
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
