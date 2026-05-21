export interface Publication {
  title: string
  year?: string
  isbn?: string
  publisher?: string
  imageUrl?: string
  downloadUrl?: string
  downloadLabel?: string
}

// All publication covers from sivertlindblom.se/biografi/publicerat/
export const PUBLICATIONS: Publication[] = [
  {
    title: 'Akvareller 1975–2012, Kungl. Konstakademien',
    year: '2012',
    isbn: '978-91-86583-13-2',
    publisher: 'Bullfinch Publishing',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Gratt-omslag-klipp.jpg',
    downloadUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/documents/Sivert-Katalog-Akvareller.pdf',
    downloadLabel: 'Ladda ner katalog (PDF)',
  },
  {
    title: 'Skissernas Museum',
    year: '1993',
    isbn: '91-7856-046-2',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Rott-omslag-klipp.jpg',
  },
  {
    title: 'Lunds Konsthall',
    year: '1993',
    isbn: '91-630-1609-5',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Vitt-omslag-klipp.jpg',
  },
  {
    title: 'KRO Konstnären Nr. 2',
    year: 'Mars 1993',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/KRO-Konstnaren-1.jpg',
  },
  {
    title: 'Akvarellen',
    year: '2013',
    isbn: 'ISSN 1102-7843',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/akvarellen-2013.jpg',
  },
  {
    title: 'Skissernas Museum',
    year: '1999',
    isbn: '91-7856-059-4',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Skissernas-museum-1999.jpg',
  },
  {
    title: 'Medelhavsmuseet — Istanbul',
    year: '1990',
    isbn: 'ISSN 0347-8068',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Istanbul-1990-ISSBN-0347-8068.jpg',
  },
  {
    title: 'Malmö Konsthall — Metapolis',
    year: '1986',
    isbn: '91-7704-019-8',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Metapolis-2.jpg',
  },
  {
    title: 'Gemensamma rum',
    year: '1998',
    publisher: 'Peter Cornell & Sivert Lindblom, Bonnier Essä',
    isbn: '91-34-52034-1',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Cornell-och-Sivert-1998-ISBN-91-34-52034-1.jpg',
  },
  {
    title: 'Arkitektur nr 5, årgång 83',
    year: 'Juni 1983',
    isbn: 'ISSN 0004-2021',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Arkitektur-nr-5-1983.jpg',
  },
  {
    title: 'Föreningen KRIS',
    year: 'Mars 1983',
    isbn: 'ISSN 0348-033X',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Kris-25_27.jpg',
  },
  {
    title: 'Föreningen KRIS',
    year: 'Mars 1981',
    isbn: 'ISSN 0348-033X',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Kris-17_18.jpg',
  },
  {
    title: 'Centre Culturel Suédois, Paris',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/CCS-omslag.jpg',
  },
  {
    title: 'Kunstmuseum Luzern — Live Show II',
    year: '1977',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Kunstmuseum-Luzern-2.jpg',
  },
  {
    title: 'Moderna Museet — Live Show',
    year: '1974',
    isbn: '91-7100-041-0',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Live-Show.jpg',
  },
  {
    title: 'Biennale Nürnberg',
    year: '1969',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Biennale-1969.jpg',
  },
  {
    title: 'Studio International, Vol. 177, No. 911',
    year: '1969',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Studio-1-1969.jpg',
  },
  {
    title: 'Sveriges Stenindustriförbund, Nr 2',
    year: '1985',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Skannad-bild-150460006.jpg',
    downloadUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/documents/Stenpriset-1985.pdf',
    downloadLabel: 'Ladda ner artikel (PDF)',
  },
  {
    title: '"Glöm oss inte"',
    year: '1999',
    publisher: 'Hilleviförlaget',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Glom-oss-inte-Omslag.jpg',
  },
  {
    title: 'Peter Celsing',
    publisher: 'LiberFörlaget / Arkitekturmuseet',
    isbn: '91-38-05276-8',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Peter-Celsing-bok.jpg',
  },
  {
    title: 'Konsthögskolan — Galleri Mejan',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Konsthogskolan-.jpg',
  },
  {
    title: '"Frisk med konst", Östergötlands läns landsting',
    year: '1988',
    isbn: '91-7970-204-X',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Frisk-med-konst-.jpg',
  },
  {
    title: 'Images du Nord, Dakar',
    year: '1973',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Dakar-1.jpg',
  },
  {
    title: 'Sivert Lindblom — Statens konstråd',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Statens-konstrad-1-.jpg',
  },
  {
    title: 'Sivert Lindblom — Konstrevy',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Konstrevy-1.jpg',
  },
  {
    title: 'Paletten',
    year: '1974',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/Paletten-1974.jpg',
  },
  {
    title: 'Vår Konst Nr. 6',
    year: '1968',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/Var-Konst-Nr.6-1968.jpg',
  },
  {
    title: 'Gula sidorna A–J',
    year: '1992',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/Gula-1992-1jpg.jpg',
  },
  {
    title: 'Paletten',
    year: '1967',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Paletten-67.jpg',
  },
  {
    title: 'Art and Artists',
    year: '1969',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Art-and-artists-1969.jpg',
  },
  {
    title: 'IBID I',
    year: '1982',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Ibid-1982-.jpg',
  },
  {
    title: 'IBID II',
    year: '1983',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Ibid-1983-.jpg',
  },
  {
    title: 'Galerie Burén Nr. 10 Nov. 1963',
    year: '1963',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Ulrik-och-Sivert.jpg',
  },
  {
    title: 'North',
    year: '1978',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/North-1978.jpg',
  },
  {
    title: 'Norrköpings Museum',
    year: '1999',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Norrkopings-museum-1-1999.jpg',
  },
  {
    title: 'Gimpel & Hanover Galerie',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Gimpel-2.jpg',
  },
  {
    title: 'Katalog',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/page_1.jpg',
  },
  {
    title: 'Obskyr tidskrift UPA',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/Labelle-.jpg',
  },
  {
    title: 'Multikonst — Moderna Museets Vänner',
    year: '1968',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Multi-1-2.jpg',
  },
  {
    title: 'Medelhavsmuseet',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Medelhavsmuseet-1.jpg',
  },
  {
    title: 'Konstnärscentrum Nr 2',
    year: '1982',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Konstnarscentrum-Nr-2-82-1.jpg',
  },
  {
    title: 'Staffan Cullberg',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Staffan-Cullberg-1.jpg',
  },
  {
    title: 'Arkitekturmuseet',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Arkitekturmuseet-11.jpg',
  },
  {
    title: 'Raum',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Raum-1.jpg',
  },
  {
    title: 'Paletten Nr 2',
    year: '1968',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Paletten-Nr-2-1968-1-.jpg',
  },
  {
    title: 'Här och Nu',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Har-och-Nu-1.jpg',
  },
  {
    title: 'Katalog',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/img154-.jpg',
  },
  {
    title: 'Images du Nord, Dakar',
    year: '1973',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Dakar-7.jpg',
  },
  {
    title: 'Kalejdoskop',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Kalejdoskop.jpg',
  },
  {
    title: 'Liljevalchs',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Liljevalchs-1.jpg',
  },
  {
    title: 'Årby',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Arby-1-1.jpg',
  },
  {
    title: 'Konstrevy',
    year: '1964',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/Konstrevy-omslaget-1964.jpg',
  },
  {
    title: 'Heute',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Heute-1-1.jpg',
  },
  {
    title: 'Suède 63',
    year: '1963',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Suede-63.jpg',
  },
  {
    title: 'Material',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Material-Omslag.jpg',
  },
  {
    title: 'Kalejdoskop',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Kalejdoskop.jpg',
  },
  {
    title: 'Galleri Östergren',
    year: '1969',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Galleri-Ostergren-69.jpg',
  },
  {
    title: 'Under Jorden',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Under-jorden.jpg',
  },
  {
    title: 'Moderna Museet Bulletin',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Moderna-Museet-bulletin.jpg',
  },
  {
    title: 'Haninge Konst',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Haninge-konst.jpg',
  },
  {
    title: 'Forum',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Forum.jpg',
  },
  {
    title: 'Gestaltningar, Universitetet',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Gestaltningar-Universitetet.jpg',
  },
  {
    title: 'Offentliga Rummet',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Offentliga-rummet.jpg',
  },
  {
    title: 'Skannad bild',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610011.jpg',
  },
  {
    title: 'Eskilstuna-Kuriren Kulturpris',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Eskilstuna-Kuriren-Kulturpris-1-.jpg',
  },
  {
    title: 'Vandalorum 2016',
    year: '2016',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/11/20171016_163452.jpg',
  },
  {
    title: 'Peter Celsing — Celsingarkivet',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Celsingarkivet-1.jpg',
  },
  {
    title: 'Malmö Konsthall',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Malmo-konsthall.jpg',
  },
  {
    title: 'Lunds Konsthall — fasad',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Lund-fasad.jpg',
  },
  {
    title: 'Katalog',
    imageUrl: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/00.jpg',
  },
]
