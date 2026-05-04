import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'

export const metadata: Metadata = { title: 'Portfolio' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const SLIDESHOW_IMAGES: Record<string, string[]> = {
  exhibitions: [
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Siverts-exit.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Lunds-konsthall-10.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Lunds-konsthall-7.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/SAM_7624.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/20121028_135410.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/20121028_160220.jpg',
  ],
  'public-works': [
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Atlas.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Västra-skogen-T.bana_0106.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2018/02/20180114_142218.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert566-kopia.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusTbana.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2019/05/20190506_182925.jpg',
  ],
  watercolors: [
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-12-1489.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-29-1431-2.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-38-1478.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-64-1453-2.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-42-1473.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-59-1458.jpg',
  ],
  scenography: [
    'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Triumf-Paris.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Profiler_0069.jpg',
    'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Profiler_0072.jpg',
  ],
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const CATEGORIES = [
    {
      key: 'exhibitions',
      label: dict.portfolio?.cat_exhibitions ?? 'Utställningar',
      sub: dict.portfolio?.sub_exhibitions ?? '1961 – 2016',
      desc: dict.portfolio?.desc_exhibitions ?? '',
      count: 28,
    },
    {
      key: 'public-works',
      label: dict.portfolio?.cat_public ?? 'Offentliga arbeten',
      sub: dict.portfolio?.sub_public ?? 'Exteriörer & interiörer',
      desc: dict.portfolio?.desc_public ?? '',
      count: 42,
    },
    {
      key: 'watercolors',
      label: dict.portfolio?.cat_watercolors ?? 'Akvareller',
      sub: dict.portfolio?.sub_watercolors ?? '1975 – 2012',
      desc: dict.portfolio?.desc_watercolors ?? '',
      count: 49,
    },
    {
      key: 'scenography',
      label: dict.portfolio?.cat_scenography ?? 'Scenografi',
      sub: dict.portfolio?.sub_scenography ?? 'Teater & koreografi',
      desc: dict.portfolio?.desc_scenography ?? '',
      count: 6,
    },
  ]

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          {dict.nav?.portfolio ?? 'Portfolio'}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(2rem,4vw,3.5rem)', marginBottom: '1rem' }}>
          {dict.portfolio?.title ?? 'Konstnärskap 1961–2016'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
          {dict.portfolio?.intro ?? ''}
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem' }}>
        <div className="portfolio-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={`/${locale}/portfolio/${cat.key}`} style={{ display: 'block' }}>
              <article className="card" style={{ overflow: 'hidden' }}>
                <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                  <PortfolioSlideshow
                    images={SLIDESHOW_IMAGES[cat.key] ?? []}
                    alt={cat.label}
                    objectFit={cat.key === 'watercolors' ? 'contain' : 'cover'}
                    background={cat.key === 'watercolors' ? '#ede9e2' : 'var(--color-bg-card)'}
                    padding={cat.key === 'watercolors' ? '1rem' : '0'}
                    interval={3200 + Object.keys(SLIDESHOW_IMAGES).indexOf(cat.key) * 400}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', margin: 0 }}>{cat.label}</h2>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{cat.count} {dict.portfolio?.count_works ?? 'verk'}</span>
                  </div>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{cat.sub}</p>
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7 }}>{cat.desc}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Map callout */}
        <Link
          href={`/${locale}/portfolio/map`}
          className="row-hover"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '3rem',
            padding: '1.25rem 0',
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            textDecoration: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-base)', color: 'var(--color-text)' }}>
              {dict.portfolio?.map_title ?? 'Utforska skulpturer på karta'}
            </span>
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
              {29} {dict.portfolio?.map_works ?? 'offentliga verk'} · {5} {dict.portfolio?.map_countries ?? 'länder'}
            </span>
          </div>
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', flexShrink: 0 }}>
            {dict.portfolio?.map_label ?? 'Visa karta'} →
          </span>
        </Link>
      </div>

      <div className="page-pad" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Link href={`/${locale}`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.home ?? 'Hem'}</span>
        </Link>
      </div>
    </div>
  )
}
