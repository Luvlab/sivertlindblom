// The radio's playlist and switches.
// Two catalogues the admin can pick from: Aeon's sync catalogue (radio-tracks.json) and the rest of
// Breakin' Bread's public library (radio-library.json, a snapshot of every public track with audio).
// The playlist is only what the admin has chosen; until then it is one track, "Crescendo with Flute and Clarinet"
// (Gordon 2026-11-22: "the other ones don't really fit").
import SYNC from './radio-tracks.json'
import LIBRARY from './radio-library.json'

export type RadioTrack = { id: string; title: string; url: string }
export type RadioRow = RadioTrack & { on: boolean }
export type LibraryTrack = RadioTrack & { artist: string; source: 'sync' | 'bb' }
export type RadioConfig = { enabled: boolean; random: boolean; rows: RadioRow[] }

// playlist_v2: the first list (all 72 sync tracks) is dropped on purpose.
export const RADIO_KEYS = { enabled: 'radio_enabled', random: 'radio_random', playlist: 'radio_playlist_v2' } as const

/** Only these play before the admin has saved a list. */
const DEFAULT_ON = ['YiG3ZPlpipEfTcpsygDW']

/** Everything the admin can add: the sync catalogue first, then the rest of the library. */
export const LIBRARY_TRACKS: LibraryTrack[] = [
  ...(SYNC as { id: string; title: string; url: string }[]).map((t) => ({ id: t.id, title: t.title, url: t.url, artist: 'Aeon Manahan', source: 'sync' as const })),
  ...(LIBRARY as { id: string; title: string; artist: string; url: string }[]).map((t) => ({ ...t, source: 'bb' as const })),
]
const BY_ID = new Map(LIBRARY_TRACKS.map((t) => [t.id, t]))

/** The saved list, resolved against the catalogues. A track that has left the library is skipped. */
export function radioConfig(settings: Record<string, string | undefined>): RadioConfig {
  let saved: { id: string; on: boolean }[] | null = null
  try {
    const parsed = JSON.parse(settings[RADIO_KEYS.playlist] ?? '')
    if (Array.isArray(parsed)) saved = parsed.filter((p) => p && typeof p.id === 'string')
  } catch { /* nothing saved yet */ }

  const rows: RadioRow[] = []
  const seen = new Set<string>()
  for (const s of saved ?? DEFAULT_ON.map((id) => ({ id, on: true }))) {
    const t = BY_ID.get(s.id)
    if (!t || seen.has(s.id)) continue
    seen.add(s.id)
    rows.push({ id: t.id, title: t.title, url: t.url, on: !!s.on })
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
