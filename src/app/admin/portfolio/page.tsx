'use client'

import { useState, useEffect } from 'react'
import AdminForm, { FieldLabel } from '@/components/admin/AdminForm'
import ImageListEditor from '@/components/admin/ImageListEditor'
import { PORTFOLIO_CATEGORY_KEYS, type PortfolioThumbs, type PortfolioCategoryKey } from '@/lib/portfolio-thumbs'

const CATEGORY_LABELS: Record<PortfolioCategoryKey, string> = {
  exhibitions: 'Utställningar',
  'public-works': 'Offentliga arbeten',
  watercolors: 'Akvareller',
  scenography: 'Scenografi',
}

const EMPTY: PortfolioThumbs = { exhibitions: [], 'public-works': [], watercolors: [], scenography: [] }

export default function AdminPortfolioThumbs() {
  const [thumbs, setThumbs] = useState<PortfolioThumbs>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/portfolio-thumbs', { cache: 'no-store' })
      .then(r => r.json())
      .then((d: PortfolioThumbs | { error: string }) => {
        if ('error' in d) setError(String(d.error))
        else setThumbs(d)
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  function setCat(cat: PortfolioCategoryKey, images: string[]) {
    setThumbs(prev => ({ ...prev, [cat]: images }))
    setDirty(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/portfolio-thumbs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(thumbs),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.error) setError(data.error)
      else { setSaved(true); setDirty(false); setTimeout(() => setSaved(false), 3000) }
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', color: 'var(--color-muted)' }}>Laddar…</div>

  return (
    <AdminForm
      title="Portfolio – kategoribilder"
      backHref="/admin"
      backLabel="Dashboard"
      onSave={handleSave}
      saving={saving}
      saved={saved}
      error={error}
      dirty={dirty}
      maxWidth={900}
      previewHref="/sv/portfolio"
    >
      <p style={{ color: 'var(--color-muted)', fontSize: 'var(--fs-sm)', lineHeight: 1.7, marginTop: '-0.5rem' }}>
        Bilderna som visas i de fyra korten på portfoliosidan. Varje kort växlar automatiskt mellan sina bilder.
        Första bilden visas först. Lämnar du en kategori tom används standardbilderna.
      </p>

      {PORTFOLIO_CATEGORY_KEYS.map((cat) => (
        <div key={cat} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
          <FieldLabel>{CATEGORY_LABELS[cat]}</FieldLabel>
          <ImageListEditor
            images={thumbs[cat] ?? []}
            onChange={(images) => setCat(cat, images)}
            label={`Bilder för ${CATEGORY_LABELS[cat]}`}
          />
        </div>
      ))}
    </AdminForm>
  )
}
