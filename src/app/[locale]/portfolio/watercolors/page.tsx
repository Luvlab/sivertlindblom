import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = {
  title: 'Akvareller 1975–2012',
  description:
    'Sivert Lindbloms akvarellserie 1975–2012 — axonometriska arkitektoniska visioner i omärkta pigment. Visades i sin helhet på Kungl. Konstakademien 2012.',
  openGraph: {
    title: 'Akvareller 1975–2012 — Sivert Lindblom',
    description:
      'Över 200 akvareller skapade 1975–2012. Axonometriska perspektiv, omärkta pigment — "hermetiskt arkitektoniskt landskap" (Peter Cornell).',
    images: [
      {
        url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',
        width: 1200,
        height: 800,
        alt: 'Sivert Lindblom, Akvarell nr 01',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg'],
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const WATERCOLOR_IMAGES = Array.from({ length: 12 }, (_, i) => {
  const ids = [
    '1445','1428','1447','1507','1504','1443','1446','1508','1502','1501',
    '1500','1499',
  ]
  const nums = [
    '79','80','70','01','04','76','75','02','05','06',
    '07','08',
  ]
  return {
    url: `https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-${nums[i] || String(i+1).padStart(2,'0')}-${ids[i] || '1400'}.jpg`,
    alt: `Akvarell nr ${nums[i] || i+1}`,
  }
})

export default async function WatercolorsPage({
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
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          {dict.watercolors?.title ?? 'Akvareller 1975–2012'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)', lineHeight: 1.8, marginBottom: '2rem' }}>
          {dict.watercolors?.description ?? ''}
        </p>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-sm)' }}>
          {dict.watercolors?.book_note ?? ''}
        </p>
      </div>

      <hr className="divider" />

      <div style={{ paddingTop: '2rem' }}>
        <div className="auto-grid-sm page-pad">
          {WATERCOLOR_IMAGES.map((img, i) => (
            <div key={i} className="img-zoom" style={{ aspectRatio: '3/4', background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
