'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface TranslationRow {
  entity_type: string
  entity_id: string
  locale: string
  title: string | null
  machine_translated: boolean
  reviewed_by: string | null
  updated_at: string
}

interface TextItem { slug: string; title: string; author: string; lang: string }
interface BioEntry { id: string; title: string; type: string }

const LOCALES = ['en', 'fr', 'de', 'es', 'it', 'pt', 'ro', 'gsw']
const LOCALE_FLAGS: Record<string, string> = {
  en: '🇬🇧', fr: '🇫🇷', de: '🇩🇪', es: '🇪🇸',
  it: '🇮🇹', pt: '🇵🇹', ro: '🇷🇴', gsw: '🇨🇭',
}

function StatusDot({ status }: { status: 'none' | 'machine' | 'reviewed' }) {
  const color = status === 'none' ? 'var(--color-border)' : status === 'machine' ? '#f0a020' : '#3a3'
  const title = status === 'none' ? 'Saknas' : status === 'machine' ? 'Maskinöversatt' : 'Granskad'
  return (
    <span title={title} style={{
      display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: color,
    }} />
  )
}

export default function TranslationsPage() {
  const [texts, setTexts] = useState<TextItem[]>([])
  const [bioEntries, setBioEntries] = useState<BioEntry[]>([])
  const [translations, setTranslations] = useState<TranslationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'texts' | 'biography'>('texts')
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchLog, setBatchLog] = useState<string[]>([])
  const [batchDone, setBatchDone] = useState(0)
  const [batchTotal, setBatchTotal] = useState(0)
  const [translating, setTranslating] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    setLoading(true)
    const [textsRes, bioRes, trRes] = await Promise.all([
      fetch('/api/admin/texts').then(r => r.json()),
      fetch('/api/admin/biography?type=all').then(r => r.json()),
      fetch('/api/admin/translations').then(r => r.json()),
    ])
    setTexts(Array.isArray(textsRes) ? textsRes : [])
    setBioEntries(Array.isArray(bioRes) ? bioRes : [])
    setTranslations(Array.isArray(trRes) ? trRes : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const trMap = new Map(translations.map(t => [`${t.entity_type}::${t.entity_id}::${t.locale}`, t]))

  function getStatus(entityType: string, entityId: string, locale: string): 'none' | 'machine' | 'reviewed' {
    const t = trMap.get(`${entityType}::${entityId}::${locale}`)
    if (!t) return 'none'
    return t.machine_translated ? 'machine' : 'reviewed'
  }

  async function translateOne(entityType: 'text' | 'biography_entry', entityId: string, locale: string) {
    const key = `${entityType}::${entityId}::${locale}`
    setTranslating(prev => ({ ...prev, [key]: true }))
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_type: entityType, entity_id: entityId, locale }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (data.error) alert(`Fel: ${data.error}`)
      else await load()
    } finally {
      setTranslating(prev => { const n = { ...prev }; delete n[key]; return n })
    }
  }

  async function runBatch(entityType: 'text' | 'biography_entry') {
    setBatchRunning(true)
    setBatchLog([])
    setBatchDone(0)
    setBatchTotal(0)

    const res = await fetch('/api/admin/translate/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entity_type: entityType, skip_existing: true }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value)
      for (const line of text.split('\n')) {
        if (!line.startsWith('data: ')) continue
        try {
          const ev = JSON.parse(line.slice(6)) as {
            type: string; total?: number; done?: number
            entity_id?: string; locale?: string; error?: string
          }
          if (ev.type === 'start') { setBatchTotal(ev.total ?? 0) }
          else if (ev.type === 'done') {
            setBatchDone(ev.done ?? 0)
            setBatchLog(prev => [...prev.slice(-99), `✓ ${ev.entity_id} → ${ev.locale}`])
          } else if (ev.type === 'error') {
            setBatchDone(ev.done ?? 0)
            setBatchLog(prev => [...prev.slice(-99), `✗ ${ev.entity_id} → ${ev.locale}: ${ev.error}`])
          } else if (ev.type === 'complete') {
            setBatchLog(prev => [...prev, `Klar! ${ev.done}/${ev.total} behandlade.`])
          }
        } catch { /* ignore parse errors */ }
      }
    }

    setBatchRunning(false)
    await load()
  }

  const entityType = tab === 'texts' ? 'text' : 'biography_entry'
  const entities = tab === 'texts'
    ? texts.map(t => ({ id: t.slug, label: t.title, sub: t.author, lang: t.lang }))
    : bioEntries.map(b => ({ id: b.id, label: b.title, sub: b.type, lang: 'sv' }))

  const missingCount = entities.reduce((acc, e) =>
    acc + LOCALES.filter(loc => getStatus(entityType, e.id, loc) === 'none' && (tab === 'biography' || e.lang !== loc)).length
  , 0)

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 3rem)', maxWidth: 1200 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 400, fontSize: 'clamp(var(--fs-xl), 4vw, var(--fs-3xl))', margin: 0 }}>
          Översättningar
        </h1>
        <Link href="/admin" style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', textDecoration: 'none' }}>← Admin</Link>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: 'var(--fs-xs)', color: 'var(--color-muted)', marginBottom: '1.5rem' }}>
        <span><StatusDot status="none" /> Saknas</span>
        <span><StatusDot status="machine" /> Maskinöversatt</span>
        <span><StatusDot status="reviewed" /> Granskad</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
        {(['texts', 'biography'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            style={{
              background: 'none', border: 'none', padding: '0.6rem 1.2rem', cursor: 'pointer',
              fontSize: 'var(--fs-sm)', color: tab === t ? 'var(--color-text)' : 'var(--color-muted)',
              borderBottom: tab === t ? '2px solid var(--color-accent)' : '2px solid transparent',
              marginBottom: -1,
            }}>
            {t === 'texts' ? 'Texter' : 'Biografi'}
          </button>
        ))}
      </div>

      {/* Batch translate */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn" disabled={batchRunning}
          onClick={() => runBatch(entityType as 'text' | 'biography_entry')}>
          {batchRunning ? `Översätter… (${batchDone}/${batchTotal})` : `Maskinöversätt alla ${tab === 'texts' ? 'texter' : 'biografi-poster'} (hoppa över befintliga)`}
        </button>
        {missingCount > 0 && !batchRunning && (
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-muted)' }}>
            {missingCount} översättningar saknas
          </span>
        )}
      </div>

      {batchLog.length > 0 && (
        <div style={{
          background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
          padding: '0.75rem 1rem', borderRadius: 3, fontSize: '0.7rem', fontFamily: 'monospace',
          maxHeight: 160, overflowY: 'auto', marginBottom: '1.5rem', color: 'var(--color-muted)',
        }}>
          {batchLog.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--color-muted)' }}>Laddar…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--fs-xs)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '0.4rem 0.6rem', fontWeight: 400, color: 'var(--color-muted)' }}>Titel</th>
                {LOCALES.map(loc => (
                  <th key={loc} style={{ textAlign: 'center', padding: '0.4rem 0.3rem', fontWeight: 400, color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                    {LOCALE_FLAGS[loc]} {loc.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entities.map(e => (
                <tr key={e.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.4rem 0.6rem', maxWidth: 260 }}>
                    <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.label}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: '0.65rem' }}>{e.sub}</div>
                  </td>
                  {LOCALES.map(loc => {
                    const isSourceLang = e.lang === loc
                    const status = getStatus(entityType, e.id, loc)
                    const key = `${entityType}::${e.id}::${loc}`
                    const busy = translating[key]

                    if (isSourceLang) {
                      return (
                        <td key={loc} style={{ textAlign: 'center', padding: '0.4rem 0.3rem' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)' }}>original</span>
                        </td>
                      )
                    }

                    return (
                      <td key={loc} style={{ textAlign: 'center', padding: '0.4rem 0.3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <StatusDot status={status} />
                          {status === 'none' ? (
                            <button type="button" disabled={busy} onClick={() => translateOne(entityType as 'text' | 'biography_entry', e.id, loc)}
                              style={{ fontSize: '0.6rem', background: 'none', border: '1px solid var(--color-border)', borderRadius: 2, padding: '1px 4px', cursor: busy ? 'default' : 'pointer', color: 'var(--color-muted)' }}>
                              {busy ? '…' : 'AI'}
                            </button>
                          ) : (
                            <Link href={`/admin/translations/${entityType}/${encodeURIComponent(e.id)}/${loc}`}
                              style={{ fontSize: '0.6rem', color: 'var(--color-accent)', textDecoration: 'none' }}>
                              redigera
                            </Link>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
