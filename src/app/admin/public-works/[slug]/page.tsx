'use client'

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import type { PublicWork } from '@/lib/public-works'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import LinkTextarea from '@/components/admin/LinkTextarea'

declare global {
  interface Window { L: any } // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditPublicWorkPage({ params }: Props) {
  const { slug } = use(params)
  const router = useRouter()
  const [form, setForm] = useState<PublicWork | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [leafletReady, setLeafletReady] = useState(false)

  // Callback ref — triggers map init the moment the div mounts
  const [mapEl, setMapEl] = useState<HTMLDivElement | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null)

  // Poll for Leaflet (cached script case)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.L) { setLeafletReady(true); return }
    const t = setInterval(() => { if (window.L) { setLeafletReady(true); clearInterval(t) } }, 100)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    fetch(`/api/admin/public-works/${slug}`)
      .then(r => r.json())
      .then((data: PublicWork | { error: string }) => {
        if ('error' in data) setError(String(data.error))
        else setForm(data)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [slug])

  // ── Init map once all three are ready ──────────────────────────────────
  useEffect(() => {
    if (!leafletReady || !form || !mapEl || mapInstance.current) return
    const L = window.L

    const hasCoords = typeof form.lat === 'number' && typeof form.lng === 'number'
    const map = L.map(mapEl, {
      center: hasCoords ? [form.lat!, form.lng!] : [59.3, 18.07],
      zoom: hasCoords ? 12 : 5,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 19,
    }).addTo(map)
    mapInstance.current = map
    requestAnimationFrame(() => map.invalidateSize())

    // Active marker only if coords exist
    if (hasCoords) {
      const icon = L.divIcon({
        html: `<div style="width:16px;height:16px;background:#c9a84c;border:2px solid #fff;border-radius:50%;cursor:grab;box-shadow:0 0 0 3px rgba(201,168,76,.4),0 2px 8px rgba(0,0,0,.6)"></div>`,
        className: '', iconSize: [16, 16], iconAnchor: [8, 8],
      })
      const marker = L.marker([form.lat!, form.lng!], { icon, draggable: true, zIndexOffset: 1000 })
      marker.addTo(map)
      markerRef.current = marker
      marker.on('dragend', () => {
        const { lat, lng } = marker.getLatLng()
        setForm(prev => prev ? { ...prev, lat: +lat.toFixed(6), lng: +lng.toFixed(6) } : prev)
        setDirty(true)
      })
    }

    // Click to place / move marker
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng
      const L = window.L
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        const icon = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#c9a84c;border:2px solid #fff;border-radius:50%;cursor:grab;box-shadow:0 0 0 3px rgba(201,168,76,.4),0 2px 8px rgba(0,0,0,.6)"></div>`,
          className: '', iconSize: [16, 16], iconAnchor: [8, 8],
        })
        const marker = L.marker([lat, lng], { icon, draggable: true, zIndexOffset: 1000 })
        marker.addTo(map)
        markerRef.current = marker
        marker.on('dragend', () => {
          const { lat: la, lng: ln } = marker.getLatLng()
          setForm(prev => prev ? { ...prev, lat: +la.toFixed(6), lng: +ln.toFixed(6) } : prev)
          setDirty(true)
        })
      }
      setForm(prev => prev ? { ...prev, lat: +lat.toFixed(6), lng: +lng.toFixed(6) } : prev)
      setDirty(true)
    })

    return () => {
      map.remove()
      mapInstance.current = null
      markerRef.current = null
    }
  }, [leafletReady, mapEl, form !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync marker to lat/lng fields
  useEffect(() => {
    if (!markerRef.current || !form?.lat || !form?.lng) return
    const { lat: mLat, lng: mLng } = markerRef.current.getLatLng()
    if (Math.abs(mLat - form.lat) > 0.0001 || Math.abs(mLng - form.lng) > 0.0001) {
      markerRef.current.setLatLng([form.lat, form.lng])
      mapInstance.current?.panTo([form.lat, form.lng])
    }
  }, [form?.lat, form?.lng])

  function update(key: keyof PublicWork, value: PublicWork[keyof PublicWork]) {
    setForm(prev => prev ? { ...prev, [key]: value } : prev)
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/public-works/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as PublicWork | { error: string }
      if ('error' in data) setError(String(data.error))
      else { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
    } catch (err) { setError(String(err)) }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm(`Radera "${form?.title}"? Detta kan inte ångras.`)) return
    try {
      const res = await fetch(`/api/admin/public-works/${slug}`, { method: 'DELETE' })
      const data = await res.json() as { ok: boolean; error?: string }
      if (data.error) setError(data.error)
      else router.push('/admin/public-works')
    } catch (err) { setError(String(err)) }
  }

  if (loading) return <div style={{ padding: '3rem', color: 'var(--color-muted)' }}>Laddar...</div>
  if (!form) return <div style={{ padding: '3rem', color: '#f88' }}>{error || 'Hittades inte'}</div>

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin="" strategy="afterInteractive" onLoad={() => setLeafletReady(true)} />
      <style>{`
        .leaflet-container{background:#111!important;cursor:crosshair!important;}
        .leaflet-control-attribution{background:rgba(10,10,10,.8)!important;color:#666!important;font-size:10px!important;}
        .leaflet-control-zoom a{background:#1a1a1a!important;color:#e8e8e4!important;border-color:#333!important;}
        .leaflet-control-zoom a:hover{background:#2a2a2a!important;}
        .pw-editor-grid { display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:start; }
        @media(max-width:800px){ .pw-editor-grid { grid-template-columns:1fr; } }
      `}</style>

      <AdminForm
        title={form.title}
        backHref="/admin/public-works"
        backLabel="Offentliga arbeten"
        onSave={handleSave}
        onDelete={handleDelete}
        saving={saving}
        saved={saved}
        error={error}
        dirty={dirty}
        deleteLabel="Radera verk"
      >
        <div className="pw-editor-grid">

          {/* ── Left: text fields ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div>
              <FieldLabel>Titel *</FieldLabel>
              <input type="text" required className="input" style={{ width: '100%' }}
                value={form.title} onChange={e => update('title', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <FieldLabel>År</FieldLabel>
                <input type="text" className="input" style={{ width: '100%' }}
                  value={form.year} onChange={e => update('year', e.target.value)}
                  placeholder="1989 eller 1987–91" />
              </div>
              <div>
                <FieldLabel>Plats</FieldLabel>
                <input type="text" className="input" style={{ width: '100%' }}
                  value={form.location} onChange={e => update('location', e.target.value)} />
              </div>
              <div>
                <FieldLabel>Kategori</FieldLabel>
                <select className="input" style={{ width: '100%' }}
                  value={form.category} onChange={e => update('category', e.target.value as 'exterior' | 'interior')}>
                  <option value="exterior">Exteriör</option>
                  <option value="interior">Interiör</option>
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Slug (URL)</FieldLabel>
              <input type="text" className="input" style={{ width: '100%' }}
                value={form.slug} onChange={e => update('slug', e.target.value)} />
            </div>

            <div>
              <FieldLabel>Kort beskrivning</FieldLabel>
              <textarea className="input" rows={3} style={{ width: '100%', resize: 'vertical' }}
                value={form.description} onChange={e => update('description', e.target.value)}
                placeholder="Visas i meta och eventuellt i listvy" />
            </div>

            <div>
              <FieldLabel>Brödtext (svenska)</FieldLabel>
              <LinkTextarea
                value={form.body ?? ''}
                onChange={v => update('body', v)}
                rows={6}
                placeholder="Längre beskrivning — visas på detaljsidan"
                hint="Markera text + 🔗 Länk för att infoga hyperlänk."
              />
            </div>

          </div>

          {/* ── Right: map + coordinates ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                Plats på karta — klicka för att placera, dra för att flytta
              </label>
              <div ref={setMapEl} style={{
                height: 380, width: '100%', background: '#111',
                border: '1px solid var(--color-border)', borderRadius: 2, overflow: 'hidden',
              }} />
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.35rem' }}>
                {form.lat && form.lng
                  ? `${form.lat.toFixed(5)}, ${form.lng.toFixed(5)}`
                  : 'Ingen position satt — klicka på kartan för att placera'}
              </p>
            </div>

            {/* Manual coord inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Latitud</label>
                <input className="input" type="number" step="0.000001" style={{ width: '100%', fontFamily: 'monospace' }}
                  value={form.lat ?? ''} onChange={e => update('lat', e.target.value ? Number(e.target.value) : null)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Longitud</label>
                <input className="input" type="number" step="0.000001" style={{ width: '100%', fontFamily: 'monospace' }}
                  value={form.lng ?? ''} onChange={e => update('lng', e.target.value ? Number(e.target.value) : null)} />
              </div>
            </div>
          </div>

        </div>{/* /pw-editor-grid */}

        {/* Images — full width below the two columns */}
        <ImageListEditor
          images={form.images.map(img => (typeof img === 'string' ? img : img.url))}
          onChange={urls => update('images', urls.map(url => ({ url, alt: '' })))}
        />

      </AdminForm>
    </>
  )
}
