export interface HomeContent {
  siteTitle: string
  tagline: string
  pressQuote: string
  pressAttribution: string
  pressSource: string
  pressDuration: string
  audioUrl: string
  audioLink: string
  aboutText: string
  statNActive: string
  statNPublic: string
  statNCountries: string
  statNBorn: string
  contactImage: string
}

export const HOME_CONTENT_DEFAULTS: HomeContent = {
  siteTitle: 'Sivert Lindblom',
  tagline: 'Skulptur, offentlig konst, akvareller och scenografi sedan 1957',
  pressQuote: '»Någonting pågår, exakt vad kommer vi aldrig att få svar på, annat än av vår egen fantasi.«',
  pressAttribution: 'Karsten Thurfjell',
  pressSource: 'Kulturnytt, Sveriges Radio P1 · 4 aug 2016',
  pressDuration: '3:20 min',
  audioUrl: 'https://www.sverigesradio.se/topsy/ljudfil/5783965?publicationId=6483716',
  audioLink: 'https://sverigesradio.se/artikel/6483716',
  aboutText: '',
  statNActive: '60+',
  statNPublic: '50+',
  statNCountries: '30+',
  statNBorn: '1931',
  contactImage: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/contact/siverts-alper.jpg',
}
