import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Scenography' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const WORKS = [
  { year: 1970, title: 'Coriolanus', venue: 'Dramaten, Stockholm. Regi: Alf Sjöberg', type: 'Teaterscenografi' },
  { year: 1974, title: 'Sand — 10 rörelsedikter', venue: 'Koreografi: Margaretha Åsberg', type: 'Koreografi' },
  { year: 1982, title: 'Falska Förtroenden av Marivaux', venue: 'Stockholms Stadsteater', type: 'Teaterscenografi' },
  { year: 1987, title: 'Drivved — Fragment ur tidigare koreografier', venue: 'Koreografi: Margaretha Åsberg', type: 'Koreografi' },
  { year: 1998, title: 'Fragment — Allvarsamma bagateller', venue: 'Koreografi: Margaretha Åsberg', type: 'Koreografi' },
]

export default async function ScenographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const HERO = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Triumf-Paris.jpg'

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: '55vh', minHeight: 300, overflow: 'hidden', marginBottom: '4rem', marginTop: 'calc(-1 * (var(--header-h) + 1.5rem))' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="Scenografi — Sivert Lindblom" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(10,10,10,0.88) 100%)' }} />
        <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
          <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
          </Link>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.4rem' }}>
            1970–1998
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: 0 }}>
            {dict.portfolio?.cat_scenography ?? 'Scenografi'}
          </h1>
        </div>
      </div>

      <div className="section-gap" style={{ paddingTop: 0 }}>
        <div className="page-pad" style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
            {dict.portfolio?.desc_scenography ?? ''}
          </p>
        </div>
      <hr className="divider" />
      <div className="page-pad" style={{ paddingTop: '2rem' }}>
        {WORKS.map((w) => (
          <div key={w.title} style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto', gap: '1.5rem', padding: '1.2rem 0', borderBottom: '1px solid var(--color-border)', alignItems: 'start' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{w.year}</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.25rem' }}>{w.title}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{w.venue}</div>
            </div>
            <span className="badge">
              {w.type === 'Teaterscenografi'
                ? (dict.portfolio?.type_theater ?? w.type)
                : (dict.portfolio?.type_choreography ?? w.type)}
            </span>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}
