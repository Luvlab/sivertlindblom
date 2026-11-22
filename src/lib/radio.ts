// The radio's playlist and switches.
// The full list of tracks is one file, radio-tracks.json: Aeon's sync catalogue on Breakin' Bread.
// Which tracks play, in what order, and whether the order is random is saved by the admin
// in three rows of the settings table.
import ALL from './radio-tracks.json'

export type RadioTrack = { id: string; title: string; url: string }
export type RadioRow = RadioTrack & { on: boolean }
export type RadioConfig = { enabled: boolean; random: boolean; rows: RadioRow[] }

export const RADIO_KEYS = { enabled: 'radio_enabled', random: 'radio_random', playlist: 'radio_playlist' } as const

const CATALOGUE = ALL as RadioRow[]

/** The saved choices laid over the full catalogue. Tracks the admin has never seen come last, switched off. */
export function radioConfig(settings: Record<string, string | undefined>): RadioConfig {
  let saved: { id: string; on: boolean }[] | null = null
  try {
    const parsed = JSON.parse(settings[RADIO_KEYS.playlist] ?? '')
    if (Array.isArray(parsed)) saved = parsed.filter((p) => p && typeof p.id === 'string')
  } catch { /* nothing saved yet */ }

  let rows: RadioRow[]
  if (!saved) rows = CATALOGUE.map((t) => ({ ...t }))
  else {
    const byId = new Map(CATALOGUE.map((t) => [t.id, t]))
    const seen = new Set<string>()
    rows = []
    for (const s of saved) {
      const t = byId.get(s.id)
      if (!t || seen.has(s.id)) continue
      seen.add(s.id)
      rows.push({ ...t, on: !!s.on })
    }
    for (const t of CATALOGUE) if (!seen.has(t.id)) rows.push({ ...t, on: false })
  }
  return {
    enabled: settings[RADIO_KEYS.enabled] !== 'false',
    random: settings[RADIO_KEYS.random] === 'true',
    rows,
  }
}

/** What the public player needs: only the tracks that are switched on, in order. */
export function radioForPlayer(c: RadioConfig): { enabled: boolean; random: boolean; tracks: RadioTrack[] } {
  return { enabled: c.enabled, random: c.random, tracks: c.rows.filter((r) => r.on).map(({ id, title, url }) => ({ id, title, url })) }
}
