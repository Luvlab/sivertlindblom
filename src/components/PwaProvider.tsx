'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * PwaProvider
 *
 * • Registers /sw.js
 * • Listens for the SW_UPDATED broadcast (posted by the new SW on activate)
 * • Shows a subtle bottom banner: "Ny version tillgänglig" → "Uppdatera"
 * • Also exposes a manual ↺ refresh button in the bottom-right corner
 *   (hidden until the page has been loaded for a few seconds, so it
 *   doesn't flicker on hard refreshes)
 */
export default function PwaProvider() {
  const [updateReady, setUpdateReady] = useState(false)
  const [reg, setReg] = useState<ServiceWorkerRegistration | null>(null)
  const [dismissed, setDismissed] = useState(false)

  // Register SW
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        setReg(registration)

        // Already waiting (page was previously loaded, new SW installed)
        if (registration.waiting) {
          setUpdateReady(true)
          return
        }

        // New SW found while page is open
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (!newWorker) return
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setUpdateReady(true)
            }
          })
        })
      })
      .catch(() => {/* silently ignore in dev or unsupported env */})

    // Listen for the SW_UPDATED broadcast from the new activated SW
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_UPDATED') setUpdateReady(true)
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [])

  const applyUpdate = useCallback(() => {
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
    // Wait a tick for skipWaiting to propagate then reload
    setTimeout(() => window.location.reload(), 150)
  }, [reg])

  // Nothing to render if update not ready or user dismissed
  if (!updateReady || dismissed) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        background: 'var(--color-bg-surface, #1a1a18)',
        border: '1px solid var(--color-accent, #b48c3c)',
        padding: '0.75rem 1rem 0.75rem 1.25rem',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center',
        boxShadow: '0 4px 32px rgba(0,0,0,0.6)',
        maxWidth: 'calc(100vw - 2rem)',
        minWidth: 260,
        // Slide-up entrance
        animation: 'swBannerIn 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes swBannerIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Pulse dot */}
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: 'var(--color-accent, #b48c3c)',
        flexShrink: 0,
        boxShadow: '0 0 0 3px rgba(180,140,60,0.25)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(180,140,60,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(180,140,60,0.08); }
        }
      `}</style>

      <span style={{
        flex: 1,
        fontSize: 'var(--fs-sm, 0.85rem)',
        color: 'var(--color-muted, #888)',
        whiteSpace: 'nowrap',
      }}>
        Ny version tillgänglig
      </span>

      <button
        onClick={applyUpdate}
        style={{
          background: 'var(--color-accent, #b48c3c)',
          color: '#0a0a0a',
          border: 'none',
          padding: '0.35em 0.9em',
          fontSize: 'var(--fs-xs, 0.75rem)',
          fontWeight: 700,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        ↺ Uppdatera
      </button>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Stäng"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-muted, #666)',
          cursor: 'pointer',
          padding: '0.2rem 0.3rem',
          fontSize: '1rem',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}
