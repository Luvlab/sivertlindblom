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
  { year: 1970, title: 'Coriolanus', venue: 'Stockholms Stadsteater', type: 'Teaterscenogrfi' },
  { year: 1974, title: 'Sand — 10 rörelsedikter', venue: 'Med koreograf Margareta Åsberg', type: 'Koreografi' },
  { year: 1982, title: 'Falska Förtroenden av Marivaux', venue: 'Stockholms Stadsteater', type: 'Teaterscenogrfi' },
  { year: 1989, title: 'Förbindelsegang, Kulturhuset–Stadsteaterns Stora Scen', venue: 'Stockholm', type: 'Interiör' },
  { year: 1998, title: 'Fragment — Allvarsamma bagateller', venue: 'Med Margaretha Åsberg', type: 'Koreografi' },
  { year: 2010, title: 'Drivved — Fragment ur tidigare koreografier', venue: 'Med Margareta Åsberg', type: 'Koreografi' },
]

export default async function ScenographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/portfolio`} style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {dict.common?.back ?? '←'} {dict.nav?.portfolio ?? 'Portfolio'}
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem' }}>
          {dict.portfolio?.cat_scenography ?? 'Scenografi'}
        </h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '1rem', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
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
            <span className="badge">{w.type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
