import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * On-demand cache revalidation. Needed because some content (e.g. text images)
 * is edited out-of-band (direct DB writes / bulk imports) which don't fire the
 * admin routes' revalidateTag, leaving `'use cache'` entries stale across
 * deploys. Call with the shared secret to bust one or more cache tags.
 *
 *   curl "https://<host>/api/revalidate?secret=XXX&tag=texts"
 *   curl "https://<host>/api/revalidate?secret=XXX&tag=texts,references-utmarkelser"
 *
 * The secret lives in the REVALIDATE_SECRET env var (Vercel → Project → Env).
 */
function authorized(req: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return false
  const url = new URL(req.url)
  return url.searchParams.get('secret') === secret
}

function handle(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const raw = url.searchParams.get('tag') ?? ''
  const tags = raw.split(',').map((t) => t.trim()).filter(Boolean)
  if (!tags.length) return NextResponse.json({ error: 'tag required' }, { status: 400 })
  for (const tag of tags) revalidateTag(tag, 'max')
  return NextResponse.json({ ok: true, revalidated: tags })
}

export async function GET(req: Request) { return handle(req) }
export async function POST(req: Request) { return handle(req) }
