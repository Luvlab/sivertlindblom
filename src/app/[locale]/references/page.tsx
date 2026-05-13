import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'
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

const FILMS: Array<{ year: number; title: string; director?: string; venue?: string; videoUrl?: string }> = [
  { year: 1967, title: 'Beskrivning av en tankes rörelse', director: 'Lasse Forsberg' },
  { year: 1972, title: 'Ted Gärdestad sjunger "Helena"', venue: 'med Sivert Lindbloms skulpturer', videoUrl: 'https://www.youtube.com/watch?v=yXAKq0KDpYk' },
  { year: 1974, title: 'Vad var Multikonst?', venue: 'SVT / Öppet Arkiv', videoUrl: 'https://www.oppetarkiv.se/video/10872733/multikonst-hela-sverige-gar-pa-utstallning' },
  { year: 1993, title: 'Sivert Lindblom visar modeller', venue: 'Skissernas Museum, Lund' },
  { year: 1996, title: 'Poetic Cinema — Landscape After Verlaine', venue: 'Carl Henrik Svenstedt' },
  { year: 1996, title: 'TV-intervju med Sivert Lindblom', venue: 'TV Eskilstuna' },
  { year: 1998, title: 'TV4-Uppland: kortintervju om skulptur', venue: 'TV4 Uppland' },
  { year: 2001, title: 'Resningen av Profilen, Potatisåkern', venue: 'Malmö' },
  { year: 2002, title: 'Fontänerna på Gustav Adolfs torg', venue: 'Malmö', videoUrl: 'https://www.youtube.com/watch?v=-ba2Oq65qe4' },
  { year: 1973, title: 'Skandinaviska Bankens Palats — Gustav Adolfs Torg', venue: 'Sveriges Riksbank', videoUrl: 'https://www.riksbank.se/sv/om-riksbanken/riksbankens-hus/' },
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
                  <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.2rem' }}>{f.title}</div>
                  {f.director && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{dict.references?.director ?? 'Regi'}: {f.director}</div>}
                  {f.venue && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{f.venue}</div>}
                  {f.videoUrl && !ytId && (
                    <a
                      href={f.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)' }}
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
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
          Utmärkelser, priser och medaljer
        </h2>

        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
          Mottagna priser
        </h3>
        {[
          { year: '1984', title: 'K A Linds Hederspris', org: 'Moderna Museets Vänners kulturpris' },
          { year: '1985', title: 'Stenpriset', org: 'Sveriges Stenindustriförbund' },
          { year: '1989', title: 'Prins Eugen-medaljen', org: '' },
          { year: '1995', title: 'Sergelpriset', org: 'Kungl. Akademien för de fria konsterna, Stockholm', desc: 'Priset inrättades 1945 till minne av Johan Tobias Sergel. Utdelas vart femte år på Sergels dödsdag 26 februari.' },
          { year: '2002', title: 'S:t Eriksmedaljen', org: 'Stockholm stad', desc: '»Kreativ konstnär vars många sköna och spännande skulpturer på torg och broar är viktiga inslag i kulturstaden Stockholm«' },
          { year: '2002', title: 'Eskilstunakurirens kulturpris', org: 'Eskilstuna-Kuriren' },
        ].map((a) => (
          <div key={a.title + a.year} style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{a.year}</span>
              <div>
                <span style={{ fontSize: 'var(--fs-base)' }}>{a.title}</span>
                {a.org && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginLeft: '0.75rem' }}>{a.org}</span>}
                {a.desc && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', marginTop: '0.35rem', fontStyle: 'italic', lineHeight: 1.6 }}>{a.desc}</p>}
              </div>
            </div>
          </div>
        ))}

        <h3 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1rem', marginTop: '2.5rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
          Medaljer formgivna av Sivert Lindblom
        </h3>
        {[
          {
            year: '1992',
            title: 'Kungl. Ingenjörsvetenskapsakademiens (IVA) Minnesmedalj',
            desc: 'Åtsida: Profil av arkitekten Gunnar Asplund. Frånsida: Symbol för Stockholmsutställningen 1930 med kompassnål N och upphöjd sfär, inspirerad av egyptiska gudinnan Isis.',
            videoUrl: 'https://youtu.be/uKDKR1KDdvQ',
          },
          {
            year: '2003',
            title: 'Kungl. Vitterhets Historie och Antikvitets Akademiens Jubileumsmedalj',
            desc: 'Åtsida: latinskt motto SEMPER VIRIDES med tre lagerkransar. Frånsida: fasaden av Rettigska huset vid Villagatan 3, Stockholm. 2 exemplar i guld (Kungen och Drottningen) samt 400 i silver till jubileumsbanketten 20 mars 2003.',
          },
        ].map((m) => (
          <div key={m.title} style={{ padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', paddingTop: '0.1rem' }}>{m.year}</span>
              <div>
                <div style={{ fontSize: 'var(--fs-base)' }}>{m.title}</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', marginTop: '0.35rem', lineHeight: 1.6 }}>{m.desc}</p>
                {m.videoUrl && (
                  <a href={m.videoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)' }}>
                    ▶ Se film →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
