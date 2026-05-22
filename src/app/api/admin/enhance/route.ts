import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent'

// ── helpers ──────────────────────────────────────────────────────────────────

function mimeFromUrl(url: string): string {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp',
    gif: 'image/gif', avif: 'image/avif',
  }
  return map[ext] ?? 'image/jpeg'
}

// ── POST /api/admin/enhance ───────────────────────────────────────────────────
//
// Body variants:
//   { operation: 'proxy';      imageUrl: string }
//   { operation: 'ai_enhance'; imageBase64: string; mimeType: string }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      operation: 'proxy' | 'ai_enhance'
      imageUrl?: string
      imageBase64?: string
      mimeType?: string
    }

    // ── 1. PROXY — fetch image server-side to bypass CORS ────────────────────
    if (body.operation === 'proxy') {
      if (!body.imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

      const res = await fetch(body.imageUrl, {
        headers: { 'User-Agent': 'SivertLindblom-CMS/1.0' },
      })
      if (!res.ok) return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 502 })

      const buf      = await res.arrayBuffer()
      const bytes    = buf.byteLength
      const mimeType = res.headers.get('content-type')?.split(';')[0] ?? mimeFromUrl(body.imageUrl)
      const base64   = Buffer.from(buf).toString('base64')

      return NextResponse.json({ imageBase64: base64, mimeType, bytes })
    }

    // ── 2. AI ENHANCE — call Gemini image-generation model ───────────────────
    if (body.operation === 'ai_enhance') {
      const apiKey = process.env.GEMINI_API_KEY
      if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return NextResponse.json(
          { error: 'GEMINI_API_KEY inte konfigurerat. Lägg till nyckeln i .env.local och i Vercel.' },
          { status: 503 },
        )
      }
      if (!body.imageBase64 || !body.mimeType) {
        return NextResponse.json({ error: 'imageBase64 and mimeType required' }, { status: 400 })
      }

      const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: 'Sharpen and enhance this artwork/sculpture photograph. Increase sharpness and fine detail clarity, reduce compression artefacts, improve micro-contrast. Preserve the original composition, colours and mood exactly — do not add or remove any objects.',
              },
              {
                inlineData: { mimeType: body.mimeType, data: body.imageBase64 },
              },
            ],
          }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        }),
      })

      if (!geminiRes.ok) {
        const err = await geminiRes.text()
        return NextResponse.json({ error: `Gemini error ${geminiRes.status}: ${err}` }, { status: 502 })
      }

      const json = await geminiRes.json() as {
        candidates?: Array<{
          content: { parts: Array<{ inlineData?: { mimeType: string; data: string }; text?: string }> }
        }>
        error?: { message: string }
      }

      if (json.error) return NextResponse.json({ error: json.error.message }, { status: 502 })

      const parts = json.candidates?.[0]?.content?.parts ?? []
      const imgPart = parts.find(p => p.inlineData)
      if (!imgPart?.inlineData) {
        return NextResponse.json({ error: 'Gemini returned no image. Try again.' }, { status: 502 })
      }

      return NextResponse.json({
        imageBase64: imgPart.inlineData.data,
        mimeType:    imgPart.inlineData.mimeType,
      })
    }

    return NextResponse.json({ error: 'Unknown operation' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
