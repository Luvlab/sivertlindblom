'use client'

import { useEffect, useRef, useState } from 'react'
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
  /** Override map container height. Default 480. Accept number (px) or CSS string. */
  mapHeight?: number | string
  /** Remove outer horizontal margins (for use inside a panel). */
  compact?: boolean
  /** Show the exterior/interior/metro filter buttons. Default true. */
  showFilter?: boolean
  /** Zoom level used when there is exactly one location (single-pin detail map). Default 14. */
  singleZoom?: number
}

const TYPE_COLORS: Record<string, string> = {
  exterior: '#0952f7', // blue
  interior: '#1f9d55', // green
  metro: '#a084c9',
}

const TYPE_LABELS: Record<string, Record<string, string>> = {
  exterior: { sv: 'Utomhus', en: 'Exterior', de: 'Außen', fr: 'Extérieur', es: 'Exterior', it: 'Esterno', zh: '室外', ja: '屋外', ar: 'خارجي', pt: 'Exterior', ru: 'Снаружи', nl: 'Buiten', pl: 'Zewnętrzne', ko: '외부', th: 'ภายนอก' },
  interior: { sv: 'Inomhus', en: 'Interior', de: 'Innen', fr: 'Intérieur', es: 'Interior', it: 'Interno', zh: '室内', ja: '屋内', ar: 'داخلي', pt: 'Interior', ru: 'Внутри', nl: 'Binnen', pl: 'Wewnętrzne', ko: '내부', th: 'ภายใน' },
  metro: { sv: 'Tunnelbana', en: 'Metro', de: 'U-Bahn', fr: 'Métro', es: 'Metro', it: 'Metro', zh: '地铁', ja: '地下鉄', ar: 'مترو', pt: 'Metro', ru: 'Метро', nl: 'Metro', pl: 'Metro', ko: '지하철', th: 'รถไฟใต้ดิน' },
}

export default function SculptureMap({ locations, locale, mapHeight = 480, compact = false, showFilter = true, singleZoom = 14 }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circlesRef = useRef<Map<number, any>>(new Map())
  const [leafletReady, setLeafletReady] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  // Load Leaflet then the cluster plugin STRICTLY in sequence. The plugin
  // executes against window.L at load time, so parallel <Script> tags raced:
  // when the plugin won, it threw, markerClusterGroup never existed, and the
  // map stayed blank until a lucky (cached) reload.
  useEffect(() => {
    let cancelled = false
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve()
        existing.addEventListener('load', () => resolve())
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)))
        return
      }
      const s = document.createElement('script')
      s.src = src
      s.crossOrigin = ''
      s.addEventListener('load', () => { s.dataset.loaded = 'true'; resolve() })
      s.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)))
      document.head.appendChild(s)
    })
    ;(async () => {
      if (!window.L) await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js')
      if (!window.L?.markerClusterGroup) await loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js')
      if (!cancelled && window.L?.markerClusterGroup) setLeafletReady(true)
    })().catch(() => { /* network failure — map stays hidden */ })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstance.current) return

    const L = window.L
    if (!L || !L.markerClusterGroup) return

    // Init map — will fitBounds to all markers after adding them
    const map = L.map(mapRef.current, {
      center: [56.5, 14.5],
      zoom: 3,
      zoomControl: true,
    })

    // OpenStreetMap tiles (free, no API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Create cluster group
    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: { getChildCount: () => number }) => {
        const count = cluster.getChildCount()
        return L.divIcon({
          html: `<div style="
            width:32px;height:32px;
            background:#0952f7;
            border:2px solid #0a0a0a;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:11px;color:#fff;font-weight:600;
            font-family:Georgia,serif;
            box-shadow:0 0 0 3px #0952f760;
          ">${count}</div>`,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })
      },
    })

    mapInstance.current = map
    clusterRef.current = clusterGroup

    // Force Leaflet to recalculate container dimensions.
    // Two passes: rAF for fast renders, setTimeout for slow/mobile layouts.
    requestAnimationFrame(() => map.invalidateSize())
    const sizeTimer = setTimeout(() => map.invalidateSize(), 300)

    // Helper to create a marker
    const addMarker = (loc: SculptureLocation) => {
      const color = TYPE_COLORS[loc.type] ?? '#c9a84c'
      const iconHtml = (scale = 1) => `<div style="
        width:${14 * scale}px;height:${14 * scale}px;
        background:${color};
        border:2px solid #0a0a0a;
        border-radius:50%;
        cursor:pointer;
        box-shadow:0 0 0 ${2 * scale}px ${color}60;
        transition:all 0.15s;
        margin:${-((14 * scale - 14) / 2)}px 0 0 ${-((14 * scale - 14) / 2)}px;
      "></div>`

      const icon = L.divIcon({ html: iconHtml(1), className: '', iconSize: [14, 14], iconAnchor: [7, 7] })
      const marker = L.marker([loc.lat, loc.lng], { icon })

      // Hover effects
      marker.on('mouseover', () => {
        marker.setIcon(L.divIcon({ html: iconHtml(1.6), className: '', iconSize: [14, 14], iconAnchor: [7, 7] }))
      })
      marker.on('mouseout', () => {
        marker.setIcon(L.divIcon({ html: iconHtml(1), className: '', iconSize: [14, 14], iconAnchor: [7, 7] }))
      })

      // Tooltip (hover label)
      marker.bindTooltip(loc.title, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'sculpture-tooltip',
        opacity: 0.95,
      })

      const typeLabel = TYPE_LABELS[loc.type]?.[locale] ?? loc.type
      marker.bindPopup(`
        <div style="font-family:Georgia,serif;min-width:200px">
          <div style="font-size:11px;color:#0952f7;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">
            ${loc.year} · ${typeLabel}
          </div>
          <div style="font-size:14px;line-height:1.4;margin-bottom:6px;font-weight:500">${loc.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:${loc.description ? '8px' : '0'}">${loc.city}, ${loc.country}</div>
          ${loc.description ? `<div style="font-size:12px;color:#aaa;line-height:1.5;border-top:1px solid #333;padding-top:8px">${loc.description}</div>` : ''}
          ${loc.slug ? `<a href="/${locale}/portfolio/public-works/${loc.slug}" style="display:inline-block;margin-top:8px;font-size:11px;color:#0952f7;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid #0952f760;padding-bottom:2px">→ Läs mer</a>` : ''}
        </div>
      `, { maxWidth: 280, className: 'sculpture-popup' })

      return marker
    }

    // Add all markers to cluster group
    locations.forEach((loc) => {
      const marker = addMarker(loc)
      clusterGroup.addLayer(marker)
    })

    clusterGroup.addTo(map)

    // 0.5km radius circles — added directly to map (not clustered)
    const circMap = new Map<number, any>() // eslint-disable-line @typescript-eslint/no-explicit-any
    locations.forEach((loc, i) => {
      const circle = L.circle([loc.lat, loc.lng], {
        radius: 500,
        color: TYPE_COLORS[loc.type] ?? '#c9a84c',
        fillColor: TYPE_COLORS[loc.type] ?? '#c9a84c',
        fillOpacity: 0.07,
        weight: 1,
        opacity: 0.25,
        interactive: false,
      })
      circle.addTo(map)
      circMap.set(i, circle)
    })
    circlesRef.current = circMap

    // Fit view to all markers so every project (incl. NY, Tokyo) is visible.
    // For a single location, centre on it at a closer zoom (place-level detail map).
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], singleZoom)
    } else if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((l: SculptureLocation) => [l.lat, l.lng]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 })
    }

    return () => {
      clearTimeout(sizeTimer)
      map.remove()
      mapInstance.current = null
      clusterRef.current = null
      circlesRef.current = new Map()
    }
  }, [leafletReady, locations, locale, singleZoom])

  // Re-filter markers when selectedType changes
  useEffect(() => {
    if (!mapInstance.current || !clusterRef.current) return
    const L = window.L
    if (!L) return

    const clusterGroup = clusterRef.current
    clusterGroup.clearLayers()

    const filtered = selectedType ? locations.filter((l) => l.type === selectedType) : locations

    filtered.forEach((loc) => {
      const color = TYPE_COLORS[loc.type] ?? '#c9a84c'
      const iconHtml = (scale = 1) => `<div style="
        width:${14 * scale}px;height:${14 * scale}px;
        background:${color};
        border:2px solid #0a0a0a;
        border-radius:50%;
        cursor:pointer;
        box-shadow:0 0 0 ${2 * scale}px ${color}60;
        transition:all 0.15s;
        margin:${-((14 * scale - 14) / 2)}px 0 0 ${-((14 * scale - 14) / 2)}px;
      "></div>`
      const icon = L.divIcon({ html: iconHtml(1), className: '', iconSize: [14, 14], iconAnchor: [7, 7] })
      const marker = L.marker([loc.lat, loc.lng], { icon })
      marker.on('mouseover', () => {
        marker.setIcon(L.divIcon({ html: iconHtml(1.6), className: '', iconSize: [14, 14], iconAnchor: [7, 7] }))
      })
      marker.on('mouseout', () => {
        marker.setIcon(L.divIcon({ html: iconHtml(1), className: '', iconSize: [14, 14], iconAnchor: [7, 7] }))
      })
      marker.bindTooltip(loc.title, {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'sculpture-tooltip',
        opacity: 0.95,
      })
      const typeLabel = TYPE_LABELS[loc.type]?.[locale] ?? loc.type
      marker.bindPopup(`
        <div style="font-family:Georgia,serif;min-width:200px">
          <div style="font-size:11px;color:#0952f7;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">
            ${loc.year} · ${typeLabel}
          </div>
          <div style="font-size:14px;line-height:1.4;margin-bottom:6px;font-weight:500">${loc.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:${loc.description ? '8px' : '0'}">${loc.city}, ${loc.country}</div>
          ${loc.description ? `<div style="font-size:12px;color:#aaa;line-height:1.5;border-top:1px solid #333;padding-top:8px">${loc.description}</div>` : ''}
          ${loc.slug ? `<a href="/${locale}/portfolio/public-works/${loc.slug}" style="display:inline-block;margin-top:8px;font-size:11px;color:#0952f7;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid #0952f760;padding-bottom:2px">→ Läs mer</a>` : ''}
        </div>
      `, { maxWidth: 280, className: 'sculpture-popup' })
      clusterGroup.addLayer(marker)
    })

    // Sync circle visibility with the filter
    circlesRef.current.forEach((circle, i) => {
      const loc = locations[i]
      if (!loc || !mapInstance.current) return
      const show = !selectedType || loc.type === selectedType
      if (show && !mapInstance.current.hasLayer(circle)) circle.addTo(mapInstance.current)
      else if (!show && mapInstance.current.hasLayer(circle)) mapInstance.current.removeLayer(circle)
    })
  }, [selectedType, locations, locale])

  const types = ['exterior', 'interior', 'metro']

  return (
    <div style={compact ? {} : { paddingBottom: '2rem' }}>
      {/* Leaflet CSS + JS via CDN */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        crossOrigin=""
      />
      {/* Type filter */}
      {showFilter && (
      <div style={{ padding: compact ? '0.75rem 1rem' : '0 clamp(1rem, 4vw, 5rem) 1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          height: mapHeight,
          background: '#111',
          margin: compact ? 0 : '0 clamp(1rem, 4vw, 5rem)', // match .page-pad gutters
          borderRadius: compact ? 0 : 2,
          overflow: 'hidden',
          border: compact ? 'none' : '1px solid var(--color-border)',
          borderTop: compact ? '1px solid var(--color-border)' : undefined,
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
        .sculpture-tooltip {
          background: #1a1a1a !important;
          border: 1px solid #3a3a3a !important;
          color: #e8e8e4 !important;
          font-family: Georgia, serif !important;
          font-size: 11px !important;
          padding: 3px 8px !important;
          border-radius: 2px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
          white-space: nowrap !important;
        }
        .sculpture-tooltip::before { display: none !important; }
      `}</style>
    </div>
  )
}
