/**
 * Editable data for the References → "Fotografier – inspiration" section.
 * Stored in the `settings` table as one JSON blob so Jan can manage the images,
 * captions and a photographer credit from admin (/admin/references/fotografi).
 * Falls back to the static FOTOGRAFIER_IMAGES until he edits it.
 */
import { FOTOGRAFIER_IMAGES, type FotografiImage } from '@/lib/fotografier-data'

export const FOTOGRAFI_SETTINGS_KEY = 'reference_fotografi'

export interface FotografiSection {
  intro: string
  photographer: string
  images: FotografiImage[]
}

export const DEFAULT_FOTOGRAFI: FotografiSection = {
  intro: '',
  photographer: '',
  images: FOTOGRAFIER_IMAGES,
}

/** Parse a stored JSON blob into a FotografiSection, tolerating bad data. */
export function parseFotografi(raw: string | null | undefined): FotografiSection {
  if (!raw) return { ...DEFAULT_FOTOGRAFI }
  try {
    const v = JSON.parse(raw) as Partial<FotografiSection>
    const images = Array.isArray(v.images)
      ? v.images.filter((i) => i && typeof i.url === 'string' && i.url.trim())
          .map((i) => ({ url: i.url, caption: i.caption || undefined }))
      : []
    return {
      intro: typeof v.intro === 'string' ? v.intro : '',
      photographer: typeof v.photographer === 'string' ? v.photographer : '',
      // Empty list = keep defaults so the gallery is never blank.
      images: images.length ? images : DEFAULT_FOTOGRAFI.images,
    }
  } catch {
    return { ...DEFAULT_FOTOGRAFI }
  }
}
