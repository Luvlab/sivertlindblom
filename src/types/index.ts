export type WorkCategory =
  | 'exhibition'
  | 'public_exterior'
  | 'public_interior'
  | 'scenography'
  | 'watercolor'
  | 'sculpture'
  | 'graphic'

export type TextType =
  | 'essay'
  | 'review'
  | 'interview'
  | 'own_writing'
  | 'translated'
  | 'preface'

export type BiographyEntryType =
  | 'education'
  | 'position'
  | 'award'
  | 'public_commission'
  | 'group_exhibition'
  | 'publication'
  | 'personal'

export interface Work {
  id: string
  slug: string
  title: string
  title_sv?: string
  category: WorkCategory
  subcategory?: string
  year_start?: number
  year_end?: number
  description?: string
  location?: string
  source_url?: string
  published: boolean
  sort_order: number
  created_at: string
  updated_at: string
  images?: Image[]
}

export interface Image {
  id: string
  work_id: string
  url: string
  alt?: string
  caption?: string
  sort_order: number
  created_at: string
}

export interface Text {
  id: string
  slug: string
  title: string
  author?: string
  text_type: TextType
  publication?: string
  year?: number
  language: string
  content?: string
  source_url?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface BiographyEntry {
  id: string
  entry_type: BiographyEntryType
  year_start?: number
  year_end?: number
  title: string
  description?: string
  location?: string
  sort_order: number
  created_at: string
}

export interface Setting {
  key: string
  value: string
  updated_at: string
}

export interface SiteSettings {
  site_title: string
  site_subtitle: string
  hero_tagline: string
  contact_email: string
  about_short: string
}

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  exhibition:       'Utställningar',
  public_exterior:  'Offentliga arbeten — Exteriörer',
  public_interior:  'Offentliga arbeten — Interiörer',
  scenography:      'Scenografi',
  watercolor:       'Akvareller',
  sculpture:        'Skulptur',
  graphic:          'Grafik',
}

export const TEXT_TYPE_LABELS: Record<TextType, string> = {
  essay:       'Essays',
  review:      'Recensioner',
  interview:   'Intervjuer',
  own_writing: 'Egna texter',
  translated:  'Översatta texter',
  preface:     'Förord',
}

export const BIO_TYPE_LABELS: Record<BiographyEntryType, string> = {
  education:         'Utbildning',
  position:          'Uppdrag & tjänster',
  award:             'Priser & utmärkelser',
  public_commission: 'Offentliga uppdrag',
  group_exhibition:  'Grupputställningar',
  publication:       'Publikationer',
  personal:          'Personligt',
}
