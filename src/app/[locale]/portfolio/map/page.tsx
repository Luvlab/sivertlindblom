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
      <div style={{ padding: '3rem 3rem 2rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          {dict.portfolio?.cat_public ?? 'Public Works'}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-3xl)', marginBottom: '1rem' }}>
          {locale === 'sv' ? 'Karta — offentliga verk' :
           locale === 'de' ? 'Karte — öffentliche Werke' :
           locale === 'fr' ? 'Carte — œuvres publiques' :
           locale === 'es' ? 'Mapa — obras públicas' :
           locale === 'it' ? 'Mappa — opere pubbliche' :
           locale === 'zh' ? '地图 — 公共作品' :
           locale === 'ja' ? 'マップ — パブリックアート' :
           locale === 'ar' ? 'خريطة — الأعمال العامة' :
           locale === 'pt' ? 'Mapa — obras públicas' :
           locale === 'ru' ? 'Карта — общественные работы' :
           locale === 'nl' ? 'Kaart — openbare werken' :
           locale === 'pl' ? 'Mapa — prace publiczne' :
           locale === 'ko' ? '지도 — 공공 작품' :
           locale === 'th' ? 'แผนที่ — งานสาธารณะ' :
           'Map — Public Works'}
        </h1>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '3rem', marginBottom: '0', fontSize: 'var(--fs-sm)', color: 'var(--color-muted)' }}>
          <div>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', display: 'block', lineHeight: 1 }}>{counts.total}</span>
            {locale === 'sv' ? 'Platser' : locale === 'th' ? 'สถานที่' : 'Locations'}
          </div>
          <div>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', display: 'block', lineHeight: 1 }}>{counts.cities}</span>
            {locale === 'sv' ? 'Städer' : locale === 'th' ? 'เมือง' : 'Cities'}
          </div>
          <div>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', display: 'block', lineHeight: 1 }}>{counts.countries}</span>
            {locale === 'sv' ? 'Länder' : locale === 'th' ? 'ประเทศ' : 'Countries'}
          </div>
        </div>
      </div>

      {/* Map */}
      <SculptureMap locations={locations} locale={locale} />

      {/* Location list */}
      <div style={{ padding: '3rem', maxWidth: 1200 }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', marginBottom: '1.5rem', fontWeight: 400 }}>
          {locale === 'sv' ? 'Alla platser' : locale === 'th' ? 'สถานที่ทั้งหมด' : 'All locations'}
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
                  {loc.type === 'metro' ? '⬟ Metro' : loc.type === 'interior' ? '◈ Interior' : '◉ Exterior'}
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
