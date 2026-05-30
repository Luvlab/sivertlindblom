import { createAdminClient } from '@/lib/supabase/admin'
import { cacheTag, cacheLife } from 'next/cache'

export interface Work {
  slug: string
  year: number | null
  title: string
  venue: string
  type: 'Teaterscenografi' | 'Koreografi'
  description: string
  images: string[]
  video_url: string
  sort_order: number
  published: boolean
}

// Static fallback in case DB is unavailable
const WP = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp'

export const FALLBACK_WORKS: Work[] = [
  {
    slug: 'coriolanus',
    year: 1970,
    title: 'Coriolanus',
    venue: 'Dramaten, Stockholm. Regi: Alf Sjöberg',
    type: 'Teaterscenografi',
    description: 'Till Alf Sjöbergs uppsättning av William Shakespeares Coriolanus gjorde Sivert scenografin. Coriolanus är en tragedi som tros ha skrivits mellan 1605 och 1608 och bygger på livet för den legendariske romerske härskaren Caius Marcius Coriolanus. Föreställningen hade premiär den 25 april 1970 på Dramaten, Stockholm.',
    images: [
      `${WP}/2015/06/Coriolanus547.jpg`, `${WP}/2015/06/Coriolanus550.jpg`,
      `${WP}/2015/06/Coriolanus551.jpg`, `${WP}/2015/06/Coriolanus552.jpg`,
      `${WP}/2015/06/Coriolanus553.jpg`, `${WP}/2015/06/imgSV423.jpg`,
      `${WP}/2015/06/imgSV424.jpg`, `${WP}/2015/06/Coriolanus2556.jpg`,
      `${WP}/2015/06/Coriolanus2559.jpg`,
      `${WP}/2015/01/Sivert-Lindblom-Stadsteatern-Stockholm-1.jpg`,
      `${WP}/2015/01/Sivert-Lindblom-Stadsteatern-Stockholm-3.jpg`,
    ],
    video_url: '',
    sort_order: 0,
    published: true,
  },
  {
    slug: 'sand-10-rorelsedikter',
    year: 1974,
    title: 'Sand — 10 rörelsedikter',
    venue: 'Koreografi: Margaretha Åsberg',
    type: 'Koreografi',
    description: 'Tillsammans med Margaretha Åsbergs första egna koreografiska produktion, efter det att hon slutat på Kungl. Operan, gjorde Sivert scenografi till "Sand – 10 rörelsedikter" 1974. Denna produktion räknas som den första "Performance-föreställningen" inom den moderna dansteatern i Sverige.',
    images: [
      `${WP}/2018/07/10-rorelsedikter-x-4.jpg`, `${WP}/2018/06/Margareta-2-Lutfi-Ozkok.jpg`,
      `${WP}/2018/06/Margareta-8-Lutfi-Ozkok.jpg`, `${WP}/2018/06/Margareta-14-Andre-Lafolie.jpg`,
    ],
    video_url: '',
    sort_order: 1,
    published: true,
  },
]

export async function getWorks(): Promise<Work[]> {
  'use cache'
  cacheTag('scenography')
  cacheLife('hours')
  try {
    const supabase = createAdminClient()
    if (!supabase) return FALLBACK_WORKS

    const { data, error } = await supabase
      .from('scenography_works')
      .select(`*, scenography_images(url, alt, sort_order)`)
      .eq('published', true)
      .order('sort_order', { ascending: true })

    if (error || !data?.length) return FALLBACK_WORKS

    return data.map(w => ({
      slug: w.slug,
      year: w.year,
      title: w.title,
      venue: w.venue ?? '',
      type: (w.type as 'Teaterscenografi' | 'Koreografi') ?? 'Teaterscenografi',
      description: w.description ?? '',
      video_url: w.video_url ?? '',
      sort_order: w.sort_order ?? 0,
      published: w.published ?? true,
      images: ((w.scenography_images ?? []) as { url: string; alt: string | null; sort_order: number }[])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.url),
    }))
  } catch {
    return FALLBACK_WORKS
  }
}
