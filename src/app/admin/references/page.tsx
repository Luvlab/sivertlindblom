'use client'

import Link from 'next/link'

const SECTIONS = [
  {
    id: 'skulptur',
    label: 'Skulptur',
    desc: 'Skulpturprojekt och serier. Redigeras via Offentliga arbeten och Karta.',
    href: '/admin/public-works',
    cta: 'Öppna Offentliga arbeten →',
  },
  {
    id: 'grafik',
    label: 'Grafik',
    desc: 'Grafiska verk och serier. Kopplade till sculpture-projects-data.',
    href: null,
    cta: null,
  },
  {
    id: 'fotografi',
    label: 'Fotografier',
    desc: 'Fotografier av Siverts verk. Bilder hanteras via Media-biblioteket.',
    href: '/admin/media',
    cta: 'Öppna Media →',
  },
  {
    id: 'film-tv',
    label: 'Film & TV',
    desc: 'Filmklipp och TV-inslag. Lägg till YouTube/Vimeo-URL:er via statisk data.',
    href: null,
    cta: null,
  },
  {
    id: 'publicerat',
    label: 'Publicerat',
    desc: 'Tidningsartiklar och recensioner. Redigeras via Texter.',
    href: '/admin/texts',
    cta: 'Öppna Texter →',
  },
  {
    id: 'utmarkelser',
    label: 'Utmärkelser',
    desc: 'Priser och utmärkelser. Redigeras via Biografi (typ: Pris/Utmärkelse).',
    href: '/admin/biography',
    cta: 'Öppna Biografi →',
  },
  {
    id: 'ogonblick',
    label: 'Ögonblick',
    desc: 'Personliga fotografier av Sivert. Hanteras via Biografi (Fotografier-fliken).',
    href: '/admin/biography',
    cta: 'Öppna Biografi →',
  },
]

export default function AdminReferences() {
  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: 760 }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Admin</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', marginBottom: '0.25rem' }}>Referenser</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>
          Referenssidans 7 sektioner och var innehållet hanteras.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {SECTIONS.map(s => (
          <div
            key={s.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '7rem 1fr auto',
              gap: '1.5rem',
              alignItems: 'center',
              padding: '1.1rem 1.25rem',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              borderRadius: 2,
            }}
          >
            <span style={{ fontFamily: 'Georgia, serif', color: 'var(--color-accent)', fontSize: 'var(--fs-sm)' }}>
              #{s.id}
            </span>
            <div>
              <div style={{ fontSize: 'var(--fs-sm)', marginBottom: '0.2rem' }}>{s.label}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{s.desc}</div>
            </div>
            {s.href ? (
              <Link href={s.href}>
                <button className="btn" style={{ fontSize: '0.7rem', padding: '0.3em 0.8em', whiteSpace: 'nowrap' }}>{s.cta}</button>
              </Link>
            ) : (
              <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>Statisk data</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', padding: '1.25rem', border: '1px solid var(--color-border)', background: 'var(--color-bg-surface)', borderRadius: 2, fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--color-text)', display: 'block', marginBottom: '0.5rem' }}>Tips</strong>
        Sektioner märkta med "Statisk data" redigeras i källfilerna{' '}
        <code style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }}>src/lib/sculpture-projects.ts</code>{' '}
        och{' '}
        <code style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }}>src/app/[locale]/references/page.tsx</code>.
        Kontakta webbutvecklaren för att lägga till stöd för databasdriven redigering av dessa sektioner.
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link href="/sv/references" target="_blank" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
          ↗ Visa referenssidan
        </Link>
      </div>
    </div>
  )
}
