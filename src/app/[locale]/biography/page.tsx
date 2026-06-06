import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import MasonryGallery from '@/components/gallery/MasonryGallery'
import TabsLayout from '@/components/TabsLayout'
import { createAdminClient } from '@/lib/supabase/admin'
import { cacheTag, cacheLife } from 'next/cache'
import { FALLBACK_SETTINGS } from '@/lib/db'

const DEFAULT_PORTRAIT = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Portratt-SivertMattias.jpg'

const DEFAULT_PHOTOS: Array<{ url: string; caption: string }> = [
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2012/12/Sivert-skulptor.jpg',        caption: 'Sivert Lindblom, skulptör' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Portratt-SivertMattias.jpg', caption: 'Porträtt. Foto: Mathias Johansson' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_135427.jpg',         caption: 'Konstakademien 2012. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-sten-kopia.jpg',       caption: 'Sivert med sten. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20130308_101452.jpg',         caption: 'Bergmans Konstgjuteri, Enskede 2013. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert571-kopia.jpg',         caption: 'Sivert vid Kejsar Konstantins hand, Capitolium museet, Rom' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2012/12/Sivert-skulpterar-1.jpg',     caption: 'Sivert skulpterar' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121101_151438.jpg',         caption: 'Ateljén. Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/fotokarta-1963.jpg',          caption: 'Fotokort, 1963' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Eskilstuna-91.jpg',           caption: 'Eskilstuna. Foto: Lasse Larsson' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Eskilstuna-arb-161.jpg',      caption: 'I arbete, Eskilstuna. Foto: Lasse Larsson' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/DSC01888-kopia.jpg',          caption: 'Sivert Lindblom' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20120614_173855-kopia.jpg',   caption: 'Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7961.jpg',                caption: 'Foto: Jan Öqvist' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Siverts-exit.jpg',            caption: 'Siverts exit' },
  { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20130308_103958.jpg',         caption: 'Gjuteriet 2013. Foto: Jan Öqvist' },
]

async function getBiographySettings(): Promise<{
  intro: string
  portrait: string
  photos: Array<{ url: string; caption: string }>
}> {
  'use cache'
  cacheTag('biography')
  cacheLife('hours')
  try {
    const supabase = createAdminClient()
    if (supabase) {
      const { data } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['biography_intro', 'biography_portrait', 'biography_photos'])
      if (data?.length) {
        const map: Record<string, string> = {}
        data.forEach(({ key, value }: { key: string; value: string }) => { map[key] = value })
        let photos = DEFAULT_PHOTOS
        if (map.biography_photos) {
          try { photos = JSON.parse(map.biography_photos) } catch { /* ignore */ }
        }
        return {
          intro: map.biography_intro ?? FALLBACK_SETTINGS.biography_intro ?? '',
          portrait: map.biography_portrait ?? DEFAULT_PORTRAIT,
          photos,
        }
      }
    }
  } catch { /* ignore */ }
  return {
    intro: FALLBACK_SETTINGS.biography_intro ?? '',
    portrait: FALLBACK_SETTINGS.biography_portrait ?? DEFAULT_PORTRAIT,
    photos: DEFAULT_PHOTOS,
  }
}

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

const AWARDS: Array<{
  year: string
  title: string
  description?: string
  images?: string[]
  links?: Array<{ prefix: string; label: string; url: string }>
}> = [
  {
    year: '1985',
    title: 'Stenpriset — Sveriges Stenindustriförbund',
    links: [
      { prefix: 'LÄS OM', label: 'Om Stenpriset till Sivert Lindblom — Sveriges Stenindustriförbund 1985', url: '/texts/stenpriset-1985' },
      { prefix: 'HÄMTA', label: 'Sten 1985 — artikel (PDF)', url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Sten-1985opt-.pdf' },
      { prefix: 'LÄS MER', label: 'sten.se/stenpriset', url: 'https://www.sten.se/stenpriset/' },
    ],
  },
  {
    year: '1995',
    title: 'Sergelpriset, Stockholm',
  },
  {
    year: '2002',
    title: 'S:t Eriksmedaljen',
    images: [
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/st-eriksmedaljen.jpg',
    ],
  },
  {
    year: '',
    title: 'K A Linds Hederspris — Moderna Museets vänners kulturpris',
    links: [
      { prefix: 'LÄS MER', label: 'Moderna museets vänners skulpturpris — Wikipedia', url: 'https://sv.wikipedia.org/wiki/Moderna_museets_v%C3%A4nners_skulpturpris' },
    ],
  },
  {
    year: '',
    title: 'Prins Eugen-medaljen',
    description: 'Prins Eugen-medaljen instiftades av Konung Gustaf V i samband med Prins Eugens 80-årsdag år 1945. Medaljen tilldelas för framstående konstnärlig verksamhet. Medaljförläningen sker på Eugendagen den 5 november och själva utdelningen en kort tid därefter. Medaljen utdelas i guld (förgyllt silver) av 8:e storleken och bärs på bröstet i vitt-gult-vitt band med blå kantränder. Medaljmottagarens namn och årtal präglas på medaljens nedre rand.',
    images: [
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/prins-eugen-medaljen.jpg',
    ],
    links: [
      { prefix: 'LÄS MER', label: 'Om medaljen och målarprinsen — Kungl. Maj:ts Orden', url: 'https://kungligmajestatsorden.se/medaljer/prins-eugen-medaljen' },
    ],
  },
  {
    year: '',
    title: 'Eskilstuna Kuriren Kulturpris',
    images: [
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-1.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-2.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-3.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-4.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-5.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-6.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-7.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-8.jpg',
      'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/biography/priser/eskilstuna-kulturpris-9.jpg',
    ],
  },
]

const PUBLIC_COMMISSIONS: Array<{ year: string; title: string; location: string; slug?: string }> = [
  { year: '2013', title: 'Bältesspännarparken', location: 'Göteborg',  slug: 'baltesspannarparken-goteborg-2013' },
  { year: '2004', title: 'Roslagens Sparbank', location: 'Norrtälje' },
  { year: '2003', title: 'Nobelmonument', location: 'New York',          slug: 'nobelmonument-new-york-2003' },
  { year: '2002', title: 'Eskilstuna rondellen — Profilen', location: 'Eskilstuna' },
  { year: '2002', title: 'Gustav Adolfs torg, fontäner', location: 'Malmö', slug: 'gustav-adolfs-torg-malmo-2002' },
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
  { year: '1989', title: 'Blasieholmstorg — Hästar i brons', location: 'Stockholm', slug: 'blasieholmstorg-stockholm-1989' },
  { year: '1988', title: 'SAS Huvudkontor, Frösundavik', location: 'Stockholm' },
  { year: '1988', title: 'Skissernas Museum, fasad', location: 'Lund' },
  { year: '1987–91', title: 'Stockholms Universitet Campus', location: 'Stockholm', slug: 'stockholms-universitet-campus-1987-91' },
  { year: '1986', title: 'Uppsala Stadsbibliotek', location: 'Uppsala' },
  { year: '1985', title: 'Göteborgs Universitetsbibliotek', location: 'Göteborg' },
  { year: '1984–85', title: 'Tetra Pak', location: 'Lausanne' },
  { year: '1984–85', title: 'Pharmacia entréplats', location: 'Uppsala' },
  { year: '1982', title: 'Riksbyggen/Göta Ark, Medborgarplatsen', location: 'Stockholm' },
  { year: '1975–85', title: 'Västra skogen T-banestation', location: 'Stockholm', slug: 'vastra-skogen-t-banestation-1975-1985' },
  { year: '1975', title: 'Fersenska palatset, Handelsbanken', location: 'Stockholm' },
  { year: '1972', title: 'Garnisonen', location: 'Stockholm' },
  { year: '1966–67', title: 'Vällingby backe', location: 'Stockholm' },
  { year: '1965', title: 'Bronsgaller, Dagens Nyheter', location: 'Stockholm' },
]

const GROUP_EXHIBITIONS: Array<{ year: string; title: string; location: string; slug?: string }> = [
  { year: '1968', title: '34:e Biennalen i Venedig', location: 'Venedig',      slug: 'biennale-venezia-1968' },
  { year: '1972', title: 'Swedish Art 1972', location: 'Tokyo & Kyoto',         slug: 'swedish-art-1972' },
  { year: '1973', title: 'Images du Nord, Art Suédois, Musée Dynamique', location: 'Dakar', slug: 'musee-dynamique-1973' },
  { year: '1975', title: '12 Svenska skulptörer, Malmö Konsthall', location: 'Malmö', slug: 'skulptorer-1975' },
  { year: '1977', title: 'Kunstmuseum Luzern, Live Show II', location: 'Schweiz', slug: 'kunstmuseum-luzern-1977' },
  { year: '1979', title: 'Biennale Middelheim', location: 'Antwerpen',          slug: 'biennale-middelheim-1979' },
]

const BIBLIOGRAPHY = [
  { year: '1963', text: 'Katalog Galerie Burén, Förord av Leon Rappaport' },
  { year: '1963', text: 'Stockholms Tidningen, Arne Törnqvist' },
  { year: '1964', text: 'Konstrevy nr 1 – »Sivert Lindblom«, Jimmy Nyström' },
  { year: '1966', text: 'Leif Nylén, Konstrevy 5–6' },
  { year: '1966', text: 'Leif Nylén, DN – Biennalen i Venedig 1968' },
  { year: '1966', text: 'Ulf Linde, DN 23 november' },
  { year: '1967', text: 'Paletten nr 1 – »Reflexer«, Arne Törnqvist' },
  { year: '1967', text: 'Thomas Lehner über Sivert Lindblom im Nürnberger Biennale' },
  { year: '1967', text: 'Konstrevy nr 2 – »Samtal med Sivert Lindblom«, Beate Sydhoff' },
  { year: '1968', text: 'Paletten nr 2 – »Bildens emancipation« (SL)' },
  { year: '1968', text: 'Paletten nr 4 – Debattinlägg (SL)' },
  { year: '1968', text: 'Katalog La 34 Biennale di Venezia – Modelli e disegni 1964–1968 (SL)' },
  { year: '1968', text: 'Meddelande från Moderna Museet 27–28 – Enkät, konstnärer om multikonst' },
  { year: '1969', text: 'Galleri Östergren Malmö 1969' },
  { year: '1969', text: 'ART and Artists nr 2, vol. 4 – »The Music of Time«, Olle Granath' },
  { year: '1970', text: 'Baumeister nr 9 – »Kunst am Bau; Das Landzeichen«' },
  { year: '1970', text: 'Katalogtext für »Der Raum« am Kunsthalle Nürnberg 1970' },
  { year: '1972', text: 'Paletten nr 2 – »Skulpturer«' },
  { year: '1973', text: 'Form nr 10 – »Vad avslöjar formen?«, Staffan Cullberg' },
  { year: '1974', text: 'Sivert Lindblom – Katalogtext till »Live Show«, Moderna Museet' },
  { year: '1974', text: 'Paletten nr 3 – »Live Show«, Christian Chambert' },
  { year: '1976', text: 'Riksbanken, Birgitta Nyblom, DN – På Stan 3–9 januari' },
  { year: '1977', text: 'Konstnärer i miljögestaltningen – Rapport från konferens i Linköping, arr. Statens Kulturråd, Jan Torsten Ahlstrand' },
  { year: '1977', text: 'Katalog Live Show II – North-Information No. 30' },
  { year: '1977', text: 'Katalog Kunstmuseum Luzern, »Live Show 2«, Jean-Christophe Ammann' },
  { year: '1978', text: 'North nr 37 – (Ohne Worte), (SL)' },
  { year: '1978', text: 'Kalejdoskop nr 1 – »Azteker«, (SL)' },
  { year: '1980', text: 'Katalog Centre Culturel Suédois, Paris – »Sans Titre«, Torsten Ekbom, Lars Bergquist' },
  { year: '1981', text: 'Kris nr 17–18 – »Kommentarer«, Stig Larsson' },
  { year: '1982', text: 'Konstnärscentrums Tidning nr 2 – »Konst som arkitektur – arkitektur som konst«, intervju Agneta Freccero' },
  { year: '1982', text: 'Arkitektur nr 2 – »Ateljé och sommarhus på Gotland«, Olof Hultin' },
  { year: '1983', text: 'Form nr 1 – »Medelhavsmuseet ett lysande provisorium«, Monica Boman' },
  { year: '1983', text: 'Kris nr 25–26 – »IBID.: Sivert Lindblom«' },
  { year: '1983', text: 'Arkitektur nr 5 – »Att ge det verkliga rummet sitt uttryck«, intervju Eva Eriksson' },
  { year: '1983', text: 'Konstnärscentrums Tidning nr 3 – »Riksbanken« »…och flera rum«, Agneta Freccero' },
  { year: '1983', text: 'Konstnären som kommentator – »Bildens emancipation«; »Live Show«, (SL), red. Bo Nilsson' },
  { year: '1985', text: 'Riksutställningar och Konstnärscentrum, Meddelande Bo 85 – »Jag vill skapa vardagslivets kultrum«, intervju Peder Alton' },
  { year: '1985', text: 'Sten nr 2 – Stenpriset 1985' },
  { year: '1985', text: 'Statens Konstråd nr 12 – Göteborgs Universitetsbibliotek' },
  { year: '1986', text: 'Katalog Malmö Konsthall – »Metapolis«, Björn Springfeldt' },
  { year: '1986', text: '»Bra konst i bra arkitektur« – symposium KRO distrikt 17 och SAR-MSA' },
  { year: '1988', text: 'Statens Konstråd nr 17–18 – »Att behärska sina medel«, (SL)' },
  { year: '1988', text: 'Arkitektur nr 10 – »Konstmuseet, Lund«, Karl Koistinen (SL)' },
  { year: '1989', text: 'Baumeister nr 5 – Anbau an das Kunstmuseum in Lund' },
  { year: '1989', text: 'Jubileumstidskrift Humanistiska Föreningen, Stockholms Universitet – Intervju, Jan Åman' },
  { year: '1990', text: 'Sten nr 2 – Blasieholmstorg – Uppsala Stadsbibliotek' },
  { year: '1990', text: 'Svenska Forskningsinstitutet, Istanbul – »Från Hippodromen i Konstantinopel till Blasieholmstorg«, Ulf Abel; »Två bronshästars väg till Blasieholmstorg«, Ulla Ehrensvärd & (SL)' },
  { year: '1992', text: 'Statens Konstråd årskatalog 1991 nr 22 – »Här ligger en sfinx begraven!«, Inga-Maj Beck' },
  { year: '1993', text: 'Stefan Alenius – Text till katalog »SKULPTUR ARKITEKTUR«, Skissernas museum' },
  { year: '1993', text: 'Cecilia Nelson – Förord till katalog »SKULPTUR«, Lunds konsthall' },
  { year: '1993', text: 'Daniel Birnbaum – Förord till katalog »SKULPTUR«, Lunds konsthall' },
  { year: '1993', text: 'Stig Larsson – Text till katalog »SKULPTUR«, Lunds konsthall' },
  { year: '1993', text: 'Jan Torsten Ahlstrand – Förord till katalog »SKULPTUR ARKITEKTUR«, Skissernas museum' },
  { year: '2012', text: 'Jan Öqvist – Text till katalog »AKVARELLER – m.m.«' },
  { year: '2012', text: 'Peter Cornell – Text till katalog »AKVARELLER – m.m.«' },
  { year: '2012', text: 'Catharina Gabrielsson – Text till katalog »AKVARELLER«' },
]

const TABS = [
  { id: 'biografi',           label: 'Biografi' },
  { id: 'offentliga-uppdrag', label: 'Offentliga uppdrag' },
  { id: 'grupputstallningar', label: 'Grupputställningar' },
  { id: 'litteratur',         label: 'Litteraturförteckning' },
  { id: 'fotografier',        label: 'Fotografier' },
]

export default async function BiographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [dict, bioSettings] = await Promise.all([
    getDictionary(locale as Locale),
    getBiographySettings(),
  ])
  const { intro: bioIntro, portrait: PORTRAIT_URL, photos: bioPhotos } = bioSettings

  return (
    <div style={{ paddingBottom: '5rem', marginTop: 'calc(-1 * var(--header-h))' }}>
      {/* ── Tabs — strip sits flush under fixed header ─────────── */}
      <TabsLayout tabs={TABS} defaultTab="biografi" label={dict.nav?.biography ?? 'Biografi'}>

        {/* ── Tab 1: Biografi ── */}
        <section className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
          <style>{`
            .bio-hero {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: clamp(1.5rem, 3vw, 3rem);
              margin-bottom: 2.5rem;
              align-items: start;
            }
            .bio-portrait {
              position: relative;
              height: calc(100dvh - var(--header-h) - var(--subnav-h));
              max-height: 90vh;
              border-radius: 2px;
              overflow: hidden;
              background: var(--color-bg-surface);
            }
            @media (max-width: 700px) {
              .bio-hero { grid-template-columns: 1fr; }
              .bio-portrait {
                height: auto;
                aspect-ratio: 4/3;
                order: -1;
              }
            }
          `}</style>

          {/* Intro header with portrait — 50/50 desktop, stacked mobile */}
          <div className="bio-hero">
            <div>
              <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
                {dict.nav?.biography ?? 'Biografi'}
              </p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginBottom: '1rem' }}>
                {dict.biography?.title ?? 'Sivert Lindblom'}
              </h1>
              {(bioIntro || dict.biography?.intro) && (
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.8 }}>
                  {bioIntro || dict.biography?.intro}
                </p>
              )}
            </div>
            <div className="bio-portrait">
              <Image
                src={PORTRAIT_URL}
                alt="Sivert Lindblom. Foto: Mathias Johansson"
                fill
                sizes="(max-width: 700px) 100vw, 50vw"
                style={{ objectFit: 'cover', objectPosition: 'top center' }}
                priority
              />
            </div>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
            {dict.biography?.timeline ?? 'Kronologi'}
          </h2>
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', flexShrink: 0 }}>{t.year}</span>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)' }}>{(dict.biography as any)?.[`timeline_${i}`] ?? t.label}</span>
            </div>
          ))}

          {/* ── Priser & utmärkelser ── */}
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginTop: '3rem', marginBottom: '2rem' }}>
            Priser &amp; utmärkelser
          </h2>
          {AWARDS.map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid var(--color-border)', alignItems: 'start' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', flexShrink: 0, paddingTop: '0.1rem' }}>{a.year}</span>
              <div>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', display: 'block' }}>{a.title}</span>
                {a.description && (
                  <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', lineHeight: 1.7, marginTop: '0.5rem', marginBottom: '0.25rem' }}>{a.description}</p>
                )}
                {a.images && a.images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
                    {a.images.map((src, k) => (
                      <div key={k} style={{ position: 'relative', width: '9rem', height: '6.5rem', borderRadius: 2, overflow: 'hidden', background: 'var(--color-bg-surface)', flexShrink: 0 }}>
                        <Image src={src} alt={a.title} fill sizes="9rem" style={{ objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                )}
                {a.links && a.links.length > 0 && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.5rem' }}>
                    {a.links.map((lnk, j) => (
                      <a
                        key={j}
                        href={lnk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textDecoration: 'none', letterSpacing: '0.06em' }}
                      >
                        <span style={{ opacity: 0.6, marginRight: '0.35em' }}>{lnk.prefix}</span>
                        {lnk.label} →
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── Tab 2: Offentliga uppdrag ── */}
        <section className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
            {dict.biography?.public_commissions ?? 'Offentliga uppdrag i urval'}
          </h2>
          {PUBLIC_COMMISSIONS.map((c, i) => {
            const rowStyle = { display: 'grid', gridTemplateColumns: '7rem 1fr auto', gap: '1rem', padding: '0.85rem 0', borderBottom: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit' } as const
            const inner = (
              <>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{c.year}</span>
                <span style={{ fontSize: 'var(--fs-sm)' }}>{c.title}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{c.location}</span>
              </>
            )
            return c.slug
              ? <Link key={i} href={`/${locale}/portfolio/public-works/${c.slug}`} className="row-hover" style={rowStyle}>{inner}</Link>
              : <div key={i} style={rowStyle}>{inner}</div>
          })}
        </section>

        {/* ── Tab 3: Grupputställningar ── */}
        <section className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
            {dict.biography?.group_exhibitions ?? 'Grupputställningar i urval'}
          </h2>
          {GROUP_EXHIBITIONS.map((e, i) => {
            const rowStyle = { display: 'grid', gridTemplateColumns: '5rem 1fr auto', gap: '1rem', padding: '0.9rem 0', borderBottom: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit' } as const
            const inner = (
              <>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{e.year}</span>
                <span style={{ fontSize: 'var(--fs-sm)' }}>{e.title}</span>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textAlign: 'right' }}>{e.location}</span>
              </>
            )
            return e.slug
              ? <Link key={i} href={`/${locale}/portfolio/exhibitions#${e.slug}`} className="row-hover" style={rowStyle}>{inner}</Link>
              : <div key={i} style={rowStyle}>{inner}</div>
          })}
        </section>

        {/* ── Tab 4: Litteraturförteckning ── */}
        <section className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
            {dict.biography?.bibliography ?? 'Litteraturförteckning i urval'}
          </h2>
          {BIBLIOGRAPHY.map((entry, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', flexShrink: 0 }}>{entry.year}</span>
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 1.6 }}>{entry.text}</span>
            </div>
          ))}
        </section>

        {/* ── Tab 5: Fotografier ── */}
        <section className="page-pad" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '2rem' }}>
            {dict.biography?.photographs ?? 'Fotografier'}
          </h2>
          <MasonryGallery columns="4" images={bioPhotos} />
        </section>

      </TabsLayout>

      <div className="page-pad" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Link href={`/${locale}`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.nav?.home ?? 'Hem'}</span>
        </Link>
      </div>
    </div>
  )
}
