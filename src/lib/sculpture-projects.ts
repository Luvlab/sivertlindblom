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
  links?: Array<{ label: string; url: string }>
}

export const SCULPTURE_PROJECTS: SculptureProject[] = [
  {
    slug: 'profiler',
    title: 'Profiler',
    years: '1966–',
    description: 'Profilskulpturer i sten och brons — Sivert Lindbloms genomgående serie sedan 1960-talet.',
    body: `Siverts profiler har blivit något av ett signum genom den ryktbarhet de fått sedan de först presenterades som en skulptural, visuell avbildning av honom själv sedd som ett streck roterat i 360° i samband med Riksutställningars – Multikonst, 1968.

Han har själv berättat att utgångspunkten för den svit av profilskulpturer som han producerade ett antal år ursprungligen var just en punkt, kanske placerad mitt i pannan, som sedan sträcktes ut till en linje som följde hans ansikte och kroppsprofil, från hjässans högsta punkt och till tåspetsen.

Denna linje lät han sedan rotera runt sin "egen axel", varvid hans kropp blev tredimensionell från ett två-dimensionellt streck, från linje till volym. Profilen kunde på så sätt svarvas i olika material och även gjutas i plast eller metall.

Sivert har sedan undersökt den uppkomna formen både som ett upprättstående och som sittande fyllt objekt och som en urtagen volym av formerna själva och sedan även förskjutit profilerna i olika riktningar. Man skulle kunna säga att man kan "se profilerna som konvexa eller konkava".

Han har även gjort flera serier grafiska blad med profilteckningar som bildar mönsterliknande ytor. Det är profiler som överlappar varandra till ett intrikat mönster och som ibland placeras in i perspektiviskt landskap.

Huruvida han träffat på den amerikanske satirtecknaren Charles Dana Gibson är ointressant men det finns ett humoristisk tolkningsperspektiv av hans konst som när man för ett kort ögonblick ser Gibsons skämtteckning "A Gentleman´s Dilemma" från 1900.

Sivert fick mycket senare kännedom om denne i ett brev från hans vän arkitekten Åke Wallgård den 15 december 1994 med en kopia på ett tidningsurklipp med Gibsons teckning och en julhälsning. — Jan Öqvist

Som underlag för "profiler" togs bland annat en serie fotografier – stilstudier – av Sivert som siluett av vännen och fotografen Wilhelm Rapp 1963.

Charles Dana Gibson (1867–1944)`,
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0069.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0072.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0071.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0068.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0070.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0067.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0075.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0074.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler_0073.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Profiler-staende.jpg', alt: 'Modell; svarvad figur, 1967' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7624.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_135410.jpg', alt: 'Profiler, Konstakademien 2012. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_160220.jpg', alt: 'Profiler, Konstakademien 2012. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7644.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_140224.jpg', alt: 'Profiler 2012. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_140352.jpg', alt: 'Profiler 2012. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Lunds-konsthall-10.jpg', alt: 'Profiler, Lunds Konsthall 1993' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Lunds-konsthall-7.jpg', alt: 'Profiler, Lunds Konsthall 1993' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Vastra-skogen-T.bana_0106.jpg', alt: 'Profil, Västra skogen T-banestation' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Frescati-Profil.jpg', alt: 'Profil, Stockholms Universitet Frescati. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert_Lindblom_Wanas.jpg', alt: 'Profil, Wanås' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Eskilstuna_10.jpg', alt: 'Profil, Eskilstuna' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Eskilstuna_14.jpg', alt: 'Profil, Eskilstuna' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Eskilstuna_21.jpg', alt: 'Profil, Eskilstuna' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Eskilstuna_31.jpg', alt: 'Profil, Eskilstuna' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Eskilstuna_81.jpg', alt: 'Profil, Eskilstuna' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Objekt-Profil-Gotland002-kopia.jpg', alt: 'Profil; Austre, Gotland 2012' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur034-kopia.jpg', alt: 'Profil. Foto: Jan Jansson' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur033a-kopia.jpg', alt: 'Profil. Foto: Jan Jansson' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur029-kopia.jpg', alt: 'Profil. Foto: Jan Jansson' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur043-kopia.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur027-kopia.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur023-kopia.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert396.jpg', alt: 'Profil. Foto: Wilhelm Rapp' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert375.jpg', alt: 'Profil. Foto: Wilhelm Rapp' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Buren-66-1.jpg', alt: 'Galerie Burén, Stockholm 1966' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Buren-66-3.jpg', alt: 'Galerie Burén, Stockholm 1966' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Buren-68-5.jpg', alt: 'Galerie Burén, Stockholm 1968' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Nurnberg2.jpg', alt: 'Nürnberg' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Profil-skiss001.jpg', alt: 'Profilskiss' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/cubegrid001-.jpg', alt: 'Kub; axonometrisk ritning, 1967' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-1x1-A4.jpg', alt: 'Profiler, kompositionsstudie 1×1' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-2x2-A4.jpg', alt: 'Profiler, kompositionsstudie 2×2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-3x2-liggande-A4.jpg', alt: 'Profiler, kompositionsstudie 3×2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-12x4-liggande-A4.jpg', alt: 'Profiler, kompositionsstudie 12×4' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Celsing-12.jpg', alt: 'Profil, Celsingprojekt' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Celsing-5.jpg', alt: 'Profil, Celsingprojekt' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2016/08/SAM_7288.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2016/08/SAM_7271.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2016/08/SAM_7256.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2016/08/SAM_7224.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2016/08/SAM_7191.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2016/08/SAM_7097.jpg', alt: 'Profiler, Vandalorum 2016. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/10/20171016_160128.jpg', alt: 'Profil, 2017' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/10/20171016_160437.jpg', alt: 'Profil, 2017' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/06/20170621_135503.jpg', alt: 'Profil, 2017' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/06/20170621_140826.jpg', alt: 'Profil, 2017' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180227_133414.jpg', alt: 'Profil, 2018' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/02/20180227_132949.jpg', alt: 'Profil, 2018' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/SAM_4878-kopia.jpg', alt: 'Profil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/02/SAM_4828.jpg', alt: 'Profil. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-NK-ljusgard_0091.jpg', alt: 'Profil, NK Ljusgård' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/04/Gibson-.jpg', alt: 'Charles Dana Gibson — "A Gentleman\'s Dilemma", 1900. Brev från Åke Wallgård, 15 dec 1994' },
    ],
  },
  {
    slug: 'metamorfoser',
    title: 'Metamorfoser — Sittare',
    years: '1970–1985',
    description: 'Sittande figurer i sten och brons som förenas i en metamorfosprocess.',
    body: '',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur109-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur107-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur105-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur102-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur103-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur117-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur119-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur118-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur121-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur120-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur108-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur101-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur001-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur094-kopia.jpg', alt: 'Sittare. Foto: Sven Åsberg' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur097-kopia.jpg', alt: 'Sittare. Foto: Sven Åsberg' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur059-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur076-kopia.jpg', alt: 'Sittare' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert123-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert143-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert118-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert122-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert125-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert126-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert124-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert121-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert113-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert112-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert108-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert105-kopia.jpg', alt: 'Sittare. Foto: Magnus Lindblom' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/IMG_1334-kopia.jpg', alt: 'Sittare, utomhus' },
    ],
  },
  {
    slug: 'monoliter',
    title: 'Monoliter & Blystoder',
    years: '1975–1982',
    description: 'Monolitiska former i bly och sten, inklusive verken i Paris 1977.',
    body: '',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bly-klossar012.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/bly-klossar004.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/bly-klossar007.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bly-klossar015.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bly-klossar014.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Skannad-bild-150260014.jpg', alt: 'Monoliter. Foto: Rolf Berglund' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Skannad-bild-150260013.jpg', alt: 'Monoliter. Foto: Rolf Berglund' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Skannad-bild-150270003.jpg', alt: 'Monoliter. Foto: Rolf Berglund' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Dr-Glas-1.jpg', alt: 'Blystoder, Galleri Doktor Glas' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Dr-Glas-2.jpg', alt: 'Blystoder, Galleri Doktor Glas' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Dr-Glas-3.jpg', alt: 'Blystoder, Galleri Doktor Glas' },
    ],
  },
  {
    slug: 'azteker',
    title: 'Azteker',
    years: '1978–1983',
    description: 'Aztekiskt inspirerade skulpturer med geometrisk komplexitet.',
    body: '',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Azteker-1.jpg', alt: 'Aztek skulptur 1' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Azteker-2.jpg', alt: 'Aztek skulptur 2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Azteker-3.jpg', alt: 'Aztek skulptur 3' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bly-klossar012.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/bly-klossar004.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/bly-klossar007.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bly-klossar015.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bly-klossar014.jpg', alt: 'Azteker; bly 1978' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610027.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610028.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610029.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610030.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610031.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610032.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610033.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610034.jpg', alt: 'Kalejdoskop Nr 1/78' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Skannad-bild-150610035.jpg', alt: 'Kalejdoskop Nr 1/78' },
    ],
  },
  {
    slug: 'tidiga-skulpturer',
    title: 'Tidiga skulpturer',
    years: '1955–1968',
    description: 'Verk från 1950- och 1960-talen som spänner från figurativt till abstrakt.',
    body: 'I Magasin III:s samling ingår denna brons "Utan titel" från 1963.\n\nI galleriet finns en del av Siverts tidiga skulpturer.',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert678-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert050-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert060-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert054-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert065-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert071-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert072-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert056-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert058-kopia.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert629-kopia1.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert628-kopia1.jpg', alt: 'Tidigt verk' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Aronow.Mattias04670-kopia-2.jpg', alt: 'Tidigt verk, foto: Mattias Aronow' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7585.jpg', alt: 'Tidiga skulpturer, installationsvy' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SAM_7586.jpg', alt: 'Tidiga skulpturer, installationsvy' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_135633.jpg', alt: 'Tidiga skulpturer, utställning 2012' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20121028_135512.jpg', alt: 'Tidiga skulpturer, utställning 2012' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Mariestad-1962.jpg', alt: 'Mariestad 1962' },
    ],
  },
  {
    slug: 'kofeser',
    title: 'Kofeser — meningslös meningsfullhet',
    years: '1980–1990',
    description: 'En serie skulpturer som undersöker meningslös meningsfullhet.',
    body: `Sivert Lindblom har genom åren framkallat skulpturer utan direkt åsyftan utan som kommit till ur slumpen eller ur de omedvetna skapelseögonblicken.

Han har valt att kalla dessa skulpturer för kofeser. Ett begrepp som kanske eller kanske inte behöver någon förklaring därför att en kofes är en kofes och inget annat.

Någon skulle kanske kunna kalla dessa skulpturer för "fri form", jämförbara med jazzmusikens fria uttryck. Andra de för något annat …

Den insisterande kan ju läsa lite om varifrån begreppet "kofes" har sitt förmodade ursprung.`,
    links: [
      { label: 'Birger Vikström — "Vad är en kofes?" ur 13 berättelser', url: '/texts/birger-vikstrom-kofes' },
    ],
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/DSC01868-kopia.jpg', alt: 'Kofes' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Kofeser-.jpg', alt: 'Kofeser' },
    ],
  },
  {
    slug: 'blyplattor',
    title: 'Blyplattor',
    years: '1975–1982',
    description: 'Reliefverk i bly med subtila ytbehandlingar.',
    body: '1978 undersökte Sivert två ytstrukturer inom en given geometriskt utgångspunkt dvs. samma yta i olika format.\n\nHan presenterade dessa för första gången på Doktor Glas i Kungsträdgården med en längre svit av infattade blyplattor, Stockholm.\n\nDessa var blytäckta plattor innanför en klart definierat svartmålad ram. Varje platta signerades med det inre fältets exakta kvadratdecimetermått.',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplattor-.jpg', alt: 'Blyplattor' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620028-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620026-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620030-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620029-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620027-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620025-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620024-.jpg', alt: 'Blyplatta' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/media/2015/03/Blyplatta-150620023-.jpg', alt: 'Blyplatta' },
    ],
  },
  {
    slug: 'tradkonstruktioner',
    title: 'Trädkonstruktioner',
    years: '1974–1978',
    description: 'Skulpturer och konstruktioner i trä, bl.a. från Live Show II i Luzern.',
    body: '',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad022.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad021.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad020.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad019.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad018.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad017.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad013.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad011.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad010.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/LuzernTrad008.jpg', alt: 'Trädkonstruktion, Luzern' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-Live-Show-Luzern-0481.jpg', alt: 'Live Show II, Luzern 1977' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur055-kopia.jpg', alt: 'Trädkonstruktion' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Bok-Skulptur051-kopia.jpg', alt: 'Trädkonstruktion' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Aronowitsch-1.jpg', alt: 'Trädkonstruktion, foto Aronowitsch' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/sivert_lindblom-2.jpg', alt: 'Trädkonstruktion' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/20120730_131452.jpg', alt: 'Trädkonstruktion, 2012' },
    ],
  },
  {
    slug: 'tornmodeller',
    title: 'Tornmodeller',
    years: '1985–1995',
    description: 'Modeller och tävlingsförslag för torn och höga strukturer.',
    body: `Sivert Lindblom har sedan lång tid arbetat med tornbyggnation som en idé att undersöka.

De torn som Sivert Lindblom undersökt representerar endast resningen i förhållande till sin omgivning.

Tornet är om man så vill en större sinnebild för den mindre uppbyggnationen – sockeln.

Sockeln kan ses som en symbolisk förbindelse mellan marken och det som ska bäras upp.

Socklar i stadsrummen brukar bära upp byster av bemärkta personer eller skulpturer med och av dessa i imposanta ställningar.

Den klassiska sockeln skriver Palladio, ur den första boken om arkitekturen:

"Vi har ett utkragande nedersta led som eventuellt uttrycker förankring i marken och stabilitet.

Vi har ett översta led som med en likaså utkragande gest som uttrycker bärande och utgör sockelns avslutning uppåt. Slutligen ett mellanled vars liv ligger något innanför det översta och nedersta. Mellanledet utgör sockelns bål, utgör dess majoritet av massa och ger helheten dess resning."

Att visualisera förankring med marken, med moder jord, har högt symbolvärde och är något arketypiskt. Det gäller för hus-socklar såväl som för skulptur-socklar.

I den klassiska antikens byggnader förekommer sockeln företrädesvis som byggnadsanknutet eller en del av tempelbyggnaden.

Då som kolonnerna med stylobatens tre trappsteg. Överst bär arkitraven föremålet. Denna vilar på en triglyf och har ofta en metopfris. Metoperna är reliefer eller en fris med samtidens hjältar i olika situationer. Frisen och arkitraven tillsammans bildar visuellt underlag till de fullt ut skulpterade gudarna som placeras i tympanon.

Sivert Lindbloms socklar eller torn framhäver inget annat än tornet i sig.

Tidens konventioner påverkar seendet av ett torn. Det samma gäller när den är lägre uppbyggnaden när den ses som en sockel. Dessa har oavsett höjd onekligen fler funktioner än den primära att bära något ovanpå sig.

De skapar en förankringen till platsen, marken runt tornet separerar skulpturen från omgivningen och bildar en rumsbildande gräns och samtidigt blir tornet eller sockeln en fokuseringspunkt i ett större sammanhang.

Sockel eller Socculus betyder liten sko på latin.`,
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-A1-.jpg', alt: 'Tornmodell A1' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-A2-.jpg', alt: 'Tornmodell A2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-B1-.jpg', alt: 'Tornmodell B1' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-B2-.jpg', alt: 'Tornmodell B2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-C-.jpg', alt: 'Tornmodell C' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-D-.jpg', alt: 'Tornmodell D' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Lindblom-Torn-E.jpg', alt: 'Tornmodell E' },
    ],
  },
  {
    slug: 'arbetsmodeller',
    title: 'Arbetsmodeller',
    years: '1960–2000',
    description: 'Arbetsmodeller i gips, lera och trä som dokumenterar skulpturprocessen.',
    body: '',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/ModellWasa014.jpg', alt: 'Wasamuseet tävlingsförslag — modell' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/ModellWasa020.jpg', alt: 'Wasamuseet modell 2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/ModellWasa026.jpg', alt: 'Wasamuseet modell 3' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/ModellWasa030.jpg', alt: 'Wasamuseet modell 4' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/ModellWasa031.jpg', alt: 'Wasamuseet modell 5' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/ModellWasa035.jpg', alt: 'Wasamuseet modell 6' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/imgWasa1440-.jpg', alt: 'Wasamuseet tävlingsförslag, planritning' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/05/imgWasa2441-.jpg', alt: 'Wasamuseet tävlingsförslag, sektion' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-SEB-Stockholm_0090.jpg', alt: 'SEB Stockholm — arbetsmodell' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Lindblom-NK-ljusgard_0091.jpg', alt: 'NK Ljusgård — arbetsmodell' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/vagverket031.jpg', alt: 'Vägverkets pris — föreslagen modell' },
    ],
  },
  {
    slug: 'grafik',
    title: 'Grafik i urval',
    years: '1966–2018',
    description: 'Teckningar, grafikblad och studier som dokumenterar det konstnärliga arbetet.',
    body: '',
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Linje-profil002.jpg', alt: 'Linjeprofil' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Skrynkligneg001.jpg', alt: 'Skrynklig, negativ' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SkrynkligDubbel003.jpg', alt: 'Skrynklig dubbel' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-Profil004BWprint.jpg', alt: 'Profil, svartvitt' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/SkrynkligProfilPersp.002.jpg', alt: 'Skrynklig profil, perspektiv' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/triple001.jpg', alt: 'Triple' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Profil-skiss001.jpg', alt: 'Profilskiss' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-trassel002.jpg', alt: 'Trassel 2' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Sivert-trassel001.jpg', alt: 'Trassel 1' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/Komplicerad-kub001.jpg', alt: 'Komplicerad kub' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/01/cubegrid001-.jpg', alt: 'Kubgrid' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-1x1-A4.jpg', alt: '1×1 komposition' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-1111-mindre-liggande-A4.jpg', alt: '1111 komposition' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-2x2-A4.jpg', alt: '2×2 komposition' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-3x2-liggande-A4.jpg', alt: '3×2 komposition' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-4x2-liggande-A4.jpg', alt: '4×2 komposition' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-9x7-A4.jpg', alt: '9×7 komposition' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Sivert-12x4-liggande-A4.jpg', alt: '12×4 komposition' },
    ],
  },
  // ── Västerhaninge / Haninge kulturhus — sub-pages ───────────────────────
  {
    slug: 'i-stalverkstaden',
    title: 'I stålverkstaden',
    description: 'Precisionsvetsning av de två rostfria stålstoderna för Västerhaninge bibliotek — dokumentation från verkstaden.',
    body: `Med hög precision svetsades dessa två stålstoder i N.N. verkstad.

De rostfria stålskulpturerna som beställdes för Västerhaninge bibliotek 1970 tillverkades i en specialiserad stålverkstad. Bilderna dokumenterar den minutiösa tillverkningsprocessen — svetsning, polering och montering av de två blänkande stoderna som nu står vid Haninge kulturhus övre entré.

Se även: [Västerhaninge bibliotek — Haninge kulturhus 1970](/portfolio/public-works/vasterhaninge-bibliotek-haninge-kulturhus-1970) · [Haninge konst 2002](/references/haninge-konst-2002)`,
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV397.jpg', alt: 'I stålverkstaden' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV396.jpg', alt: 'I stålverkstaden' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV395.jpg', alt: 'I stålverkstaden' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV428.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV435.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV429.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV427.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV438.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV434.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV431.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV433.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV437.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV430.jpg', alt: 'Svetsning av stålstod' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV398.jpg', alt: 'I stålverkstaden' },
    ],
  },
  {
    slug: 'haninge-konst-2002',
    title: 'Haninge konst 2002',
    description: 'Haninges kommunala konstinventering 2002 — Siverts skulpturala byggnad vid Haninge kulturhus övre entré.',
    body: `Haninge kommun genomförde en inventering av konsten i Haninge. I inventeringen lyfts Siverts skulpturala grupp — benämnd "skulptural byggnad" — fram: två stöd i rostfritt stål placerade vid Haninge kulturhus övre entré sedan 2002.

Skulpturerna tillverkades ursprungligen för Västerhaninge bibliotek 1970. På bilderna syns även de två kunniga svetsarna/smederna som monterade skulpturerna.

Se även: [Västerhaninge bibliotek — Haninge kulturhus 1970](/portfolio/public-works/vasterhaninge-bibliotek-haninge-kulturhus-1970) · [I stålverkstaden](/references/i-stalverkstaden)`,
    images: [
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/06/Anebysmeder.jpg', alt: 'Smederna som monterade skulpturerna. Foto: Jan Öqvist' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV428.jpg', alt: 'Stålstod under tillverkning' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2017/08/imgSV434.jpg', alt: 'Stålstod under tillverkning' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Haninge-konst.jpg', alt: 'Haninge konst 2002 — inventering' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Haninge-konst-1.jpg', alt: 'Haninge konst 2002 — inventering' },
      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/03/Haninge-konst-2.jpg', alt: 'Haninge konst 2002 — inventering' },
    ],
  },
]
