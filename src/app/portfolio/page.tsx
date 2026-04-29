import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Portfolio' }

const CATEGORIES = [
  {
    key: 'exhibitions',
    label: 'Utställningar',
    sub: '1961 – 2016',
    desc: 'Solo- och grupputställningar i Sverige och internationellt, från Galerie Buren 1963 till VANDALORUM 2016.',
    image: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',
    count: 28,
  },
  {
    key: 'public-works',
    label: 'Offentliga arbeten',
    sub: 'Exteriörer & interiörer',
    desc: 'Skulpturer och installationer på torg, tunnelbanestationer, ambassader och bibliotek i Sverige och världen.',
    image: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg',
    count: 42,
  },
  {
    key: 'watercolors',
    label: 'Akvareller',
    sub: '1975 – 2012',
    desc: 'Ca 200 akvarellerade bilder — ett "mentalt konstruktivism"-projekt med hermetisk arkitektonisk geometri.',
    image: null,
    count: 50,
  },
  {
    key: 'scenography',
    label: 'Scenografi',
    sub: 'Teater & koreografi',
    desc: 'Scenografier för Stockholms Stadsteater, koreografier med Margareta Åsberg m.fl.',
    image: null,
    count: 6,
  },
]

export default function PortfolioPage() {
  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          Portfolio
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(2rem,4vw,3.5rem)', marginBottom: '1rem' }}>
          Konstnärskap 1961–2016
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
          Fyra kategorier dokumenterar Sivert Lindbloms konstnärliga arbete: utställningar, offentliga uppdrag, akvareller och scenografi.
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem' }}>
        <div className="auto-grid-wide">
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={`/portfolio/${cat.key}`} style={{ display: 'block' }}>
              <article className="card" style={{ overflow: 'hidden' }}>
                {cat.image ? (
                  <div className="img-zoom" style={{ aspectRatio: '16/9' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image} alt={cat.label} loading="lazy" />
                  </div>
                ) : (
                  <div style={{
                    aspectRatio: '16/9',
                    background: 'var(--color-bg-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--color-border)',
                  }}>
                    <span style={{ fontSize: 'var(--fs-4xl)', color: 'var(--color-border)', fontFamily: 'Georgia, serif' }}>
                      {cat.label.charAt(0)}
                    </span>
                  </div>
                )}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-xl)', margin: 0 }}>{cat.label}</h2>
                    <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{cat.count} verk</span>
                  </div>
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{cat.sub}</p>
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7 }}>{cat.desc}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
