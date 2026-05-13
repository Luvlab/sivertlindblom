import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import TextImageSlideshow from '@/components/TextImageSlideshow'

export const metadata: Metadata = { title: 'Scenography' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Base URL for original WP images (all verified accessible)
const WP = 'https://sivertlindblom.se/wp-content/uploads'

interface Work {
  year: number
  title: string
  venue: string
  type: 'Teaterscenografi' | 'Koreografi'
  desc: string
  images: string[]
  videoUrl?: string
}

const WORKS: Work[] = [
  {
    year: 1970,
    title: 'Coriolanus',
    venue: 'Dramaten, Stockholm. Regi: Alf Sjöberg',
    type: 'Teaterscenografi',
    desc: 'Till Alf Sjöbergs uppsättning av William Shakespeares Coriolanus gjorde Sivert scenografin. Coriolanus är en tragedi som tros ha skrivits mellan 1605 och 1608 och bygger på livet för den legendariske romerske härskaren Caius Marcius Coriolanus. Föreställningen hade premiär den 25 april 1970 på Dramaten, Stockholm.',
    images: [
      `${WP}/2015/06/Coriolanus547.jpg`,
      `${WP}/2015/06/Coriolanus550.jpg`,
      `${WP}/2015/06/Coriolanus551.jpg`,
      `${WP}/2015/06/Coriolanus552.jpg`,
      `${WP}/2015/06/Coriolanus553.jpg`,
      `${WP}/2015/06/imgSV423.jpg`,
      `${WP}/2015/06/imgSV424.jpg`,
      `${WP}/2015/06/Coriolanus2556.jpg`,
      `${WP}/2015/06/Coriolanus2559.jpg`,
      `${WP}/2015/01/Sivert-Lindblom-Stadsteatern-Stockholm-1.jpg`,
      `${WP}/2015/01/Sivert-Lindblom-Stadsteatern-Stockholm-3.jpg`,
    ],
  },
  {
    year: 1974,
    title: 'Sand — 10 rörelsedikter',
    venue: 'Koreografi: Margaretha Åsberg',
    type: 'Koreografi',
    desc: 'Tillsammans med Margaretha Åsbergs första egna koreografiska produktion, efter det att hon slutat på Kungl. Operan, gjorde Sivert scenografi till "Sand – 10 rörelsedikter" 1974. Denna produktion räknas som den första "Performance-föreställningen" inom den moderna dansteatern i Sverige. Sand var ett sceniskt verk uppbyggt av 10 rörelsedikter som alla hade sitt ursprung från den Chilenska militärjuntans angrepp 1973. Bland de objekt som ingick var Siverts konstruerade gråmålade "skal till stol" med vitt inre, ett antal vita "träd rekonstruktioner" och trossar. Urpremiär: Fylkingens lokaler, Östgötagatan 33, Stockholm.',
    images: [
      `${WP}/2018/07/10-rörelsedikter-x-4.jpg`,
      `${WP}/2018/06/Margareta-2-Lutfi-Özkök.jpg`,
      `${WP}/2018/06/Margareta-8-Lutfi-Özkök.jpg`,
      `${WP}/2018/06/Margareta-14-André-Lafolie.jpg`,
      `${WP}/2018/06/Margareta-4-Lutfi-Özkök.jpg`,
      `${WP}/2018/06/Margareta-3-Lutfi-Özkök.jpg`,
      `${WP}/2018/06/Margareta-5-Lutfi-Özkök.jpg`,
      `${WP}/2018/06/Margareta-9-Lutfi-Özkök.jpg`,
      `${WP}/2018/06/Margareta-10-Lutfi-Özkök.jpg`,
    ],
  },
  {
    year: 1982,
    title: 'Falska Förtroenden av Marivaux',
    venue: 'Stockholms Stadsteater. Regi: Jonas Cornell',
    type: 'Teaterscenografi',
    desc: 'Scenografi till "Falska förtroenden" av Turid Marivaux (1737), Stockholms Stadsteater, regi Jonas Cornell.',
    images: [
      `${WP}/2015/03/Sivert-Lindblom-Marivaux-1-.jpg`,
      `${WP}/2015/03/Sivert-Lindblom-Marivaux-2-.jpg`,
      `${WP}/2015/03/Sivert-Lindblom-Marivaux-3-.jpg`,
      `${WP}/2015/03/Sivert-Lindblom-Marivaux-4-.jpg`,
      `${WP}/2015/03/Marivauxprogram-1.jpg`,
      `${WP}/2015/03/Marivauxprogram-2.jpg`,
      `${WP}/2015/03/Marivauxprogram-3.jpg`,
      `${WP}/2015/03/Marivauxprogram-4.jpg`,
      `${WP}/2015/03/Marivaux-Recension.jpg`,
    ],
  },
  {
    year: 1987,
    title: 'Drivved — Fragment ur tidigare koreografier',
    venue: 'Koreografi: Margaretha Åsberg. Moderna Dansteatern',
    type: 'Koreografi',
    desc: 'Margaretha Åsberg sammanställde 1987 en koreografi byggd på tidigare koreografier med samlingsnamnet "Drivved". Föreställningen var uppbyggd av dekonstruerade fragment ur koreografierna Sand (1974), Life Boat (1976) och Natten innan (1978). I denna föreställning ingick ett antal skulpturala element ur den tidigare koreografin Sand: kraftigt uppbundna vitmålade grenar på gråmålade stag, en rostfri pendel och ett par långa störar med väskhandtag med arbetsnamnet "Spänger". Urpremiär: 1987-11-06 på Moderna Dansteatern med dansarna Anja Birnbaum och Cecilia Roos förutom Margaretha själv. Margaretha Åsberg var initiativtagare till att skapa en egen scen för den moderna dansen i Sverige och var konstnärlig ledare för Moderna Dansteatern under nära två decennier.',
    images: [
      `${WP}/2018/06/Margareta-15-Sven-Åsberg.jpg`,
      `${WP}/2018/06/Margareta-16-Sven-Åsberg.jpg`,
      `${WP}/2018/06/Margareta-12-Sven-Åsberg.jpg`,
      `${WP}/2018/06/Margareta-13-Sven-Åsberg.jpg`,
    ],
  },
  {
    year: 1998,
    title: 'Fragment — Allvarsamma bagateller',
    venue: 'Koreografi: Margaretha Åsberg. Moderna Dansteatern',
    type: 'Koreografi',
    desc: 'Fragment – Allvarsamma bagateller med Margaretha Åsberg för Pyramiderna, Moderna Dansteatern. Verket består av två delar och rör sig kring de djupt mänskliga begreppen minne, förlust och beröring. Det inleds i ett intensivt lilafärgat mörker som gradvis bleknar bort och frilägger ett scengolv täckt av ljusa och mörka rektanglar över vilket tre kvinnor rör sig i en koreografi som tangerar ritualen. I föreställningen ingick objekt av förutom Sivert även av Johan Scott, Agnes Monus och Håkan Rehnberg.',
    images: [],
  },
]

const FILTERS = [
  { key: 'alla', label: 'Alla' },
  { key: 'Teaterscenografi', label: 'Teaterscenografi' },
  { key: 'Koreografi', label: 'Koreografi' },
] as const

export default async function ScenographyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const HERO = 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2015/03/Sivert-Triumf-Paris.jpg'

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: '55vh', minHeight: 300, overflow: 'hidden', marginBottom: '4rem', marginTop: 'calc(-1 * (var(--header-h) + 1.5rem))' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="Scenografi — Sivert Lindblom" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 20%, rgba(10,10,10,0.88) 100%)' }} />
        <div className="page-pad" style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
          <Link href={`/${locale}/portfolio`} className="back-link" style={{ color: 'rgba(255,255,255,0.75)' }}>
            <span className="back-link-arrow">←</span>
            <span className="back-link-label">{dict.nav?.portfolio ?? 'Portfolio'}</span>
          </Link>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.4rem' }}>
            1970–1998
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.6rem,3.5vw,2.8rem)', margin: 0 }}>
            {dict.portfolio?.cat_scenography ?? 'Scenografi'}
          </h1>
        </div>
      </div>

      <div className="section-gap" style={{ paddingTop: 0 }}>
        <div className="page-pad" style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--color-muted)', maxWidth: '60ch', fontSize: 'var(--fs-base)' }}>
            {dict.portfolio?.desc_scenography ?? 'Sivert har genom åren samarbetat med såväl teaterregissörer och koreografer med scenografiska lösningar och skulpturala objekt.'}
          </p>

          {/* Filter nav */}
          <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }} aria-label="Filter">
            {FILTERS.map((f) => (
              <a
                key={f.key}
                href={f.key === 'alla' ? '#works' : `#type-${f.key}`}
                className="filter-link"
                style={{
                  fontSize: 'var(--fs-xs)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  border: '1px solid var(--color-border)',
                  padding: '0.3em 0.8em',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                {f.label}
              </a>
            ))}
          </nav>
        </div>

        <hr className="divider" />

        {/* Works list */}
        <div id="works" className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
          {WORKS.map((w, idx) => (
            <article
              key={w.title}
              id={`type-${w.type}`}
              style={{
                paddingBottom: idx < WORKS.length - 1 ? '4rem' : 0,
                marginBottom: idx < WORKS.length - 1 ? '4rem' : 0,
                borderBottom: idx < WORKS.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr auto', gap: '1.5rem', alignItems: 'start', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', paddingTop: '0.15rem' }}>
                  {w.year}
                </span>
                <div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'var(--fs-xl)', margin: '0 0 0.35rem' }}>
                    {w.title}
                  </h2>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{w.venue}</div>
                </div>
                <span className="badge">
                  {w.type === 'Teaterscenografi'
                    ? (dict.portfolio?.type_theater ?? w.type)
                    : (dict.portfolio?.type_choreography ?? w.type)}
                </span>
              </div>

              {/* Description */}
              {w.desc && (
                <div style={{ paddingLeft: 'calc(5rem + 1.5rem)', marginBottom: '1.75rem' }}>
                  <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', lineHeight: 1.7, maxWidth: '70ch', margin: 0 }}>
                    {w.desc}
                  </p>
                </div>
              )}

              {/* Image slideshow */}
              {w.images.length > 0 && (
                <div style={{ paddingLeft: 'calc(5rem + 1.5rem)', maxWidth: '720px' }}>
                  <TextImageSlideshow images={w.images} title={w.title} thumbnailAspect="4/3" />
                </div>
              )}

              {/* YouTube embed */}
              {w.videoUrl && (
                <div style={{ paddingLeft: 'calc(5rem + 1.5rem)', marginTop: '1.5rem' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '640px' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${w.videoUrl}`}
                      title={w.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
