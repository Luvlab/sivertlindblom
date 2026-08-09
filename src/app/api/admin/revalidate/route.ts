import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'

const KNOWN_TAGS = [
  'biography', 'bibliography', 'exhibitions', 'public-works', 'hero',
  'home-content', 'references-film', 'references-utmarkelser', 'references-sculpture',
  'references-fotografi', 'references-ogonblick', 'references-grafik',
  'watercolors', 'portfolio-thumbs',
] as const

export async function POST(req: Request) {
  const store = await cookies()
  if (store.get('admin_session')?.value !== 'authenticated') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let tags: string[]
  try {
    const body = await req.json() as { tags?: string[] }
    tags = Array.isArray(body.tags) ? body.tags : [...KNOWN_TAGS]
  } catch {
    tags = [...KNOWN_TAGS]
  }
  const busted: string[] = []
  for (const tag of tags) {
    if (KNOWN_TAGS.includes(tag as typeof KNOWN_TAGS[number])) {
      revalidateTag(tag, 'max')
      busted.push(tag)
    }
  }
  return NextResponse.json({ ok: true, busted })
}
