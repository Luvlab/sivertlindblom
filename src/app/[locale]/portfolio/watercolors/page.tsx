import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import WatercolorsGallery from './WatercolorsGallery'

export const metadata: Metadata = {
  title: 'Akvareller 1975–2012',
  description:
    'Sivert Lindbloms akvarellserie 1975–2012 — axonometriska arkitektoniska visioner i omärkta pigment. Visades i sin helhet på Kungl. Konstakademien 2012.',
  openGraph: {
    title: 'Akvareller 1975–2012 — Sivert Lindblom',
    description:
      'Över 200 akvareller 1975–2012. Axonometriska perspektiv — "hermetiskt arkitektoniskt landskap" (Peter Cornell).',
    images: [{
      url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',
      width: 1200, height: 800, alt: 'Sivert Lindblom, Akvarell nr 01',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg'],
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function WatercolorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return <WatercolorsGallery locale={locale} />
}
