'use client'

import { useState } from 'react'
import PdfFlipbook from './PdfFlipbook'

export interface PdfItem { label: string; url: string }

/**
 * The public "Ladda ner" section for a record's PDFs. Each entry can be opened
 * as a fullscreen flip-book (Bläddra) or downloaded.
 */
export default function PdfDownloads({ pdfs, heading = 'Ladda ner' }: { pdfs: PdfItem[]; heading?: string }) {
  const [open, setOpen] = useState<PdfItem | null>(null)
  if (!pdfs || pdfs.length === 0) return null

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
      <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.1rem' }}>{heading}</p>
      {pdfs.map((pdf, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setOpen(pdf)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-accent-dim)', paddingBottom: '0.1em' }}
          >
            <span aria-hidden>📖</span>{pdf.label}
          </button>
          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            ↓ Ladda ner
          </a>
        </div>
      ))}
      {open && <PdfFlipbook url={open.url} title={open.label} onClose={() => setOpen(null)} />}
    </div>
  )
}
