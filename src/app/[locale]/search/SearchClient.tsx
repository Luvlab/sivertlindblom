'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { SearchItem } from '@/lib/search-index'

const TYPE_LABELS: Record<SearchItem['type'], string> = {
  exhibition:   'Utställning',
  text:         'Text',
  'public-work': 'Offentligt arbete',
  sculpture:    'Skulptur',
  biography:    'Biografi',
}

const TYPE_ORDER: SearchItem['type'][] = [
  'public-work', 'sculpture', 'exhibition', 'text', 'biography',
]

function score(item: SearchItem, q: string): number {
  const lower = q.toLowerCase()
  let s = 0
  if (item.title.toLowerCase().includes(lower))    s += 10
  if (item.subtitle.toLowerCase().includes(lower)) s += 5
  if (item.excerpt.toLowerCase().includes(lower))  s += 2
  return s
}

function highlight(text: string, q: string): React.ReactNode {
  if (!q || !text) return text
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'var(--color-accent)', color: '#000', padding: '0 2px', borderRadius: 2 }}>
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  )
}

interface Props {
  index: SearchItem[]
  locale: string
  placeholder: string
}

export default function SearchClient({ index, locale, placeholder }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  const q = query.trim()

  const results: SearchItem[] = q.length < 2
    ? []
    : index
        .map((item) => ({ item, s: score(item, q) }))
        .filter(({ s }) => s > 0)
        .sort((a, b) => b.s - a.s || (b.item.year ?? 0) - (a.item.year ?? 0))
        .map(({ item }) => item)

  // Group by type in preferred order
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    label: TYPE_LABELS[type],
    items: results.filter((r) => r.type === type),
  })).filter((g) => g.items.length > 0)

  return (
    <div>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        <span style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-muted)',
          pointerEvents: 'none',
          fontSize: '1.1rem',
        }}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          style={{
            width: '100%',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 3,
            padding: '0.85rem 1rem 0.85rem 2.75rem',
            fontSize: 'var(--fs-base)',
            color: 'var(--color-text)',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Rensa"
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-muted)',
              fontSize: '1.1rem',
              lineHeight: 1,
              padding: '0.2rem',
            }}
          >×</button>
        )}
      </div>

      {/* Empty state */}
      {q.length < 2 && (
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          Skriv minst 2 tecken för att söka…
        </p>
      )}

      {/* No results */}
      {q.length >= 2 && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-muted)' }}>
          <p style={{ fontSize: 'var(--fs-xl)', marginBottom: '0.5rem' }}>Inga träffar</p>
          <p style={{ fontSize: 'var(--fs-sm)' }}>Ingen post matchade «{q}»</p>
        </div>
      )}

      {/* Results */}
      {grouped.map(({ type, label, items }) => (
        <section key={type} style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <span style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
              {label}
            </span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
              {items.length} träff{items.length !== 1 ? 'ar' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                className="row-hover"
                style={{
                  display: 'block',
                  padding: '0.9rem 0',
                  borderBottom: '1px solid var(--color-border)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--fs-base)', fontFamily: 'Georgia, serif', color: 'var(--color-text)' }}>
                    {highlight(item.title, q)}
                  </span>
                  {item.year && (
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif', flexShrink: 0 }}>
                      {item.year}
                    </span>
                  )}
                </div>
                {item.subtitle && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.2rem' }}>
                    {highlight(item.subtitle, q)}
                  </div>
                )}
                {item.excerpt && (
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', marginTop: '0.35rem', opacity: 0.8, lineHeight: 1.5 }}>
                    {highlight(item.excerpt, q)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Result count summary */}
      {results.length > 0 && (
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '1rem', opacity: 0.6 }}>
          {results.length} resultat totalt
        </p>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="6.5" cy="6.5" r="5" />
      <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
    </svg>
  )
}
