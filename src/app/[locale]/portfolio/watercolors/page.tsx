import type { Metadata } from 'next'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/getDictionary'
import { createAdminClient } from '@/lib/supabase/admin'
import { cacheTag, cacheLife } from 'next/cache'
import WatercolorsGallery from './WatercolorsGallery'
import type { LightboxImage } from '@/components/gallery/Lightbox'

export const metadata: Metadata = {
  title: 'Akvareller 1975–2012',
  description:
    'Sivert Lindbloms akvarellserie 1975–2012 — axonometriska arkitektoniska visioner i omärkta pigment. Visades i sin helhet på Kungl. Konstakademien 2012.',
  openGraph: {
    title: 'Akvareller 1975–2012 — Sivert Lindblom',
    description:
      'Över 200 akvareller 1975–2012. Axonometriska perspektiv — "hermetiskt arkitektoniskt landskap" (Peter Cornell).',
    images: [{
      url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg',
      width: 1200, height: 800, alt: 'Sivert Lindblom, Akvarell nr 01',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg'],
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Fallback static images if DB is unavailable
const FALLBACK_IMAGES: LightboxImage[] = [
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg', alt: 'Akvarell nr 01, 1507' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-akvarell-02-1506-2.jpg', alt: 'Akvarell nr 02, 1506' },
]

async function getWatercolors(): Promise<LightboxImage[]> {
  'use cache'
  cacheTag('watercolors')
  cacheLife('hours')
  try {
    const supabase = createAdminClient()
    if (!supabase) return FALLBACK_IMAGES
    const { data, error } = await supabase
      .from('watercolors')
      .select('url, alt')
      .order('sort_order', { ascending: true })
    if (error || !data?.length) return FALLBACK_IMAGES
    return data.map(r => ({ url: r.url, alt: r.alt ?? '' }))
  } catch {
    return FALLBACK_IMAGES
  }
}

export default async function WatercolorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [dict, images] = await Promise.all([
    getDictionary(locale as Locale),
    getWatercolors(),
  ])
  return <WatercolorsGallery locale={locale} dict={dict} images={images} />
}
