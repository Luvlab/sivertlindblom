/**
 * Editable data for the References → "Film & TV" section. Stored in `settings`
 * as one JSON blob so Jan can add/edit film & TV entries from admin
 * (/admin/references/film-tv). Falls back to the static FILMS list until edited.
 */
import { FILMS, type FilmEntry } from '@/lib/films-data'

export const FILM_SETTINGS_KEY = 'reference_film'

export type { FilmEntry }

export const DEFAULT_FILMS: FilmEntry[] = FILMS

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'film'
}

export function parseFilms(raw: string | null | undefined): FilmEntry[] {
  if (!raw) return DEFAULT_FILMS
  try {
    const v = JSON.parse(raw)
    if (!Array.isArray(v)) return DEFAULT_FILMS
    const films = v
      .filter((f) => f && typeof f.title === 'string' && f.title.trim())
      .map((f, i): FilmEntry => ({
        slug: (typeof f.slug === 'string' && f.slug.trim()) ? f.slug : slugify(f.title) + '-' + i,
        year: Number(f.year) || 0,
        title: f.title,
        director: f.director || undefined,
        venue: f.venue || undefined,
        desc: f.desc || undefined,
        videoUrl: f.videoUrl || undefined,
        extraVideos: Array.isArray(f.extraVideos) ? f.extraVideos.filter((u: unknown) => typeof u === 'string') : undefined,
        poster: f.poster || undefined,
      }))
    return films.length ? films : DEFAULT_FILMS
  } catch {
    return DEFAULT_FILMS
  }
}

/** Normalize the admin payload into clean FilmEntry rows for storage. */
export function cleanFilms(input: unknown): FilmEntry[] {
  if (!Array.isArray(input)) return []
  return input
    .filter((f) => f && typeof (f as FilmEntry).title === 'string' && (f as FilmEntry).title.trim())
    .map((f, i): FilmEntry => {
      const e = f as Partial<FilmEntry>
      return {
        slug: (typeof e.slug === 'string' && e.slug.trim()) ? e.slug : slugify(e.title as string) + '-' + i,
        year: Number(e.year) || 0,
        title: e.title as string,
        director: e.director?.trim() || undefined,
        venue: e.venue?.trim() || undefined,
        desc: e.desc?.trim() || undefined,
        videoUrl: e.videoUrl?.trim() || undefined,
        extraVideos: Array.isArray(e.extraVideos) ? e.extraVideos.filter((u) => typeof u === 'string' && u.trim()) : undefined,
        poster: e.poster?.trim() || undefined,
      }
    })
}
