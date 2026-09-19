import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function requireAdmin() {
  const jar = await cookies()
  return jar.get('admin_session')?.value === 'authenticated'
}

// Every non-Swedish locale the site serves — keep in sync with src/i18n/config.ts
// and the LOCALE_NAMES map in ../route.ts.
const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'zh', 'ja', 'ar', 'pt', 'ru', 'nl', 'pl', 'ko', 'th', 'hu']

// POST /api/admin/translate/batch
// Body: { entity_type: 'text'|'biography_entry'|'exhibition'|'public_work', entity_ids?: string[], locales?: string[] }
// Translates all (or specified) entities to all (or specified) locales one by one.
// Returns a stream of progress messages via Server-Sent Events.
export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    entity_type: 'text' | 'biography_entry' | 'exhibition' | 'public_work' | 'home'
    entity_ids?: string[]
    locales?: string[]
    skip_existing?: boolean
  }

  const targetLocales = body.locales ?? LOCALES
  const skipExisting = body.skip_existing !== false

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      function send(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // Get entity IDs from DB if not specified
        let entityIds = body.entity_ids ?? []
        if (entityIds.length === 0 && body.entity_type === 'home') {
          // Singleton — 'home' translations live in the settings table, not
          // the translations table, so there is no list endpoint to query.
          entityIds = ['home']
        }
        if (entityIds.length === 0) {
          const baseUrl = req.nextUrl.origin
          const listRes = await fetch(`${baseUrl}/api/admin/translations?entity_type=${body.entity_type}`, {
            headers: { cookie: req.headers.get('cookie') ?? '' },
          })
          const existing: Array<{ entity_id: string; locale: string }> = await listRes.json()

          const listEndpoints: Record<Exclude<typeof body.entity_type, 'home'>, { path: string; idField: string }> = {
            text: { path: '/api/admin/texts', idField: 'slug' },
            biography_entry: { path: '/api/admin/biography', idField: 'id' },
            exhibition: { path: '/api/admin/exhibitions', idField: 'slug' },
            public_work: { path: '/api/admin/public-works', idField: 'slug' },
          }
          const { path, idField } = listEndpoints[body.entity_type as Exclude<typeof body.entity_type, 'home'>]
          const listItemsRes = await fetch(`${baseUrl}${path}`, {
            headers: { cookie: req.headers.get('cookie') ?? '' },
          })
          const items: Array<Record<string, string>> = await listItemsRes.json()
          const existingKeys = new Set(existing.map(e => `${e.entity_id}::${e.locale}`))
          entityIds = items.map(it => it[idField]).filter(Boolean)
          if (skipExisting) {
            // only ids that have at least one missing locale
            entityIds = entityIds.filter(id =>
              targetLocales.some(loc => !existingKeys.has(`${id}::${loc}`))
            )
          }
        }

        const total = entityIds.length * targetLocales.length
        let done = 0

        send({ type: 'start', total })

        for (const entityId of entityIds) {
          for (const locale of targetLocales) {
            try {
              const res = await fetch(`${req.nextUrl.origin}/api/admin/translate`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  cookie: req.headers.get('cookie') ?? '',
                },
                body: JSON.stringify({
                  entity_type: body.entity_type,
                  entity_id: entityId,
                  locale,
                }),
              })
              const rawText = await res.text()
              let result: { error?: string } = {}
              try { result = rawText ? JSON.parse(rawText) : {} } catch { /* non-JSON body handled below */ }
              done++
              if (!res.ok || result.error) {
                send({ type: 'error', entity_id: entityId, locale, error: result.error ?? `HTTP ${res.status}${rawText ? `: ${rawText.slice(0, 200)}` : ' (empty response)'}`, done, total })
              } else {
                send({ type: 'done', entity_id: entityId, locale, done, total })
              }
            } catch (err) {
              done++
              send({ type: 'error', entity_id: entityId, locale, error: String(err), done, total })
            }
          }
        }

        send({ type: 'complete', done, total })
      } catch (err) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'fatal', error: String(err) })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
