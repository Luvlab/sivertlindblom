// Fallback static data used when Supabase is not yet configured
import type { Work, Text, BiographyEntry, SiteSettings } from '@/types'

export const FALLBACK_SETTINGS: SiteSettings = {
  site_title:   'Sivert Lindblom',
  site_subtitle:'Skulptör · Konstnär · Stockholm',
  hero_tagline: 'Skulptur, offentlig konst, akvareller och scenografi sedan 1963',
  contact_email:'info@sivertlindblom.se',
  about_short:  'Sivert Lindblom (f. 1931) är en av Sveriges mest betydande skulptörer. Han studerade vid Kungliga Konsthögskolan 1958–1963 och har sedan dess skapat ett omfattande verk av skulpturer, offentliga installationer, akvareller och scenografi.',
}

// Key highlight works used on the homepage when DB is empty
export const HIGHLIGHT_IMAGES = [
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',  alt: 'Blasieholmstorg, Stockholm 1989' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg',  alt: 'Hästar i brons, Blasieholmstorg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg',  alt: 'Detalj, Blasieholmstorg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg',  alt: 'Blasieholmstorg natt' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg',  alt: 'Blasieholmstorg panorama' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/San-Marco-h%C3%A4star.jpg',                 alt: 'San Marco hästar, Venedig' },
]

export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !!(url && url !== 'your_supabase_project_url' && url.startsWith('http'))
}
