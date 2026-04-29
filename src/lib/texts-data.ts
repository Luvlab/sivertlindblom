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
