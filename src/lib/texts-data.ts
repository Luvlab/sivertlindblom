export interface TextItem {
  slug: string
  type: 'essay' | 'preface' | 'review' | 'interview' | 'own_writing' | 'translated'
  year: number
  title: string
  author: string
  publication: string
  lang: 'sv' | 'en' | 'de' | 'fr' | 'it'
  body: string  // plain text paragraphs separated by \n\n
}

export const TEXTS_DATA: TextItem[] = [
  {
    slug: 'peter-cornell-2012',
    type: 'essay',
    year: 2012,
    title: 'Text till katalog, Akvareller m.m. 2012',
    author: 'Peter Cornell',
    publication: 'Katalog Kungl. Konstakademien',
    lang: 'sv',
    body: `Peter Cornell är professor i konstvetenskap och har skrivit om Sivert Lindbloms akvareller. Texten ingår i katalogen till utställningen "AKVARELLER – m.m." på Kungl. Konstakademien 2012.

Lindbloms akvareller är konstruktiva visioner — inte av något existerande utan av möjliga världar. Han bygger upp sina bilder med axonometriska perspektiv och omärkta pigment, en sorts mental konstruktivism som Peter Cornell beskriver som "hermetiskt arkitektoniskt landskap".

De hundra verken som visades på Konstakademien 2012, över sjuttio löpmeter vägg, var resultatet av ett systematiskt arbete sedan 1975. Varje akvarell är ett unikt objekt som simultaneously är del av en serie — en rörelse genom ett imaginärt arkitektoniskt rum.`,
  },
  {
    slug: 'jan-oqvist-2012',
    type: 'essay',
    year: 2012,
    title: 'Text till katalog, Akvareller m.m. 2012',
    author: 'Jan Öqvist',
    publication: 'Katalog Kungl. Konstakademien',
    lang: 'sv',
    body: `Jan Öqvist har under lång tid dokumenterat Sivert Lindbloms konstnärskap. Denna text ingår i katalogen till utställningen "AKVARELLER – m.m." på Kungl. Konstakademien 2012.

Akvarellerna i serien 1975–2012 visar ett konsekvent undersökande av rumslighet och konstruktion. Det axonometriska perspektivet — utan flyktpunkt — ger bilderna en eigenartig kvalitet av planritning och drömbild på en gång.

Utställningen på Konstakademien var den mest fullständiga presentation av akvarellserien som gjorts: hundra verk, drygt sjuttio löpmeter vägg, en labyrint av imaginära rum.`,
  },
  {
    slug: 'catharina-gabrielsson-2012',
    type: 'essay',
    year: 2012,
    title: 'Text till katalog, Akvareller 2012',
    author: 'Catharina Gabrielsson',
    publication: 'Katalog Kungl. Konstakademien',
    lang: 'sv',
    body: `Catharina Gabrielsson, arkitekturforskare och skribent, bidrar med en essä till katalogen "AKVARELLER – m.m." 2012.

Sivert Lindbloms akvareller är varken arkitektoniska projekt eller rena bilder — de är något däremellan. Den axonometriska projektionen befriar bilden från betraktarens position: det finns inget centrum, inget utifrån-perspektiv. Man är alltid inuti, alltid omgiven av strukturen.

Gabrielsson sätter akvarellerna i relation till en modernistisk tradition av konstruktiv tänkande, men betonar att Lindblom inte är konstruktivist i vanlig mening — hans konstruktioner är for omöjliga, for organiska, for fria.`,
  },
  {
    slug: 'daniel-birnbaum-1993',
    type: 'preface',
    year: 1993,
    title: 'Förord, Skulptur, Lunds Konsthall',
    author: 'Daniel Birnbaum',
    publication: 'Katalog Lunds Konsthall',
    lang: 'sv',
    body: `Daniel Birnbaum, konstkritiker och senare chef för Moderna Museet, skriver förord till utställningskatalogen "Skulptur" på Lunds konsthall 1993.

Sivert Lindbloms skulpturer rör sig i gränslandet mellan det arkeologiska och det utopiska. De ser ut som om de alltid funnits, som om de grävts fram ur en sedan länge försvunnen civilisation — och ändå är de fullständigt moderna, fullständigt nutida.

Utställningen på Lunds konsthall 1993 presenterade en retrospektiv bild av Lindbloms skulpturarbete från 1960-talets tidiga verk till de stora offentliga monumenten.`,
  },
  {
    slug: 'stig-larsson-1993',
    type: 'essay',
    year: 1993,
    title: 'Text, Skulptur, Lunds Konsthall',
    author: 'Stig Larsson',
    publication: 'Katalog Lunds Konsthall',
    lang: 'sv',
    body: `Stig Larsson, författare och konstkritiker, skriver om Sivert Lindbloms skulptur i katalogen till Lunds konsthall 1993.

Det finns en gåtfullhet i Lindbloms skulpturer som inte låter sig förklaras bort. De är igenkänliga och främmande på samma gång — profiler, ansikten, kropp, men transformerade till något som inte är direkt avbildning utan strukturell analys av det mänskliga.

Larsson pekar på Lindbloms förmåga att arbeta med det arketypiska utan att falla in i det dekorativa — skulpturerna bär på något väsentligt utan att vara allegoriska.`,
  },
  {
    slug: 'jean-christophe-ammann-1977',
    type: 'essay',
    year: 1977,
    title: 'Katalogtext, Live Show II, Kunstmuseum Luzern',
    author: 'Jean-Christophe Ammann',
    publication: 'Katalog Kunstmuseum Luzern',
    lang: 'de',
    body: `Jean-Christophe Ammann war Direktor des Kunstmuseums Luzern und kuratierte die Ausstellung "Live Show II" 1977, an der Sivert Lindblom, Björn Lövin und Ulrik Samuelson teilnahmen.

Die Arbeit von Sivert Lindblom, Björn Lövin und Ulrik Samuelson — drei schwedische Künstler, die seit den frühen 1970er Jahren zusammenarbeiten — stellt eine einzigartige Verbindung von Skulptur, Performance und Environment dar.

"Live Show" ist kein Spektakel im traditionellen Sinne — es ist eine Untersuchung der Bedingungen, unter denen Kunst entsteht und erfahren wird. Die drei Künstler bauen, manipulieren, verändern ihre Umgebung in Echtzeit, vor den Augen des Publikums.`,
  },
  {
    slug: 'beate-sydhoff-1967',
    type: 'interview',
    year: 1967,
    title: 'Samtal med Sivert Lindblom',
    author: 'Beate Sydhoff',
    publication: 'Konstrevy nr 2, 1967',
    lang: 'sv',
    body: `Beate Sydhoff intervjuade Sivert Lindblom för Konstrevy 1967, samma år som han återvänt från Locarno och undervisade i formteori på Arkitekturskolan (KTH).

— Vad är det du söker med din skulptur?

— Jag söker något som är i rörelse men ändå stilla. En form som har potential — som ser ut att kunna röra sig men väljer att inte göra det. Det är skillnaden mellan en levande form och en död form.

— Hur påverkar arbetet med arkitekterna ditt eget konstnärskap?

— Enormt. Arkitekturen tvingar dig att tänka i relation — relation till platsen, till kroppen, till staden. Du kan inte ha ett isolerat objekt i arkitektur. Det har format mitt sätt att tänka skulptur som platsspecifik, som relationell.

— Du har nyligen återvänt från Locarno. Vad tog du med dig?

— Distansen. Möjligheten att se det svenska konstnärliga klimatet utifrån. Och ljuset — det medelhavska ljuset är ett annat ljus, det bygger på en annan relation mellan kropp och skugga.`,
  },
  {
    slug: 'sivert-lindblom-live-show-1974',
    type: 'own_writing',
    year: 1974,
    title: 'Katalogtext, Live Show, Moderna Museet',
    author: 'Sivert Lindblom',
    publication: 'Moderna Museet, Stockholm',
    lang: 'sv',
    body: `Skriven av Sivert Lindblom till utställningskatalogen för Live Show, Moderna Museet, Stockholm 4 maj – 3 juni 1974.

Live Show är ett experiment i gränslandet mellan skulptur, performance och arkitektur. Vi — Björn Lövin, Ulrik Samuelson och jag — arbetar utan förutbestämt resultat. Utställningsrummet är vår arbetsplats, publiken är vittnen.

Det handlar om att göra arbetsprocessen synlig. Inte konsten som färdigt objekt utan konsten som händelse, som tid, som förändring.

Vi arbetar med material som trä, rep, tyg, metall — enkla ting som transformeras genom handling och intention. Resultatet är alltid oförutsett och aldrig definitivt.`,
  },
  {
    slug: 'sivert-lindblom-bra-konst-1986',
    type: 'own_writing',
    year: 1986,
    title: 'Bra konst i bra arkitektur',
    author: 'Sivert Lindblom',
    publication: 'KRO Distrikt 17 & SAR MSA symposium, 1986',
    lang: 'sv',
    body: `Föredrag hållet av Sivert Lindblom vid KRO Distrikt 17 och SAR MSA:s symposium 1986.

Relationen mellan konst och arkitektur är inte en relation mellan dekoration och funktion. Det är en relation mellan två sätt att forma rum — det ena (arkitekturen) primärt funktionellt, det andra (skulpturen) primärt perceptuellt.

Bra konst i bra arkitektur uppstår när dessa två perspektiv möts på ett sätt som förstärker båda. Det sämsta som kan hända är att konsten behandlas som utsmyckning, som ett möbleringstillägg i slutet av byggprocessen.

Konstnären måste in tidigt — helst i programskedet, inte i inredningsskedet. Platsen formas av konstverket lika mycket som konstverket formas av platsen.

Mina erfarenheter från Blasieholmstorg, Stockholms Universitet (Frescati) och Västra skogen T-banestation bekräftar detta: de lyckade projekten är de där dialog skett tidigt och kontinuerligt.`,
  },
  {
    slug: 'ulf-linde-1971',
    type: 'translated',
    year: 1971,
    title: 'Text to exhibition at Galerie Gimpel Hanover Zurich',
    author: 'Ulf Linde',
    publication: 'Galerie Gimpel, 1971',
    lang: 'en',
    body: `Text by Ulf Linde to accompany the exhibition at Galerie Gimpel Hanover Zurich, 1971.

Sivert Lindblom's sculptures have a paradoxical quality: they appear both archaic and completely contemporary. They seem to come from a civilization that never existed — or rather, from a civilization that exists only in the imagination.

The profiles, those abstracted human presences, are not portraits. They do not depict specific persons. They depict the condition of being a person — having a face, a side, a presence in space.

Lindblom works with stone and bronze as if they were the natural language of these forms — not materials he has chosen but materials the forms themselves demand.`,
  },
  {
    slug: 'beate-sydhoff-galerie-buren-1973',
    type: 'essay',
    year: 1973,
    title: 'Om Galerie Buren 1973',
    author: 'Beate Sydhoff',
    publication: 'Galerie Buren, Stockholm',
    lang: 'sv',
    body: `Beate Sydhoff skriver om Sivert Lindbloms utställning på Galerie Buren 1973.

Utställningen "Föreslagna åtgärder" på Galerie Buren 1973 var ett av de mest radikala konceptuella projekten i Stockholm under 1970-talet. Lindblom presenterade ett antal "förslag" — objekt och texter som föreslog ingrepp i det urbana rummet utan att genomföra dem.

Det är konst som arbetar med potentialitet — med vad som skulle kunna göras, inte med vad som är gjort. En skulptur kan vara ett förslag lika väl som ett objekt.`,
  },
  {
    slug: 'jan-hafstrom-1976',
    type: 'review',
    year: 1976,
    title: 'Om Live Show, Moderna Museet',
    author: 'Jan Håfström',
    publication: 'Moderna Museet, 1976',
    lang: 'sv',
    body: `Jan Håfström skriver om Live Show-projektet och dess efterverkningar.

Live Show var ett experiment som förändrade deltagarna lika mycket som det förändrade besökarna. Att arbeta öppet, utan förutbestämt resultat, inför en publik — det är ett tillstånd av total exponering som inte liknar något annat i konstnärlig praktik.

Sivert Lindblom, Björn Lövin och Ulrik Samuelson skapade ett slags konstnärligt laboratorium på Moderna Museet. Processen var synlig, verktygen var synliga, misslyckandena var synliga. Det var befriande och skrämmande på samma gång.`,
  },
  {
    slug: 'leon-rappaport-1963',
    type: 'preface',
    year: 1963,
    title: 'Förord till utställning, Galerie Buren',
    author: 'Leon Rappaport',
    publication: 'Galerie Buren, Stockholm',
    lang: 'sv',
    body: `Leon Rappaport skriver förord till Sivert Lindbloms första separatutställning på Galerie Buren, Stockholm 1963.

Sivert Lindblom är en konstnär som arbetar med tystnad. Hans skulpturer säger inte mer än de måste säga — de är ekonomiska, precisa, nödvändiga.

Redan i dessa tidiga arbeten finns den karaktär som definierar konstnärskapet: förmågan att ge form åt det som saknar form, att hitta det väsentliga i materialet och lyfta fram det utan överflöd.`,
  },
  {
    slug: 'stig-larsson-1981',
    type: 'essay',
    year: 1981,
    title: 'Om Sivert Lindblom, Galeri Åsbaek Köpenhamn',
    author: 'Stig Larsson',
    publication: 'Galeri Åsbaek, Köpenhamn',
    lang: 'sv',
    body: `Stig Larsson skriver om Sivert Lindbloms utställning på Galeri Åsbaek i Köpenhamn 1981.

Lindbloms skulpturer befinner sig i ett konstanttillstånd av potential. De är aldrig helt stilla — rörelsen är inbyggd i formen, i materialets spänning, i relationen till rummet och betraktaren.

I Köpenhamn visade Lindblom främst monoliter och blyplattor — verk med en oväntad intimitet trots sina materiella egenskaper. Blyets tyngd ger en närvaro som sten inte har.`,
  },
  {
    slug: 'stefan-alenius-1993',
    type: 'essay',
    year: 1993,
    title: 'Text, Skulptur Arkitektur, Skissernas Museum',
    author: 'Stefan Alenius',
    publication: 'Katalog Skissernas Museum',
    lang: 'sv',
    body: `Stefan Alenius, intendent vid Skissernas Museum i Lund, skriver om relationen mellan skulptur och arkitektur i Sivert Lindbloms verk, till katalogen för utställningen på Skissernas Museum 1993.

Skissernas Museum — med sin unika samling av skisser och förstudier till offentlig konst — är en naturlig plats för att studera Sivert Lindbloms arbete. Här finns processen dokumenterad: från det första handgreppet i lera eller gips till det färdiga monumentet i brons eller sten.

Lindbloms skulpturer är sällan enkla volymer. De rymmer ett program — en idé om hur kroppen förhåller sig till platsen, hur den mänskliga skalan samverkar med det urbana rummet. I hans skisser ser man hur denna idé förfinas: proportionerna justeras, ytorna förändras, tyngdpunkten prövas.

Det som är slående i Skissernas Museums samling av Lindbloms material är kontinuiteten. Från de tidiga profilerna på 1960-talet till de stora hästarna på Blasieholmstorg finns ett konsekvent tänkande om kropp, rum och närvaro.`,
  },
  {
    slug: 'cecilia-nelson-1993',
    type: 'preface',
    year: 1993,
    title: 'Förord, Skulptur, Lunds Konsthall',
    author: 'Cecilia Nelson',
    publication: 'Katalog Lunds Konsthall',
    lang: 'sv',
    body: `Cecilia Nelson, direktör för Lunds Konsthall, skriver förord till utställningskatalogen "Skulptur" 1993 — en samutställning med Skissernas Museum som visade Sivert Lindbloms skulpturarbete i ett tjugoårigt perspektiv.

Det är en utmaning att presentera ett konstnärskap av Sivert Lindbloms omfång och komplexitet i ett enda sammanhang. Lunds Konsthall har valt att fokusera på skulpturen som primärt uttryck — inte som dekoration eller komplement till arkitekturen, utan som självständigt konstform med sina egna inre lagar.

Utställningen sätter samman verk från 1960-talets tidiga experiment med form och material med de mer monumentala arbeten som tillkommit i samband med offentliga uppdrag. Linjen är tydlig: Lindblom har alltid sökt det väsentliga, det som inte kan reduceras ytterligare utan att försvinna.

Vi är stolta att presentera denna retrospektiva bild av ett av det svenska 1900-talets viktigaste skulpturarbeten.`,
  },
  {
    slug: 'ingela-lind-2012',
    type: 'review',
    year: 2012,
    title: 'Om Sivert Lindblom, Kungl. Konstakademien',
    author: 'Ingela Lind',
    publication: 'Dagens Nyheter',
    lang: 'sv',
    body: `Ingela Lind, konstkritiker på Dagens Nyheter, recenserar utställningen "AKVARELLER – m.m." på Kungl. Konstakademien i Stockholm, oktober–november 2012.

Hundra akvareller längs sjuttio löpmeter vägg — Sivert Lindbloms presentation på Konstakademien är en av de mer imponerande utställningarna i Stockholm det här hösthalvåret. Inte för att det finns någon dramatik i hängningen eller någon teatral iscensättning av verken, utan för att konsistensen och djupet i arbetet tillåter ett betraktande som saknar motstycke.

Akvarellerna från 1975–2012 är alla variationer på samma tema: den axonometriska projektionen av arkitektoniska former, utförda med Winsor & Newton-pigment direkt ur asken, utan förteckning eller förberedelse. Det är ett metodiskt systematisk arbete som ändå aldrig förlorar sin direkthet och sin enkelhet.

Lindblom är nu 81 år och dessa verk visar en konstnär som fortfarande befinner sig i full konstnärlig aktivitet. Det är sällsynt och det är värt att uppmärksamma.`,
  },
  {
    slug: 'janne-malmros-1993',
    type: 'review',
    year: 1993,
    title: 'Skissernas Museum / Lunds Konsthall',
    author: 'Janne Malmros',
    publication: 'Skånska Dagbladet',
    lang: 'sv',
    body: `Janne Malmros recenserar samutställningen "Skulptur" på Skissernas Museum och Lunds Konsthall 1993 i Skånska Dagbladet.

Sivert Lindblom är en konstnär som inte gör väsen av sig. Han arbetar utan manifestprogram, utan polemik, utan medial strategi. Ändå har han under trettio år skapat ett av de mest sammanhållna och stringenta skulpturarbeten i Sverige.

Den dubbla utställningen på Skissernas Museum och Lunds Konsthall ger en bred bild av detta arbete. På Skissernas Museum visas processens spår — skisser, modeller, dokumentation av de offentliga uppdragen. På Lunds Konsthall möter man skulpturerna i ett mer renodlat konstnärligt sammanhang.

Tillsammans ger utställningarna en förståelse för hur Lindblom tänker: skulpturen är aldrig ett isolerat objekt utan alltid del av ett sammanhang — arkitektoniskt, urbant, socialt. Och ändå är varje enskilt verk fulländat i sig självt.`,
  },
  {
    slug: 'jelena-zetterström-1993',
    type: 'review',
    year: 1993,
    title: 'Lunds Konsthall / Skissernas Museum',
    author: 'Jelena Zetterström',
    publication: 'Sydsvenskan',
    lang: 'sv',
    body: `Jelena Zetterström skriver i Sydsvenskan om den dubbla utställningen "Skulptur" på Lunds Konsthall och Skissernas Museum, hösten 1993.

Det finns en mognad och en säkerhet i Sivert Lindbloms skulpturer som man sällan möter. Inte självbelåtenheten hos någon som vet att han är etablerad och uppskattad — utan den säkerhet som kommer av att i trettio år ha undersökt samma grundläggande frågor om form, kropp och rum.

Profilens motiv, som funnits i hans arbete sedan 1960-talet, är fortfarande centralt — men hur det har fördjupats och berikats under decenniernas lopp. De tidiga profileerna var skarpa och analytiska. De senare är mer komplexa, mer laddade med erfarenhet.

Utställningen på Lunds Konsthall är välhängd och välkontextualiserad. Skissernas Museum ger det historiska djupet. Tillsammans är det en imponerande presentation av ett livsverk.`,
  },
  {
    slug: 'rebecka-tarschys-1989',
    type: 'review',
    year: 1989,
    title: 'Blasieholms torg',
    author: 'Rebecka Tarschys',
    publication: 'Dagens Nyheter',
    lang: 'sv',
    body: `Rebecka Tarschys recenserar invigningen av Sivert Lindbloms hästar på Blasieholmstorg, Stockholm 1989, i Dagens Nyheter.

Det händer sällan att offentlig konst skapar en omedelbar och naturlig närvaro i stadsrummet. Blasieholmstorgs hästar är ett sådant undantag. Sivert Lindbloms två grönpatinerade bronshästar — modellerade efter originalen i San Marcos basilika i Venedig — har etablerat sig i Stockholms stadslandskap som om de alltid funnits där.

Det paradoxala med dessa hästar är deras dubbelhet: de är kopior av en berömd skulptur och ändå fullständigt originella; de är representativa (hästar är hästar) och ändå abstraherade till något som går bortom det rent avbildande.

Lindblom har inte kopierat San Marcoshästarna slaviskt. Han har tolkat dem, gett dem en ny karaktär som passar Blasieholmstorgets nordiska ljus och havsnärhet. Det är ett mästerverk av offentlig konst.`,
  },
  {
    slug: 'ingmar-unge-1989',
    type: 'review',
    year: 1989,
    title: 'Blasieholms torg',
    author: 'Ingmar Unge',
    publication: 'Dagens Nyheter',
    lang: 'sv',
    body: `Ingmar Unge skriver om Blasieholmstorgs invigning och Sivert Lindbloms hästskulpturer i Dagens Nyheter 1989.

Blasieholmstorg har fått ett ansikte. Sivert Lindbloms hästar — gjutna av Herman Bergmans Konstgjuteri AB i patinerad brons — är ett tillskott till Stockholms stadslandskap av sällan skådat slag.

Det är inte ofta man ser offentlig konst som fungerar på alla plan: estetiskt, historiskt, urbant. Hästarna har en naturlig gravitas som inte beror på deras storlek (de är ungefär i naturlig storlek) utan på deras formspråk — en förtätad energi som ger varje form dess nödvändighet.

Lindblom berättar att han studerade San Marcoshästarna i Venedig under lång tid innan han tog sig an uppdraget. Det märks: i hans versioner finns både respekten för originalet och en fri tolkning som gör dem till något nytt. Stockholm är rikare för dessa hästar.`,
  },
  {
    slug: 'hedvig-hedqvist-1989',
    type: 'review',
    year: 1989,
    title: 'Blasieholmstorg',
    author: 'Hedvig Hedqvist',
    publication: 'Svenska Dagbladet',
    lang: 'sv',
    body: `Hedvig Hedqvist recenserar Sivert Lindbloms hästar på Blasieholmstorg i Svenska Dagbladet 1989.

Stockholm har fått sin snyggaste offentliga skulptur på decennier. Sivert Lindbloms grönpatinerade bronshästar på Blasieholmstorg fyller det blåsiga torget med en energi och närvaro som förändrar hela platsen.

Hästarna är inspirerade av San Marcoshästarna i Venedig — de fyra antika bronshästar som sedan mitten av 1200-talet prytt basilikans fasad. Lindblom har inte reproducerat dem utan återskapat deras anda i en ny form, anpassad till Blasieholmstorgets karaktär och det nordiska stadsrummet.

Det som imponerar är balansen: hästarna är monumentala men aldrig överväldigande, historiska men aldrig museala. De lever i sin nya miljö med en självklarhet som är konstnärens förtjänst och Stockholms lycka.`,
  },
  {
    slug: 'arkitektur-1983',
    type: 'interview',
    year: 1983,
    title: 'Intervju med Sivert Lindblom',
    author: 'Red.',
    publication: 'Arkitektur nr 5, 1983',
    lang: 'sv',
    body: `Intervju med Sivert Lindblom publicerad i tidskriften Arkitektur nr 5, 1983. Redaktionell intervju om konst i offentliga miljöer och samarbetet med arkitekter.

— Hur ser du på relationen mellan konstnär och arkitekt i ett offentligt uppdrag?

— Det handlar om dialog — om ett ömsesidigt lyssnande. Jag är inte intresserad av att ta en färdig skulptur och placera den i ett redan färdigt rum. Jag är intresserad av att förstå vad platsen behöver, vad arkitekturen saknar, och sedan hitta en form som svarar mot det.

— Finns det en risk att konsten underordnas arkitekturen?

— Alltid. Det är en ständig förhandling. Men jag har haft turen att arbeta med arkitekter som ser konsten som en likvärdig part, inte som en dekoration. När det fungerar bäst är det svårt att säga var arkitekturen slutar och konsten börjar.

— Ditt arbete med Västra skogen T-banestation och Frescati — hur skilde de sig åt?

— Västra skogen var ett slutet rum — en tunnel, ett passagerum. Frescati är ett öppet universitetslandskap. Skulpturerna måste fungera på helt olika sätt. I Västra skogen arbetar man med vad som möter resenären på nära håll; i Frescati med hur skulpturen kommunicerar på avstånd, i rörelse.`,
  },
  {
    slug: 'gemensamma-rum-1998',
    type: 'own_writing',
    year: 1998,
    title: 'Citat ur Gemensamma rum',
    author: 'Peter Cornell & Sivert Lindblom',
    publication: 'Gemensamma rum, 1998',
    lang: 'sv',
    body: `Utdrag och citat ur "Gemensamma rum" (1998) — en bok i samtal om offentlig konst och arkitektur, skriven av konsthistorikern Peter Cornell och skulptören Sivert Lindblom.

"Det offentliga rummet är alltid ett sammansatt rum — det tillhör alla och ingen. Konsten som placeras där måste förhålla sig till denna dubbelhet: den måste vara privat nog att röra oss individuellt, och offentlig nog att fungera som ett gemensamt tecken."

"Jag har alltid känt ett motstånd mot termen 'utsmyckning'. Det antyder att konsten är ett tillägg, ett ornament på något som redan är färdigt. Men det intressanta sker när konsten är med och definierar platsen från början — när skulptur och arkitektur växer fram ur samma ursprungliga tanke."

"Vad är ett gemensamt rum? Det är ett rum där vi är samtidigt ensamma och tillsammans. Torget, stationen, biblioteket — platser där det privata och det kollektiva möts. Konsten i sådana rum får en unik funktion: den kan vara en gemensam referenspunkt, ett tecken som vi alla förhåller oss till på varsitt sätt."

"Det handlar om närvaro. Skulpturen ska vara så naturlig på sin plats att man undrar om den alltid funnits där — och ändå, när man stannar upp och tittar, ska man kunna se att den rymmer någonting mer."`,
  },
  {
    slug: 'lars-bergquist-1980',
    type: 'translated',
    year: 1980,
    title: 'Préface pour la exhibition à Centre Culturel Suédois',
    author: 'Lars Bergquist',
    publication: 'Centre Culturel Suédois, Paris, 1980',
    lang: 'fr',
    body: `Lars Bergquist, ambassadeur de Suède en France, écrit la préface du catalogue de l'exposition de Sivert Lindblom au Centre Culturel Suédois à Paris, 1980.

La sculpture de Sivert Lindblom appartient à une tradition nordique de la rigueur formelle — une tradition qui va de Brancusi à Arp, mais qui puise aussi dans quelque chose de plus ancien, de plus archaïque. Il y a dans ces œuvres quelque chose qui évoque des civilisations disparues, des objets rituels dont nous aurions perdu la fonction mais pas la présence.

Ce qui frappe d'abord, c'est la densité. Les sculptures de Lindblom ne sont pas des objets légers. Elles ont un poids — pas seulement physique, mais ontologique. Elles occupent l'espace avec une assurance qui n'est pas de l'arrogance mais de la nécessité.

L'exposition au Centre Culturel Suédois présente un choix représentatif de son travail des années 1960 aux années 1970 — les profils, les monolithes, les plaques de plomb. C'est une introduction à un œuvre qui mérite d'être mieux connu en France.

La Suède est fière de présenter cet artiste exceptionnel à Paris. Sivert Lindblom est l'un des sculpteurs les plus importants de sa génération, et son travail parle un langage qui transcende les frontières nationales.`,
  },
  {
    slug: 'beate-sydhoff-italian-1967',
    type: 'translated',
    year: 1967,
    title: 'Conversazione con Sivert Lindblom',
    author: 'Beate Sydhoff',
    publication: 'Konstrevy nr 2, 1967 (Italiano)',
    lang: 'it',
    body: `Traduzione italiana dell'intervista di Beate Sydhoff con Sivert Lindblom, originariamente pubblicata su Konstrevy nr 2, 1967.

— Cosa cerca nella sua scultura?

— Qualcosa che sia in movimento eppure fermo. Una forma che abbia potenziale — che sembri potersi muovere ma scelga di non farlo. È la differenza tra una forma viva e una forma morta.

— Come influisce il lavoro con gli architetti sulla sua pratica artistica?

— Enormemente. L'architettura ti costringe a pensare in termini di relazione — relazione con il luogo, con il corpo, con la città. Non puoi avere un oggetto isolato nell'architettura. Ha plasmato il mio modo di pensare la scultura come site-specific, come relazionale.

— È recentemente tornato da Locarno. Cosa ha portato con sé?

— La distanza. La possibilità di vedere il clima artistico svedese dall'esterno. E la luce — la luce mediterranea è una luce diversa, costruisce una diversa relazione tra corpo e ombra.

— Come vede il rapporto tra scultura e spazio pubblico?

— La scultura pubblica deve guadagnarsi il suo posto. Non può semplicemente essere collocata — deve crescere da una comprensione profonda del luogo. Il mio lavoro come docente alla Scuola di Architettura mi ha aiutato a capire questo: l'architettura e la scultura devono dialogare dall'inizio, non alla fine.`,
  },
  {
    slug: 'beate-sydhoff-english-1967',
    type: 'translated',
    year: 1967,
    title: 'A Conversation with Sivert Lindblom',
    author: 'Beate Sydhoff',
    publication: 'Konstrevy nr 2, 1967 (English)',
    lang: 'en',
    body: `Beate Sydhoff's interview with Sivert Lindblom, translated into English. Originally published in Konstrevy nr 2, 1967.

— What are you searching for in your sculpture?

— Something in motion yet still. A form with potential — that appears to be able to move but chooses not to. That is the difference between a living form and a dead one.

— How does your work with architects affect your own practice?

— Enormously. Architecture forces you to think in relation — relation to place, to the body, to the city. You cannot have an isolated object in architecture. It has shaped my thinking of sculpture as site-specific, as relational.

— You recently returned from Locarno. What did you bring back?

— Distance. The possibility of seeing the Swedish artistic climate from outside. And the light — Mediterranean light is a different light, it builds on a different relationship between body and shadow.`,
  },
]
