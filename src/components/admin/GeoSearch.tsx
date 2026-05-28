'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address?: {
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
    country?: string
  }
}

export interface GeoResult {
  lat: number
  lng: number
  displayName: string
  city: string
  country: string
}

interface GeoSearchProps {
  onSelect: (result: GeoResult) => void
  placeholder?: string
  /** Additional styles on the outer wrapper */
  style?: React.CSSProperties
}

export default function GeoSearch({ onSelect, placeholder = 'Sök plats eller adress…', style }: GeoSearchProps) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<NominatimResult[]>([])
  const [loading, setLoading]   = useState(false)
  const [open, setOpen]         = useState(false)
  const [activeIdx, setActive]  = useState(-1)
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
        { headers: { 'Accept-Language': 'en', 'User-Agent': 'SivertLindblomCMS/1.0 admin@sivertlindblom.se' } }
      )
      const data = await res.json() as NominatimResult[]
      setResults(data)
      setOpen(data.length > 0)
      setActive(-1)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(q), 320)
  }

  function pick(r: NominatimResult) {
    const addr  = r.address ?? {}
    const city  = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.county ?? ''
    const country = addr.country ?? ''
    onSelect({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), displayName: r.display_name, city, country })
    // Keep a short label in the input
    setQuery(r.display_name.split(', ').slice(0, 2).join(', '))
    setOpen(false)
    setResults([])
  }

  function handleKey(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); pick(results[activeIdx]) }
    if (e.key === 'Escape') { setOpen(false) }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      {/* Input */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{
          position: 'absolute', left: '0.7rem',
          color: 'var(--color-muted)', fontSize: '0.85rem', pointerEvents: 'none', zIndex: 1,
        }}>
          {loading ? (
            <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>◌</span>
          ) : '🔍'}
        </span>
        <input
          type="text"
          className="input"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKey}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          placeholder={placeholder}
          autoComplete="off"
          style={{ paddingLeft: '2.25rem', paddingRight: query ? '2rem' : undefined, width: '100%' }}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setOpen(false) }}
            style={{
              position: 'absolute', right: '0.5rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-muted)', fontSize: '0.85rem', padding: '0.25rem', lineHeight: 1,
            }}
          >✕</button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0, right: 0,
          background: '#1a1a1a',
          border: '1px solid var(--color-border)',
          borderRadius: 2,
          zIndex: 2000,
          boxShadow: '0 8px 28px rgba(0,0,0,0.65)',
          overflow: 'hidden',
        }}>
          {results.map((r, i) => {
            const parts = r.display_name.split(', ')
            const name  = parts.slice(0, 2).join(', ')
            const rest  = parts.slice(2).join(', ')
            return (
              <button
                key={r.place_id}
                type="button"
                onMouseDown={() => pick(r)}
                onMouseEnter={() => setActive(i)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '0.6rem 0.9rem',
                  background: i === activeIdx ? 'var(--color-bg-card)' : 'transparent',
                  border: 'none',
                  borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none',
                  cursor: 'pointer', color: 'var(--color-text)', fontSize: 'var(--fs-sm)',
                }}
              >
                <div>📍 {name}</div>
                {rest && (
                  <div style={{
                    fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{rest}</div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Spin keyframe (cheap inline) */}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
