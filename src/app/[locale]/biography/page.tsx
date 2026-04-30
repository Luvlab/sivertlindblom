import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'

export const metadata: Metadata = { title: 'Biography' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const TIMELINE = [
  { year: '1931',      label: 'Född i Husby-Rekarne, Södermanland' },
  { year: '1945–49',   label: 'Teknisk utbildning, Eskilstuna' },
  { year: '1949–51',   label: 'Lärlingsplats hos arkitekt Sigurd Lewerentz' },
  { year: '1954–58',   label: 'Teckningslärarseminarium, Stockholm' },
  { year: '1958–63',   label: 'Kungliga Konsthögskolan, Stockholm' },
  { year: '1957–74',   label: 'Samarbete med arkitekt Peter Celsing' },
  { year: '1963–66',   label: 'Bosatt i Locarno, Schweiz' },
  { year: '1966–70',   label: 'Lärare i formteori, KTH Arkitekturskolan' },
  { year: '1974–',     label: 'Ledamot, Kungliga Akademien för de fria konsterna' },
  { year: '1975–79',   label: 'Ledamot, Statens konstråd' },
  { year: '1985',      label: 'Stenpriset, Sveriges Stenindustrifförbund' },
  { year: '1989–',     label: 'Ledamot, Vägverkets skönhetsråd' },
  { year: '1991–',     label: 'Professor i skulptur, Kungliga Konsthögskolan' },
  { year: '1995',      label: 'Sergelpriset, Stockholm' },
]

const PUBLIC_COMMISSIONS = [
  { year: '2013', title: 'Bältesspännarparken', location: 'Göteborg' },
  { year: '2004', title: 'Roslagens Sparbank', location: 'Norrtälje' },
  { year: '2003', title: 'Nobelmonument', location: 'New York' },
  { year: '2002', title: 'Eskilstuna rondellen — Profilen', location: 'Eskilstuna' },
  { year: '2002', title: 'Gustav Adolfs torg, fontäner', location: 'Malmö' },
  { year: '2001', title: 'Potatisåkern — Profilen', location: 'Malmö' },
  { year: '1998', title: 'Kungliga Biblioteket', location: 'Stockholm' },
  { year: '1998', title: 'Sergels torg — Sergel monumentet', location: 'Stockholm' },
  { year: '1998', title: 'Synagoga förintelsenmonumentet', location: 'Stockholm' },
  { year: '1997–98', title: 'Kungsträdgården, norra delen', location: 'Stockholm' },
  { year: '1995–96', title: 'Cavallobrunnen, Resecentrum', location: 'Skövde' },
  { year: '1993', title: 'Haga Norra gångbro', location: 'Stockholm' },
  { year: '1993', title: 'Nobel Forum', location: 'Solna' },
  { year: '1992', title: 'SEB Banken Huvudkontor', location: 'Rissne' },
  { year: '1991', title: 'Berns Ljusgård', location: 'Stockholm' },
  { year: '1990–91', title: 'Sveriges ambassad, entré', location: 'Tokyo' },
  { year: '1989', title: 'Blasieholmstorg — Hästar i brons', location: 'Stockholm' },
  { year: '1988', title: 'SAS Huvudkontor, Frösundavik', location: 'Stockholm' },
  { year: '1988', title: 'Skissernas Museum, fasad', location: 'Lund' },
  { year: '1987–91', title: 'Stockholms Universitet Campus', location: 'Stockholm' },
  { year: '1986', title: 'Uppsala Stadsbibliotek', location: 'Uppsala' },
  { year: '1985', title: 'Göteborgs Universitetsbibliotek', location: 'Göteborg' },
  { year: '1984–85', title: 'Tetra Pak', location: 'Lausanne' },
  { year: '1984–85', title: 'Pharmacia entréplats', location: 'Uppsala' },
  { year: '1982', title: 'Riksbyggen/Göta Ark, Medborgarplatsen', location: 'Stockholm' },
  { year: '1975–85', title: 'Västra skogen T-banestation', location: 'Stockholm' },
  { year: '1975', title: 'Fersenska palatset, Handelsbanken', location: 'Stockholm' },
  { year: '1972', title: 'Garnisonen', location: 'Stockholm' },
  { year: '1966–67', title: 'Vällingby backe', location: 'Stockholm' },
  { year: '1965', title: 'Bronsgaller, Dagens Nyheter', location: 'Stockholm' },
]

const GROUP_EXHIBITIONS = [
  { year: '1968', title: '34:e Biennalen i Venedig', location: 'Venedig' },
  { year: '1972', title: 'Swedish Art 1972', location: 'Tokyo & Kyoto' },
  { year: '1973', title: 'Images du Nord, Art Suédois, Musée Dynamique', location: 'Dakar' },
  { year: '1975', title: '12 Svenska skulptörer, Malmö Konsthall', location: 'Malmö' },
  { year: '1977', title: 'Kunstmuseum Luzern, Live Show II', location: 'Schweiz' },
  { year: '1979', title: 'Biennale Middelheim', location: 'Antwerpen' },
]

export default async function BiographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      {/* Header */}
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
          {dict.nav?.biography ?? 'Biografi'}
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1rem' }}>
          {dict.biography?.title ?? 'Sivert Lindblom'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '65ch', fontSize: 'var(--fs-base)', lineHeight: 1.8 }}>
          {dict.biography?.intro ?? ''}
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,480px),1fr))', gap: '4rem' }}>

          {/* Timeline */}
          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
              {dict.biography?.timeline ?? 'Kronologi'}
            </h2>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', flexShrink: 0 }}>{t.year}</span>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{t.label}</span>
              </div>
            ))}
          </section>

          {/* Group exhibitions */}
          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
              {dict.biography?.group_exhibitions ?? 'Grupputställningar i urval'}
            </h2>
            {GROUP_EXHIBITIONS.map((e, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{e.year}</span>
                <span style={{ fontSize: 'var(--fs-sm)' }}>{e.title}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{e.location}</span>
              </div>
            ))}
          </section>
        </div>
      </div>

      <hr className="divider" style={{ margin: '4rem 0' }} />

      {/* Public commissions */}
      <section className="page-pad" style={{ paddingBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
          {dict.biography?.public_commissions ?? 'Offentliga uppdrag i urval'}
        </h2>
        <div>
          {PUBLIC_COMMISSIONS.map((c, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '7rem 1fr auto', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{c.year}</span>
              <span style={{ fontSize: 'var(--fs-sm)' }}>{c.title}</span>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{c.location}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" style={{ margin: '0 0 4rem' }} />

      {/* Photographs of Sivert */}
      <section className="page-pad" style={{ paddingBottom: '5rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
          {dict.biography?.photographs ?? 'Fotografier'}
        </h2>
        <div className="bio-photo-grid">
          {[
            { url: 'https://sivertlindblom.se/wp-content/uploads/2012/12/Sivert-skulptör.jpg',        caption: 'Sivert Lindblom, skulptör' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Porträtt-SivertMattias.jpg', caption: 'Porträtt. Foto: Mathias Johansson' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20121028_135427.jpg',         caption: 'Konstakademien 2012. Foto: Jan Öqvist' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-sten-kopia.jpg',       caption: 'Sivert med sten. Foto: Jan Öqvist' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20130308_101452.jpg',         caption: 'Bergmans Konstgjuteri, Enskede 2013. Foto: Jan Öqvist' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert571-kopia.jpg',         caption: 'Sivert vid Kejsar Konstantins hand, Capitolium museet, Rom' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2012/12/Sivert-skulpterar-1.jpg',     caption: 'Sivert skulpterar' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20121101_151438.jpg',         caption: 'Ateljén. Foto: Jan Öqvist' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/fotokarta-1963.jpg',          caption: 'Fotokort, 1963' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-91.jpg',           caption: 'Eskilstuna. Foto: Lasse Larsson' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Eskilstuna-arb-161.jpg',      caption: 'I arbete, Eskilstuna. Foto: Lasse Larsson' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/DSC01888-kopia.jpg',          caption: 'Sivert Lindblom' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20120614_173855-kopia.jpg',   caption: 'Foto: Jan Öqvist' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/SAM_7961.jpg',                caption: 'Foto: Jan Öqvist' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Siverts-exit.jpg',            caption: 'Siverts exit' },
            { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20130308_103958.jpg',         caption: 'Gjuteriet 2013. Foto: Jan Öqvist' },
          ].map((photo, i) => (
            <div key={i} style={{ marginBottom: '6px', breakInside: 'avoid', lineHeight: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption}
                loading={i < 8 ? 'eager' : 'lazy'}
                title={photo.caption}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ))}
        </div>
        <style>{`
          .bio-photo-grid { columns: 4; column-gap: 6px; }
          @media (max-width: 480px)  { .bio-photo-grid { columns: 2; } }
          @media (min-width: 481px) and (max-width: 768px) { .bio-photo-grid { columns: 3; } }
        `}</style>
      </section>
    </div>
  )
}
