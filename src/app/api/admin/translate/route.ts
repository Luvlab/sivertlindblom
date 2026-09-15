import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'

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

async function requireAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'authenticated'
}

async function translateWithClaude(
  fields: Record<string, string>,
  sourceLang: string,
  targetLocale: string
): Promise<Record<string, string>> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.includes('your_')) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const client = new Anthropic({ apiKey })
  const targetLang = LOCALE_NAMES[targetLocale] ?? targetLocale

  const fieldLines = Object.entries(fields)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `<field name="${k}">${v}</field>`)
    .join('\n')

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are a professional translator for an art museum website about Swedish sculptor Sivert Lindblom (born 1931). Translate the following fields from ${sourceLang} to ${targetLang}. Preserve formatting including line breaks and paragraph structure. Keep proper nouns (names, places, institutions) in their original form unless there is a well-established translation. Return ONLY the translated XML, no commentary.

${fieldLines}

Respond with the same XML structure, replacing content with ${targetLang} translations.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
  const result: Record<string, string> = {}

  for (const [key] of Object.entries(fields)) {
    const match = responseText.match(new RegExp(`<field name="${key}">([\s\S]*?)<\/field>`))
    if (match) result[key] = match[1].trim()
  }

  return result
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 500 })

  const body = await req.json() as {
    entity_type: 'text' | 'biography_entry' | 'exhibition' | 'public_work'
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
    const { data } = await supabase
      .from('texts')
      .select('title, body, author_bio, language')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: 'Text not found' }, { status: 404 })
    if (data.language === locale) return NextResponse.json({ error: 'Cannot translate to source language' }, { status: 400 })
    const langMap: Record<string, string> = { sv: 'Swedish', en: 'English', fr: 'French', de: 'German', it: 'Italian', hu: 'Hungarian', nl: 'Dutch' }
    sourceLang = langMap[data.language] ?? data.language
    if (data.title) fieldsToTranslate.title = data.title
    if (data.body) fieldsToTranslate.content = data.body
    if (data.author_bio) fieldsToTranslate.author_bio = data.author_bio
  } else if (entity_type === 'biography_entry') {
    const { data } = await supabase
      .from('biography_entries')
      .select('title, description')
      .eq('id', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: 'Biography entry not found' }, { status: 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
  } else if (entity_type === 'exhibition') {
    const { data } = await supabase
      .from('works')
      .select('title, description, body')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
    if (data.body) fieldsToTranslate.content = data.body
  } else if (entity_type === 'public_work') {
    const { data } = await supabase
      .from('public_works')
      .select('title, description, description_sv')
      .eq('slug', entity_id)
      .single()
    if (!data) return NextResponse.json({ error: 'Public work not found' }, { status: 404 })
    sourceLang = 'Swedish'
    if (data.title) fieldsToTranslate.title = data.title
    if (data.description) fieldsToTranslate.description = data.description
    if (data.description_sv) fieldsToTranslate.content = data.description_sv
  } else {
    return NextResponse.json({ error: `Unknown entity_type: ${entity_type}` }, { status: 400 })
  }

  if (Object.keys(fieldsToTranslate).length === 0) {
    return NextResponse.json({ error: 'No content to translate' }, { status: 400 })
  }

  let translated: Record<string, string>
  try {
    translated = await translateWithClaude(fieldsToTranslate, sourceLang, locale)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
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

  return NextResponse.json({ ok: true, translated })
}
