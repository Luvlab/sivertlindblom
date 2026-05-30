export interface FilmEntry {
  slug: string
  year: number
  title: string
  director?: string
  venue?: string
  desc?: string
  videoUrl?: string
  extraVideos?: string[]
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
  },
  {
    slug: 'vad-var-multikonst',
    year: 1974,
    title: 'Vad var Multikonst?',
    venue: 'SVT Play',
    desc: 'Program från SVT om Multikonst-projektet 1967 — en vandringsutställning i samarbete med Moderna Museet och Riksutställningar. Finns att se hos SVT Play.',
    videoUrl: 'https://www.svtplay.se/video/eEgzYWK/multikonst-hela-sverige-gar-pa-utstallning',
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
]

/** Extract YouTube video ID from any YouTube URL format */
export function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

/** Best-available YouTube thumbnail URL */
export function ytThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}
