/**
 * Shared text rendering utilities.
 *
 * Supports inline markdown links: [link text](https://example.com)
 * External URLs open in a new tab; internal paths (/sv/...) navigate in-page.
 */

import React from 'react'

/** Render a single line of text, converting [text](url) patterns to <a> links. */
export function renderInlineLinks(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  if (parts.length === 1) return text

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (match) {
          const [, label, href] = match
          const isExternal = /^https?:\/\//.test(href)
          return (
            <a
              key={i}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{ color: 'var(--color-accent)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
            >
              {label}
            </a>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

interface RichParaProps {
  style?: React.CSSProperties
}

/**
 * Render a multi-paragraph body string as <p> elements.
 * Paragraphs are separated by double newline; single newlines become <br />.
 * Inline [text](url) links are rendered as <a> tags.
 */
export function renderParagraphs(body: string, paraStyle?: React.CSSProperties): React.ReactNode {
  return body.split('\n\n').filter(Boolean).map((para, i) => (
    <p key={i} style={{ whiteSpace: 'pre-wrap', ...paraStyle }}>
      {renderInlineLinks(para)}
    </p>
  ))
}
