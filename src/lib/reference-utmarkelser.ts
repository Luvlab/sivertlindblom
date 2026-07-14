/**
 * Editable data for the References → "Utmärkelser, priser och medaljer" section.
 * Stored in `settings` as one JSON blob so Jan can edit the prizes and — his
 * main ask — attach medal images to each (Stenpriset, Prins Eugen, Sergel,
 * S:t Erik). Falls back to these defaults until edited.
 */
export const UTMARKELSER_SETTINGS_KEY = 'reference_utmarkelser'

export interface PrizeLink { label: string; url: string }

export interface PrizeEntry {
  year: string
  title: string
  sub?: string
  desc?: string
  quote?: string
  images: string[]
  links?: PrizeLink[]
}

export interface UtmarkelserSection {
  intro: string
  prizes: PrizeEntry[]
}

export const DEFAULT_UTMARKELSER: UtmarkelserSection = {
  intro: 'Priser mottagna av Sivert Lindblom samt medaljer och minnesmärken formgivna av honom.',
  prizes: [
    { year: '1984', title: 'K A Linds Hederspris', sub: 'Moderna Museets Vänners kulturpris', images: [],
      links: [{ label: 'K A Linds Hederspris — Moderna Museets vänners skulpturpris', url: 'https://sv.wikipedia.org/wiki/Moderna_museets_v%C3%A4nners_skulpturpris' }] },
    { year: '1985', title: 'Stenpriset', sub: 'Sveriges Stenindustriförbund', images: [],
      links: [{ label: 'Om Stenpriset (sten.se)', url: 'https://www.sten.se/stenpriset/' }] },
    {
      year: '1989', title: 'Prins Eugen-medaljen',
      desc: 'Prins Eugen-medaljen instiftades av Konung Gustaf V i samband med Prins Eugens 80-årsdag år 1945. Medaljen tilldelas för framstående konstnärlig verksamhet.',
      images: [],
      links: [{ label: 'LÄS MER om medaljen och målarprinsen (Kungl. Maj:ts Orden)', url: 'https://kungligmajestatsorden.se/medaljer/prins-eugen-medaljen' }],
    },
    {
      year: '1995', title: 'Sergelpriset', sub: 'Kungl. Akademien för de fria konsterna, Stockholm',
      desc: 'Priset inrättades 1945 till minne av skulptören Johan Tobias Sergel. Det utdelas vart femte år på Sergels dödsdag den 26 februari och består av en guldmedalj med Sergels porträtt.',
      images: [],
    },
    {
      year: '2002', title: 'S:t Eriksmedaljen', sub: 'Stockholm stad',
      quote: '»Kreativ konstnär vars många sköna och spännande skulpturer på torg och broar är viktiga inslag i kulturstaden Stockholm«',
      images: [],
    },
    { year: '2002', title: 'Eskilstunakurirens kulturpris', sub: 'Eskilstuna-Kuriren', images: [] },
  ],
}

export function parseUtmarkelser(raw: string | null | undefined): UtmarkelserSection {
  if (!raw) return { ...DEFAULT_UTMARKELSER }
  try {
    const v = JSON.parse(raw) as Partial<UtmarkelserSection>
    const prizes = Array.isArray(v.prizes)
      ? v.prizes
          .filter((p) => p && typeof p.title === 'string' && p.title.trim())
          .map((p): PrizeEntry => ({
            year: typeof p.year === 'string' ? p.year : '',
            title: p.title,
            sub: p.sub || undefined,
            desc: p.desc || undefined,
            quote: p.quote || undefined,
            images: Array.isArray(p.images) ? p.images.filter((u) => typeof u === 'string' && u.trim()) : [],
            links: Array.isArray(p.links) ? p.links.filter((l) => l && typeof l.url === 'string' && typeof l.label === 'string') : undefined,
          }))
      : []
    return {
      intro: typeof v.intro === 'string' ? v.intro : DEFAULT_UTMARKELSER.intro,
      prizes: prizes.length ? prizes : DEFAULT_UTMARKELSER.prizes,
    }
  } catch {
    return { ...DEFAULT_UTMARKELSER }
  }
}

export function cleanUtmarkelser(input: unknown): UtmarkelserSection {
  const v = (input ?? {}) as Partial<UtmarkelserSection>
  return {
    intro: typeof v.intro === 'string' ? v.intro : '',
    prizes: Array.isArray(v.prizes)
      ? v.prizes
          .filter((p) => p && typeof p.title === 'string' && p.title.trim())
          .map((p): PrizeEntry => ({
            year: typeof p.year === 'string' ? p.year : '',
            title: p.title as string,
            sub: p.sub?.trim() || undefined,
            desc: p.desc?.trim() || undefined,
            quote: p.quote?.trim() || undefined,
            images: Array.isArray(p.images) ? p.images.filter((u) => typeof u === 'string' && u.trim()) : [],
          }))
      : [],
  }
}
