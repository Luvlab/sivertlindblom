import { TEXT_TRANSLATIONS } from './text-translations'

export interface TextItem {
  slug: string
  type: 'essay' | 'preface' | 'review' | 'interview' | 'own_writing' | 'translated'
  year: number
  title: string
  author: string
  publication: string
  lang: 'sv' | 'en' | 'de' | 'fr' | 'it'
  body: string                              // original-language body (always present)
  bodies?: Partial<Record<string, string>>  // locale → translated body
}

const RAW_TEXTS_DATA: Omit<TextItem, 'bodies'>[] = [
  {
    slug: 'peter-cornell-2012',
    type: 'essay',
    year: 2012,
    title: 'Text till katalog, Akvareller m.m. 2012',
    author: 'Peter Cornell',
    publication: 'Katalog Kungl. Konstakademien',
    lang: 'sv',
    body: `Ett flöde av sinnrika konstruktioner. Krafter som tynger, pressar, svävar. Allt är fakta som i den nya franska romanen; på en gång sakförhållanden och fiktion.

Närmast oräkneliga löper de akvarellerade teckningarna som en fris genom utställningssalarna, ett ackompanjemang eller musikaliskt ledmotiv. I bildsviten pågår en o-uttröttlig verksamhet av byggen, konstruktioner och en aldrig sinande uppfinningsrikedom för att komma fram till den ideala lösningen. Föremålen – plank, stativ, trappor, stenar och klot – verkar alla hämtade ur samma förråd av rekvisita; element som ofta återkommer i Sivert Lindbloms konst. Träd och häckar påminner mer om artefakter och kulisser än levande natur och allt utspelar sig på en scen vars räfflade underlag liknar det väl krattade gruset i en zen-trädgård. Scenen är sedd snett uppifrån i ett skevt, axonometriskt perspektiv.

Vem är byggherren? Är han en hotfull demiurg eller är allt bara på lek?

Föremålen är spelpjäser i ett spel med givna regler som begränsar och tvingar men samtidigt är en paradoxal förutsättning för frihet; det går ju inte att leka utan regler! Ett sätt att leva, att parera nödvändighetens rike. Konstnären söker därför verktyg som begränsar valmöjligheterna och styr arbetet: ett tekniskt ritbord med linjaler och gradskiva, inte ett traditionellt staffli. Och spelreglerna för färg: alltid oblandade, direkt ur Winsor & Newtons färgkoppar.

Det är sakligt och oromantiskt som hos Bauhaus. Inga måleriskt utstuderade effekter, ingen subjektivism. Det är samma objektiva exakthet som när minimalisterna använde sig av brädgårdarnas standardmått för sina vita boxar. Sivert Lindblom har tillämpat en motsvarande metod i sina offentliga arbeten, till exempel i den ornamentala kakelsviten i tunnelbanestationen Västra Skogens dunkla grotta: kakelplattornas mått och färg var redan givna och kakelsättarna bestämdes inte av andra överväganden än sina arbetsrutiner. Och Sivert Lindbloms bilder styrs på samma sätt av ritbordets utrustning och begränsningar. Men de objektiva reglerna utesluter inte en spontanitet i själva koncipieringen, för varje ny bildidé uppstår impulsivt och oöverlagt – där smyger sig trots allt ett romantiskt skapande in bakvägen, ett omedvetet skikt i gryningens dröm och psyke.

Den tekniska ritningen har sin egen fiktion. Det noterade Roger Caillois, den franske idéhistorikern i surrealismens närhet: "Tekniska, dokumentära och vetenskapliga verk ställer oss inför en rad illustrationer där man i sökandet efter det verkliga möter det fantastiska." De ger oss mer att drömma om, de ställer fler problem, de överraskar eller oroar mer än de verk där konstnären uttryckligen spekulerar i känslan för det mystiska som han försöker få sina verk att förmedla. Och Sivert Lindblom använder sig just av den vetenskapliga fiktionens genre i sina akvareller.

Här tycks allt utspela sig i en avlägsen park, en enslig plats eller locus solus; jag tänker på Raymond Roussels roman där uppfinnaren professor Canterel tar med sina besökare på en rundvandring i en parkanläggning för att visa sin samling sällsamma konstruktioner och apparater.

Roussels patafysiska roman inspirerade den italienske arkitekten Carlo Scarpa i utformningen av den vidsträckta kyrkogårdsanläggningen Brion i Treviso – det är en estetik som står Sivert Lindblom nära.

En outtröttlig verksamhet på en byggplats, otaliga utkast och förslag: det är snart fullbordat! Den utopiskt blå kvadraten! Men ändå inte; utopin glider alltid undan som den icke-plats som är utopins etymologiska mening. Det är som i de utopiska projekten av den franska revolutionens arkitekter Boullé och Ledoux; deras jakt på ett fulländat samhällsbygge är på en gång ett storslaget och melankoliskt projekt som pendlar mellan tvång och frihet.

Svitens byggmästare är en Sisyfos där varje utkast får honom att börja på nytt och på nytt. Sisyfos är en tålmodig stoiker, inte olycklig; ett sinnestillstånd och en livshållning.

Men något okänt tränger sig in i de välordnade ritningarna: en svart formlös fläck liksom en stor bläckplump saboterar ordningen, eller en oförklarlig störning av svarta, plangeometriska gestalter som ett slags korrigeringar av en okänd hand, ibland destruerande som ett metafysiskt virus. De skapar plötsliga, blixtsnabba och oroliga rörelser i bildrummet; kanske budbärare från en annan värld, från det Malevitj kallade en fjärde eller femte dimension, 'ett geometriskt paradis' bortom tiden och döden.

Existens, samhällsbygge, teknologi – de drömda lösningarna gäller kanske till slut bildens egen byggnad: bildens outtömliga variationer och möjligheter.

Peter Cornell`,
  },
  {
    slug: 'jan-oqvist-2012',
    type: 'essay',
    year: 2012,
    title: 'Text till katalog, Akvareller m.m. 2012',
    author: 'Jan Öqvist',
    publication: 'Katalog Kungl. Konstakademien',
    lang: 'sv',
    body: `Ett inre rum med yttre gränser genom vilket tiden passerar

Alla känner vi skillnaden mellan upplevelsen av att se spåren av en händelse och att själva ha fått vara med om själva händelsen.
Gestaltande konst försöker upphäva denna skillnad och få oss att bli en del av det som skapade verket.
I Sivert Lindbloms till synes scenografiskt strama landskap tvingas vi att ta ställning till detta fenomen.

Skeendet, tidpunkten och platsen för händelserna i hans bilder är öppna för oss. Det vi ser verkar vara frusna ögonblick men samtidigt tecken på att något dramatiskt är på gång. Vi kan aldrig vara riktigt säkra på vilket – när, var och varför finns inte i hans bilder och objekt men ändå är det där med oss i betraktandet. När vi, åskådare, befinner oss granskande och ser ner i de rumsligheter han avbildat försöker vi identifiera det vi ser och ställa detta i relation till våra egna erfarenheter. Trots sin saklighet och frånvaron av visuella betoningar som reflexer och skuggor får dessa objekt stark innebörd.
De tunna färgskikten på de statiska objekten blir en vibrerande hinna, en hud som andas omsorg. Vi skapar referensvärldar för att se vad iscensättningen står för. Varje delobjekt i hans bilder är precist och verkar överensstämma med det igenkännbara. Likheterna mellan barndomens byggklotsar och futuristiska arkitektvisioner färgar våra tolkningar.
Vi försöker spåra orsakerna till dessa egensinniga världar och vad som där ska bli. Det börjar som en visuell lek med det sneda perspektivet men går snabbt över till att bli en mental uppgörelse med oss själva. Inte med det som finns avbildat utan med det som inte finns där.
Vi är vana att en inre logik måste råda mellan det avbildade och det som sker i vårt medvetande, att det finns samband mellan tanke och handling och att detta även måste ligga till grund för konstnärliga manifestationer – att innehåll och upplevelse har ett uttryckt samband.

Det enda tolkningsbara i Sivert Lindbloms bilder kommer från våra egna mentala bearbetningsprocesser.
Sinnesstämningen blir den som uppstår i oss i när vi begrundar logiken i hans bilder – hur ogripbar den än syns vara. Här uppstår den svindlande tanken att vi står inför något som kanske är obegripligt men påtagligt närvarande i skapelseakten.

Det avbildade tycks vara något mer än det synliggjorda, det väcker känslor – objekten – hela tiden på väg, framkallar energier genom sin temporära närvaro och sin fysiska utstrålning. Det är det till synes borttagna och det som inväntar åtgärder eller skeenden som framkallar meningen bortom det uppenbara. Vad får vi aldrig veta.

Hans akvareller är i första hand inte avbildningar utan iscensättningar av mentala och pågående tillstånd.
Objekten i Sivert Lindbloms bilder är som synteser av avlägsna och tidlösa kvarlevor i förhistorien. I denna bok (AKVARELLER m.m.) bjuder han oss på dessa impulser. Han gör dem till tidlösa kommentarer.
De är minnesfragment med känslomässiga kopplingar: visuella impulser med plötslig närhet. En förkroppsligad inspiration som lett fram till ett eget form- och bildspråk. De är inte symboler – de blir redskap för självkännedom när vi förhåller oss till detta.
En vanlig förklarande formel som vi brukar använda på oss själva är att vi är resultatet av våra upplevelser och produkten av våra handlingar. All konsts största utmaning ligger i avgränsandet från det oväsentliga.

När man ser Sivert Lindbloms bilder är det som att försöka förstå naturlagarna men de är undflyende och behåller sina egna konstanter. Bilderna är sig själva och oberörda av sitt öde. Även om han överlämnat dem åt betraktaren kan han aldrig befria sig ifrån dem. Lika lite som hans bilder kan frikopplas från sin historia går det att utesluta att det även finns referenser till det som han ser som det mest sevärda.

Han har efter ett långt livs avläsning av omvärldens formspråk gett oss ett sätt att se tillvaron bortom det uppenbara.

Ser vi skulptören Sivert Lindbloms formvilja i bilderna som antyder hur hans materia kan genomgå transformationer? Är bläckplumparna, den svarta materian, molnen eller de svarta blixtarna som tränger sig in över och genom bilderna den obekanta mängden av möjligheter som söker sin form och sitt uttryck?
Trots att något tycks ske i bilderna är det inte tydligt. De skildrar skapande förändringsprocesser, oavslutade och utan tydliga mål.

Vi anar målmedvetna arbetsinsatser av något frånvarande som ämnar omvandla något utan ha ett egentligt uppdrag eller tydligt syfte. Detta beskriver förgängligheten i det som pågår.
Vi ser de skyddande skikten. Vi ser skalen som formats av olika innehåll. Vi ser gjutformarna och hur dessa lämnats åt sitt öde. Även om vi anar de skapande processer som krävs för att omvandla en form till en annan så anger inte objektens tvetydighet någon början och heller inget slut. Betraktaren fyller objekten med innehåll eller frigör dem från ett innehåll.

Vi anar människans försök att beskriva idéns närvaro och hennes försök att placera sig vid sidan om denna.
Vi söker efter människan som del av sin egen skapande process.
Vi vill kunna ställa oss inför detta som är mycket större än oss själva.
Människan som har modet att se:
det humoristiska och melankoliska i förgängelsen och i skapandet.

Vi fyller formerna med idén om konsten och oss själva med innehåll eller vi bryter oss ur formen för att meddela vår närvaro i det vi tycker oss sakna. Sivert Lindblom är varken i början eller i slutet i denna process – han är i processen mellan bägge världarna.
Konstnären som skapar för att berätta att vi finns.
Vi ropar ut i universum och undrar: förutom det kända och det okända där ute, finns det något mer?

— Jan Öqvist`,
  },
  {
    slug: 'catharina-gabrielsson-2012',
    type: 'essay',
    year: 2012,
    title: 'Text till katalog, Akvareller 2012',
    author: 'Catharina Gabrielsson',
    publication: 'Katalog Kungl. Konstakademien',
    lang: 'sv',
    body: `'Genom modeller och beskrivningar kan vi få verkligheten att framträda och vi har ingen rätt att väja för det som blir synligt.' Sivert Lindblom (1974)

En kall marsdag på vandring passerar jag en märklig, kritvit skulptur i skogen. Den är drygt en meter hög och består av en avbarkad trädstam, kluven längst upp och med en käpp nedstucken djupt i sprickan. Den släta vita ytan lyser i dunklet. Formen är fullständigt främmande sin omgivning, en vårvintrigt naken slyskog i utkanten av ett fält. Senare får jag veta att det rör sig om en anordning jägarna använder för att ge salt till rådjur och älg. Viltet har slickat i sig saltet som runnit ner och färgat stammen vit.

Vid mitt nästa besök är en ny saltsten på plats och den skulpturala effekten uteblir. När ändamålsenligheten blir visuellt fattbar blir objektet ett ting bland andra – visserligen en artefakt, skild från naturen, men inte längre en skulptur.

Skulpturen har uppenbarligen med det främmande att göra, med avskiljandet från det vardagliga, men det är inte därför jag kommer att tänka på Sivert Lindblom. Inte heller för att vitmålade grenar är ett återkommande inslag i hans arbeten, grenar som surrats fast på ställningar och givits olika seriella placeringar i konstrummet, ute i skogen eller som bildmotiv; olika representationer och inplaceringar som givetvis också förändrar deras tingliga uttryck och meningskomplex. Men relationen mellan saltstoden i skogen och Lindbloms konstnärskap är inte primärt av visuell karaktär, inte heller är den speciellt intressant för att den närmast övertydligt pekar ut sammanhangets betydelse för att säkerställa konstens identitet och avsöndringsförmåga.

Det jag kommer att tänka på är det som föregriper formen, dess förutsättningar och orsaker, formblivandet eller i en mera aktiv, konstnärlig mening – formgivandet.

I Sivert Lindbloms formvärld framstår ofta objekten som en följd av en process, konsekvensen av en metod (gjuta, svarva, binda, mäta osv.) och ett visst material (trä, bly, lera, brons, rep osv.). Formen är det kvarvarande. Därmed uppstår en spänning mellan formens uttryck och dess bakomliggande villkor, dess tillblivelse, i vilken den konstnärliga viljan och förmågan endast utgör en komponent av ett (ur materiellt hänseende) oräkneligt antal formande faktorer: geologiska, biologiska, fysikaliska, kemiska, kulturella, maskinella, ekonomiska osv. Formen pekar därmed bortom sig själv, mot en rad rationella, slumpmässiga eller automatiska påverkande krafter som konstskaparen mer eller mindre medvetet har att förhålla sig till.

Lindbloms påtagliga strävan att minimera eller isolera det konstnärligt subjektiva inslaget – det som kan uppfattas i termer av generalitet, neutralitet eller vetenskaplighet – kan på samma sätt förstås som ett sätt att framhålla omständigheter som föregriper formens uttryck och som avtäcks genom den. Därför behåller han till exempel det fabriksskurna papprets format i sina akvareller och låter färgerna vara rena och obrutna: de utgör faktiska, givna element i en utvidgad – och därför problematiserad – formgivning.

Med detta perspektiv får begreppet saklighet en förnyad relevans. Historiskt sett har det sakliga – i framför allt 20-talets modernistiska arkitektur och industriformgivning – betecknat just strävan att 'få verkligheten att framträda' som är den unge Sivert Lindbloms avsiktsförklaring. Men här handlar det inte om avbildning, inte heller om ett slags teknisk-logisk nödvändighet, utan om en förståelse av formen som just formad – formen som en följd av omständigheter, som en konsekvens.

'Undret är ej att tingen är sådana de är utan att de ej är helt annorlunda' är ett citat som återkommer i Lindbloms bibliografi. Det innebär att besattheten vid objektet (utmärkande för vår kultur) viker undan till förmån för tillblivandets villkor, bortom den antropocentriska tolkningsramen.

Lindbloms konstskapande kan sägas vittna om ett evolutionärt förhållningssätt – i synnerhet om man bortser från den prägling av fulländning och framåtskridande som vidhänger begreppet, för vad Darwin ytterst visade var dynamiken i det organiska livets mångfald och slumpens oerhörda betydelse som formgivande element.

Lindbloms konst har mycket riktigt kallats posthumanistisk i det att den använder den mänskliga figuren som ett avpersonifierat tecken, men jag tror att premisserna för en sådan förståelse måste nyanseras. Det posthumanistiska springer inte ur en negerad – och därför paradoxalt nog vidmakthållen – mänsklig centralitet, utan ur insikten att formen endast utgör en tillfällig och delvis slumpmässig materiell sammansättning; följden av en oändligt utsträckt och komplex naturlig eller kulturell process som varken avstannar eller avslutas med det vi konventionellt benämner skulptur.

Vi ser inte längre en egyptisk pyramid, utan ett monument över slavsamhället; inte en ny mobiltelefon, utan den arktiska utvinningen av spårmetaller; inte längre ett par gymnastikskor, utan arbetsvillkoren i det så kallade post-industriella samhällets fabriker. Inte längre en skulptur, utan följden av en uppsättning bortträngda och immateriella villkor som endast konsten har kraft att framkalla.

Catharina Gabrielsson`,
  },
  {
    slug: 'daniel-birnbaum-1993',
    type: 'preface',
    year: 1993,
    title: 'Förord, Skulptur, Lunds Konsthall',
    author: 'Daniel Birnbaum',
    publication: 'Katalog Lunds Konsthall',
    lang: 'sv',
    body: `"Den mänskliga kroppens yta är gränsen mellan inre och yttre. Finns det en liknande yta i tänkandets rike, som skiljer tankens insida från dess utsida, från det icke tänkta?" I Paul Valérys Cahiers finner man en serie reflektioner som utvecklar föreställningen om en abstrakt yta som föregår det mänskliga medvetandet, en yta som kan veckas och böjas tillbaka över sig själv, och på så vis skapa den mänskliga tankens inre rymd.

Att få tillgång till denna yta, skriver Valéry, är tanken att tänka bortom människan – att tänka det omänskliga.

Är det denna yta som ger sig tillkänna i Sivert Lindbloms skulpturer från 60-talet, dessa svarvade gestalter som likt schackpjäser tycks röra sig i ett abstrakt rum bortom det mänskliga? Det personliga, konstnärens egen profil, har i dessa skulpturer generaliserats till en överallt närvarande form – den egna kroppens signatur har blivit en figur utan relation till det unika jaget. Detta är en konst som befriats från traditionella föreställningar om ursprung och originalitet; det unika har lämnat plats åt serier utan absolut början eller slut.

"Vi kan idag inte annat än tänka i det vakuum som lämnats efter människans försvinnande", lyder en sats av Michel Foucault som Lindblom sätter som motto för sin utställning på Biennalen i Venedig 1968.

Människan, så som hon studeras av de moderna humanvetenskaperna, är enligt Foucault en tillfällig kristallisering av krafter, som ett slags knut som i framtiden kommer att lösas upp för att lämna plats åt nya former av liv. Det är innebörden i den profetiska avslutningen av Les mots et les choses: "Som vårt tänkandes arkeologi visat är människan en uppfinning av sent datum. Och kanske en som närmar sig sitt slut."

Människan, skriver Foucault, är en formation som snart kommer att "suddas ut, likt ett ansikte som ritats i sanden vid havets rand."

Vad är den egna profilen, eller handens unika signatur, i ett sådant posthumanistiskt rum?

Lindbloms konst undersöker själva spänningen mellan det unika och det generella – mellan det egna och den maskinella reproduktionen. Redan i de tidiga arbetena i brons finns, trots närheten till Rodin och den klassiska skulpturen, denna spänning. Lindblom arbetar med repetitiva moment – verken skrivs in i serier, vilket ruckar på deras status som unika. Det singulära uttrycket försvinner in i en mer omfattande rörelse.

Ingenstans är denna försvinnandets rörelse, som också Foucault intresserade sig för, tydligare än i de svarvade arbetena från 60-talet. Men avhumaniseringen drivs ännu längre under de kommande åren: här handlar det inte längre om den mänskliga kroppens förvandling till generaliserad form, utan om en fullständig frånvaro av det mänskliga. Själva motsättningen mellan människa och värld har lämnat plats åt ett slags artificiell natur, ett landskap som förenar det organiska med abstrakta konstruktioner: grenar fogas till enkla arkitektoniska element, väldiga stenblock förbinds av grova kättingar. Ingenstans skymtar mänskliga former.

Väsentligare än det enstaka verket är den modell som förmår generera en form – en gång eller oändligt många gånger. Lindbloms arbeten innefattar inte sällan en redovisning av själva den konstnärliga metoden: mallen, gjutformen, mätredskapen. Här finns en närhet till vetenskapen. Ingenting lämnas dolt; ingenting är hemligt.

Upprepningen har sin plats i detta utforskande av modellens möjligheter: en form kan repeteras och varieras i ändlösa material och tekniker. När människan åter introduceras i Lindbloms landskap är det som en sådan variabel.

Avgjutningen av den egna kroppen återges i olika storlekar och utföranden; det handlar inte om något återupprättande av en humanistisk kropp, utan om ett laborerande med en form som mångfaldigas och inordnas i en större logik. Likt ornamentet, som följer upprepningens och de små förskjutningarnas princip, arbetar sig denna konst igenom formens alla möjligheter.

Men ornamentiken sluts aldrig, mönstret förblir öppet. På utställningen Ibid sitter de två små gestalterna ihopkrupna på olika höjd – runtomkring dem på väggen ett slags ornament i gips. "Ornament ist Verbrechen", skriver Adolf Loos. Brottet bestraffas: ornamentiken bryts sönder, faller i bitar.

Gipsfragmenten ligger strödda över golvet.

Daniel Birnbaum`,
  },
  {
    slug: 'stig-larsson-1993',
    type: 'essay',
    year: 1993,
    title: 'Text, Skulptur, Lunds Konsthall',
    author: 'Stig Larsson',
    publication: 'Katalog Lunds Konsthall',
    lang: 'sv',
    body: `Det är inte en slump att Sivert Lindblom benämner det mesta i sin produktion Utan titel. Det finns en vägran i honom att närma sig en betydelse, en tidigare existerad värld hans verk skulle kunna hänföras till. Denna vägran ser vi också genomgående hos minimalismen och delar av den abstrakta expressionismen.

Men hos honom är inte denna vägran till betydelse entydigt kopplad med en reduktion av former, med en enkelhet.

Det är snarare ett försök att tala aldrig talade ord, att genom tingen äska ett adamiskt språk, där tingen och namnen är ett, där det inte finns denna ursprungliga klyvnad, ett språk där det moraliska omdömet inte trätt in. Att skapa former där estetiska och religiösa konnotationer inte bortbleknat – de har aldrig funnits. Där den högstämdhet som vilar över tingen kan locka åskådaren att frammana bakomliggande gåtor (kanske från Kabbala, kanske från mayafolkens ritualer) men där allt sådant arbete är förgäves. Det finns ingen gåta, ingenting bakomliggande hos Lindbloms skulpturer. Det som finns är en slät eller veckad yta innan eller efter, den mänskliga kulturen: en röst som inte kommer från ett struphuvud. Det är ting som aldrig varit invävda i de språkliga system som utgör den objektivitet som vi som subjekt förhåller oss till när vi tänker och ser våra liv.

Dessa språkliga system som alltid utgör ett Där, som vi aldrig helt kan göra till ett Här, som vi inte kan tänka, göra genomskinliga för vår blick, eftersom de bildar ett Före, en gräns för vår egen subjektivitet – vilket gör att man inte kan "förstå" konstverk. När Lindblom undviker betydelsen, ännu som anad betydelse, är han en del av de strömningar i vårt århundrades konst som försökt ställa sig utanför, bortom, ett språkligt system inom vilket allting redan tycks ha uttryckts. Känslan av senhet är säkert incitamentet till dessa önskningar om ett otalat språk.

Hos Lindblom utgör motsättningen mellan detta absoluta krav och det första intryck som stöter emot oss, intryck av en avlägsen, en gång oerhörd magi, den spänning som gör att hans verk inte sällar sig till raden av sisyfosförsök att skapa ett nytt språk. Det finns ingenting bakom, absolut ingenting, och det att vi verkligen trott på ett obetydligt, svagt glimmande, men ändå ett svar, gör att vi inför detta ingenting ser den avgrund som tomheten, den icke meningsbärande gesten och tinget har, den tomhet, den icke-mänsklighet, som vidlåder naturen.

De små gjutna människofigurerna som är uppsatta på en vägg utgår från en avgjutning av den egna kroppen Lindblom gjorde under sextitalet. De är exakta kopior av den ursprungliga modellen, skalenligt förminskad i en verkstad i Paris, varje detalj, t.o.m. en ring han hade på sig under avgjutningen, finns kvar. Men trots att den är ytterst människolik, vi skulle kunna vänta oss att den skulle resa sig på sina små ben, finns det inget mänskligt över den, ingenting subjektivt. Upprepningen och förminskningen av den mänskliga kroppen gör att dess främsta konstituent, dess unicitet, kroppen, lever i skillnaden från andra kroppar, bräcks sönder, kroppen, det mänskliga, avhumaniseras i grunden. Den blå, röda och svarta färg som kastats över figurerna, som "skändat" dem, är ytterligare en förstärkning av denna rörelse. Färgerna är oss något främmande, vi är inga färger.

De lister av brons som är placerade i ögonhöjd i lokalen, kraftigt patinerade i grönt, är Lindbloms senaste arbete. Även de är avskalade all funktion, all betydelse. De skulle kunna vara stavar i en uråldrig indiansk ritual, men de refererar inte till någon tro, bortom deras materialitet finns ingenting. Det är i materialen, bly, päronträ, plast, här brons, vi möter den totalt stumma naturen.

Lindbloms verk existerar i större utsträckning inuti sig själva, en kvadratcentimeter brons omgärdad av brons, ett universum av materialitet, en luftlös och blicklös punkt av ickemänsklighet. De är placerade i ögonhöjd, mot irisens och blickens kanske gröna köttslighet står hårdheten, ouppbrytbarheten i bronsets gröna materialitet. Den horisontella linjen av käppar som omsluter rummet har sin pendang i en annan materialitet, de gröna ögonens, blickarnas, de som ibland hejdar sig mot varandra – lika omöjliga att genomtränga som bronsen.

Vi ser hellre ett Efter än ett Före språken hos Lindblom, hellre en ny inte inlöst stavelse, än drömmen om en en gång uttalad, nu glömd sedan miljoner år. Inte drömmen om en ursprunglighet, inga drömmar alls, det vakna tillståndet i en kommande värld där tingen och namnen är ett. Man skulle kunna likna Lindbloms arbeten med en apné, den indiska tekniken för medvetet hjärtstillestånd, en sista ansträngning för att träda ut ur det mänskliga.

Kanske dödens former, förruttnelsen, skelettets hårdhet, bär en mer pregnant bild av oss som människor, där vi inte längre är mänskliga, "humana", utan helt försänkta i naturens tystnad. Alltifrån de egyptiska gravritualerna har en sådan aning funnits.

Lindblom är ännu ett vittne till denna livets avstängning.

Stig Larsson`,
  },
  {
    slug: 'jean-christophe-ammann-1977',
    type: 'essay',
    year: 1977,
    title: 'Katalogtext, Live Show II, Kunstmuseum Luzern',
    author: 'Jean-Christophe Ammann',
    publication: 'Katalog Kunstmuseum Luzern',
    lang: 'de',
    body: `SIVERT LINDBLOM

Sivert Lindblom, geboren am 1.11.1931, ist Bildhauer. Zu Beginn der sechziger Jahre schuf er Skulpturen in Holz und Kunststoff. Sie sahen u.a. aus wie die Balustradenstützen einer Renaissanceterrasse: er schuf ganze Serien davon, einerseits in einer Reihe geordnet, alternierend zwischen einem schmalen und einem breiten Element.

Bei genauerer Betrachtung konnte man feststellen, dass die isolierten Gebilde ein menschliches Profil zeigten, in den Reihenskulpturen dagegen wurde der Umriss des menschlichen Körpers durch den Zwischenraum gebildet. Es handelte sich stets um sein eigenes Profil, um seinen eigenen Körperumriss. Die Skulpturen waren anonym, glatt und abweisend. Sie waren eine perfekte Metapher für die 'Kälte' seiner Ideen, für eine Art von angereichertem Leer-Zustand, der nicht von innen her zu erläutern, nur von aussen zu umreissen war: durch eine Form, die a) nichts Originäres im Sinne der Erfindung offenbarte, b) mechanisch hergestellt wurde und sich c) durch eine ebenso lapidare Farbigkeit charakterisierte. Entsprechend dem Zeitgeist wurden diese Arbeiten allzu rasch als Ausdruck der Kunststoffeuphorie gesehen, etwa in der Perspektive der damaligen englischen Skulptur.

Als Lindblom Ende 1960 seinen Blick ausdehnte, wurde plötzlich klar, was die „Kälte" seiner Ideen beinhaltete. Es schien, als blickte er in eine Welt, die er sehr genau registrierte, ohne sie zu verstehen. Es schien, als sähe er Gegenstände, ohne deren Bedeutung zu erkennen. Er entleerte nicht den Gegenstand seiner Bedeutung, er sah ihn ohne Bedeutung. Seiner in Einzelmomente entsprach gleichzeitig die Neutralisierung des durch das Wissen voreingenommenen Blickes. Liegt hier eine Methode (strukturalistischer Natur) vor oder macht den Zusammenhang bedeutungslos? Mir scheint, dass beide Seiten ineinanderwirken.

In dem Masse wie Lindblom die Welt der Dinge ihrer Bedeutung entkleidet sieht, in dem Masse lädt er sie (re)konstruierend mit Bedeutung auf. Aber dieses bedeutungsschaffende In-Verbindungsetzen erscheint denkbar hilflos. Sind die mit Seilen an Vierkantbalken geschnürten Äste — Teil seines Vokabulars seit Anfang 1970 — nicht allzu einsichtige Metaphern? Sie sind es dann, wenn man eingleisige Schlüsse daraus zieht: die Erkenntnis gleichsam vorausnimmt, ohne die Querverbindungen miteinzubeziehen, welche diese Erkenntnis relativieren.

Die sinn-losen Verbindungen und Beziehungen sind nur im Vergleich zu sinn-vollen relevant. Das heisst, sie sind in dem Masse sinn-los, als die sinn-vollen, entsprechend ihrer Ideologie, zum Spielball einer Rhetorik der Bedeutungen um ihrer selbst willen geworden sind. Lindblom deckt nichts auf, er schafft die äquivalente Gegenwelt. Assoziatives findet nicht statt. Denn die Objekte werden nicht inhaltlich als Gegensatz miteinander verbunden; die bedeutungsschaffende Verknüpfung ist in sich selbst gegensätzlich, weil sie den Zusammenhang der im Wahrnehmungsprozess negiert. Ein solches Vorgehen scheint dem Zufall jede Möglichkeit offen zu lassen. Deshalb hat Lindblom eine Art Vokabular geschaffen: Grundelemente, Situationen, Perspektiven, welche den Ausgangspunkt für die Konstituierung einer 'Welt' darstellen. Sie erscheinen in und als Landschaftsausschnitte in immer neuen Konstellationen. Die Natur der Ausschnitte verweist auf eine unendliche Landschaft. Die Präzision, mit der seine Aquarelle und räumlichen Objekte geschaffen sind, ist weniger ein ästhetisches Moment als vielmehr Handhabe für Artikulation, Zusammenfügen, In-Beziehung-setzen von Gebilden, Situationen, Perspektiven. Die Präzision ist die Realität des Blickes, der die Realität der Gebilde und Verbände konstituiert. — Anlässlich der Ausstellung "Live Show" (1974, Moderna Museet, Stockholm) zeigte die Skulptur eines sitzenden Mannes mit angezogenen Beinen und geschlossenen Augen (der Künstler selbst) den mentalen Charakter des Environments.

Jean-Christophe Ammann.
Ausstellungen: Gal. Burén, Stockholm 1963/66/68; 34.Biennale Venedig (schwedischer Pavillon) 1968; Kunsthalle Nürnberg, Kunsthalle Düsseldorf, Kunstverein Stuttgart, 1970; Gal. Gimpel & Hannover, Zürich 1971`,
  },
  {
    slug: 'beate-sydhoff-1967',
    type: 'interview',
    year: 1967,
    title: 'Samtal med Sivert Lindblom',
    author: 'Beate Sydhoff',
    publication: 'Konstrevy nr 2, 1967',
    lang: 'sv',
    body: `Samtal med Sivert Lindblom
Beate Sydhoff, Konstrevy nr 2, 1967

Beate Sydhoff: I vårt samtal om dina skulpturer har du fört fram begrepp som primära och sekundära känslor. Vad menar du med en form som inte är förknippad med vad du kallar sekundära känslor?

Sivert Lindblom: Först bör jag nog förklara vad jag menar med sekundära och primära känslor. Den sekundära känslan är baserad på våra direkta erfarenheter och är en konsekvens av dessa, den är rent subjektiv. Den primära känslan, den som är gemensam för alla kan kanske förklaras som en av biologiska faktorer präglad grundstruktur. Att den existerar är emellertid svårt att belägga. Denna primära känsla är säkerligen både mål och drivkraft i allt skapande men kan inte behandlas som medel.
Den primära känslan är alltså inte direkt kommunikabel utan måste först objektiveras genom något medel och blir på så sätt kommunikabel indirekt.
Att den sekundära känslan existerar är uppenbart men den är varken direkt eller indirekt kommunikabel därför att den inte är gemensam för alla.
Om man ser formen som kommunikationsmedel så bör den alltså inte förknippas med den sekundära.
Man måste koncentrera sig på själva språket, formen. Konstatera var i vilket plan formen som kommunikationsmedel fungerar och i detta plan söka distinkta och precisa formuleringar. Att i så hög grad som möjligt utnyttja det medvetna jaget, intellektet, för att med största tydlighet kunna objektivera sina upplevelser.

BS: Betyder detta att dina arbeten är "känslolösa"?
SL: Beträffande de sekundära känslorna hoppas jag det. Om man undviker dessa relativa moment uppstår en för mig aktiv tomhet som närmar sig begreppet frihet. En tomhet som åskådaren själv kan "fylla" och därför verkligen uppleva. Kärlets form bestämmer innehållets.

BS: Vad var orsaken till att du kom fram till dessa idéer?
SL: Orsaken var den inlärda formkonventionens begränsning. En situation uppstår då man inte kan komma vidare utan mycket krystade avsikter. En slags förlamning.

BS: Du upplevde en frihet när du upptäckte att du helt kunde förkasta de sekundära känslorna som medel.
SL: Att medvetet exploatera sina känslor är för mig en paradox. När konsekvensen av detta stod klart för mig upplevde jag verkligen en stor befrielse, känslan av maximala möjligheter. I en sådan situation blir iakttagelserna och observationerna möjliga, sentimentets godtycklighet försvinner, det är inte längre metafysik man sysslar med utan ett seende.

BS: Kan man hitta något genomgående karakteristiskt i din idé om form?
SL: Som jag nämnde tidigare försökte jag konstatera hur vi upplever den formala och den innehållsliga registreringen. Upptäckten av det tvådimensionella i såväl form som innehåll var avgörande för det fortsatta arbetet.

BS: Vad menar du med tvådimensionalitet?
SL: Våra visuella möjligheter. Jag menar att tvådimensionaliteten blir påtaglig vid en direkt iakttagelse av hur människans sinnen och intellekt fungerar när de uppfattar form och innehåll, t ex våra ögons oförmåga att registrera annat än formens yta.
Om vi ser en kub uppfattar vi den som ett tredimensionellt ting, men vad vi ser är ytor förenade i givna positioner. En textur är bara ett mer komplicerat ytfenomen.
För att skapa oss en uppfattning om vad som finns bakom ytorna kan vi tillfrå vår egen erfarenhet, även andras, men det är fortfarande omöjligt att med våra sinnen bevisa något, inte ens ett snitt i föremålet kan säga oss något utan ger oss enbart nya ytor. De innehållsliga formuleringarna står i ett liknande förhållande till sina mekanismer.

BS: Om man för över resonemanget till din skulptur, vad blev konsekvensen?
SL: Konsekvensen blev att jag kunde bestämma var mitt språk kan uppfattas och alltså kunde jag koncentrera mig på att arbeta där med största möjliga tydlighet. Så att innehållet låg i det synbara (så nära ytan som möjligt).

BS: Vad betydde detta när det gällde valet av material?
SL: Materialet blev plötsligt likgiltigt och fick endast en teknisk funktion som stöd åt ytan.

BS: Hur fungerar färgen på dessa ytor?
SL: Färgen som material används ju yrkesmässigt för att precisera ytan, den uppfattas alltså vanemässigt som tvådimensionell. De olika färgerna, kulörerna, är valda utan estetiska värderingar. Det gällde att finna färger som människan registrerar som saklig information, exempelvis som på trafikskyltar.

BS: Du vill inte förmedla innehållsliga moment?
SL: Det innehållsliga och det formala i mina arbeten är svårt att behandla var för sig. Det innehållsliga är det formala och det formala är det innehållsliga.
Innehållet, den poetiska avsikten, har fått sin tydligaste formulering och jag kan här bara informera om läsarten, sättet att se. Beträffande färgen måste jag konstatera att jag ställer dessa arbetsresultat inför en publik som av konvention blandar ihop ett av konstkonventionen präglat innehåll, man tror att man ser mer än man kan se. Av den orsaken måste jag alltså försöka förnya sättet att se och använda förtydliganden och därvid har jag ibland tagit färgen till hjälp. Det finns alltså detaljer som enbart är till för att styra seendet.

BS: Hur vill du att din skulptur skall uppfattas?
SL: En ytterligare konsekvens av tvådimensionaliteten och den arbetsmetodik som kommit ur den iakttagelsen gör att föremålen blir "immateriella" och bör uppfattas som tankestyrda operationer, tankeregistreringar.
Det viktiga är att få åskådaren delaktig i de intellektuella äventyren, ett slags medskapande i de spekulativa undersökningarna.

BS: Hur ställer du dig till den nya "immateriella" skulpturen i England?
SL: Tekniskt och formellt är jag nyfiken och känner mig något besläktad, men jag har mycket svårt att förstå meningen med deras arbeten. Dom har i mina ögon stannat på halva vägen. Där finns ett drag av konventionellt formtänkande som jag inte kan sympatisera med.

BS: Du nämnde något tidigare spekulativa undersökningar. Har dessa något med Bauhaus att göra?
SL: De har inget alls med Bauhaus att göra. Hela bakgrunden till Bauhaus' tro på formen och dess funktioner är inte längre aktuell för oss. Vad som är alldeles uppenbart just nu är att vi är helt trolösa mot vad Bauhaus menade med form. Idé och avsikt kräver att vi väljer den form som är effektivast som kommunikationsmedel, vare sig den är enkel, sammansatt, klar eller oklar, ren eller oren.

BS: Bauhaus trodde på en ren värld. Är din idé motsatt också på den punkten?
SL: Min idé är annorlunda, det är inte fråga om något motsatsförhållande. Jag försöker inte bevisa något som utesluter något annat. Bl.a. av den orsaken är Bauhaus' tro ointressant för mig. Det sätt jag arbetar på gäller i första hand mig själv och mina möjligheter att kommunicera.

BS: Är din konst programmatisk? Har du avsikter som leder mot ett speciellt mål?
SL: Jag önskar jag kunde deltaga i ett positivt och progressivt skapande som kan utveckla människans mekanismer och därigenom möjliggöra en mer nyanserad erfarenhet av tillvaron. Konstens sociala funktion.`,
  },
  {
    slug: 'sivert-lindblom-live-show-1974',
    type: 'own_writing',
    year: 1974,
    title: 'Katalogtext, Live Show, Moderna Museet',
    author: 'Sivert Lindblom',
    publication: 'Moderna Museet, Stockholm',
    lang: 'sv',
    body: `… kanske beror det på det okändas ständiga närvaro, kanske förklaringen finns i vår omedvetna oro för att föremålen i vår omgivning plötsligt skall omgrupperas till stridslinjer eller förrädiska bakhåll.
Varifrån kommer egentligen alla dessa materialiserade förslag och åtgärder som vi möter överallt. Beklagar att jag inte kan lita till de självklara förklaringar som så prompt och tjänstvilligt förmedlas.
Jag ber dig, när du lämnar mig och återgår till ordningen, att vara på din vakt och rapportera alla förändringar.
Vi, du och jag måste vara vaksamma.
Men akta dig för pessimism, eventuella hot skall mötas med optimism.
Optimismen finns i viljan att se allt. Låt oss lära oss att se och jag menar då även den form vars innehåll är okänt eller rättare sagt vars innehåll är det okända.
Alla former är former för möten mellan oss och i dessa möten tar du och jag form. Det är denna form som är avgörande. Det är den som våra ansträngningar gäller.
Du förstår plötsligt upptäcker man att det hela tiden varit samma avsikt som präglat ens arbete under alla år. Som om riktning, hastighet och tid var förutbestämd och att man hela tiden bara utfört de rörelser som jämvikten krävt.
Slumpen har styrt men inte bestämt riktningen.
Det låter ju inte bra för konsten är ju fri säger man. Men jag försäkrar dig, inte heller konsten är fri, men den har ett mål.
Genom modeller och beskrivningar kan vi få verkligheten att framträda och vi har ingen rätt att väja för det som blir synligt.
Det är alltså vår gemensamma livssituation som ger form och innehåll.

Konsten bestämmer verkligheten, utan konst ingen verklighet inget liv ingen död.
Varför ser mina bilder ut som dom gör?
Jag skall försöka förklara:
Samhället innehåller en mängd funktioner som producerar dess bilder och ger föremålen dess form. Dessa bilder och former, ingenjörens, sociologens, arkitektens, biologens, matematikerns, tar vi till oss på olika sätt med olika reservationer, positivt eller negativt med ett register av olika känslor.
Vi kan tala om en mängd präglade beteenden i förhållande till bild och form.
Det finns också en prägling till konstens form och metoder som för mig känns besvärande. Man låter sig inte beröras, konsten är ofarlig den hänger på sin krok; konsten gör det outhärdliga uthärdligt.
Denna prägling är säkert nyttig för försäljningen men var det verkligen avsikten. Avsikten väljer bildmetod och är avsikten att göra en tavla eller skulptur så finns det inga skäl att bråka men är avsikten att bestämma verkligheten så är alla metoder lediga och därmed alla präglingar.
Det känns därför inte självklart att ovillkorligen låsa sin bild eller form i relation till konstens bilder och former.
Det gäller istället att hitta den metod som ger avsikten den bästa hjälpen och då menar jag att valet står mellan verklighetens alla uttryck, språkformer, bildmetoder, material och tekniker.
Det bekymrar mig inte att mina bilder därigenom kan vara svåra att bestämma i förhållande till konstens bilder, inte heller är det något problem att mina former inte alltid ser ut som skulpturer. Det viktigaste är inte bildernas egenskaper utan deras relation till verkligheten.
I mina rum finns inga solitärer, allt bevakar samma verklighet.

Ps. Hur är det egentligen finns det en god och en ond form eller är verklighetens form en oskuld som var morgon återfår sin mödom. Eller tar det onda resp. goda säte i närmast tillgängliga form och gör den ond eller god. Eller är det så kanske att det onda kan producera god form och det goda ond form. Hur är det egentligen? Är vi inte offer för en formmagi som visserligen är bekväm men ödesdigert falsk. En form kan lätt avlägsnas men avlägsnar vi verkligen det onda med den. Ds.`,
  },
  {
    slug: 'sivert-lindblom-bra-konst-1986',
    type: 'own_writing',
    year: 1986,
    title: 'Bra konst i bra arkitektur',
    author: 'Sivert Lindblom',
    publication: 'KRO Distrikt 17 & SAR MSA symposium, 1986',
    lang: 'sv',
    body: `I samband med utställningarna 'Bra konst i bra arkitektur' och 'Konst är bra' genomfördes debatter och symposium rörande samarbetet mellan konstnärer och arkitekter i regi av KRO Västmanland och SAR-MSA Västerås.

Målsättningen var att inspirera till ett ökat samarbete mellan yrkesgrupperna och väcka debatt om orsakerna till att konstnärernas kunskaper i så liten utsträckning utnyttjas i bostadsbyggnationen.

Utställningarna och symposium genomfördes tack vare generösa bidrag från Västerås kommuns kultur- och fritidsförvaltning och Statens kulturråd samt från sekretariatet för Konstens vecka.

I en skrift dit ett antal konstnärer inbjudits till att formulera sina synpunkter i frågan skrev Sivert Lindblom följande inlägg (ur en intervju med Peder Alton, KRO-Konstnären 4/85):

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
    body: `Sivert Lindblom

Lindblom has been concerned to assert the fact that the only thing visible in a sculpture is a complicated, curved surface. His new sculptures are surfaces that conceal masses, densities. This concealment of mass eliminates the impression of gravity of balanced shifts in weight. The perpendiculars of these sculptures are "dead" – entirely neutral in their mechanical precision; simple by-products of the process of turning. These sculptures, in other words, are neither light nor heavy – they lack all "imaginary" relationship to the force of gravity. One's imagination cannot seize on any specific weight or density.

We are faced, quite simply, with a turned and painted "knob". Then suddenly we discover that the profile of the knob is that of a face. As we realize this, it feels as if a head had suddenly turned inside the sculpture – like a sort of futuristic shiver …

These sculptures thus have a figurative content. We have a sort of reversed painting – since if a painting is a flat surface portraying curved surfaces in imaginary space, we see here a curved surface portraying a flat profile or projection. When our imagination made a cut in his earlier sculptures, it met matter, a mass of given consistency. It now encounters instead the projection of a face, a form. Only in a few cases has Sivert Lindblom made such a cut in "reality", in the actual sculpture. In the majority of cases, the spectator himself must "in spirit" saw in two the sculpture to find the picture, the silhouette. It is customarily said that sculpture is a more "realistic" art than painting, since it retains the third dimension of reality — which is dispensed with in painting. To me this has always seemed a dubious proposition — it may, perhaps, have been valid for Mme Tussaud, who was in fact concerned with the unreal, with illusion. In Sivert Lindblom's case, it is utter nonsense to speak of the "realistic" status of sculpture.

In his sculptures, it is not only the third dimension of the object portrayed that becomes imaginary. The two other dimensions – those of the plane — are also imaginary. In his most interesting and complete works, the profile is completely overshadowed by the curved surface that the sculpture comprises. The actually visible form and the interpreted "cerebral" form are as unlike each other as they could be.

If I understand his work aright, it is precisely this disparity that he wishes to achieve. The profile — the self-portrait — is in itself of no great interest; he could just as well have taken the profile of Caesar, or a bottle, or a Chevrolet. It is of the gap between the seen and the comprehended, between sensual impression and conception, that this entire exhibition treats – he has filled the premises with a mysterious mental vacuum: that from which our every thought flashes.

Ulf Linde`,
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
    body: `Du måste se med dina ögon
Ta del om du vill delta

Sivert Lindblom i Lunds Konsthall – ett länge efterlängtat möte har blivit verklighet.
I det mötet kommer mycket att bli synligt: två konstarter, arkitekturen och skulpturen, kommer med var sitt distinkta språk både att samspela och att tydliggöra det egna uttrycket.
Skulpturer från 30 års arbete visas på utställningen. För publiken innebär det en möjlighet att för första gången få en överblick över Sivert Lindbloms konstnärskap och därmed att bli medveten om hans plats i det svenska samtida konstlivet.
En presentation av Sivert Lindbloms konstnärliga arbete vore ofullständig om inte också skisserna till hans omfattande offentliga verk visades. I Lund blir nu detta möjligt genom ett samarbete med Skissernas Museum och deras utställning Skulptur – Arkitektur. Den en gång använda utställningstiteln IBID skulle därför kunna användas igen, IBID "på samma plats".
Må det tillåtas mig att bli en smula personlig. Upplevelser som man får just när man tar klivet in i vuxenlivet kan få en särskild intensitet och styrka som aldrig lämnar en. Det är en styrka som bara kan jämföras med ett barns förstagångsupplevelser. Mötet med Sivert Lindbloms konst blev så för mig. Under ett sorgearbete gav skulpturerna mig möjligheten att se det närvarande i det frånvarande.
Det är med största glädje vi hälsar Sivert Lindblom välkommen till Lunds Konsthall. Sivert har tillsammans med sin hustru Marianne utfört ett enastående insamlingsarbete, både inför utställning och inför katalog. För allt gott samarbete ett varmt tack!
Ett varmt tack vill vi också rikta till alla dem, institutioner och privata ägare, som med sin generositet ställt sina verk till förfogande.
Samarbetet med chefen för Skissernas Museum Jan Torsten Ahlstrand har varit mycket gott.
Det är därför vi nu gemensamt kan visa Sivert Lindblom som en av våra mest betydande skulptörer – genom de två utställningarna och genom de båda katalogerna, vilka för första gången sammanfattar hans konstnärskap.

Lund i januari 1993
Cecilia Nelson`,
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
    body: `"att ge det verkliga rummet sitt uttryck"

Sivert Lindblom hör till det fåtal svenska konstnärer som har en lång erfarenhet av samarbete med arkitekter. I ett samtal med Arkitekturs redaktion talade han om sin syn på konst och arkitektur med Eva Eriksson.

– Arkitektur som begrepp innehåller för mig en generell, formal kod, som utgår från människans mått och sociala funktion och som därför inte bör utnyttjas för någon total individuell utlevelse. En situation som konsten kan försätta sig i, i sina desperata försök att bevisa sin frihet. Här finns en motsättning som jag måste ta ställning till när jag som skulptör skall delta i arkitektonisk gestaltning.

– Den arbetsmetod som jag hamnat i är kanske alltför personlig för att vara förebildlig. Man blir ju någon slags bastard, hälften skulptör, hälften arkitekt.
Det uppstår en konflikt i den tudelning som verksamheten som skulptör och skulptörarkitekt innebär. När jag som skulptör gör mina utställningar är jag suverän och behöver inte ta hänsyn. Det sökta uttrycket är det primära och allt får underordna sig detta. Den som vill kan ta del, men har sin frihet att avstå. Den form som uppstår har inte det dekorativa som mål. Det fula bär också ett uttryck. När jag sysslar med arkitektur handlar det om det sociala rummet, som vi alla delar och detta måste få sina konsekvenser. Det är inte tillfället för någon hänsynslös personlig utlevelse utan man försöker skapa det rum som positivt aktiverar det sociala liv som skall rymmas där.
Trots denna motsättning har utbytet mellan dessa två delar av mitt arbete varit stort. Den konceptuella sidan av arkitekturen, metod och teknik, att formens uttryck inte ovillkorligen är beroende av ett intimt knådande med materialet m.m. Och omvänt den fria verksamhetens koncentration på det visuella uttrycket, sökandet, där alla former är utnyttjbara.

— Vissa konstnärer gör bilder som motsäger eller förändrar rummets ursprungliga form och uttryck. Är det skillnad på detta sätt att jobba och ditt?

– Jag ser nog deras insats mer som en komplettering av arkitekturen och inte som arkitektonisk gestaltning. Jag tror det är ett naturligt synsätt för målare som är vana att manipulera med yta och illusion. Som skulptör är jag mer intresserad av rum och struktur, att ge det verkliga rummet sitt uttryck.
Skulpturen lever i samme rum som vi, därför ser jag också mina utställningar som en form av rumsgestaltning, ett slags scenografi.
Varje detalj i en byggnad är delaktig i det totala uttrycket. Dekor är bara ytterligare en detalj som bör delta i denna samverkan. Detta betyder inte att man nödvändigtvis skall underordna sig, utan uttryckets intensitet skall naturligtvis stegras så att arkitekturens totala uttryck blir maximalt.

— Vilken är skillnaden mellan ditt sätt att se på hus som konstnär och arkitektens sätt att se?

– Arkitekter har en tendens att intellektualisera, söka stöd i verbala analyser för att på så sätt komma fram till en "riktig" lösning. Detta är säkert nödvändigt i många skeden av arbetet, men när det gäller den formala gestaltningen måste man lita på sina sinnen och sin intuition, då är det fråga om bra eller dålig form. Är den dålig måste något ändras på samme sätt som när man som skulptör arbetar sig fram till ett visst uttryck. Den direkta visuella upplevelsen är avgörande.
En av orsakerna till att konstnären ofta har svårt att samarbeta med arkitekten är att han gärna biter sig fast i sin idé och när någon ifrågasätter den blir han störd, kanske i rädsla att inte hitta något alternativ. Som konstnär är han suverän med sin bild och behöver inte ta hänsyn. Han har svårt att inse att kritik och motargument skapar nya förutsättningar och möjligheter till nya idéer och därmed nya lösningar som han annars aldrig upptäckt.
Den traditionella skulpturen försöker envist upprepa vad BRANCUSI, ARP, GIACOMETTI … redan för 50 år sedan hade fört till fulländning. Om man i stället kunde se längre än till denna "konstnärliga" period så skulle man finna de skulpturala kvaliteterna i helt andra sammanhang. Där det skulpturala uttrycket omfattar den totala helheten.
Den konceptionella konsten innehåller i en del fall en sådan inriktning och där finns kanske en möjlighet att skulptur och arkitektur närmar sig varandra.

– Just nu talar man bara om "postmodernism". En ny beteckning gör plötsligt en existerande företeelse synlig för teoretikern, trots att formen har präglats av hårt arbete i femton, tjugo år. Ett dåligt orienterat kulturliv inbillar sig att det "nya" föds när begreppet dyker upp. Vad som sker är i stället en allmän exploatering och tyvärr också vulgarisering.
Jag hoppas ändå att det seriösa ska tränga fram och medverka till en humanisering av vår miljö. Att man inte bara förvandlar postmodernismen till stil och mode, utan förstår att det är ett seriöst försök att återknyta kontakt med sin egen tradition för att kunna utnyttja de kvaliteter som visat sig oemotsägliga.

— Nämn några av de projekt du jobbat med?

– Riksbanken. Där arbetade jag tillsammans med Ulrik Samuelson och vi gjorde också Motala Folkets Hus gemensamt. Dessutom har jag gjort Handelsbankens gård i Fersenska palatset och tunnelbanestationen Västra Skogen samt några scenografier. Och nu senast Medelhavsmuseet.
Sedan har jag deltagit i en rad arkitekturprojekt i samband med tävlingar, vilket kanske är intressantare i detta sammanhang. Dit hör Vällingby kyrka, Enskilda bankens huvudkontor, Stadsgården, Kulturhuset, Halmstads bibliotek, Södra Stationsområdet, Kvarteret Ormsaltaren vid Slussen, ett eget förslag för Vasamuseet och slutligen överdäckningen av spårområdet vid Centralstationen.

– Garnisonens gårdar gjorde jag tillsammans med tre kollegor från konstakademin. Man skulle jobba kollektivt på den tiden, så vi formade tillsammans en helhet.

– Den ursprungliga bankhallen har en slags blekmesig klassicism, som egentligen inte har någon som helst kontakt med det som är ursprunget till klassicismen. Därför ville jag använda ett litet råare och kraftfullare formspråk för att få en riktigare kontakt med de föremål som skulle ställas ut. Jag tittade mycket på pompejanska miljöer t ex. Det var ju samhällen som inte hade så långt ut till lergölarna och jag tyckte det var viktigt att få med det. Jag försökte fånga upp färgerna och den arkitektoniska karaktären. Där fanns ju mycket fräckhet och friskhet i uttrycken.

Intervju med Sivert av Eva Eriksson`,
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
    body: `Le rapport entre la forme et le contenu n'est-il pas un problème majeur dans notre société?

La même interrogation s'est naturellement emparée des arts plastiques et de l'image.

On peut considérer les travaux de Sivert Lindblom comme une recherche continue de la vie propre de la forme: une tentative de mettre à nu les structures qui se trouvent derrière le quotidien tel que nous le voyons, déterminée, une qui auquel nous donnons une signification bien chair, un sang, un nom aux références claires et avec des ramifications étendues.

Une tentative dans cette direction a été présentée au Moderna Museet de Stockholm en 1974 et au Konstmuseum de Lucerne en 1977.

L'intérêt qu'il porte à la 'surface' le conduit sans cesse vers de nouvelles cherchera.

Voici donc définitivement côte le contenu et la forme libérée et ambigue.

Paris le 23 septembre 1980
Lars Berquist`,
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

export const TEXTS_DATA: TextItem[] = RAW_TEXTS_DATA.map(item => ({
  ...item,
  bodies: TEXT_TRANSLATIONS[item.slug],
}))
