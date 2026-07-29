import { NextRequest, NextResponse } from 'next/server'
import { getExhibitions, getPublicWorks, getTexts, getSculptureProjects } from '@/lib/data-server'

// Gemini text model — fast + cheap, reuses the GEMINI_API_KEY already in the env.
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

interface ChatMessage { role: 'user' | 'assistant'; content: string }
interface Doc { title: string; meta: string; text: string }

function truncate(s: string | undefined | null, n: number): string {
  const v = (s ?? '').trim()
  return v.length > n ? v.slice(0, n) + '…' : v
}

/** Build a compact, grounded corpus from the site's own content. */
async function buildCorpus(): Promise<Doc[]> {
  const [exhibitions, publicWorks, texts, sculptures] = await Promise.all([
    getExhibitions().catch(() => []),
    getPublicWorks().catch(() => []),
    getTexts().catch(() => []),
    getSculptureProjects().catch(() => []),
  ])
  const docs: Doc[] = []

  for (const e of exhibitions) {
    docs.push({
      title: e.title,
      meta: `Utställning${e.year ? ' ' + e.year : ''}${e.location ? ', ' + e.location : ''}`,
      text: `${truncate(e.description, 400)} ${truncate(e.body, 600)}`.trim(),
    })
  }
  for (const w of publicWorks) {
    docs.push({
      title: w.title,
      meta: `Offentligt verk${w.year ? ' ' + w.year : ''}${w.location ? ', ' + w.location : ''}`,
      text: `${truncate(w.description, 400)} ${truncate(w.body, 600)}`.trim(),
    })
  }
  for (const s of sculptures) {
    docs.push({
      title: s.title,
      meta: `Skulpturserie${s.years ? ' ' + s.years : ''}`,
      text: `${truncate(s.description, 400)} ${truncate(s.body, 600)}`.trim(),
    })
  }
  for (const t of texts) {
    docs.push({
      title: t.title,
      meta: `Text${t.author ? ' av ' + t.author : ''}${t.year ? ' (' + t.year + ')' : ''}`,
      text: truncate(t.body, 700),
    })
  }
  return docs.filter((d) => d.title && d.text)
}

/** Keyword-score the corpus against the question and return the top matches. */
function retrieve(docs: Doc[], question: string, k = 8): Doc[] {
  const terms = (question.toLowerCase().match(/\p{L}{3,}/gu) ?? [])
  if (terms.length === 0) return docs.slice(0, k)
  const scored = docs.map((d) => {
    const title = d.title.toLowerCase()
    const hay = (d.title + ' ' + d.meta + ' ' + d.text).toLowerCase()
    let score = 0
    for (const term of terms) {
      if (title.includes(term)) score += 4
      let idx = hay.indexOf(term)
      while (idx !== -1) { score += 1; idx = hay.indexOf(term, idx + term.length) }
    }
    return { d, score }
  })
  return scored.sort((a, b) => b.score - a.score).slice(0, k).filter((s) => s.score > 0).map((s) => s.d)
}

const SYSTEM = `Du är museiguiden för skulptören Sivert Lindbloms konstarkiv och webbplats — en varm, kunnig och nyfiken konstciceron.

Regler:
- Svara ENDAST utifrån materialet nedan. Hitta aldrig på verk, årtal, platser eller citat.
- Om svaret inte finns i materialet: säg ärligt att just det inte framgår här, och föreslå vänligt att besökaren utforskar Portfolio, Referenser eller Texter på sajten.
- Svara på SAMMA språk som besökaren skriver.
- Håll det kortfattat, levande och personligt — som en engagerad guide, inte en uppslagsbok. 2–5 meningar räcker oftast.
- Sivert Lindblom är född 1931, svensk skulptör känd för offentlig konst, skulptur, akvareller och scenografi.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return NextResponse.json({ error: 'Guiden är inte konfigurerad ännu (saknar API-nyckel).' }, { status: 503 })
  }

  let body: { messages?: ChatMessage[] }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Ogiltig förfrågan.' }, { status: 400 }) }

  const messages = (body.messages ?? []).filter((m) => m && typeof m.content === 'string' && m.content.trim()).slice(-8)
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  if (!lastUser) return NextResponse.json({ error: 'Ingen fråga.' }, { status: 400 })

  const corpus = await buildCorpus()
  const relevant = retrieve(corpus, lastUser.content)
  const context = relevant.map((d) => `## ${d.title}\n${d.meta}\n${d.text}`).join('\n\n')

  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: `${SYSTEM}\n\n=== MATERIAL FRÅN SAJTEN ===\n${context || '(inget relevant material hittades)'}` }] },
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
    return NextResponse.json({ reply, sources: relevant.map((d) => d.title).slice(0, 4) })
  } catch (e) {
    return NextResponse.json({ error: `Nätverksfel mot guiden: ${String(e)}` }, { status: 502 })
  }
}
