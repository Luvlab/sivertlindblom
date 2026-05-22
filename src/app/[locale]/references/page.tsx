import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'
import SafeImg from '@/components/SafeImg'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import TabsLayout from '@/components/TabsLayout'
import { SCULPTURE_PROJECTS } from '@/lib/sculpture-projects'
import { FOTOGRAFIER_IMAGES } from '@/lib/fotografier-data'
import { PUBLICATIONS } from '@/lib/publications-data'

export const metadata: Metadata = { title: 'Sculpture & Graphics' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// Build slug → image URL[] lookup from sculpture-projects data
const SLIDESHOW_IMAGES: Record<string, string[]> = Object.fromEntries(
  SCULPTURE_PROJECTS.map((p) => [p.slug, p.images.slice(0, 8).map((i) => i.url)])
)

// Skulptur series — excludes grafik (it gets its own tab)
const SCULPTURE_SERIES = [
  { key: 'profiler',        label: 'Profiler',                    desc: 'Profilskulpturer i sten och brons.' },
  { key: 'metamorfoser',    label: 'Metamorfoser — Sittare',      desc: 'Sittande figurer i metamorfos.' },
  { key: 'monoliter',       label: 'Monoliter & Blystoder',       desc: 'Monolitiska former, inkl. Paris 1977.' },
  { key: 'azteker',         label: 'Azteker',                     desc: 'Aztekiskt inspirerade skulpturer.' },
  { key: 'tidiga-skulpturer', label: 'Tidiga skulpturer',         desc: 'Verk från 1950- och 1960-talen.' },
  { key: 'kofeser',         label: 'Kofeser',                     desc: 'En serie om meningslös meningsfullhet.' },
  { key: 'blyplattor',      label: 'Blyplattor',                  desc: 'Reliefverk i bly.' },
  { key: 'tradkonstruktioner', label: 'Trädkonstruktioner',       desc: 'Skulpturer i trä.' },
  { key: 'tornmodeller',    label: 'Tornmodeller',                 desc: 'Modeller och förslag för torn.' },
  { key: 'arbetsmodeller',  label: 'Arbetsmodeller & Förslag',    desc: 'Arbetsmodeller i gips, lera och trä samt tävlingsförslag.' },
] as const

const FILMS: Array<{ year: number; title: string; director?: string; venue?: string; desc?: string; videoUrl?: string; extraVideos?: string[] }> = [
  {
    year: 1967,
    title: 'Beskrivning av en tankes rörelse',
    director: 'Lasse Forsberg',
    desc: 'En film om Sivert Lindblom av Lasse Forsberg, 1967. Sivert berättar om sin metod: hur profilen av hans eget ansikte blev utgångspunkten för ett formspråk förmedlat via exakta arbetsorder — på samma sätt som en arkitekt förmedlar form utan att delta i det praktiska arbetet. »Målet är inte att ge en illusion av rörelse utan målet är att ge en beskrivning av en tankes rörelse.«',
  },
  {
    year: 1972,
    title: 'Ted Gärdestad sjunger "Helena"',
    venue: 'med Sivert Lindbloms skulpturer',
    desc: 'Musikvideo till Ted Gärdestads "Helena" inspelad i miljö med Sivert Lindbloms skulpturer.',
    videoUrl: 'https://www.youtube.com/watch?v=yXAKq0KDpYk',
  },
  {
    year: 1974,
    title: 'Vad var Multikonst?',
    venue: 'SVT Play',
    desc: 'Program från SVT om Multikonst-projektet 1967 — en vandringsutställning i samarbete med Moderna Museet och Riksutställningar. Finns att se hos SVT Play (extern länk, kan inte bäddas in).',
    videoUrl: 'https://www.svtplay.se/video/eEgzYWK/multikonst-hela-sverige-gar-pa-utstallning',
  },
  {
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
    year: 1996,
    title: 'TV-intervju med Sivert Lindblom',
    venue: 'TV Eskilstuna / Minnenas Television',
    desc: 'Intervju med Sivert Lindblom för TV Eskilstuna 1996 — Minnenas Television.',
    videoUrl: 'https://www.youtube.com/embed/xhMABJ90HBE',
  },
  {
    year: 1996,
    title: 'Poetic Cinema — Landscape After Verlaine',
    venue: 'Carl Henrik Svenstedt',
    desc: 'Filmverk av Carl Henrik Svenstedt, 1996.',
  },
  {
    year: 1998,
    title: 'TV4-Uppland: kortintervju om skulptur',
    venue: 'TV4 Uppland',
    desc: 'I en 1-minuters intervju den 23 februari 1998 kommenterar Sivert Lindblom vilken skulptur han är mest nöjd med.',
    videoUrl: 'https://www.youtube.com/embed/bhWP7NP89YM',
  },
  {
    year: 1999,
    title: 'Torg i tiden — Gustav Adolfs torg, Malmö',
    venue: 'Malmö Stads Gatukontor',
    desc: 'En 23 minuter lång dokumentärfilm om Gustav Adolfs torgs historia i Malmö, producerad av Malmö Stads Gatukontor. Byggherre: Malmö kommun. Invigdes 12 juni 1999.',
    videoUrl: 'https://www.youtube.com/watch?v=-ba2Oq65qe4',
  },
  {
    year: 2001,
    title: 'Resningen av Profilen, Potatisåkern',
    venue: 'Malmö',
    desc: 'Film över resningen och installationen av Sivert Lindbloms skulptur "Profilen" på Potatisåkern bostadsområde i Malmö, 2001.',
    videoUrl: 'https://www.youtube.com/embed/hfwecUKJCJo',
  },
  {
    year: 1973,
    title: 'Skandinaviska Bankens Palats — Gustav Adolfs Torg',
    venue: 'Sveriges Riksbank',
    desc: 'Dokumentation av utsmyckningen av Riksbankens fasad vid Gustav Adolfs torg, Stockholm, 1973.',
    videoUrl: 'https://www.riksbank.se/sv/om-riksbanken/riksbankens-hus/',
  },
]

// Ögonblick — candid / behind-the-scenes photos (scraped from sivertlindblom.se)
const OGONBLICK_IMAGES = [
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/07/20180714_181121.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/07/20180714_181104.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/07/20180714_181039.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/07/20180714_181150.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/10/20181018_195227.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/10/20181018_195108.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/10/20181018_195148.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180203_160556.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180203_160613.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180203_160538.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180203_160518.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180203_160623_001.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/Lykta-Konstakademin.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/img296.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/08/20180817_135602.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/08/20180817_135547.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/08/20180817_135534.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/08/20180817_135458.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/08/20180817_135440.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180131_111554.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180131_111159.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180131_111221.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180131_111324.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180131_111349.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180131_111425.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20150118_201040.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/10/20170927_181311.jpg',
  'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/10/20170927_181256.jpg',
]

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const grafikProject = SCULPTURE_PROJECTS.find((p) => p.slug === 'grafik')
  const grafikImages = grafikProject?.images.map((i) => i.url) ?? []

  // LightboxImage arrays for thumbnail-grid tabs
  const grafikLightboxImages: LightboxImage[] = grafikImages.map((url) => ({ url, alt: 'Grafik' }))
  const pubLightboxImages: LightboxImage[] = PUBLICATIONS
    .filter((p) => !!p.imageUrl)
    .map((p) => ({ url: p.imageUrl!, alt: p.title, caption: [p.title, p.year].filter(Boolean).join(' — ') }))
  const fotoLightboxImages: LightboxImage[] = FOTOGRAFIER_IMAGES.map((img) => ({
    url: img.url,
    alt: img.caption ?? 'Fotografi',
    caption: img.caption,
  }))
  const ogonblickLightboxImages: LightboxImage[] = OGONBLICK_IMAGES.map((url) => ({ url, alt: 'Ögonblick' }))

  const TABS = [
    { id: 'skulptur',    label: dict.references?.sculpture_series ?? 'Skulptur',   count: SCULPTURE_SERIES.length },
    { id: 'grafik',      label: 'Grafik',                                           count: grafikImages.length },
    { id: 'film-tv',     label: dict.references?.film_tv ?? 'Film & TV',            count: FILMS.length },
    { id: 'publicerat',  label: dict.references?.publicerat ?? 'Publicerat' },
    { id: 'fotografi',   label: dict.references?.fotografier ?? 'Fotografier' },
    { id: 'utmarkelser', label: 'Utmärkelser' },
    { id: 'ogonblick',   label: 'Ögonblick' },
  ]

  return (
    <div className="section-gap">
      {/* Tabs — label embedded in tab strip row */}
      <TabsLayout
        tabs={TABS}
        defaultTab="skulptur"
        label={dict.references?.title ?? 'Referensmaterial'}
      >

        {/* ── 1. Skulptur ───────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="auto-grid-wide">
            {SCULPTURE_SERIES.map((s, i) => {
              const images = SLIDESHOW_IMAGES[s.key] ?? []
              return (
                <Link key={s.key} href={`/${locale}/references/${s.key}`} className="card card-hover" style={{ display: 'block', overflow: 'hidden', textDecoration: 'none' }}>
                  {images.length > 0 ? (
                    <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                      <PortfolioSlideshow images={images} alt={s.label} objectFit="cover" interval={3200 + i * 300} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '4/3', background: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', fontStyle: 'italic' }}>{s.label}</span>
                    </div>
                  )}
                  <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '0.4rem' }}>{s.label}</h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', margin: 0 }}>{s.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── 2. Grafik ─────────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          {grafikProject && (
            <>
              <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
                {grafikProject.years}
              </p>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, marginBottom: '0.75rem' }}>
                {grafikProject.title}
              </h2>
              <p style={{ color: 'var(--color-muted)', maxWidth: '65ch', fontSize: 'var(--fs-base)', lineHeight: 1.7, marginBottom: '2rem' }}>
                {grafikProject.body}
              </p>
            </>
          )}
          {grafikLightboxImages.length > 0 ? (
            <GalleryGrid images={grafikLightboxImages} aspectRatio="1/1" columns="sm" />
          ) : (
            <p style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: 'var(--fs-sm)' }}>
              Bilder laddas in…
            </p>
          )}
        </section>

        {/* ── 3. Film & TV ──────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
            {dict.references?.film_tv ?? 'Film & TV'}
          </h2>
          {FILMS.map((f) => {
            const ytId = f.videoUrl ? getYouTubeId(f.videoUrl) : null
            return (
              <div key={f.title} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '4rem 1fr', gap: '1.5rem' }}>
                  <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{f.year}</span>
                  <div>
                    <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.2rem', fontWeight: 500 }}>{f.title}</div>
                    {f.director && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.15rem' }}>{dict.references?.director ?? 'Regi'}: {f.director}</div>}
                    {f.venue && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.15rem' }}>{f.venue}</div>}
                    {f.desc && (
                      <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, margin: '0.5rem 0 0', maxWidth: '65ch' }}>
                        {f.desc}
                      </p>
                    )}
                    {f.videoUrl && !ytId && (
                      <a href={f.videoUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)' }}>
                        ▶ {dict.references?.watch ?? 'Se filmen'} →
                      </a>
                    )}
                  </div>
                </div>
                {ytId && (
                  <div style={{ marginTop: '1rem', marginLeft: '5.5rem', aspectRatio: '16/9', maxWidth: '640px', background: '#000', overflow: 'hidden' }}>
                    <iframe src={`https://www.youtube.com/embed/${ytId}`} title={f.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
                  </div>
                )}
                {f.extraVideos && f.extraVideos.map((ev, ei) => {
                  const evId = getYouTubeId(ev)
                  if (!evId) return null
                  return (
                    <div key={ei} style={{ marginTop: '0.75rem', marginLeft: '5.5rem', aspectRatio: '16/9', maxWidth: '640px', background: '#000', overflow: 'hidden' }}>
                      <iframe src={`https://www.youtube.com/embed/${evId}`} title={`${f.title} (del ${ei + 2})`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </section>

        {/* ── 4. Publicerat ─────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
            {dict.references?.publicerat ?? 'Publicerat'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
            {dict.references?.publicerat_desc ?? 'Kataloger, tidskriftsartiklar och böcker med texter om Sivert Lindbloms konstnärskap.'}
          </p>
          <GalleryGrid images={pubLightboxImages} aspectRatio="2/3" columns="sm" />
        </section>

        {/* ── 5. Fotografier ────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
            {dict.references?.fotografier ?? 'Fotografier & Inspiration'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
            {dict.references?.fotografier_desc ?? 'Bilder som på ett eller annat sätt berört och inspirerat Sivert Lindblom i sitt arbete.'}
          </p>
          <GalleryGrid images={fotoLightboxImages} aspectRatio="3/2" columns="sm" />
        </section>

        {/* ── 6. Utmärkelser ────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
            Utmärkelser, priser och medaljer
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '3rem', maxWidth: '60ch' }}>
            Priser mottagna av Sivert Lindblom samt medaljer och minnesmärken formgivna av honom.
          </p>

          {/* Medal collage */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {[
              { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Medaljer-Front.jpg',       alt: 'Medaljer åtsida' },
              { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/20180316_172048_001.jpg',  alt: 'Medaljer' },
            ].map((img) => (
              <SafeImg key={img.src} src={img.src} alt={img.alt} loading="lazy"
                style={{ height: 160, width: 'auto', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
            ))}
          </div>

          <h3 style={{ fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
            Mottagna priser
          </h3>

          {([
            {
              year: 1984, title: 'K A Linds Hederspris', sub: 'Moderna Museets Vänners kulturpris',
              links: [{ label: 'K A Linds Hederspris — Moderna Museets vänners skulpturpris', url: 'https://sv.wikipedia.org/wiki/Moderna_museets_v%C3%A4nners_skulpturpris' }],
            },
            {
              year: 1985, title: 'Stenpriset', sub: 'Sveriges Stenindustriförbund',
              links: [
                { label: 'Om Stenpriset (sten.se)', url: 'https://www.sten.se/stenpriset/' },
              ],
            },
            {
              year: 1989, title: 'Prins Eugen-medaljen',
              desc: 'Prins Eugen-medaljen instiftades av Konung Gustaf V i samband med Prins Eugens 80-årsdag år 1945. Medaljen tilldelas för framstående konstnärlig verksamhet. Medaljförläningen sker på Eugendagen den 5 november och själva utdelningen en kort tid därefter. Medaljen utdelas i guld (förgyllt silver) av 8:e storleken och bärs på bröstet i vitt-gult-vitt band med blå kantränder. Medaljmottagarens namn och årtal präglas på medaljens nedre rand.',
              links: [{ label: 'LÄS MER om medaljen och målarprinsen (Kungl. Maj:ts Orden)', url: 'https://kungligmajestatsorden.se/medaljer/prins-eugen-medaljen' }],
            },
            {
              year: 1995, title: 'Sergelpriset', sub: 'Kungl. Akademien för de fria konsterna, Stockholm',
              desc: 'Priset inrättades 1945 till minne av skulptören Johan Tobias Sergel. Det utdelas vart femte år på Sergels dödsdag den 26 februari och består av en guldmedalj med Sergels porträtt.',
            },
            {
              year: 2002, title: 'S:t Eriksmedaljen', sub: 'Stockholm stad',
              quote: '»Kreativ konstnär vars många sköna och spännande skulpturer på torg och broar är viktiga inslag i kulturstaden Stockholm«',
            },
            {
              year: 2002, title: 'Eskilstunakurirens kulturpris', sub: 'Eskilstuna-Kuriren',
            },
          ] as Array<{ year: number; title: string; sub?: string; desc?: string; quote?: string; links?: Array<{ label: string; url: string }> }>).map((p) => (
            <div key={p.title} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{p.year}</span>
                <div>
                  <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.25rem' }}>{p.title}</div>
                  {p.sub && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{p.sub}</div>}
                  {p.desc && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginTop: '0.5rem', maxWidth: '55ch' }}>{p.desc}</p>}
                  {p.quote && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', fontStyle: 'italic', lineHeight: 1.7, marginTop: '0.5rem', maxWidth: '55ch' }}>{p.quote}</p>}
                  {p.links && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {p.links.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)', paddingBottom: '0.1em', alignSelf: 'flex-start' }}>
                          {link.label} →
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <h3 style={{ fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1.25rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
            Medaljer formgivna av Sivert Lindblom
          </h3>

          {/* IVA */}
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>1992</span>
              <div>
                <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>Kungl. Ingenjörsvetenskapsakademiens (IVA) Minnesmedalj</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '60ch' }}>
                  Åtsida: Profil av arkitekten Gunnar Asplund. Frånsida: Symbol för Stockholmsutställningen 1930 med kompassnål N och upphöjd sfär, inspirerad av den egyptiska gudinnan Isis.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {[
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Asplund-medalj-1.jpg', alt: 'IVA medalj åtsida — Gunnar Asplund' },
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Asplund-medalj-2.jpg', alt: 'IVA medalj frånsida' },
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Isis-gudinna.jpg',      alt: 'Isis gudinna — inspiration' },
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Balusterdockor-1-1.jpg', alt: 'Balusterdockor' },
                  ].map(img => (
                    <SafeImg key={img.src} src={img.src} alt={img.alt} loading="lazy"
                      style={{ height: 120, width: 'auto', border: '1px solid var(--color-border)' }} />
                  ))}
                </div>
                <a href="https://youtu.be/uKDKR1KDdvQ" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)' }}>
                  ▶ Se film →
                </a>
              </div>
            </div>
          </div>

          {/* Vitterhetsakademien */}
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>2003</span>
              <div>
                <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>Kungl. Vitterhets Historie och Antikvitets Akademiens Jubileumsmedalj</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '60ch' }}>
                  Åtsida: latinskt motto <em>SEMPER VIRIDES</em> med tre lagerkransar. Frånsida: fasaden av Rettigska huset vid Villagatan 3, Stockholm. Utfördes i 2 exemplar i guld (till Kungen och Drottningen) samt 400 i silver till jubileumsbanketten den 20 mars 2003.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Akademien-Viridis-1.jpg', alt: 'Jubileumsmedalj åtsida — SEMPER VIRIDES' },
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Akademien-Viridis-2.jpg', alt: 'Jubileumsmedalj frånsida' },
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Jubileumsmedalj-1.jpeg',  alt: 'Jubileumsmedalj' },
                    { src: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Jubileumsmedalj-2.jpeg',  alt: 'Jubileumsmedalj detalj' },
                  ].map(img => (
                    <SafeImg key={img.src} src={img.src} alt={img.alt} loading="lazy"
                      style={{ height: 120, width: 'auto', border: '1px solid var(--color-border)' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Ögonblick ──────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, marginBottom: '0.75rem' }}>
            Ögonblick
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', maxWidth: '60ch', lineHeight: 1.7, marginBottom: '2rem' }}>
            Bilder på och med Sivert Lindblom — i atelén, vid invigningar och i vardagen.
          </p>
          {ogonblickLightboxImages.length > 0 && (
            <GalleryGrid images={ogonblickLightboxImages} aspectRatio="4/3" columns="sm" />
          )}
        </section>

      </TabsLayout>
    </div>
  )
}
