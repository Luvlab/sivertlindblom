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
      generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 300)}`)
  }
  const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
  const responseText = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  if (!responseText.trim()) throw new Error('Gemini returned an empty response')

  const result: Record<string, string> = {}
  for (const [key] of Object.entries(fields)) {
    const match = responseText.match(new RegExp(`<field name="${key}">([\\s\\S]*?)<\\/field>`))
    if (match) result[key] = match[1].trim()
  }

  return result
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const body = await req.json() as {
    entity_type: 'text' | 'biography_entry' | 'exhibition' | 'public_work' | 'home'
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
  } else if (entity_type === 'home') {
    // Singleton homepage content, stored as key/value rows in 'settings' —
    // not the 'translations' table. entity_id is unused (always 'home').
    const { data } = await supabase.from('settings').select('key, value').in('key', [...HOME_TRANSLATABLE_KEYS])
    const map: Record<string, string> = {}
    for (const row of data ?? []) if (row.value) map[row.key] = row.value
    sourceLang = 'Swedish'
    for (const key of HOME_TRANSLATABLE_KEYS) if (map[key]) fieldsToTranslate[key] = map[key]
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

  if (entity_type === 'home') {
    const rows = Object.entries(translated)
      .filter(([, value]) => value)
      .map(([key, value]) => ({ key: `${key}_${locale}`, value }))
    if (rows.length === 0) return NextResponse.json({ error: 'Translation returned no content' }, { status: 500 })
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    revalidateTag('home-content', { expire: 0 })
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
