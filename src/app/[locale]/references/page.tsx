import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Sculpture & Graphics' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

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
      <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
          {dict.references?.sculpture_series ?? 'Skulpturserier'}
        </h2>
        <div className="auto-grid-wide">
          {SCULPTURE_SERIES.map((s) => (
            <Link key={s.key} href={`/${locale}/references/${s.key}`} className="card card-hover" style={{ padding: '1.5rem', display: 'block' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '0.5rem' }}>{s.label}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Film & TV */}
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
      <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
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
      <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
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
    </div>
  )
}
