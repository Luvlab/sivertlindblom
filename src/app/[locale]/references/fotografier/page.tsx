import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/i18n/getDictionary'
import { locales } from '@/i18n/config'
import type { Locale } from '@/i18n/config'
import MasonryGallery from '@/components/gallery/MasonryGallery'
import { FOTOGRAFIER_IMAGES } from '@/lib/fotografier-data'

export const metadata: Metadata = {
  title: 'Fotografier & Inspiration — Sivert Lindblom',
  description: 'Bilder som berört och inspirerat Sivert Lindblom i hans konstnärliga arbete.',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function FotografierPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  return (
    <div style={{ paddingBottom: '5rem', marginTop: 'calc(-1.5rem + 1px)' }}>
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

      <div className="page-pad" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <MasonryGallery images={FOTOGRAFIER_IMAGES} columns="4" />
      </div>

      <div className="page-pad" style={{ paddingBottom: '4rem' }}>
        <Link href={`/${locale}/references`} className="back-link">
          <span className="back-link-arrow">←</span>
          <span className="back-link-label">{dict.references?.title ?? 'Referensmaterial'}</span>
        </Link>
      </div>
    </div>
  )
}
