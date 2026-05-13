import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'
import SafeImg from '@/components/SafeImg'
import { SCULPTURE_PROJECTS } from '@/lib/sculpture-projects'

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

const SCULPTURE_SERIES = [
  { key: 'profiler', label: 'Profiler', desc: 'Profilskulpturer i sten och brons.' },
  { key: 'metamorfoser', label: 'Metamorfoser — Sittare', desc: 'Sittande figurer i metamorfos.' },
  { key: 'monoliter', label: 'Monoliter & Blystoder', desc: 'Monolitiska former, inkl. Paris 1977.' },
  { key: 'azteker', label: 'Azteker', desc: 'Aztekiskt inspirerade skulpturer.' },
  { key: 'tidiga-skulpturer', label: 'Tidiga skulpturer', desc: 'Verk från 1950- och 1960-talen.' },
  { key: 'kofeser', label: 'Kofeser', desc: 'En serie om meningslös meningsfullhet.' },
  { key: 'blyplattor', label: 'Blyplattor', desc: 'Reliefverk i bly.' },
  { key: 'tradkonstruktioner', label: 'Trädkonstruktioner', desc: 'Skulpturer i trä.' },
  { key: 'tornmodeller', label: 'Tornmodeller', desc: 'Modeller och förslag för torn.' },
  { key: 'arbetsmodeller', label: 'Arbetsmodeller & Förslag', desc: 'Arbetsmodeller i gips, lera och trä samt tävlingsförslag.' },
  { key: 'grafik', label: 'Grafik i urval', desc: 'Teckningar, grafikblad och studier.' },
]

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
    venue: 'SVT / Öppet Arkiv',
    desc: 'Program från SVT om Multikonst-projektet 1967 — en vandringsutsällning i samarbete med Moderna Museet och Riksutställningar. Finns att se hos SVT Öppet Arkiv (extern länk, kan inte bäddas in).',
    videoUrl: 'https://www.oppetarkiv.se/video/10872733/multikonst-hela-sverige-gar-pa-utstallning',
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

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          {dict.references?.subtitle ?? 'Skulptur & Grafik'}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
          {dict.references?.title ?? 'Referensmaterial'}
        </h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '1rem', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
          {dict.references?.intro ?? ''}
        </p>

        {/* Section nav */}
        <nav style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '2rem' }} aria-label="Sektioner">
          {[
            { href: '#skulptur',    label: dict.references?.sculpture_series ?? 'Skulpturserier' },
            { href: '#film-tv',     label: dict.references?.film_tv ?? 'Film & TV' },
            { href: '#publicerat',  label: dict.references?.published ?? 'Publicerat' },
            { href: '#fotografi',   label: dict.references?.photography ?? 'Fotografier & Inspiration' },
            { href: '#utmarkelser', label: dict.references?.awards ?? 'Utmärkelser & Medaljer' },
          ].map(({ href, label }) => (
            <a key={href} href={href} className="filter-link" style={{
              fontSize: 'var(--fs-xs)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              padding: '0.3em 0.8em',
              textDecoration: 'none',
            }}>
              {label}
            </a>
          ))}
        </nav>
      </div>

      <hr className="divider" />

      {/* Sculpture series */}
      <section id="skulptur" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
          {dict.references?.sculpture_series ?? 'Skulpturserier'}
        </h2>
        <div className="auto-grid-wide">
          {SCULPTURE_SERIES.map((s, i) => {
            const images = SLIDESHOW_IMAGES[s.key] ?? []
            return (
              <Link key={s.key} href={`/${locale}/references/${s.key}`} className="card card-hover" style={{ display: 'block', overflow: 'hidden', textDecoration: 'none' }}>
                {images.length > 0 ? (
                  <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden' }}>
                    <PortfolioSlideshow
                      images={images}
                      alt={s.label}
                      objectFit="cover"
                      interval={3200 + i * 300}
                    />
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: '4/3',
                    background: 'var(--color-bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
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

      <hr className="divider" />

      {/* Film & TV */}
      <section id="film-tv" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
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
                    <a
                      href={f.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: '0.75rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)' }}
                    >
                      ▶ {dict.references?.watch ?? 'Se filmen'} →
                    </a>
                  )}
                </div>
              </div>
              {ytId && (
                <div style={{ marginTop: '1rem', marginLeft: '5.5rem', aspectRatio: '16/9', maxWidth: '640px', background: '#000', borderRadius: 2, overflow: 'hidden' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    title={f.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  />
                </div>
              )}
              {f.extraVideos && f.extraVideos.map((ev, ei) => {
                const evId = getYouTubeId(ev)
                if (!evId) return null
                return (
                  <div key={ei} style={{ marginTop: '0.75rem', marginLeft: '5.5rem', aspectRatio: '16/9', maxWidth: '640px', background: '#000', borderRadius: 2, overflow: 'hidden' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${evId}`}
                      title={`${f.title} (del ${ei + 2})`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </section>

      <hr className="divider" />

      {/* Publicerat */}
      <section id="publicerat" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '1rem' }}>
          {dict.references?.publicerat ?? 'Publicerat'}
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
          {dict.references?.publicerat_desc ?? 'Kataloger, tidskriftsartiklar och böcker med texter om Sivert Lindbloms konstnärskap.'}
        </p>
        <Link href={`/${locale}/references/publicerat`} className="btn">
          {dict.references?.view_publicerat ?? 'Visa publikationer'} →
        </Link>
      </section>

      <hr className="divider" />

      {/* Fotografier & Inspiration */}
      <section id="fotografi" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '1rem' }}>
          {dict.references?.fotografier ?? 'Fotografier & Inspiration'}
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
          {dict.references?.fotografier_desc ?? 'Bilder som på ett eller annat sätt berört och inspirerat Sivert Lindblom i sitt arbete.'}
        </p>
        <Link href={`/${locale}/references/fotografier`} className="btn">
          {dict.references?.view_fotografier ?? 'Visa bildgalleri'} →
        </Link>
      </section>

      <hr className="divider" />

      {/* Utmärkelser */}
      <section id="utmarkelser" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
          Utmärkelser, priser och medaljer
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '3rem', maxWidth: '60ch' }}>
          Priser mottagna av Sivert Lindblom samt medaljer och minnesmärken formgivna av honom.
        </p>

        {/* Main medal collage */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {[
            { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Medaljer-Front.jpg',       alt: 'Medaljer åtsida' },
            { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/20180316_172048_001.jpg',  alt: 'Medaljer' },
          ].map((img) => (
            
            <SafeImg key={img.src} src={img.src} alt={img.alt} loading="lazy"
              style={{ height: 160, width: 'auto', objectFit: 'cover', border: '1px solid var(--color-border)' }}
            />
          ))}
        </div>

        <h3 style={{ fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
          Mottagna priser
        </h3>

        {/* K A Linds */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>1984</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.25rem' }}>K A Linds Hederspris</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>Moderna Museets Vänners kulturpris</div>
            </div>
          </div>
        </div>

        {/* Stenpriset */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>1985</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.25rem' }}>Stenpriset</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '1rem' }}>Sveriges Stenindustriförbund</div>
            </div>
          </div>
        </div>

        {/* Prins Eugen */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>1989</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)' }}>Prins Eugen-medaljen</div>
            </div>
          </div>
        </div>

        {/* Sergelpriset */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>1995</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>Sergelpriset</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Kungl. Akademien för de fria konsterna, Stockholm</div>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '55ch' }}>
                Priset inrättades 1945 till minne av skulptören Johan Tobias Sergel. Det utdelas vart femte år på Sergels dödsdag den 26 februari och består av en guldmedalj med Sergels porträtt.
              </p>
            </div>
          </div>
        </div>

        {/* S:t Eriksmedaljen */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>2002</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>S:t Eriksmedaljen</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.75rem' }}>Stockholm stad</div>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '55ch' }}>
                »Kreativ konstnär vars många sköna och spännande skulpturer på torg och broar är viktiga inslag i kulturstaden Stockholm«
              </p>
              {}
              <SafeImg src="https://sivertlindblom.se/wp-content/uploads/2018/05/S-t-Eriksmedalj.jpg" alt="S:t Eriksmedaljen"
                loading="lazy" style={{ height: 120, width: 'auto', border: '1px solid var(--color-border)' }}
              />
            </div>
          </div>
        </div>

        {/* Eskilstunakurirens kulturpris */}
        <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>2002</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>Eskilstunakurirens kulturpris</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '1rem' }}>Eskilstuna-Kuriren</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[1,2,3,4].map(n => (
                  
                  <SafeImg key={n}
                    src={`http://media.sivertlindblom.se/2015/03/Sivert-Lindblom-Eskilstuna-Kuriren-Kulturpris-${n}-.jpg`}
                    alt={`Eskilstunakurirens kulturpris ${n}`} loading="lazy"
                    style={{ height: 120, width: 'auto', border: '1px solid var(--color-border)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Medals designed by Sivert */}
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
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Asplund-medalj-1.jpg', alt: 'IVA medalj åtsida — Gunnar Asplund' },
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Asplund-medalj-2.jpg', alt: 'IVA medalj frånsida' },
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Isis-gudinna.jpg',      alt: 'Isis gudinna — inspiration' },
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Balusterdockor-1-1.jpg', alt: 'Balusterdockor' },
                ].map(img => (
                  
                  <SafeImg key={img.src} src={img.src} alt={img.alt} loading="lazy"
                    style={{ height: 120, width: 'auto', border: '1px solid var(--color-border)' }}
                  />
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
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Akademien-Viridis-1.jpg', alt: 'Jubileumsmedalj åtsida — SEMPER VIRIDES' },
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Akademien-Viridis-2.jpg', alt: 'Jubileumsmedalj frånsida' },
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Jubileumsmedalj-1.jpeg',  alt: 'Jubileumsmedalj' },
                  { src: 'https://sivertlindblom.se/wp-content/uploads/2018/05/Jubileumsmedalj-2.jpeg',  alt: 'Jubileumsmedalj detalj' },
                ].map(img => (
                  
                  <SafeImg key={img.src} src={img.src} alt={img.alt} loading="lazy"
                    style={{ height: 120, width: 'auto', border: '1px solid var(--color-border)' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
