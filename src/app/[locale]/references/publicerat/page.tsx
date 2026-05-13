import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { PUBLICATIONS } from '@/lib/publications-data'

export const metadata: Metadata = {
  title: 'Publicerat — Sivert Lindblom',
  description: 'Kataloger, tidskriftsartiklar och böcker med texter om Sivert Lindbloms konstnärskap.',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function PubliceratPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/references`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.title ?? 'Referensmaterial'}</span>
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          {dict.references?.publicerat ?? 'Publicerat'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '65ch', fontSize: 'var(--fs-base)', lineHeight: 1.8 }}>
          {dict.references?.publicerat_intro ?? 'Kataloger, tidskriftsartiklar och böcker med texter som anknyter till Siverts konstnärskap.'}
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {/* Masonry grid of publication covers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}>
          {PUBLICATIONS.map((pub, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pub.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={pub.imageUrl}
                  alt={pub.title}
                  loading={i < 8 ? 'eager' : 'lazy'}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                    {pub.title}
                  </span>
                </div>
              )}
              <div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text)', lineHeight: 1.4, fontStyle: 'italic' }}>
                  {pub.title}
                </div>
                {pub.year && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', marginTop: '0.2rem' }}>{pub.year}</div>
                )}
                {pub.publisher && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem' }}>{pub.publisher}</div>
                )}
                {pub.isbn && (
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.1rem', fontVariantNumeric: 'tabular-nums' }}>{pub.isbn}</div>
                )}
                {pub.downloadUrl && (
                  <a
                    href={pub.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      marginTop: '0.5rem',
                      fontSize: 'var(--fs-xs)',
                      color: 'var(--color-accent)',
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                      borderBottom: '1px solid var(--color-accent-dim)',
                    }}
                  >
                    ↓ {pub.downloadLabel ?? 'Ladda ner (PDF)'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-pad" style={{ paddingBottom: '4rem' }}>
        <Link href={`/${locale}/references`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.title ?? 'Referensmaterial'}</span>
        </Link>
      </div>
    </div>
  )
}
