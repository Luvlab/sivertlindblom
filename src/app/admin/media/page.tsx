'use client'

import { useState, useEffect, useMemo } from 'react'
import type { PublicWork } from '@/lib/public-works'

interface MediaImage {
  url: string
  alt: string
  work: string
}

const PAGE_SIZE = 48

export default function AdminMedia() {
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Fetch public work images
        const worksRes = await fetch('/api/admin/public-works')
        const worksData = await worksRes.json() as PublicWork[] | { error: string }

        const collected: MediaImage[] = []

        if (!('error' in worksData)) {
          for (const work of worksData) {
            for (const img of work.images ?? []) {
              collected.push({ url: img.url, alt: img.alt ?? '', work: work.title })
            }
          }
        }

        // Fetch texts images
        const textsRes = await fetch('/api/admin/texts')
        const textsData = await textsRes.json() as Array<{ title: string; images?: string[] }> | { error: string }

        if (!('error' in textsData)) {
          for (const text of textsData) {
            for (const url of text.images ?? []) {
              if (typeof url === 'string' && url) {
                collected.push({ url, alt: '', work: text.title })
              }
            }
          }
        }

        setImages(collected)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return images
    const q = filter.toLowerCase()
    return images.filter(img =>
      img.work.toLowerCase().includes(q) ||
      img.alt.toLowerCase().includes(q) ||
      img.url.toLowerCase().includes(q)
    )
  }, [images, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageImages = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleFilterChange(v: string) {
    setFilter(v)
    setPage(1)
  }

  return (
    <div style={{ padding: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '0.25rem' }}>
          Media
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          {loading ? 'Laddar…' : `${filtered.length} bilder${filter ? ' (filtrerade)' : ''} av totalt ${images.length}`}
        </p>
      </div>

      {error && (
        <div style={{ background: '#2a0a0a', border: '1px solid #a33', color: '#f88', padding: '0.75rem 1rem', fontSize: 'var(--fs-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="search"
          className="input"
          placeholder="Sök verk, alt-text…"
          value={filter}
          onChange={e => handleFilterChange(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : (
        <>
          {/* Image grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {pageImages.map((img, i) => (
              <div
                key={`${img.url}-${i}`}
                style={{ border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-bg-surface)' }}
              >
                <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
                <div style={{ padding: '0.5rem 0.6rem' }}>
                  {img.alt && (
                    <div style={{
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--color-text)',
                      marginBottom: '0.15rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {img.alt}
                    </div>
                  )}
                  <div style={{
                    fontSize: 'var(--fs-xs)',
                    color: 'var(--color-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {img.work}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
              <button
                className="btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                style={{ opacity: safePage === 1 ? 0.4 : 1 }}
              >
                ← Föregående
              </button>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
                Sida {safePage} av {totalPages}
              </span>
              <button
                className="btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                style={{ opacity: safePage === totalPages ? 0.4 : 1 }}
              >
                Nästa →
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '3rem' }}>
              Inga bilder hittades.
            </p>
          )}
        </>
      )}
    </div>
  )
}
