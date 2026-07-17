/**
 * Editable data for the References → "Ögonblick" section (candid photos of
 * Sivert). Stored in `settings` so Jan can add/remove/reorder images and add
 * an intro. Falls back to the static default list until edited.
 */
const WP = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp'

export const OGONBLICK_SETTINGS_KEY = 'reference_ogonblick'

export interface OgonblickImage { url: string; caption?: string }

export interface OgonblickSection {
  intro: string
  images: OgonblickImage[]
}

const DEFAULT_URLS = [
  `${WP}/2018/07/20180714_181121.jpg`, `${WP}/2018/07/20180714_181104.jpg`, `${WP}/2018/07/20180714_181039.jpg`,
  `${WP}/2018/07/20180714_181150.jpg`, `${WP}/2018/10/20181018_195227.jpg`, `${WP}/2018/10/20181018_195108.jpg`,
  `${WP}/2018/10/20181018_195148.jpg`, `${WP}/2018/02/20180203_160556.jpg`, `${WP}/2018/02/20180203_160613.jpg`,
  `${WP}/2018/02/20180203_160538.jpg`, `${WP}/2018/02/20180203_160518.jpg`, `${WP}/2018/02/20180203_160623_001.jpg`,
  `${WP}/2018/02/Lykta-Konstakademin.jpg`, `${WP}/2018/02/img296.jpg`, `${WP}/2018/08/20180817_135602.jpg`,
  `${WP}/2018/08/20180817_135547.jpg`, `${WP}/2018/08/20180817_135534.jpg`, `${WP}/2018/08/20180817_135458.jpg`,
  `${WP}/2018/08/20180817_135440.jpg`, `${WP}/2018/02/20180131_111554.jpg`, `${WP}/2018/02/20180131_111159.jpg`,
  `${WP}/2018/02/20180131_111221.jpg`, `${WP}/2018/02/20180131_111324.jpg`, `${WP}/2018/02/20180131_111349.jpg`,
  `${WP}/2018/02/20180131_111425.jpg`, `${WP}/2015/01/20150118_201040.jpg`, `${WP}/2017/10/20170927_181311.jpg`,
  `${WP}/2017/10/20170927_181256.jpg`,
]

export const DEFAULT_OGONBLICK: OgonblickSection = {
  intro: 'Bilder på och med Sivert Lindblom — i ateljén, vid invigningar och i vardagen.',
  images: DEFAULT_URLS.map((url) => ({ url })),
}

export function parseOgonblick(raw: string | null | undefined): OgonblickSection {
  if (!raw) return { ...DEFAULT_OGONBLICK }
  try {
    const v = JSON.parse(raw) as Partial<OgonblickSection>
    const images = Array.isArray(v.images)
      ? v.images.filter((i) => i && typeof i.url === 'string' && i.url.trim())
          .map((i) => ({ url: i.url, caption: i.caption || undefined }))
      : []
    return {
      intro: typeof v.intro === 'string' ? v.intro : DEFAULT_OGONBLICK.intro,
      images: images.length ? images : DEFAULT_OGONBLICK.images,
    }
  } catch {
    return { ...DEFAULT_OGONBLICK }
  }
}
