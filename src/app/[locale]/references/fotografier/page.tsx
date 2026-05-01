import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import MasonryGallery from '@/components/gallery/MasonryGallery'

export const metadata: Metadata = {
  title: 'Fotografier & Inspiration — Sivert Lindblom',
  description: 'Bilder som berört och inspirerat Sivert Lindblom i hans konstnärliga arbete.',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// All reference/inspiration images from sivertlindblom.se/biografi/referens-och-inspirationsbilder/
const IMAGES: Array<{ url: string; caption?: string }> = [
  { url: 'https://media.sivertlindblom.se/2015/03/Sivert-Lindblom-gjuts-1-.jpg', caption: 'Sivert gjuts' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert541-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Siverts-Scarabe-kopia.jpg', caption: 'Egyptisk skulptur av en mänsklig scarabé. Kairos museum.' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Stenar081-kopia.jpg', caption: 'Flyttblock, Gotland' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sten-på-marken-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Skruvstäd001-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert648-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Siverts-Stenstod-kopia.jpg', caption: 'Stenstod, Egypten' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Extra.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert640-kopia-2.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert540-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert534-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert452-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert031-sv-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert297-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert307-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert303-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert037-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert301-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert650-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert189-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert298-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert258-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/perspektiv060-kopia-2.jpg', caption: 'Perspektivstudie (1600-tal)' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur063-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert220-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert208-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert199-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert205-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert202-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert201-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert197-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert194-kopia1.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert198-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/perspektiv059-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert192-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/nazca-kopia.jpg', caption: 'Nazcalinjerna, geoglyfer i Nazcaöknen, Peru' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/bubbler2-kopia.jpg', caption: 'Spår av elektriskt laddade partiklar i bubbelkammare' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Hundar-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert025-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Rimbaud001-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert023-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/NewYork-fasad-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Pyramid-1-kopia.jpg', caption: 'Cheopspyramiden, Kairo, Egypten' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/IMG_0002-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/o_ywcs24nq-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Perspektiv063-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Giants_Causeway_Northern_Ireland-kopia.jpg', caption: 'Giants Causeway, Nordirland' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert196Stengavel-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert537-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Perspektiv-4-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur062-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Perspektiv-3-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Perspektiv-1-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert193-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/perspektiv058-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sandhög001-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Manshuin-Kyoto-kopia.jpg', caption: 'Manshuin, Kyoto' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Strandsten003-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Durer-2-kopia.jpg', caption: 'Albrecht Dürer' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur019-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert235-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur006-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert028-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert030-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert280-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur003-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert029-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bockar-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Duerer_Hieronymus-kopia.jpg', caption: 'Hieronymus im Gehäus, 1514, Albrecht Dürer' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Stenar086-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Skulpturtorn002-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/grav.jpg', caption: 'Judisk kyrkogård, Prag' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/img001-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Valley-de-Luna-kopia.jpg', caption: 'Valle de la Luna' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/20120614_174130-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/8-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Bok-Skulptur004-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert295-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert294-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert247-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert027-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Skulptur-delar-Rom001-kopia.jpg', caption: 'Antikt fragment, Vatikanmuseet, Rom' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Sivert571-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/01/Passare-kopia.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/02/SNC00868.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/02/SNC00870.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/02/SNC00882.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/02/SNC00888.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-Scarabe-.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/03/Sivert-Lindblom-gjuts-2-.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/04/Gibson-.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/Svarv531.jpg' },
  { url: 'https://sivertlindblom.se/wp-content/uploads/2015/06/Svarv532.jpg' },
]

export default async function FotografierPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div className="section-gap">
      <div className="page-pad" style={{ marginBottom: '3rem' }}>
        <Link href={`/${locale}/references`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.title ?? 'Referensmaterial'}</span>
        </Link>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(1.8rem,4vw,3rem)', marginTop: '1rem', marginBottom: '1rem' }}>
          {dict.references?.fotografier ?? 'Fotografier & Inspiration'}
        </h1>
        <p style={{ color: 'var(--color-muted)', maxWidth: '65ch', fontSize: 'var(--fs-base)', lineHeight: 1.8 }}>
          {dict.references?.fotografier_intro ?? ''}
        </p>
      </div>

      <hr className="divider" />

      <div className="page-pad" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <MasonryGallery images={IMAGES} columns="4" />
      </div>
    </div>
  )
}
