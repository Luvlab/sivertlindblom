import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import TextImageSlideshow from '@/components/TextImageSlideshow'
import ExhibitionsHeroSlideshow from '@/components/gallery/ExhibitionsHeroSlideshow'
import { createAdminClient } from '@/lib/supabase/admin'
import { cacheTag, cacheLife } from 'next/cache'

export const metadata: Metadata = { title: 'Scenography' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface Work {
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

// Static fallback (same data as before) in case DB is unavailable
const WP = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp'

const FALLBACK_WORKS: Work[] = [
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

async function getWorks(): Promise<Work[]> {
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

const FILTERS = [
  { key: 'alla', label: 'Alla' },
  { key: 'Teaterscenografi', label: 'Teaterscenografi' },
  { key: 'Koreografi', label: 'Koreografi' },
] as const

export default async function ScenographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [dict, WORKS] = await Promise.all([
    getDictionary(locale as Locale),
    getWorks(),
  ])

  // Pool all scenography images for the hero slideshow
  const heroImages = WORKS.flatMap(w => w.images).filter(Boolean)

  return (
    <div style={{ marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* Hero — full viewport, bleeds under header + subnav */}
      <div style={{ position: 'relative', height: '100vh', minHeight: 480, overflow: 'hidden', marginBottom: '4rem' }}>
        <ExhibitionsHeroSlideshow images={heroImages} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.88) 100%)' }} />

        {/* Title block */}
        <div className="page-pad" style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0 }}>
          <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
          </Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,3vw,3rem)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
            {dict.portfolio?.cat_scenography ?? 'Scenografi'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--fs-sm)', margin: 0 }}>
            {WORKS.length} {dict.portfolio?.cat_scenography?.toLowerCase() ?? 'scenografier'}
            {WORKS.length > 0 && `, ${Math.min(...WORKS.map(w => w.year ?? 9999).filter(y => y < 9999))}–${Math.max(...WORKS.map(w => w.year ?? 0))}`}
          </p>

          {/* Scroll-down arrow */}
          <div style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            opacity: 0.7,
            animation: 'scrollDrop 2.4s ease-in-out infinite',
            pointerEvents: 'none',
          }}>
            <svg width="20" height="28" viewBox="0 0 20 28" fill="none" style={{ display: 'block' }}>
              <line x1="10" y1="0" x2="10" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <polyline points="4,14 10,21 16,14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="section-gap" style={{ paddingTop: 0 }}>
        <div className="page-pad" style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
            {dict.portfolio?.desc_scenography ?? 'Sivert har genom åren samarbetat med såväl teaterregissörer och koreografer med scenografiska lösningar och skulpturala objekt.'}
          </p>

          {/* Filter nav */}
          <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }} aria-label="Filter">
            {FILTERS.map((f) => (
              <a
                key={f.key}
                href={f.key === 'alla' ? '#works' : `#type-${f.key}`}
                className="filter-link"
                style={{
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  padding: '0.3em 0.8em',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                {f.label}
              </a>
            ))}
          </nav>
        </div>

        <hr className="divider" />

        {/* Works list */}
        <div id="works" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
          {WORKS.map((w, idx) => (
            <article
              key={w.slug}
              id={`type-${w.type}`}
              style={{
                paddingBottom: idx < WORKS.length - 1 ? '4rem' : 0,
                marginBottom: idx < WORKS.length - 1 ? '4rem' : 0,
                borderBottom: idx < WORKS.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto', gap: '1.5rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', paddingTop: '0.15rem' }}>
                  {w.year ?? ''}
                </span>
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)', margin: '0 0 0.35rem' }}>
                    {w.title}
                  </h2>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{w.venue}</div>
                </div>
                <span className="badge">
                  {w.type === 'Teaterscenografi'
                    ? (dict.portfolio?.type_theater ?? w.type)
                    : (dict.portfolio?.type_choreography ?? w.type)}
                </span>
              </div>

              {/* Description */}
              {w.description && (
                <div style={{ paddingLeft: 'calc(5rem + 1.5rem)', marginBottom: '1.75rem' }}>
                  <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.7, maxWidth: '70ch', margin: 0 }}>
                    {w.description}
                  </p>
                </div>
              )}

              {/* Image slideshow */}
              {w.images.length > 0 && (
                <div style={{ paddingLeft: 'calc(5rem + 1.5rem)', maxWidth: '720px' }}>
                  <TextImageSlideshow images={w.images} title={w.title} thumbnailAspect="4/3" />
                </div>
              )}

              {/* YouTube embed */}
              {w.video_url && (
                <div style={{ paddingLeft: 'calc(5rem + 1.5rem)', marginTop: '1.5rem' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '640px' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${w.video_url}`}
                      title={w.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
