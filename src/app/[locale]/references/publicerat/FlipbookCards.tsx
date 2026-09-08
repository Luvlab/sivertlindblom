'use client'

import { useState } from 'react'
import PdfFlipbook from '@/components/pdf/PdfFlipbook'
import type { Flipbook } from '@/lib/data-server'

/**
 * Renders as additional grid items alongside the static PUBLICATIONS cards on
 * the Publicerat page (a client fragment, not a wrapping div, so it shares the
 * parent's CSS grid). Each flipbook can be browsed in-place (page-flip) or
 * downloaded as a plain PDF.
 */
export default function FlipbookCards({ flipbooks }: { flipbooks: Flipbook[] }) {
  const [open, setOpen] = useState<Flipbook | null>(null)

  return (
    <>
      {flipbooks.map((fb) => {
        const cover = fb.pages?.[0]
        return (
          <div key={fb.slug} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={fb.title}
                loading="lazy"
                style={{ width: '100%', height: 'auto', display: 'block', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', border: '1px solid var(--color-border)' }}
              />
            ) : (
              <div style={{
                width: '100%', aspectRatio: '3/4', background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', padding: '1rem', textAlign: 'center',
              }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  {fb.title}
                </span>
              </div>
            )}
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4, fontStyle: 'italic' }}>
                {fb.title}
              </div>
              {fb.subtitle && (
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem' }}>{fb.subtitle}</div>
              )}
              {fb.pdf_url && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setOpen(fb)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3em', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-accent-dim)' }}
                  >
                    📖 {fb.pdf_label || 'Bläddra'}
                  </button>
                  <a
                    href={fb.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none', letterSpacing: '0.04em', borderBottom: '1px solid var(--color-border)' }}
                  >
                    ↓ Ladda ner (PDF)
                  </a>
                </div>
              )}
            </div>
          </div>
        )
      })}
      {open && open.pdf_url && (
        <PdfFlipbook url={open.pdf_url} title={open.title} onClose={() => setOpen(null)} />
      )}
    </>
  )
}
