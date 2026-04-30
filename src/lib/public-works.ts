export interface PublicWork {
  slug: string
  title: string
  year: string
  location: string
  category: 'exterior' | 'interior' | 'scenography'
  description: string
  body: string
  images: Array<{ url: string; alt: string }>
}

export const PUBLIC_WORKS: PublicWork[] = [
  {
    slug: 'blasieholmstorg-1989',
    title: 'Blasieholmstorg, Stockholm',
    year: '1989',
    location: 'Stockholm',
    category: 'exterior',
    description: 'Två bronshastar på Blasieholmstorg, Stockholm 1989. Inspirerade av San Marco-hästarna i Venedig.',
    body: 'Skulpturverket på Blasieholmstorg utgörs av två hästar i brons, placerade på ett upphöjt podium vid Blasieholmen i centrala Stockholm. Verket invigdes 1989 och är ett av Sivert Lindbloms mest kända offentliga arbeten.\n\nHästarna är inspirerade av de berömda San Marco-hästarna i Venedig — en av konsthistoriens mest kända skulpturgrupper, ursprungligen från 300-talet e.Kr. Lindblom har transformerat detta antika förebild till ett samtida formspråk.\n\nBlasieholmstorg är en av Stockholms mest representativa platser, belägen intill Nationalmuseum och med utsikt över Skeppsholmen och Djurgårdskanalen.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2018/07/H%C3%A4st-p%C3%A5-Blasieholmen.jpg', alt: 'Hästar på väg mot Blasieholmstorg' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-01.jpg', alt: 'Blasieholmstorg, Stockholm 1989' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-31.jpg', alt: 'Hästar i brons' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-48.jpg', alt: 'Detalj' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-43.jpg', alt: 'Natt' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-71.jpg', alt: 'Panorama' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-33.jpg', alt: 'Sidovy' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-68.jpg', alt: 'Kvällsbild' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-42.jpg', alt: 'Närbild' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-02.jpg', alt: 'Fontän' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-57.jpg', alt: 'Vinterbild' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-60.jpg', alt: 'Sommarbild' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Blasieholms-Torg-38.jpg', alt: '1989' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_181256.jpg', alt: 'Blasieholmstorg 2017' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_180728.jpg', alt: 'Häst på Blasieholmen' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2017/11/20170927_181022.jpg', alt: 'Blasieholmstorg höst' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/San-Marco-h%C3%A4star.jpg', alt: 'San Marco hästar, Venedig' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-1-.jpg', alt: 'San Marco studie 1' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-San-Marco-2-.jpg', alt: 'San Marco studie 2' },
    ],
  },
  {
    slug: 'nobelmonument-new-york-2003',
    title: 'Nobelmonument, New York',
    year: '2003',
    location: 'Theodore Roosevelt Park, New York',
    category: 'exterior',
    description: 'Monument för Alfred Nobel i Theodore Roosevelt Park, New York. Invigt 14 oktober 2003.',
    body: 'Nobelmonumentet i New York placerades i Theodore Roosevelt Park och invigdes den 14 oktober 2003 med New Yorks borgmästare Bloomberg närvarande.\n\nMonumentet är ett av Sivert Lindbloms mest internationellt uppmärksammade offentliga arbeten. Det kombinerar en geometrisk form med symboliska element kopplade till Alfred Nobels arv och prisets internationella karaktär.',
    images: [],
  },
  {
    slug: 'vastra-skogen-1975',
    title: 'Västra skogen T-banestation',
    year: '1975 och 1985',
    location: 'Stockholm',
    category: 'interior',
    description: 'Konstnärlig utsmyckning av Västra skogen T-banestation. Färgfält och stora profilansikte ur berget. I samarbete med Marianne Lindblom.',
    body: 'Västra skogen är en av Stockholms mer spektakulära T-banestationer, konstnärligt utsmyckad av Sivert och Marianne Lindblom 1975 och 1985. De enorma profilansiktena som träder fram ur bergsväggen är ett av de mest ikoniska inslagen i Stockholms tunnelbanesystem.\n\nArbetet utfördes på uppdrag av SL (Storstockholms Lokaltrafik) och kombinerar keramiska fältfärger med stora skulpturala reliefer direkt huggna i berget.',
    images: [],
  },
  {
    slug: 'frescati-1987',
    title: 'Stockholms Universitet, Frescati',
    year: '1987–1991',
    location: 'Stockholms Universitet',
    category: 'exterior',
    description: 'Pelarrader, allegoriska skulpturer och integrerade konstverk på Frescati-campus.',
    body: 'Uppdraget på Stockholms Universitets campus i Frescati var ett av de mest omfattande i Sivert Lindbloms karriär. Under åren 1987–1991 skapade han ett sammanhållet konstnärligt program för campusområdet: pelarrader i tegel, gjutjärn och brons, samt tre allegoriska skulpturer — Atlas, Akilles och en abstrakt figur.\n\nVerken integrerar den klassiska skulpturtraditionen med en modern formuppfattning och skapar en dialog med den modernistiska campusarkitekturen.',
    images: [
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Klot.jpg', alt: 'Klot på tegelsockel utanför T-baneuppgången Universitetet' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusTbana.jpg', alt: 'Campus, T-baneuppgång' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati_0036.jpg', alt: 'Frescati campus' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati_0037.jpg', alt: 'Frescati campus' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati_0038.jpg', alt: 'Frescati campus' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati_0042.jpg', alt: 'Frescati campus' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati_0043.jpg', alt: 'Frescati campus' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Atlas.jpg', alt: 'Atlas, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusAkilles.jpg', alt: 'Akilles, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusAkilles2.jpg', alt: 'Akilles, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusAkilles3.jpg', alt: 'Akilles, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Profil.jpg', alt: 'Profil, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusHuvud.jpg', alt: 'Huvud, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusSkruv.jpg', alt: 'Skruv, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/CampusRing.jpg', alt: 'Ring, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert-Lindblom-Frescati-Spets.jpg', alt: 'Spets, Frescati' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2018/02/20180114_142218.jpg', alt: 'Frescati 2018' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2018/02/20180114_142324.jpg', alt: 'Frescati 2018' },
      { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert566-kopia.jpg', alt: 'Frescati, arkivfoto' },
    ],
  },
  {
    slug: 'gustav-adolfs-torg-2002',
    title: 'Gustav Adolfs Torg, Malmö',
    year: '1999–2002',
    location: 'Malmö',
    category: 'exterior',
    description: 'Fem bronsplattor och fontäner med gripen och klotmotiv. Heraklitoscitat på fontänbaserna.',
    body: 'Gustav Adolfs torg i Malmö fick fem bronsornament med griffon- och klotmotiv, placerade på fontänbaserna. På varje bas finns ett citat från den presokratiske filosofen Herakleitos, om förändring och konstans.\n\nVerket invigdes 2002 och är en av de mer poetiskt sammansatta offentliga konstinsatser Lindblom genomfört — kombinationen av skulptur, vatten och text skapar en multisensorisk upplevelse.',
    images: [],
  },
]
