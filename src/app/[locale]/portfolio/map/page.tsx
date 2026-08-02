import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import SculptureMap from '@/components/SculptureMap'
import { getMapPins } from '@/lib/data-server'

export const metadata: Metadata = { title: 'Sculpture Map' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Props = { params: Promise<{ locale: Locale }> }

export default async function MapPage({ params }: Props) {
  const { locale } = await params
  const dict = await getDictionary(locale)

  const locations = await getMapPins()
  const counts = {
    total: locations.length,
    countries: new Set(locations.map((l) => l.country)).size,
    cities: new Set(locations.map((l) => l.city)).size,
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {dict.portfolio?.cat_public ?? 'Public Works'}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '1rem' }}>
          {dict.portfolio?.map_title_full ?? 'Karta — offentliga verk'}
        </h1>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '0', fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
          <div>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', display: 'block', lineHeight: 1 }}>{counts.total}</span>
            {dict.portfolio?.map_locations ?? 'Platser'}
          </div>
          <div>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', display: 'block', lineHeight: 1 }}>{counts.cities}</span>
            {dict.portfolio?.map_cities ?? 'Städer'}
          </div>
          <div>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', display: 'block', lineHeight: 1 }}>{counts.countries}</span>
            {dict.portfolio?.map_countries ?? 'Länder'}
          </div>
        </div>
      </div>

      {/* Map */}
      <SculptureMap locations={locations} locale={locale} />

      {/* Location list */}
      <div className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '1.5rem', fontWeight: 400 }}>
          {dict.portfolio?.map_all_locations ?? 'Alla platser'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {locations.sort((a, b) => b.year - a.year).map((loc) => (
            <div key={loc.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{loc.year}</span>
                <span style={{
                  fontSize: 'var(--fs-xs)',
                  padding: '0.15rem 0.5rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 1,
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {loc.type === 'metro' ? `⬟ ${dict.portfolio?.map_type_metro ?? 'Metro'}` : loc.type === 'interior' ? `◈ ${dict.portfolio?.interiors ?? 'Interior'}` : `◉ ${dict.portfolio?.exteriors ?? 'Exterior'}`}
                </span>
              </div>
              <div style={{ fontSize: 'var(--fs-sm)', marginBottom: '0.25rem', lineHeight: 1.4 }}>{loc.title}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
                {loc.city}, {loc.country}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
