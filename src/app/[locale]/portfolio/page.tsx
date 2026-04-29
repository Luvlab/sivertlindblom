import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Portfolio' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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
      image: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',
      count: 28,
    },
    {
      key: 'public-works',
      label: dict.portfolio?.cat_public ?? 'Offentliga arbeten',
      sub: dict.portfolio?.sub_public ?? 'Exteriörer & interiörer',
      desc: dict.portfolio?.desc_public ?? '',
      image: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg',
      count: 42,
    },
    {
      key: 'watercolors',
      label: dict.portfolio?.cat_watercolors ?? 'Akvareller',
      sub: dict.portfolio?.sub_watercolors ?? '1975 – 2012',
      desc: dict.portfolio?.desc_watercolors ?? '',
      image: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',
      count: 49,
    },
    {
      key: 'scenography',
      label: dict.portfolio?.cat_scenography ?? 'Scenografi',
      sub: dict.portfolio?.sub_scenography ?? 'Teater & koreografi',
      desc: dict.portfolio?.desc_scenography ?? '',
      image: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Triumf-Paris.jpg',
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
        <div className="auto-grid-wide">
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={`/${locale}/portfolio/${cat.key}`} style={{ display: 'block' }}>
              <article className="card" style={{ overflow: 'hidden' }}>
                {cat.image ? (
                  <div className="img-zoom" style={{ aspectRatio: '16/9' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image} alt={cat.label} loading="lazy" />
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: '16/9',
                    background: 'var(--color-bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <span style={{ fontSize: 'var(--fs-4xl)', color: 'var(--color-border)', fontFamily: 'Georgia, serif' }}>
                      {cat.label.charAt(0)}
                    </span>
                  </div>
                )}
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
      </div>
    </div>
  )
}
