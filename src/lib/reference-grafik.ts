/**
 * Editable data for the References → "Grafik" section. Stored in `settings`
 * as one JSON blob so Jan can edit the heading, intro, photographer and the
 * image list from admin (/admin/references/grafik). Falls back to the values
 * from the static SCULPTURE_PROJECTS "grafik" entry until he edits it.
 */
import { SCULPTURE_PROJECTS } from '@/lib/sculpture-projects'

export const GRAFIK_SETTINGS_KEY = 'reference_grafik'

export interface GrafikImage { url: string; caption?: string }

export interface GrafikSection {
  title: string
  years: string
  intro: string
  photographer: string
  images: GrafikImage[]
}

const grafik = SCULPTURE_PROJECTS.find((p) => p.slug === 'grafik')

export const DEFAULT_GRAFIK: GrafikSection = {
  title: grafik?.title ?? 'Grafik i urval',
  years: grafik?.years ?? '',
  intro: grafik?.description ?? '',
  photographer: '',
  images: (grafik?.images ?? []).map((i) => ({ url: i.url, caption: i.alt || undefined })),
}

export function parseGrafik(raw: string | null | undefined): GrafikSection {
  if (!raw) return { ...DEFAULT_GRAFIK }
  try {
    const v = JSON.parse(raw) as Partial<GrafikSection>
    const images = Array.isArray(v.images)
      ? v.images.filter((i) => i && typeof i.url === 'string' && i.url.trim())
          .map((i) => ({ url: i.url, caption: i.caption || undefined }))
      : []
    return {
      title: typeof v.title === 'string' && v.title.trim() ? v.title : DEFAULT_GRAFIK.title,
      years: typeof v.years === 'string' ? v.years : DEFAULT_GRAFIK.years,
      intro: typeof v.intro === 'string' ? v.intro : DEFAULT_GRAFIK.intro,
      photographer: typeof v.photographer === 'string' ? v.photographer : '',
      images: images.length ? images : DEFAULT_GRAFIK.images,
    }
  } catch {
    return { ...DEFAULT_GRAFIK }
  }
}
