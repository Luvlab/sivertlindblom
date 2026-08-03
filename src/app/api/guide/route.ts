import { NextRequest, NextResponse } from 'next/server'
import { getExhibitions, getPublicWorks, getTexts, getSculptureProjects, getFilms } from '@/lib/data-server'
import { createAdminClient } from '@/lib/supabase/admin'

// Gemini text model — fast + cheap, reuses the GEMINI_API_KEY already in the env.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

interface ChatMessage { role: 'user' | 'assistant'; content: string }
interface Doc {
  title: string
  meta: string
  text: string      // truncated — sent to Gemini to keep prompt size reasonable
  fullText: string  // untruncated — used only for keyword scoring
  href: string
}

function truncate(s: string | undefined | null, n: number): string {
  const v = (s ?? '').trim()
  return v.length > n ? v.slice(0, n) + '…' : v
}

function full(s: string | undefined | null): string {
  return (s ?? '').trim()
}

/** Build a grounded corpus from the site's own content. Each doc carries the page URL
 *  (locale-prefixed) so the guide can link to it.
 *
 *  Two text fields:
 *   - `fullText`  — complete untruncated text, used ONLY for keyword scoring so names
 *                   buried deep in a description are still findable (e.g. "Ulf Ferrius").
 *   - `text`      — truncated version sent inside the Gemini prompt to control token use.
 */
async function buildCorpus(locale: string): Promise<Doc[]> {
  const [exhibitions, publicWorks, texts, sculptures, films] = await Promise.all([
    getExhibitions().catch(() => []),
    getPublicWorks().catch(() => []),
    getTexts().catch(() => []),
    getSculptureProjects().catch(() => []),
    getFilms().catch(() => []),
  ])
  const docs: Doc[] = []
  const L = `/${locale}`

  for (const e of exhibitions) {
    const raw = [full(e.description), full(e.body)].filter(Boolean).join(' ')
    docs.push({
      title: e.title,
      meta: `Utställning${e.year ? ' ' + e.year : ''}${e.location ? ', ' + e.location : ''}`,
      text: `${truncate(e.description, 600)} ${truncate(e.body, 900)}`.trim(),
      fullText: raw,
      href: `${L}/portfolio/exhibitions/${e.slug}`,
    })
  }

  for (const w of publicWorks) {
    // Include photographerCredit in full text — collaborators like Ulf Ferrius (metal casting)
    // are stored there and must be searchable even if absent from description/body.
    const raw = [full(w.description), full(w.body), full(w.photographerCredit)].filter(Boolean).join(' ')
    docs.push({
      title: w.title,
      meta: `Offentligt verk${w.year ? ' ' + w.year : ''}${w.location ? ', ' + w.location : ''}${w.photographerCredit ? ' — ' + w.photographerCredit : ''}`,
      text: `${truncate(w.description, 600)} ${truncate(w.body, 900)}`.trim(),
      fullText: raw,
      href: w.hrefBase ? `${L}${w.hrefBase}/${w.slug}` : `${L}/portfolio/public-works/${w.slug}`,
    })
  }

  for (const s of sculptures) {
    const raw = [full(s.description), full(s.body)].filter(Boolean).join(' ')
    docs.push({
      title: s.title,
      meta: `Skulpturserie${s.years ? ' ' + s.years : ''}`,
      text: `${truncate(s.description, 600)} ${truncate(s.body, 900)}`.trim(),
      fullText: raw,
      href: `${L}/references/${s.slug}`,
    })
  }

  for (const t of texts) {
    const raw = [full(t.title), full(t.author), full(t.body)].filter(Boolean).join(' ')
    docs.push({
      title: t.title,
      meta: `Text${t.author ? ' av ' + t.author : ''}${t.year ? ' (' + t.year + ')' : ''}`,
      text: truncate(t.body, 900),
      fullText: raw,
      href: `${L}/texts/${t.slug}`,
    })
  }

  for (const f of films) {
    const raw = [full(f.title), full(f.director), full(f.venue), full(f.desc)].filter(Boolean).join(' ')
    docs.push({
      title: f.title,
      meta: `Film${f.year ? ' ' + f.year : ''}${f.director ? ', regi: ' + f.director : ''}${f.venue ? ', ' + f.venue : ''}`,
      text: truncate(f.desc, 900),
      fullText: raw,
      href: `${L}/references/film-tv/${f.slug}`,
    })
  }

  return docs.filter((d) => d.title)
}

/** Keyword-score the corpus against the question and return the top matches.
 *  Scoring uses fullText (untruncated) so names anywhere in a description are found. */
function retrieve(docs: Doc[], question: string, k = 14): Doc[] {
  const terms = (question.toLowerCase().match(/\p{L}{3,}/gu) ?? [])
  if (terms.length === 0) return docs.slice(0, k)
  const scored = docs.map((d) => {
    const title = d.title.toLowerCase()
    const hay = (d.title + ' ' + d.meta + ' ' + d.fullText).toLowerCase()
    let score = 0
    for (const term of terms) {
      if (title.includes(term)) score += 4
      let idx = hay.indexOf(term)
      while (idx !== -1) { score += 1; idx = hay.indexOf(term, idx + term.length) }
    }
    return { d, score }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .filter((s) => s.score > 0)
    .map((s) => s.d)
}

const SYSTEM = `Du är museiguiden för skulptören Sivert Lindbloms konstarkiv och webbplats — en varm, kunnig och nyfiken konstciceron.

Regler:
- Svara ENDAST utifrån materialet nedan. Hitta aldrig på verk, årtal, platser eller citat.
- Om svaret inte finns i materialet: säg ärligt att just det inte framgår här, och föreslå vänligt att besökaren utforskar Portfolio, Referenser eller Texter på sajten.
- Svara på SAMMA språk som besökaren skriver.
- Håll det kortfattat, levande och personligt — som en engagerad guide, inte en uppslagsbok. 2–5 meningar räcker oftast.
- Sivert Lindblom är född 1931, svensk skulptör känd för offentlig konst, skulptur, akvareller och scenografi.
- När du nämner ett specifikt verk, en utställning, en skulpturserie eller en text som finns i materialet, LÄNKA till dess sida i formatet [titeln](URL). Kopiera exakt den URL som står på raden "URL:" för den posten — den börjar med "/" (t.ex. /sv/references/kofeser). Lägg ALDRIG till någon domän eller "https://" framför; skriv URL:en precis som den står. Hitta aldrig på länkar och länka bara till sidor som finns i materialet. Väv gärna in 1–3 relevanta länkar så besökaren kan läsa vidare.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return NextResponse.json({ error: 'Guiden är inte konfigurerad ännu (saknar API-nyckel).' }, { status: 503 })
  }

  let body: { messages?: ChatMessage[]; sessionId?: string; locale?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ogiltig förfrågan.' }, { status: 400 }) }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || null
  const country = req.headers.get('x-vercel-ip-country') || null
  const city = (() => { const c = req.headers.get('x-vercel-ip-city'); return c ? decodeURIComponent(c) : null })()
  const userAgent = req.headers.get('user-agent')?.slice(0, 400) ?? null

  const messages = (body.messages ?? []).filter((m) => m && typeof m.content === 'string' && m.content.trim()).slice(-8)
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser) return NextResponse.json({ error: 'Ingen fråga.' }, { status: 400 })

  const locale = (body.locale ?? 'sv').replace(/[^a-z-]/gi, '').slice(0, 8) || 'sv'
  const corpus = await buildCorpus(locale)
  const relevant = retrieve(corpus, lastUser.content)
  const context = relevant.map((d) => `## ${d.title}\nURL: ${d.href}\n${d.meta}\n${d.text}`).join('\n\n')

  // Extra curator-supplied knowledge (e.g. a CV about Jan Öqvist), always included.
  let knowledge = ''
  try {
    const supa = createAdminClient()
    if (supa) {
      const { data } = await supa.from('settings').select('value').eq('key', 'guide_knowledge').maybeSingle()
      knowledge = ((data?.value as string) ?? '').slice(0, 12000)
    }
  } catch { /* optional */ }

  const navSection = `=== SAJTENS HUVUDSIDOR (använd dessa URL:er — hitta INTE på egna) ===
Startsida / Hem: /${locale}
Portfolio (utställningar, offentliga verk, akvareller, scenografi): /${locale}/portfolio
Skulptur & grafik (skulpturserier, film & TV, fotografier, publicerat, utmärkelser): /${locale}/references
Texter (kritik, essays, intervjuer): /${locale}/texts
Biografi: /${locale}/biography
Kontakt: /${locale}/contact`

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: `${SYSTEM}\n\n${navSection}\n\n${knowledge ? `=== EXTRA MATERIAL (bakgrund, t.ex. om curatorn Jan Öqvist) ===\n${knowledge}\n\n` : ''}=== MATERIAL FRÅN SAJTEN ===\n${context || '(inget relevant material hittades)'}` }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 700, topP: 0.9 },
      }),
    })
    if (!res.ok) {
      const err = await res.text().catch(() => '')
      return NextResponse.json({ error: `Guiden kunde inte svara just nu (${res.status}).`, detail: err.slice(0, 200) }, { status: 502 })
    }
    const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }
    const reply = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim()
    if (!reply) return NextResponse.json({ error: 'Guiden gav inget svar. Försök igen.' }, { status: 502 })

    // Log the exchange (best-effort; never blocks or fails the reply).
    try {
      const supabase = createAdminClient()
      if (supabase) {
        await supabase.from('guide_chats').insert({
          session_id: (body.sessionId ?? '').slice(0, 80) || null,
          ip, country, city, user_agent: userAgent,
          locale: (body.locale ?? '').slice(0, 8) || null,
          question: lastUser.content.slice(0, 2000),
          answer: reply.slice(0, 4000),
        })
      }
    } catch { /* logging is non-critical */ }

    return NextResponse.json({ reply, sources: relevant.map((d) => d.title).slice(0, 4) })
  } catch (e) {
    return NextResponse.json({ error: `Nätverksfel mot guiden: ${String(e)}` }, { status: 502 })
  }
}
