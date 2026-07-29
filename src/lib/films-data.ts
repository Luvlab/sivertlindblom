export interface FilmEntry {
  slug: string
  year: number
  title: string
  director?: string
  venue?: string
  desc?: string
  videoUrl?: string
  extraVideos?: string[]
  /** Start-card image, used when there's no YouTube/self-hosted video to derive a
   *  thumbnail from (e.g. external-link or archive-only films). Editable in admin. */
  poster?: string
}

export const FILMS: FilmEntry[] = [
  {
    slug: 'beskrivning-av-en-tankes-rorelse',
    year: 1967,
    title: 'Beskrivning av en tankes rörelse',
    director: 'Lasse Forsberg',
    desc: 'En film om Sivert Lindblom av Lasse Forsberg, 1967. Sivert berättar om sin metod: hur profilen av hans eget ansikte blev utgångspunkten för ett formspråk förmedlat via exakta arbetsorder — på samma sätt som en arkitekt förmedlar form utan att delta i det praktiska arbetet. »Målet är inte att ge en illusion av rörelse utan målet är att ge en beskrivning av en tankes rörelse.«',
  },
  {
    slug: 'ted-gardestad-helena',
    year: 1972,
    title: 'Ted Gärdestad sjunger "Helena"',
    venue: 'med Sivert Lindbloms skulpturer',
    desc: 'Musikvideo till Ted Gärdestads "Helena" inspelad i miljö med Sivert Lindbloms skulpturer.',
    videoUrl: 'https://www.youtube.com/watch?v=yXAKq0KDpYk',
  },
  {
    slug: 'skandinaviska-bankens-palats',
    year: 1973,
    title: 'Skandinaviska Bankens Palats — Gustav Adolfs Torg',
    venue: 'Sveriges Riksbank',
    desc: 'Dokumentation av utsmyckningen av Riksbankens fasad vid Gustav Adolfs torg, Stockholm, 1973.',
    videoUrl: 'https://www.riksbank.se/sv/om-riksbanken/riksbankens-hus/',
    poster: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/uploads/film-posters/skandinaviska-riksbanken.jpg',
  },
  {
    slug: 'vad-var-multikonst',
    year: 1974,
    title: 'Vad var Multikonst?',
    venue: 'SVT Play',
    desc: 'Program från SVT om Multikonst-projektet 1967 — en vandringsutställning i samarbete med Moderna Museet och Riksutställningar. Finns att se hos SVT Play.',
    videoUrl: 'https://www.svtplay.se/video/eEgzYWK/multikonst-hela-sverige-gar-pa-utstallning',
    poster: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/uploads/film-posters/multikonst.jpg',
  },
  {
    slug: 'skissernas-museum-lund-1993',
    year: 1993,
    title: 'Sivert Lindblom visar modeller på Skissernas museum, Lund',
    venue: 'Skissernas Museum, Lund',
    desc: 'Tre filmer från utställningen Skulptur Arkitektur på Skissernas museum i Lund 1993, där Sivert Lindblom presenterar modeller och offentliga verk.',
    videoUrl: 'https://youtu.be/5GvdoEYox-k',
    extraVideos: [
      'https://www.youtube.com/embed/bF_AHab50Xc',
      'https://www.youtube.com/embed/HCEZ9_anTmo',
    ],
  },
  {
    slug: 'kallan-med-obelisk-bonnierhuset',
    year: 1995,
    title: 'Källan med obelisk — Bonnierhuset, atrium',
    venue: 'Bonniers kontorshus, Torsgatan 21, Stockholm',
    desc: 'Filmklipp från Källan med obelisk i Bonnierhusets atrium, 1995.',
    videoUrl: 'https://youtu.be/1q0J8_pjyAg',
  },
  {
    slug: 'tv-intervju-1996',
    year: 1996,
    title: 'TV-intervju med Sivert Lindblom',
    venue: 'TV Eskilstuna / Minnenas Television',
    desc: 'Intervju med Sivert Lindblom för TV Eskilstuna 1996 — Minnenas Television.',
    videoUrl: 'https://www.youtube.com/embed/xhMABJ90HBE',
  },
  {
    slug: 'poetic-cinema',
    year: 1996,
    title: 'Poetic Cinema — Landscape After Verlaine',
    venue: 'Carl Henrik Svenstedt',
    desc: 'Filmverk av Carl Henrik Svenstedt, 1996.',
  },
  {
    slug: 'tv4-uppland-1998',
    year: 1998,
    title: 'TV4-Uppland: kortintervju om skulptur',
    venue: 'TV4 Uppland',
    desc: 'I en 1-minuters intervju den 23 februari 1998 kommenterar Sivert Lindblom vilken skulptur han är mest nöjd med.',
    videoUrl: 'https://www.youtube.com/embed/bhWP7NP89YM',
  },
  {
    slug: 'torg-i-tiden',
    year: 1999,
    title: 'Torg i tiden — Gustav Adolfs torg, Malmö',
    venue: 'Malmö Stads Gatukontor',
    desc: 'En 23 minuter lång dokumentärfilm om Gustav Adolfs torgs historia i Malmö, producerad av Malmö Stads Gatukontor. Byggherre: Malmö kommun. Invigdes 12 juni 1999.',
    videoUrl: 'https://www.youtube.com/watch?v=-ba2Oq65qe4',
  },
  {
    slug: 'resningen-av-profilen',
    year: 2001,
    title: 'Resningen av Profilen, Potatisåkern',
    venue: 'Malmö',
    desc: 'Film över resningen och installationen av Sivert Lindbloms skulptur "Profilen" på Potatisåkern bostadsområde i Malmö, 2001.',
    videoUrl: 'https://www.youtube.com/embed/hfwecUKJCJo',
  },
  {
    slug: 'magnus-uggla',
    year: 2024,
    title: 'Magnus Uggla',
    desc: 'Kort filmklipp (ca 30 sekunder).',
    videoUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/videos/magnus-uggla-30s.mp4',
  },
  {
    slug: 't-banan-sivert-marianne-lindblom',
    year: 2025,
    title: 'T-banan — Sivert & Marianne Lindblom',
    venue: 'Stockholm',
    desc: 'Sivert och Marianne Lindblom i Stockholms tunnelbana, augusti 2025. Cirka tre minuter.',
    videoUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/videos/t-banan-sivert-marianne-lindblom.mp4',
  },
]

/** True if the videoUrl is a file we host and should play inline in a
 *  <video> element (mp4/webm/mov in our own storage), not a YouTube or
 *  external embed. */
export function isSelfHostedVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes('/storage/v1/object/public/videos/')
}

/** Extract YouTube video ID from any YouTube URL format */
export function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

/** Best-available YouTube thumbnail URL */
export function ytThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
