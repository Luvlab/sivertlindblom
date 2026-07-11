/**
 * Portfolio landing-page category thumbnails (the 4 slideshows on /portfolio).
 * Editable in admin via /admin/portfolio; stored in the `settings` table under
 * one key per category. These defaults are used until Jan edits them, so the
 * page looks identical until he changes something.
 */
const S = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images'

export type PortfolioCategoryKey = 'exhibitions' | 'public-works' | 'watercolors' | 'scenography'

export const PORTFOLIO_CATEGORY_KEYS: PortfolioCategoryKey[] = [
  'exhibitions',
  'public-works',
  'watercolors',
  'scenography',
]

/** Settings-table key that stores the image list for a category. */
export function portfolioThumbsKey(cat: PortfolioCategoryKey): string {
  return `portfolio_thumbs_${cat}`
}

export const DEFAULT_PORTFOLIO_THUMBS: Record<PortfolioCategoryKey, string[]> = {
  exhibitions: [
    `${S}/wp/2015/01/Siverts-exit.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-Lunds-konsthall-10.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-Lunds-konsthall-7.jpg`,
    `${S}/wp/2015/01/SAM_7624.jpg`,
    `${S}/wp/2015/01/20121028_135410.jpg`,
    `${S}/wp/2015/01/20121028_160220.jpg`,
  ],
  'public-works': [
    `${S}/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-Frescati-Atlas.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-Frescati-Klot.jpg`,
    `${S}/wp/2018/02/20180114_142218.jpg`,
    `${S}/wp/2015/01/Sivert566-kopia.jpg`,
    `${S}/wp/2015/06/CampusTbana.jpg`,
    `${S}/wp/2019/05/20190506_182925.jpg`,
  ],
  watercolors: [
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-01-1507-2.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-12-1489.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-29-1431-2.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-38-1478.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-64-1453-2.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-42-1473.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-akvarell-59-1458.jpg`,
  ],
  scenography: [
    `${S}/wp/2015/03/Sivert-Triumf-Paris.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-Profiler_0069.jpg`,
    `${S}/wp/2015/01/Sivert-Lindblom-Profiler_0072.jpg`,
  ],
}

export type PortfolioThumbs = Record<PortfolioCategoryKey, string[]>
