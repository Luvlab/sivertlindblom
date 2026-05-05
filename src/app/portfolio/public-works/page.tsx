import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Offentliga arbeten' }

const EXTERIORS = [
  { title: 'Blasieholmstorg — Hästar i brons', year: 1989, location: 'Stockholm', images: ['https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg'] },
  { title: 'Gustav Adolfs torg, fontäner', year: 2002, location: 'Malmö', images: [] },
  { title: 'Nobelmonument', year: 2003, location: 'New York', images: [] },
  { title: 'Sergels torg — Sergel monumentet', year: 1998, location: 'Stockholm', images: [] },
  { title: 'Kungliga Biblioteket', year: 1998, location: 'Stockholm', images: [] },
  { title: 'Synagoga — Förintelsenmonumentet', year: 1998, location: 'Stockholm', images: [] },
  { title: 'Stockholms Universitet Campus', year: 1987, location: 'Stockholm', images: [] },
  { title: 'SAS Huvudkontor, Frösundavik', year: 1988, location: 'Stockholm', images: [] },
  { title: 'Skissernas Museum, fasad', year: 1988, location: 'Lund', images: [] },
  { title: 'Haga Norra gångbro', year: 1993, location: 'Stockholm', images: [] },
  { title: 'Cavallobrunnen, Resecentrum', year: 1995, location: 'Skövde', images: [] },
  { title: 'Potatisåkern — Profilen', year: 2001, location: 'Malmö', images: [] },
  { title: 'Eskilstuna rondellen — Profilen', year: 2002, location: 'Eskilstuna', images: [] },
  { title: 'Bältesspännarparken', year: 2013, location: 'Göteborg', images: [] },
  { title: 'SEB Banken Huvudkontor', year: 1992, location: 'Rissne', images: [] },
  { title: 'Sveriges ambassad, entré', year: 1990, location: 'Tokyo', images: [] },
  { title: 'Pharmacia entréplats', year: 1984, location: 'Uppsala', images: [] },
  { title: 'Kungsträdgården, norra delen', year: 1997, location: 'Stockholm', images: [] },
  { title: 'Fersenska Palatset, Handelsbanken', year: 1975, location: 'Stockholm', images: [] },
  { title: 'Garnisonen', year: 1972, location: 'Stockholm', images: [] },
]

const INTERIORS = [
  { title: 'Nobel Forum', year: 1993, location: 'Solna' },
  { title: 'Berns Ljusgård', year: 1991, location: 'Stockholm' },
  { title: 'Västra skogen T-banestation', year: 1975, location: 'Stockholm' },
  { title: 'Sveriges Riksbank', year: 1973, location: 'Stockholm' },
  { title: 'Riksbyggen/Göta Ark, Medborgarplatsen', year: 1984, location: 'Stockholm' },
  { title: 'Tetra Pak', year: 1984, location: 'Lausanne' },
  { title: 'Göteborgs Universitetsbibliotek', year: 1985, location: 'Göteborg' },
  { title: 'NK Ljusgård', year: 1968, location: 'Stockholm' },
  { title: 'Stadsteatern Stockholm', year: 1970, location: 'Stockholm' },
]

function WorkRow({ title, year, location }: { title: string; year: number; location: string }) {
  return (
    <div
      className="row-hover"
      style={{
        display: 'grid',
        gridTemplateColumns: '5rem 1fr auto',
        gap: '1.5rem',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-accent)', fontFamily: 'Georgia, serif' }}>{year}</span>
      <span style={{ fontSize: 'var(--fs-base)' }}>{title}</span>
      <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{location}</span>
    </div>
  )
}

export default function PublicWorksPage() {
  return (
    <div className="section-gap">
      {/* Header with Blasieholmstorg hero */}
      <div style={{ position: 'relative', height: '50vh', minHeight: 280, overflow: 'hidden', marginBottom: '4rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg"
          alt="Offentliga arbeten"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.95) 100%)' }} />
        <div className="page-pad" style={{ position: 'absolute', bottom: '2rem', left: 0, right: 0 }}>
          <Link href="/portfolio" style={{ fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Portfolio</Link>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '0.5rem' }}>
            Offentliga arbeten
          </h1>
        </div>
      </div>

      <div className="page-pad">
        {/* Blasieholmstorg gallery */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.5rem' }}>Blasieholmstorg, Stockholm 1989</h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
            Två grönpatinerade bronshästar modellerade efter originalen på San Marcos basilika i Venedig. Gjutna av Herman Bergmans Konstgjuteri AB.
          </p>
          <div className="auto-grid" style={{ gap: '2px' }}>
            {[
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-75.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-68.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-42.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-02.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-57.jpg',
              'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Blasieholms-Torg-60.jpg',
            ].map((url, i) => (
              <div key={i} className="img-zoom" style={{ aspectRatio: '4/3' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Blasieholmstorg ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        {/* Exteriörer list */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>Exteriörer</h2>
          {EXTERIORS.sort((a, b) => b.year - a.year).map((w) => (
            <WorkRow key={w.title} {...w} />
          ))}
        </section>

        {/* Interiörer list */}
        <section>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>Interiörer</h2>
          {INTERIORS.sort((a, b) => b.year - a.year).map((w) => (
            <WorkRow key={w.title} {...w} />
          ))}
        </section>
      </div>
    </div>
  )
}
