'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { SculptureLocation } from '@/lib/sculpture-locations'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any
  }
}

interface Props {
  locations: SculptureLocation[]
  locale: string
}

const TYPE_COLORS: Record<string, string> = {
  exterior: '#c9a84c',
  interior: '#7a8fa6',
  metro: '#a084c9',
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  exterior: { sv: 'Utomhus', en: 'Exterior', de: 'Außen', fr: 'Extérieur', es: 'Exterior', it: 'Esterno', zh: '室外', ja: '屋外', ar: 'خارجي', pt: 'Exterior', ru: 'Снаружи', nl: 'Buiten', pl: 'Zewnętrzne', ko: '외부', th: 'ภายนอก' },
  interior: { sv: 'Inomhus', en: 'Interior', de: 'Innen', fr: 'Intérieur', es: 'Interior', it: 'Interno', zh: '室内', ja: '屋内', ar: 'داخلي', pt: 'Interior', ru: 'Внутри', nl: 'Binnen', pl: 'Wewnętrzne', ko: '내부', th: 'ภายใน' },
  metro: { sv: 'Tunnelbana', en: 'Metro', de: 'U-Bahn', fr: 'Métro', es: 'Metro', it: 'Metro', zh: '地铁', ja: '地下鉄', ar: 'مترو', pt: 'Metro', ru: 'Метро', nl: 'Metro', pl: 'Metro', ko: '지하철', th: 'รถไฟใต้ดิน' },
}

export default function SculptureMap({ locations, locale }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null)
  const [leafletReady, setLeafletReady] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstance.current) return

    const L = window.L
    if (!L) return

    // Init map centered on Stockholm
    const map = L.map(mapRef.current, {
      center: [54.0, 14.0],
      zoom: 4,
      zoomControl: true,
    })

    // OpenStreetMap tiles (free, no API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    mapInstance.current = map

    // Add markers
    locations.forEach((loc) => {
      const color = TYPE_COLORS[loc.type] ?? '#c9a84c'

      const icon = L.divIcon({
        html: `<div style="
          width:14px;height:14px;
          background:${color};
          border:2px solid #0a0a0a;
          border-radius:50%;
          cursor:pointer;
          box-shadow:0 0 0 1px ${color}40;
        "></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })

      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(map)

      const typeLabel = TYPE_LABELS[loc.type]?.[locale] ?? loc.type
      marker.bindPopup(`
        <div style="font-family:Georgia,serif;min-width:200px">
          <div style="font-size:11px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">
            ${loc.year} · ${typeLabel}
          </div>
          <div style="font-size:14px;line-height:1.4;margin-bottom:6px;font-weight:500">${loc.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:${loc.description ? '8px' : '0'}">${loc.city}, ${loc.country}</div>
          ${loc.description ? `<div style="font-size:12px;color:#aaa;line-height:1.5;border-top:1px solid #333;padding-top:8px">${loc.description}</div>` : ''}
        </div>
      `, {
        maxWidth: 280,
        className: 'sculpture-popup',
      })
    })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [leafletReady, locations, locale])

  // Re-filter markers when selectedType changes
  useEffect(() => {
    if (!mapInstance.current) return
    const L = window.L
    if (!L) return

    // Remove all layers except tile layer and re-add filtered
    mapInstance.current.eachLayer((layer: unknown) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((layer as any)._url === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mapInstance.current.removeLayer(layer as any)
      }
    })

    const filtered = selectedType ? locations.filter((l) => l.type === selectedType) : locations

    filtered.forEach((loc) => {
      const color = TYPE_COLORS[loc.type] ?? '#c9a84c'
      const icon = L.divIcon({
        html: `<div style="
          width:14px;height:14px;
          background:${color};
          border:2px solid #0a0a0a;
          border-radius:50%;
          cursor:pointer;
          box-shadow:0 0 0 1px ${color}40;
        "></div>`,
        className: '',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      const typeLabel = TYPE_LABELS[loc.type]?.[locale] ?? loc.type
      const marker = L.marker([loc.lat, loc.lng], { icon }).addTo(mapInstance.current)
      marker.bindPopup(`
        <div style="font-family:Georgia,serif;min-width:200px">
          <div style="font-size:11px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">
            ${loc.year} · ${typeLabel}
          </div>
          <div style="font-size:14px;line-height:1.4;margin-bottom:6px;font-weight:500">${loc.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:${loc.description ? '8px' : '0'}">${loc.city}, ${loc.country}</div>
          ${loc.description ? `<div style="font-size:12px;color:#aaa;line-height:1.5;border-top:1px solid #333;padding-top:8px">${loc.description}</div>` : ''}
        </div>
      `, { maxWidth: 280, className: 'sculpture-popup' })
    })
  }, [selectedType, locations, locale])

  const types = ['exterior', 'interior', 'metro']

  return (
    <div>
      {/* Leaflet CSS + JS via CDN */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        crossOrigin=""
        onLoad={() => setLeafletReady(true)}
        strategy="afterInteractive"
      />

      {/* Type filter */}
      <div style={{ padding: '0 3rem 1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedType(null)}
          style={{
            fontSize: 'var(--fs-xs)',
            padding: '0.35rem 0.9rem',
            border: '1px solid',
            borderColor: selectedType === null ? 'var(--color-accent)' : 'var(--color-border)',
            background: selectedType === null ? 'var(--color-accent)' : 'transparent',
            color: selectedType === null ? '#0a0a0a' : 'var(--color-muted)',
            borderRadius: 1,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {locale === 'sv' ? 'Alla' : locale === 'th' ? 'ทั้งหมด' : 'All'}
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type === selectedType ? null : type)}
            style={{
              fontSize: 'var(--fs-xs)',
              padding: '0.35rem 0.9rem',
              border: '1px solid',
              borderColor: selectedType === type ? TYPE_COLORS[type] : 'var(--color-border)',
              background: selectedType === type ? TYPE_COLORS[type] : 'transparent',
              color: selectedType === type ? '#0a0a0a' : 'var(--color-muted)',
              borderRadius: 1,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLORS[type], display: 'inline-block' }} />
            {TYPE_LABELS[type]?.[locale] ?? type}
          </button>
        ))}
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          height: 520,
          background: '#111',
          margin: '0 3rem',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      />

      <style>{`
        .sculpture-popup .leaflet-popup-content-wrapper {
          background: #1a1a1a;
          color: #e8e8e4;
          border: 1px solid #333;
          border-radius: 2px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        }
        .sculpture-popup .leaflet-popup-tip {
          background: #1a1a1a;
        }
        .leaflet-container {
          background: #111 !important;
          font-family: Georgia, serif;
        }
        .leaflet-control-attribution {
          background: rgba(10,10,10,0.8) !important;
          color: #666 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #888 !important; }
        .leaflet-control-zoom a {
          background: #1a1a1a !important;
          color: #e8e8e4 !important;
          border-color: #333 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #2a2a2a !important;
        }
      `}</style>
    </div>
  )
}
