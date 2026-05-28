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
      {/* ── Tab strip — fixed under main header ──────────────── */}
      <div
        className="page-pad"
        style={{
          position: 'fixed',
          top: 'calc(var(--header-h) - 1px)',
          left: 0,
          right: 0,
          zIndex: 299,
          display: 'flex',
          alignItems: 'center',
          height: 'var(--subnav-h)',
          gap: 0,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          background: 'rgba(10,10,10,0.72)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Optional section label before tabs */}
        {label && (
          <span style={{
            fontSize: 'var(--fs-sm)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            whiteSpace: 'nowrap',
            paddingRight: '1rem',
            flexShrink: 0,
          }}>
            {label}
          </span>
        )}

        {/* Divider between label and tabs */}
        {label && (
          <span style={{
            width: 1,
            height: '1em',
            background: 'var(--color-border)',
            marginRight: '0.25rem',
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
                  background: isActive ? 'rgba(255,255,255,0.07)' : 'none',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  padding: '0.25rem 0.75rem',
                  margin: '0 0.1rem',
                  fontSize: 'var(--fs-sm)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--color-accent)' : 'rgba(255,255,255,0.92)',
                  opacity: isActive ? 1 : 0.62,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s, background 0.15s, opacity 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                    ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.62'
                    ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.92)'
                  }
                }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span style={{ marginLeft: '0.35rem', opacity: 0.55 }}>
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
            fontSize: '0.69rem',
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.45)',
            whiteSpace: 'nowrap',
            paddingLeft: '1rem',
            flexShrink: 0,
            maxWidth: '28ch',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {description}
          </span>
        )}
      </div>

      {/* Spacer so panel content isn't hidden behind the fixed header + strip */}
      <div style={{ height: 'calc(var(--header-h) + var(--subnav-h))' }} />

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
