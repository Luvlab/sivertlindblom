'use client'

import { useRef } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
  rows?: number
  style?: React.CSSProperties
  placeholder?: string
  hint?: string
}

/**
 * Textarea with a 🔗 link insertion toolbar.
 * Click the button to wrap selected text in [text](url) markdown link syntax.
 * Use renderInlineLinks() from @/lib/render-text on the frontend to render links.
 */
export default function LinkTextarea({ value, onChange, rows = 6, style, placeholder, hint }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null)

  function insertLink() {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.substring(start, end)

    // eslint-disable-next-line no-alert
    const url = window.prompt('Ange URL:', 'https://')
    if (!url) return

    const linkText = selected || 'länktext'
    const insertion = `[${linkText}](${url})`
    const newValue = value.substring(0, start) + insertion + value.substring(end)
    onChange(newValue)

    // After state update, restore focus and select the link text portion if it was auto-filled
    requestAnimationFrame(() => {
      el.focus()
      if (!selected) {
        // Select the placeholder "länktext" so user can immediately type to replace it
        el.setSelectionRange(start + 1, start + 1 + linkText.length)
      } else {
        el.setSelectionRange(start + insertion.length, start + insertion.length)
      }
    })
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={insertLink}
          style={{
            background: 'none',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
            padding: '0.15em 0.65em',
            fontSize: '0.65rem',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            borderRadius: 2,
          }}
          title="Markera text och klicka för att länka"
        >
          🔗 Länk
        </button>
        <span style={{ fontSize: '0.6rem', color: 'var(--color-border)' }}>
          Markera text → klicka för att länka · Syntax: [text](url)
        </span>
      </div>
      <textarea
        ref={ref}
        className="input"
        rows={rows}
        style={{ width: '100%', resize: 'vertical', ...style }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {hint && (
        <p style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: '0.4rem' }}>{hint}</p>
      )}
    </div>
  )
}
