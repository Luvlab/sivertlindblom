import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Skulptur & Grafik' }

const SCULPTURE_SERIES = [
  { key: 'profiler', label: 'Profiler', desc: 'Profilskulpturer i sten och brons.' },
  { key: 'metamorfoser', label: 'Metamorfoser — Sittare', desc: 'Sittande figurer i metamorfos.' },
  { key: 'monoliter', label: 'Monoliter & Blystoder', desc: 'Monolitiska former, inkl. Paris 1977.' },
  { key: 'azteker', label: 'Azteker', desc: 'Aztekiskt inspirerade skulpturer.' },
  { key: 'tidiga', label: 'Tidiga skulpturer', desc: 'Verk från 1950- och 1960-talen.' },
  { key: 'kofeser', label: 'Kofeser', desc: 'En serie om meningslös meningsfullhet.' },
  { key: 'blyplattor', label: 'Blyplattor', desc: 'Reliefverk i bly.' },
  { key: 'tradkonstruktioner', label: 'Trädkonstruktioner', desc: 'Skulpturer i trä.' },
  { key: 'tornmodeller', label: 'Tornmodeller', desc: 'Modeller och förslag för torn.' },
  { key: 'arbetsmodeller', label: 'Arbetsmodeller & Förslag', desc: 'Tävlingsförslag och arbetsmodeller.' },
]

const FILMS = [
  { year: 1967, title: 'Beskrivning av en tankes rörelse', director: 'Lasse Forsberg' },
  { year: 1974, title: 'Vad var multikonst?', venue: 'SVT / Öppet Arkiv' },
  { year: 1993, title: 'Sivert Lindblom visar modeller', venue: 'Skissernas Museum, Lund' },
  { year: 1996, title: 'TV-intervju med Sivert Lindblom', venue: 'TV Eskilstuna' },
  { year: 2001, title: 'Resningen av Profilen, Potatisåkern', venue: 'Malmö' },
  { year: 2002, title: 'Fontänerna på Gustav Adolfs torg', venue: 'Malmö' },
]

export default function ReferencesPage() {
  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Skulptur & Grafik</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)' }}>Referensmaterial</h1>
        <p style={{ color: 'var(--color-muted)', marginTop: '1rem', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
          Skulpturserier, grafik, film och fotografier som dokumenterar Sivert Lindbloms konstnärliga produktion.
        </p>
      </div>

      <hr className="divider" />

      {/* Sculpture series */}
      <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>Skulpturserier</h2>
        <div className="auto-grid-wide">
          {SCULPTURE_SERIES.map((s) => (
            <div key={s.key} className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-lg)', marginBottom: '0.5rem' }}>{s.label}</h3>
              <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Film & TV */}
      <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>Film & TV</h2>
        {FILMS.map((f) => (
          <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '4rem 1fr', gap: '1.5rem', padding: '1rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{f.year}</span>
            <div>
              <div style={{ fontSize: 'var(--fs-base)' }}>{f.title}</div>
              {'director' in f && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.2rem' }}>Regi: {f.director}</div>}
              {'venue' in f && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '0.2rem' }}>{f.venue}</div>}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
