export interface SculptureImage {
  url: string
  alt: string
}

export interface SculptureProject {
  slug: string
  title: string
  years?: string
  description: string
  body: string
  images: SculptureImage[]
}

export const SCULPTURE_PROJECTS: SculptureProject[] = [
  {
    slug: 'profiler',
    title: 'Profiler',
    years: '1966–',
    description: 'Profilskulpturer i sten och brons — Sivert Lindbloms genomgående serie sedan 1960-talet.',
    body: 'Profilserien är ett av Sivert Lindbloms mest genomgående teman. Skulpturerna är abstraherade mänskliga profiler skurna ur sten eller gjutna i brons. Serien spänner från tidiga verk på 1960-talet till stora offentliga monument. Profiler finns bland annat på Stockholms universitet (Frescati), Västra skogen T-banestation och i ett flertal privata och offentliga samlingar.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg', alt: 'Profil, Blasieholmstorg' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg', alt: 'Hästar i brons' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg', alt: 'Blasieholmstorg detalj' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg', alt: 'Blasieholmstorg natt' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg', alt: 'Blasieholmstorg panorama' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg', alt: 'Blasieholmstorg sidovy' },
    ],
  },
  {
    slug: 'metamorfoser',
    title: 'Metamorfoser — Sittare',
    years: '1970–1985',
    description: 'Sittande figurer i sten och brons som förenas i en metamorfosprocess.',
    body: 'Metamorfoser-serien utforskar övergångstillståndet mellan det mänskliga och det abstrakta. De sittande figurerna är gjutna i brons och bearbetade i sten, med en inre rörelse som antyder förvandling och förändring. Skulpturerna har visats bland annat på Lunds konsthall och Moderna Museet.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-68.jpg', alt: 'Sittare, detalj' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-42.jpg', alt: 'Metamorfos' },
    ],
  },
  {
    slug: 'monoliter',
    title: 'Monoliter & Blystoder',
    years: '1975–1982',
    description: 'Monolitiska former i bly och sten, inklusive verken i Paris 1977.',
    body: 'Monoliterna utgör en serie enkla, upprätta former i bly — ett material som ger skulpturerna en specifik tyngd och yta. Verken visades bland annat på Centre Culturel Suédois i Paris 1980 och på Galerie Åsbaek i Köpenhamn 1981.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-57.jpg', alt: 'Monolitisk form' },
    ],
  },
  {
    slug: 'azteker',
    title: 'Azteker',
    years: '1978–1983',
    description: 'Aztekiskt inspirerade skulpturer med geometrisk komplexitet.',
    body: 'Aztekerna är en serie skulpturer inspirerade av prekolumbiansk konst och arkitektur. De karakteristiska trappstegsmönstren och den geometriska upprepningen ger skulpturerna ett monumentalt uttryck trots ofta liten skala.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Azteker-1.jpg', alt: 'Aztek skulptur 1' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Azteker-2.jpg', alt: 'Aztek skulptur 2' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Azteker-3.jpg', alt: 'Aztek skulptur 3' },
    ],
  },
  {
    slug: 'tidiga-skulpturer',
    title: 'Tidiga skulpturer',
    years: '1955–1968',
    description: 'Verk från 1950- och 1960-talen som spänner från figurativt till abstrakt.',
    body: 'De tidiga skulpturerna visar Sivert Lindbloms väg från figurativ konst mot ett alltmer abstrakt formspråk. Under 1950-talet arbetade han nära arkitekturen, bland annat i samarbete med Peter Celsing. 1960-talets verk, tillkomna delvis under åren i Locarno (1963–1966), visar ett allt friare förhållande till formen.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-60.jpg', alt: 'Tidigt verk' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-38.jpg', alt: 'Tidigt verk' },
    ],
  },
  {
    slug: 'kofeser',
    title: 'Kofeser — meningslös meningsfullhet',
    years: '1980–1990',
    description: 'En serie skulpturer som undersöker meningslös meningsfullhet.',
    body: 'Kofeser är ett ord utan definition — en kofes kan vara vad som helst. Serien utforskar gränsen mellan objekt och skulptur, mellan det vardagliga och det konstnärliga. Birger Vikström har skrivit om vad en kofes egentligen är i "13 berättelser".',
    images: [],
  },
  {
    slug: 'blyplattor',
    title: 'Blyplattor',
    years: '1975–1982',
    description: 'Reliefverk i bly med subtila ytbehandlingar.',
    body: 'Blyplattorna är platta, reliefliknande verk som utnyttjar blyets mjukhet och mörkhet. Ytorna bär spår av bearbetning — hamrande, pressning, skärande — och skapar en dialog mellan material och form.',
    images: [],
  },
  {
    slug: 'tradkonstruktioner',
    title: 'Trädkonstruktioner',
    years: '1974–1978',
    description: 'Skulpturer och konstruktioner i trä, bl.a. från Live Show II i Luzern.',
    body: 'Trädkonstruktionerna visar Lindbloms undersökning av organiska material och konstruktionsprinciper. Flera av verken skapades för Live Show II på Kunstmuseum Luzern 1977, i samarbete med Björn Lövin och Ulrik Samuelson.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/LuzernTräd008.jpg', alt: 'Trädkonstruktion, Luzern' },
    ],
  },
  {
    slug: 'tornmodeller',
    title: 'Tornmodeller',
    years: '1985–1995',
    description: 'Modeller och tävlingsförslag för torn och höga strukturer.',
    body: 'Tornmodellerna är en serie studier och tävlingsförslag för monumentala vertikala strukturer. De kombinerar skulpturens formspråk med arkitekturens skala och funktion.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Torn-A1.jpg', alt: 'Tornmodell A1' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Torn-A2.jpg', alt: 'Tornmodell A2' },
    ],
  },
  {
    slug: 'grafik',
    title: 'Grafik i urval',
    years: '1966–2018',
    description: 'Teckningar, grafikblad och studier som dokumenterar det konstnärliga arbetet.',
    body: 'Grafiken utgör ett komplement till skulpturarbetet — teckningar, studier och grafikblad som visar det konstnärliga tänkandets rörelser. Bland de tidiga bladen finns arbeten i akvatint och etsning från 1960-talet, samt senare digitala kompositioner.',
    images: [],
  },
]
