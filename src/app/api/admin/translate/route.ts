import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

// Every non-Swedish locale the site actually serves (see src/i18n/config.ts) —
// this must stay in sync with that file so translation coverage matches the
// language switcher exactly.
const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  zh: 'Chinese (Simplified)',
  ja: 'Japanese',
  ar: 'Arabic',
  pt: 'Portuguese',
  ru: 'Russian',
  nl: 'Dutch',
  pl: 'Polish',
  ko: 'Korean',
  th: 'Thai',
  hu: 'Hungarian',
}

// Keep in sync with HOME_TRANSLATABLE_KEYS in src/lib/data-server.ts.
const HOME_TRANSLATABLE_KEYS = [
  'site_title', 'hero_tagline', 'about_short',
  'home_press_quote', 'home_press_attribution', 'home_press_source', 'home_press_duration',
] as const

// Other singleton, settings-table-backed sections that get the same
// key/value translation treatment as 'home' (translations stored as extra
// `${key}_${locale}` rows — no dedicated table for these entity types).
const SETTINGS_SINGLETON_KEYS: Record<string, readonly string[]> = {
  home: HOME_TRANSLATABLE_KEYS,
  watercolors: ['watercolors_title', 'watercolors_description'],
  contact: ['contact_intro'],
  // reference_fotografi's source lives inside a JSON blob (not flat settings
  // keys) so it gets its own fetch branch below — but the translated intro
  // still writes out as a normal flat `${key}_${locale}` row like the others,
  // so it's listed here purely to drive that shared write path + cache tag.
  reference_fotografi: ['reference_fotografi_intro'],
  biography: ['biography_intro'],
}

// Cache tag each singleton section's public page actually reads with
// cacheTag(...) — not always the same string as the entity_type/settings
// key prefix (e.g. the contact page tags itself 'settings', not 'contact').
const SETTINGS_SINGLETON_CACHE_TAG: Record<string, string> = {
  home: 'home-content',
  watercolors: 'watercolors',
  contact: 'settings',
  reference_fotografi: 'references-fotografi',
  biography: 'biography',
}

async function requireAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'authenticated'
}

async function translateWithGemini(
  fields: Record<string, string>,
  sourceLang: string,
  targetLocale: string
): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale

  const fieldLines = Object.entries(fields)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `<field name="${k}">${v}</field>`)
    .join('\n')

  const prompt = `You are a professional translator for an art museum website about Swedish sculptor Sivert Lindblom (born 1931). Translate the following fields from ${sourceLang} to ${targetLang}. Preserve formatting including line breaks and paragraph structure. Keep proper nouns (names, places, institutions) in their original form unless there is a well-established translation. Return ONLY the translated XML, no commentary.

${fieldLines}

Respond with the same XML structure, replacing content with ${targetLang} translations.`

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // Long exhibition/text bodies (several thousand chars of source) plus
      // XML wrapper overhead can exceed a small budget well before the model
      // finishes — that previously showed up as a silently truncated
      // response (title/description present, content cut off mid-field).
      // Generous headroom here is cheap insurance against that.
      generationConfig: { temperature: 0.2, maxOutputTokens: 32768 },
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 300)}`)
  }
  const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }> }
  const candidate = json.candidates?.[0]
  const responseText = candidate?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  if (!responseText.trim()) throw new Error('Gemini returned an empty response')
  if (candidate?.finishReason === 'MAX_TOKENS') {
    throw new Error('Gemini response was truncated (hit the output token limit) — translation incomplete, not saving')
  }

  const result: Record<string, string> = {}
  for (const [key] of Object.entries(fields)) {
    const match = responseText.match(new RegExp(`<field name="${key}">([\\s\\S]*?)<\\/field>`))
    if (match) result[key] = match[1].trim()
  }

  // Every field we actually asked to translate must come back — a field
  // silently missing from the response (regex found no closing tag, most
  // likely from truncation the finishReason check above didn't catch, or a
  // malformed response) previously got upserted as a null column, which
  // then looked "done" to skip_existing forever. Fail loudly instead so the
  // caller retries rather than saving a half-translated entity.
  const requestedKeys = Object.entries(fields).filter(([, v]) => v?.trim()).map(([k]) => k)
  const missingKeys = requestedKeys.filter((k) => !result[k])
  if (missingKeys.length > 0) {
    throw new Error(`Gemini response was missing field(s): ${missingKeys.join(', ')} — translation incomplete, not saving`)
  }

  return result
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const body = await req.json() as {
    entity_type: 'text' | 'biography_entry' | 'exhibition' | 'public_work' | 'home' | 'sculpture_project' | 'scenography' | 'watercolors' | 'contact' | 'reference_fotografi' | 'biography'
    entity_id: string
    locale: string
  }

  const { entity_type, entity_id, locale } = body

  if (!entity_type || !entity_id || !locale) {
    return NextResponse.json({ error: 'Missing entity_type, entity_id or locale' }, { status: 400 })
  }

  if (!LOCALE_NAMES[locale]) {
    return NextResponse.json({ error: `Unknown locale: ${locale}` }, { status: 400 })
  }

  // Fetch source content
  let sourceLang = 'Swedish'
  let fieldsToTranslate: Record<string, string> = {}

  if (entity_type === 'text') {
    const { data, error: fetchError } = await supabase
      .from('texts')
      .select('title, content, author_bio, language')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: fetchError ? `Text lookup failed: ${fetchError.message}` : 'Text not found' }, { status: fetchError ? 500 : 404 })
    if (data.language === locale) return NextResponse.json({ error: 'Cannot translate to source language' }, { status: 400 })
    const langMap: Record<string, string> = { sv: 'Swedish', en: 'English', fr: 'French', de: 'German', it: 'Italian', hu: 'Hungarian', nl: 'Dutch' }
    sourceLang = langMap[data.language] ?? data.language
    if (data.title) fieldsToTranslate.title = data.title
    if (data.content) fieldsToTranslate.content = data.content
    if (data.author_bio) fieldsToTranslate.author_bio = data.author_bio
  } else if (entity_type === 'biography_entry') {
    const { data, error: fetchError } = await supabase
      .from('biography_entries')
      .select('title, description')
      .eq('id', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: fetchError ? `Biography entry lookup failed: ${fetchError.message}` : 'Biography entry not found' }, { status: fetchError ? 500 : 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
  } else if (entity_type === 'exhibition') {
    const { data, error: fetchError } = await supabase
      .from('works')
      .select('title, description, body')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: fetchError ? `Exhibition lookup failed: ${fetchError.message}` : 'Exhibition not found' }, { status: fetchError ? 500 : 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
    if (data.body) fieldsToTranslate.content = data.body
  } else if (entity_type === 'public_work') {
    const { data, error: fetchError } = await supabase
      .from('public_works')
      .select('title, description, description_sv')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: fetchError ? `Public work lookup failed: ${fetchError.message}` : 'Public work not found' }, { status: fetchError ? 500 : 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
    if (data.description_sv) fieldsToTranslate.content = data.description_sv
  } else if (entity_type === 'sculpture_project') {
    // Sculpture-series entries (Skulptur & Grafik references) live as a JSON
    // array under one settings row, not their own table — read-only lookup
    // here, translations still land in the normal 'translations' table.
    const { data, error: fetchError } = await supabase.from('settings').select('value').eq('key', 'reference_sculpture').single()
    if (!data) return NextResponse.json({ error: fetchError ? `Sculpture project lookup failed: ${fetchError.message}` : 'Sculpture project reference data not found' }, { status: fetchError ? 500 : 404 })
    let projects: Array<{ slug: string; title?: string; description?: string; shortDesc?: string; body?: string }> = []
    try { projects = JSON.parse(data.value)?.projects ?? [] } catch { /* fall through to not-found */ }
    const project = projects.find((p) => p.slug === entity_id)
    if (!project) return NextResponse.json({ error: 'Sculpture project not found' }, { status: 404 })
    sourceLang = 'Swedish'
    if (project.title) fieldsToTranslate.title = project.title
    // `description` is frequently empty on these entries — `shortDesc` holds
    // the real short blurb, so prefer it when present.
    const shortText = project.shortDesc || project.description
    if (shortText) fieldsToTranslate.description = shortText
    if (project.body) fieldsToTranslate.content = project.body
  } else if (entity_type === 'scenography') {
    const { data, error: fetchError } = await supabase
      .from('scenography_works')
      .select('title, description')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: fetchError ? `Scenography work lookup failed: ${fetchError.message}` : 'Scenography work not found' }, { status: fetchError ? 500 : 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
  } else if (entity_type === 'reference_fotografi') {
    // Source lives inside a JSON blob (settings key 'reference_fotografi'),
    // not as its own flat row — only the intro paragraph is translated here.
    const { data, error: fetchError } = await supabase.from('settings').select('value').eq('key', 'reference_fotografi').single()
    if (!data) return NextResponse.json({ error: fetchError ? `Fotografi reference lookup failed: ${fetchError.message}` : 'Fotografi reference data not found' }, { status: fetchError ? 500 : 404 })
    let intro = ''
    try { intro = JSON.parse(data.value)?.intro ?? '' } catch { /* leave empty */ }
    sourceLang = 'Swedish'
    if (intro) fieldsToTranslate.reference_fotografi_intro = intro
  } else if (entity_type in SETTINGS_SINGLETON_KEYS) {
    // Singleton section content (home, watercolors, contact…), stored as
    // key/value rows in 'settings' — not the 'translations' table. entity_id
    // is unused (always matches the entity_type itself, e.g. 'watercolors').
    const keys = SETTINGS_SINGLETON_KEYS[entity_type]
    const { data } = await supabase.from('settings').select('key, value').in('key', [...keys])
    const map: Record<string, string> = {}
    for (const row of data ?? []) if (row.value) map[row.key] = row.value
    sourceLang = 'Swedish'
    for (const key of keys) if (map[key]) fieldsToTranslate[key] = map[key]
  } else {
    return NextResponse.json({ error: `Unknown entity_type: ${entity_type}` }, { status: 400 })
  }

  if (Object.keys(fieldsToTranslate).length === 0) {
    return NextResponse.json({ error: 'No content to translate' }, { status: 400 })
  }

  let translated: Record<string, string>
  try {
    translated = await translateWithGemini(fieldsToTranslate, sourceLang, locale)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }

  if (entity_type in SETTINGS_SINGLETON_KEYS) {
    const rows = Object.entries(translated)
      .filter(([, value]) => value)
      .map(([key, value]) => ({ key: `${key}_${locale}`, value }))
    if (rows.length === 0) return NextResponse.json({ error: 'Translation returned no content' }, { status: 500 })
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidateTag(SETTINGS_SINGLETON_CACHE_TAG[entity_type] ?? entity_type, { expire: 0 })
    return NextResponse.json({ ok: true, translated })
  }

  const upsertData = {
    entity_type,
    entity_id,
    locale,
    title: translated.title ?? null,
    content: translated.content ?? null,
    description: translated.description ?? null,
    author_bio: translated.author_bio ?? null,
    machine_translated: true,
    reviewed_by: null,
    reviewed_at: null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase.from('translations').upsert(upsertData, {
    onConflict: 'entity_type,entity_id,locale',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidateTag('translations', { expire: 0 })

  return NextResponse.json({ ok: true, translated })
}
