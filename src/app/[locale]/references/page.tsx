import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import PortfolioSlideshow from '@/components/portfolio/PortfolioSlideshow'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { LightboxImage } from '@/components/gallery/Lightbox'
import TabsLayout from '@/components/TabsLayout'
import { getFotografi, getGrafik, getFilms, getUtmarkelser, getOgonblick, getSculptureProjects } from '@/lib/data-server'
import { PUBLICATIONS } from '@/lib/publications-data'
import FilmGrid from '@/components/references/FilmGrid'
import { renderParagraphs } from '@/lib/render-text'

export const metadata: Metadata = { title: 'Sculpture & Graphics' }

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ReferencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  const fotografi = await getFotografi()
  const grafik = await getGrafik()
  const films = await getFilms()
  const utmarkelser = await getUtmarkelser()
  const ogonblick = await getOgonblick()
  const sculpture = await getSculptureProjects()

  // Skulptur submenu cards — the series flagged inTab, derived from editable data
  const sculptureSeries = sculpture.filter((p) => p.inTab !== false)
  const slideshowImages: Record<string, string[]> = Object.fromEntries(
    sculpture.map((p) => [p.slug, p.images.slice(0, 8).map((i) => i.url)])
  )

  const grafikImages = grafik.images.map((i) => i.url)

  // LightboxImage arrays for thumbnail-grid tabs
  const grafikLightboxImages: LightboxImage[] = grafik.images.map((i) => ({ url: i.url, alt: i.caption ?? 'Grafik', caption: i.caption }))
  // Publicerat: keep the first 3 catalogs in place, sort the rest by year (newest first). (Jan, Undring 11)
  const pubWithImages = PUBLICATIONS.filter((p) => !!p.imageUrl)
  const pubOrdered = [
    ...pubWithImages.slice(0, 3),
    ...pubWithImages.slice(3).sort((a, b) => (parseInt(b.year ?? '0') || 0) - (parseInt(a.year ?? '0') || 0)),
  ]
  const pubLightboxImages: LightboxImage[] = pubOrdered
    .map((p) => ({ url: p.imageUrl!, alt: p.title, caption: [p.title, p.year].filter(Boolean).join(' — ') }))
  const fotoLightboxImages: LightboxImage[] = fotografi.images.map((img) => ({
    url: img.url,
    alt: img.caption ?? 'Fotografi',
    caption: img.caption,
    credit: img.photographer || fotografi.photographer || undefined,
  }))
  const ogonblickLightboxImages: LightboxImage[] = ogonblick.images.map((img) => ({ url: img.url, alt: img.caption ?? 'Ögonblick', caption: img.caption, credit: img.credit }))

  const TABS = [
    { id: 'skulptur',    label: dict.references?.sculpture_series ?? 'Skulptur',   count: sculptureSeries.length },
    { id: 'grafik',      label: dict.references?.grafik ?? 'Grafik',                count: grafikImages.length },
    { id: 'film-tv',     label: dict.references?.film_tv ?? 'Film & TV',            count: films.length },
    { id: 'publicerat',  label: dict.references?.publicerat ?? 'Publicerat' },
    { id: 'fotografi',   label: dict.references?.fotografier ?? 'Fotografier' },
    { id: 'utmarkelser', label: dict.references?.utmarkelser ?? 'Utmärkelser' },
    { id: 'ogonblick',   label: dict.references?.ogonblick ?? 'Ögonblick' },
  ]

  return (
    <div style={{ paddingBottom: '5rem', marginTop: 'calc(-1 * var(--header-h))' }}>
      <TabsLayout
        tabs={TABS}
        defaultTab="skulptur"
        label={dict.nav?.references ?? 'Referensmaterial'}
      >

        {/* ── 1. Skulptur ───────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <style>{`
            .sculpture-series-grid { display: grid; gap: 1.25rem; grid-template-columns: repeat(5, 1fr); }
            @media (max-width: 900px) { .sculpture-series-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (max-width: 600px) { .sculpture-series-grid { grid-template-columns: repeat(2, 1fr); } }
          `}</style>
          <div className="sculpture-series-grid">
            {sculptureSeries.map((s, i) => {
              const images = slideshowImages[s.slug] ?? []
              return (
                <Link key={s.slug} href={`/${locale}/references/${s.slug}`} className="card card-hover" style={{ display: 'block', overflow: 'hidden', textDecoration: 'none' }}>
                  {images.length > 0 ? (
                    <div style={{ aspectRatio: '3/2', position: 'relative', overflow: 'hidden' }}>
                      <PortfolioSlideshow images={images} alt={s.title} objectFit="cover" interval={3200 + i * 300} />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '3/2', background: 'var(--color-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', fontStyle: 'italic' }}>{s.title}</span>
                    </div>
                  )}
                  <div style={{ padding: '0.6rem 0.75rem 0.85rem' }}>
                    <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)', marginBottom: '0.2rem', lineHeight: 1.3 }}>{s.title}</h3>
                    <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-xs)', margin: 0, lineHeight: 1.4 }}>{s.shortDesc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── 2. Grafik ─────────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          {grafik.years && (
            <p style={{ fontSize: 'var(--fs-xs)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.5rem' }}>
              {grafik.years}
            </p>
          )}
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, marginBottom: '0.75rem' }}>
            {grafik.title}
          </h2>
          {grafik.intro && (
            <p style={{ color: 'var(--color-muted)', maxWidth: '65ch', fontSize: 'var(--fs-base)', lineHeight: 1.7, marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
              {grafik.intro}
            </p>
          )}
          {grafikLightboxImages.length > 0 ? (
            <>
              <GalleryGrid images={grafikLightboxImages} aspectRatio="1/1" columns={6} />
              {grafik.photographer && (
                <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                  {dict.common?.photo_credit ?? 'Foto:'} {grafik.photographer}
                </p>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--color-muted)', fontStyle: 'italic', fontSize: 'var(--fs-sm)' }}>
              {dict.references?.loading ?? 'Bilder laddas in…'}
            </p>
          )}
        </section>

        {/* ── 3. Film & TV ──────────────────────────────────── */}
        <section style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="page-pad" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, margin: 0 }}>
              {dict.references?.film_tv ?? 'Film & TV'}
            </h2>
          </div>
          <FilmGrid locale={locale} films={films} />
        </section>

        {/* ── 4. Publicerat ─────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
            {dict.references?.publicerat ?? 'Publicerat'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch' }}>
            {dict.references?.publicerat_intro ?? 'Ett urval av kataloger, tidskriftsartiklar och böcker med och om Sivert Lindbloms konstnärsskap.'}
          </p>
          <GalleryGrid images={pubLightboxImages} aspectRatio="2/3" columns="sm" />
        </section>

        {/* ── 5. Fotografier ────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
            {dict.references?.fotografier ?? 'Fotografier & Inspiration'}
          </h2>
          <div style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '2rem', maxWidth: '60ch', lineHeight: 1.7 }}>
            {fotografi.intro
              ? renderParagraphs(fotografi.intro, { marginBottom: '0.75rem' })
              : <p>{dict.references?.fotografier_desc ?? 'Bilder som på ett eller annat sätt berört och inspirerat Sivert Lindblom i sitt arbete.'}</p>}
          </div>
          <GalleryGrid images={fotoLightboxImages} aspectRatio="3/2" columns="sm" showCaptions fullWidthLast />
        </section>

        {/* ── 6. Utmärkelser ────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', marginBottom: '0.75rem' }}>
            {dict.references?.utmarkelser_title ?? 'Utmärkelser, priser och medaljer'}
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', marginBottom: '3rem', maxWidth: '60ch', whiteSpace: 'pre-wrap' }}>
            {utmarkelser.intro || 'Priser mottagna av Sivert Lindblom samt medaljer och minnesmärken formgivna av honom.'}
          </p>

          {/* Medal collage */}
          <div style={{ marginBottom: '3rem' }}>
            <GalleryGrid
              images={[
                { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Medaljer-Front.jpg',      alt: dict.references?.utmarkelser_title ?? 'Medaljer åtsida' },
                { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/20180316_172048_001.jpg', alt: dict.references?.utmarkelser ?? 'Medaljer' },
              ]}
              aspectRatio="1/1"
              columns="sm"
            />
          </div>

          <h3 style={{ fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
            {dict.references?.priser_received ?? 'Mottagna priser'}
          </h3>

          {utmarkelser.prizes.map((p, pi) => {
            const hasDetail = !!(p.desc || p.quote || p.images.length > 0 || (p.links && p.links.length > 0))
            return (
            <div key={pi} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
                <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>{p.year}</span>
                <div>
                  {hasDetail ? (
                    <details>
                      <summary style={{ fontSize: 'var(--fs-base)', cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.15rem' }}>
                        <span>{p.title}</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>+</span>
                      </summary>
                      {p.sub && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>{p.sub}</div>}
                      {p.desc && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginTop: '0.5rem', maxWidth: '55ch', whiteSpace: 'pre-wrap' }}>{p.desc}</p>}
                      {p.quote && <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', fontStyle: 'italic', lineHeight: 1.7, marginTop: '0.5rem', maxWidth: '55ch', whiteSpace: 'pre-wrap' }}>{p.quote}</p>}
                      {p.images.length > 0 && (
                        <div style={{ marginTop: '0.85rem' }}>
                          <GalleryGrid
                            images={p.images.map((src) => ({ url: src, alt: p.title }))}
                            aspectRatio="4/3"
                            columns="sm"
                          />
                        </div>
                      )}
                      {p.links && p.links.length > 0 && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {p.links.map((link) => (
                            <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                              style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-accent)', textDecoration: 'none', borderBottom: '1px solid var(--color-accent-dim)', paddingBottom: '0.1em', alignSelf: 'flex-start' }}>
                              {link.label} →
                            </a>
                          ))}
                        </div>
                      )}
                    </details>
                  ) : (
                    <>
                      <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.15rem' }}>{p.title}</div>
                      {p.sub && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>{p.sub}</div>}
                    </>
                  )}
                </div>
              </div>
            </div>
            )
          })}

          <h3 style={{ fontWeight: 400, color: 'var(--color-muted)', marginBottom: '1.25rem', marginTop: '3rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 'var(--fs-xs)' }}>
            {dict.references?.medaljer_designed ?? 'Medaljer formgivna av Sivert Lindblom'}
          </h3>

          {/* IVA */}
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>1992</span>
              <div>
                <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>Kungl. Ingenjörsvetenskapsakademiens (IVA) Minnesmedalj</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '60ch' }}>
                  Åtsida: Profil av arkitekten Gunnar Asplund. Frånsida: Symbol för Stockholmsutställningen 1930 med kompassnål N och upphöjd sfär, inspirerad av den egyptiska gudinnan Isis.
                </p>
                <div style={{ marginBottom: '1rem' }}>
                  <GalleryGrid
                    images={[
                      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Asplund-medalj-1.jpg', alt: 'IVA medalj åtsida — Gunnar Asplund' },
                      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Asplund-medalj-2.jpg', alt: 'IVA medalj frånsida' },
                      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Isis-gudinna.jpg',      alt: 'Isis gudinna — inspiration' },
                      { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Balusterdockor-1-1.jpg', alt: 'Balusterdockor' },
                    ]}
                    aspectRatio="1/1"
                    columns="sm"
                  />
                </div>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 4, background: 'var(--color-bg-surface)', maxWidth: '720px', marginTop: '1rem' }}>
                  <iframe
                    src="https://www.youtube.com/embed/uKDKR1KDdvQ?rel=0"
                    title="IVA Minnesmedalj — film"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vitterhetsakademien */}
          <div style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '5rem 1fr', gap: '1rem' }}>
              <span style={{ color: 'var(--color-accent)', fontFamily: 'Georgia, serif', fontSize: 'var(--fs-sm)' }}>2003</span>
              <div>
                <div style={{ fontSize: 'var(--fs-base)', marginBottom: '0.4rem' }}>Kungl. Vitterhets Historie och Antikvitets Akademiens Jubileumsmedalj</div>
                <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1rem', maxWidth: '60ch' }}>
                  Åtsida: latinskt motto <em>SEMPER VIRIDES</em> med tre lagerkransar. Frånsida: fasaden av Rettigska huset vid Villagatan 3, Stockholm. Utfördes i 2 exemplar i guld (till Kungen och Drottningen) samt 400 i silver till jubileumsbanketten den 20 mars 2003.
                </p>
                <GalleryGrid
                  images={[
                    { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Akademien-Viridis-1.jpg', alt: 'Jubileumsmedalj åtsida — SEMPER VIRIDES' },
                    { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Akademien-Viridis-2.jpg', alt: 'Jubileumsmedalj frånsida' },
                    { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Jubileumsmedalj-1.jpeg',  alt: 'Jubileumsmedalj' },
                    { url: 'https://ixlvwwllvpweltntbsou.supabase.co/storage/v1/object/public/images/wp/2018/05/Jubileumsmedalj-2.jpeg',  alt: 'Jubileumsmedalj detalj' },
                  ]}
                  aspectRatio="1/1"
                  columns="sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Ögonblick ──────────────────────────────────── */}
        <section className="page-pad" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'var(--fs-2xl)', fontWeight: 400, marginBottom: '0.75rem' }}>
            {dict.references?.ogonblick ?? 'Ögonblick'}
          </h2>
          {ogonblick.intro && (
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-base)', maxWidth: '60ch', lineHeight: 1.7, marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
              {ogonblick.intro}
            </p>
          )}
          {ogonblickLightboxImages.length > 0 && (
            <GalleryGrid images={ogonblickLightboxImages} aspectRatio="4/3" columns="sm" showCaptions fullWidthLast />
          )}
        </section>

      </TabsLayout>
    </div>
  )
}
