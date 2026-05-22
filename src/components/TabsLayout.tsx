'use client'

import { useState, useEffect, useCallback } from 'react'
import React from 'react'

export interface TabDef {
  id: string
  label: string
  count?: number
}

interface Props {
  tabs: TabDef[]
  /** Tab id to activate by default (before any hash check). Defaults to first tab. */
  defaultTab?: string
  /** Label rendered before the tabs on the same row (e.g. section title). */
  label?: string
  /** Short description rendered after the tabs on the same row. */
  description?: string
  children: React.ReactNode
}

/**
 * Client-side tab switcher.
 * Renders all children server-side; shows only the active one.
 * Initialises from URL hash on mount (e.g. `#grafik` → grafik tab).
 * Updates the URL hash when switching tabs so direct links work.
 */
export default function TabsLayout({ tabs, defaultTab, label, description, children }: Props) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '')

  // Activate the tab matching the current URL hash.
  // Runs on mount AND whenever the hash changes (e.g. SubNav click).
  useEffect(() => {
    function syncFromHash() {
      const hash = window.location.hash.replace('#', '')
      if (hash && tabs.some((t) => t.id === hash)) {
        setActive(hash)
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const switchTab = useCallback((id: string) => {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
    // Scroll tab strip into view if needed
    document.getElementById(`tab-${id}`)?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [])

  const childArray = React.Children.toArray(children)

  return (
    <div>
      {/* ── Tab strip ────────────────────────────────────────── */}
      <div
        className="page-pad"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          overflowX: 'auto',
          borderBottom: '1px solid var(--color-border)',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Optional section label before tabs */}
        {label && (
          <span style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'var(--fs-sm)',
            color: 'var(--color-text)',
            whiteSpace: 'nowrap',
            paddingRight: '1.5rem',
            paddingBottom: '1px',
            flexShrink: 0,
          }}>
            {label}
          </span>
        )}

        {/* Divider between label and tabs */}
        {label && (
          <span style={{
            width: 1,
            height: '1.1em',
            background: 'var(--color-border)',
            marginRight: '0.5rem',
            flexShrink: 0,
          }} />
        )}

        <div role="tablist" aria-label="Sektioner" style={{ display: 'flex', gap: 0, flex: 1 }}>
          {tabs.map((tab) => {
            const isActive = tab.id === active
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => switchTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive
                    ? '2px solid var(--color-accent)'
                    : '2px solid transparent',
                  cursor: 'pointer',
                  padding: '0.85rem 1.35rem',
                  fontSize: 'var(--fs-sm)',
                  fontFamily: isActive ? 'Georgia, serif' : 'inherit',
                  color: isActive ? 'var(--color-text)' : 'var(--color-muted)',
                  marginBottom: '-1px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s, border-color 0.15s',
                  flexShrink: 0,
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    style={{
                      marginLeft: '0.4rem',
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--color-muted)',
                      opacity: 0.7,
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Optional description after tabs */}
        {description && (
          <span style={{
            fontSize: 'var(--fs-xs)',
            color: 'var(--color-muted)',
            whiteSpace: 'nowrap',
            paddingLeft: '1.5rem',
            paddingBottom: '1px',
            flexShrink: 0,
            maxWidth: '28ch',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {description}
          </span>
        )}
      </div>

      {/* ── Tab panels ───────────────────────────────────────── */}
      {childArray.map((child, i) => {
        const tab = tabs[i]
        if (!tab) return null
        return (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== active}
          >
            {child}
          </div>
        )
      })}
    </div>
  )
}
