/**
 * Editable data for the Biografi → "Litteraturförteckning i urval" section.
 * Stored in `settings` so Jan can edit entries and — his main ask (Undring 15)
 * — link each entry to the text it refers to. Entries with a `slug` become
 * clickable links to /texts/<slug>. Falls back to these defaults until edited.
 */
export const BIBLIOGRAPHY_SETTINGS_KEY = 'biography_bibliography'

export interface BibEntry {
  year: string
  text: string
  /** Optional slug of a text in /texts this entry links to. */
  slug?: string
}

export interface BibliographySection {
  entries: BibEntry[]
}

export const DEFAULT_BIBLIOGRAPHY: BibEntry[] = [
  { year: '1963', text: 'Katalog Galerie Burén, Förord av Leon Rappaport', slug: 'leon-rappaport-1963' },
  { year: '1963', text: 'Stockholms Tidningen, Arne Törnqvist' },
  { year: '1964', text: 'Konstrevy nr 1 – »Sivert Lindblom«, Jimmy Nyström' },
  { year: '1966', text: 'Leif Nylén, Konstrevy 5–6' },
  { year: '1966', text: 'Leif Nylén, DN – Biennalen i Venedig 1968' },
  { year: '1966', text: 'Ulf Linde, DN 23 november', slug: 'ulf-linde-dn-1966' },
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
  { year: '1974', text: 'Sivert Lindblom – Katalogtext till »Live Show«, Moderna Museet', slug: 'sivert-lindblom-live-show-1974' },
  { year: '1974', text: 'Paletten nr 3 – »Live Show«, Christian Chambert' },
  { year: '1976', text: 'Riksbanken, Birgitta Nyblom, DN – På Stan 3–9 januari' },
  { year: '1977', text: 'Konstnärer i miljögestaltningen – Rapport från konferens i Linköping, arr. Statens Kulturråd, Jan Torsten Ahlstrand' },
  { year: '1977', text: 'Katalog Live Show II – North-Information No. 30' },
  { year: '1977', text: 'Katalog Kunstmuseum Luzern, »Live Show 2«, Jean-Christophe Ammann', slug: 'jean-christophe-ammann-1977' },
  { year: '1978', text: 'North nr 37 – (Ohne Worte), (SL)' },
  { year: '1978', text: 'Kalejdoskop nr 1 – »Azteker«, (SL)' },
  { year: '1980', text: 'Katalog Centre Culturel Suédois, Paris – »Sans Titre«, Torsten Ekbom, Lars Bergquist', slug: 'torsten-ekbom-1980' },
  { year: '1981', text: 'Kris nr 17–18 – »Kommentarer«, Stig Larsson', slug: 'stig-larsson-1981' },
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
  { year: '1988', text: 'Statens Konstråd nr 17–18 – »Att behärska sina medel«, (SL)', slug: 'statens-konstrad-1988' },
  { year: '1988', text: 'Arkitektur nr 10 – »Konstmuseet, Lund«, Karl Koistinen (SL)' },
  { year: '1989', text: 'Baumeister nr 5 – Anbau an das Kunstmuseum in Lund' },
  { year: '1989', text: 'Jubileumstidskrift Humanistiska Föreningen, Stockholms Universitet – Intervju, Jan Åman' },
  { year: '1990', text: 'Sten nr 2 – Blasieholmstorg – Uppsala Stadsbibliotek' },
  { year: '1990', text: 'Svenska Forskningsinstitutet, Istanbul – »Från Hippodromen i Konstantinopel till Blasieholmstorg«, Ulf Abel; »Två bronshästars väg till Blasieholmstorg«, Ulla Ehrensvärd & (SL)' },
  { year: '1992', text: 'Statens Konstråd årskatalog 1991 nr 22 – »Här ligger en sfinx begraven!«, Inga-Maj Beck', slug: 'inga-maj-beck-terrakotta' },
  { year: '1993', text: 'Stefan Alenius – Text till katalog »SKULPTUR ARKITEKTUR«, Skissernas museum', slug: 'stefan-alenius-1993' },
  { year: '1993', text: 'Cecilia Nelson – Förord till katalog »SKULPTUR«, Lunds konsthall', slug: 'cecilia-nelson-1993' },
  { year: '1993', text: 'Daniel Birnbaum – Förord till katalog »SKULPTUR«, Lunds konsthall', slug: 'daniel-birnbaum-1993' },
  { year: '1993', text: 'Stig Larsson – Text till katalog »SKULPTUR«, Lunds konsthall', slug: 'stig-larsson-1993' },
  { year: '1993', text: 'Jan Torsten Ahlstrand – Förord till katalog »SKULPTUR ARKITEKTUR«, Skissernas museum', slug: 'jan-torsten-ahlstrand-1993' },
  { year: '2012', text: 'Jan Öqvist – Text till katalog »AKVARELLER – m.m.«', slug: 'jan-oqvist-2012' },
  { year: '2012', text: 'Peter Cornell – Text till katalog »AKVARELLER – m.m.«', slug: 'peter-cornell-2012' },
  { year: '2012', text: 'Catharina Gabrielsson – Text till katalog »AKVARELLER«', slug: 'catharina-gabrielsson-2012' },
]

export function parseBibliography(raw: string | null | undefined): BibEntry[] {
  if (!raw) return DEFAULT_BIBLIOGRAPHY
  try {
    const v = JSON.parse(raw) as { entries?: BibEntry[] } | BibEntry[]
    const arr = Array.isArray(v) ? v : v.entries
    if (!Array.isArray(arr)) return DEFAULT_BIBLIOGRAPHY
    const cleaned = arr
      .filter((e) => e && (typeof e.text === 'string') && e.text.trim())
      .map((e): BibEntry => ({
        year: typeof e.year === 'string' ? e.year : String(e.year ?? ''),
        text: e.text,
        slug: e.slug?.trim() || undefined,
      }))
    return cleaned.length ? cleaned : DEFAULT_BIBLIOGRAPHY
  } catch {
    return DEFAULT_BIBLIOGRAPHY
  }
}
