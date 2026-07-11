/**
 * Content-tree data layer — arbitrary-depth hierarchy mirroring the original
 * sivertlindblom.se structure (Referenser, Texter, Biografi and their nested
 * sub-levels). Backed by the `content_nodes` table (self-referential parent_id).
 *
 * Server-only. All readers use `'use cache'` + cacheTag('content-tree') so an
 * admin save can call revalidateTag('content-tree', 'max') to refresh.
 */
import { cacheTag, cacheLife } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

export type ContentSection = 'references' | 'texts' | 'biography'

export interface ContentLink {
  label: string
  url: string
  external?: boolean
}

export interface ContentRef {
  kind: 'text' | 'public_work' | 'exhibition' | 'gallery'
  id?: string
  slug?: string
}

export interface ContentNode {
  id: string
  parentId: string | null
  section: ContentSection
  slug: string
  /** URL path relative to the section root, e.g. 'skulptur/profiler'. */
  path: string
  title: string
  subtitle?: string
  body?: string
  images: string[]
  videoUrl?: string
  links: ContentLink[]
  contentRef?: ContentRef | null
  sortOrder: number
  published: boolean
}

/** A node plus its direct children, for rendering a category/landing page. */
export interface ContentNodeWithChildren extends ContentNode {
  children: ContentNode[]
}

function dbRowToNode(r: Record<string, unknown>): ContentNode {
  const imgs = (r.images as string[] | null) ?? []
  const links = (r.links as ContentLink[] | null) ?? []
  return {
    id: r.id as string,
    parentId: (r.parent_id as string) ?? null,
    section: r.section as ContentSection,
    slug: r.slug as string,
    path: r.path as string,
    title: r.title as string,
    subtitle: (r.subtitle as string) ?? undefined,
    body: (r.body as string) ?? undefined,
    images: Array.isArray(imgs) ? imgs : [],
    videoUrl: (r.video_url as string) || undefined,
    links: Array.isArray(links) ? links : [],
    contentRef: (r.content_ref as ContentRef) ?? null,
    sortOrder: (r.sort_order as number) ?? 0,
    published: (r.published as boolean) ?? true,
  }
}

/** All published nodes in a section, ordered by path then sort_order. */
export async function getSectionNodes(section: ContentSection): Promise<ContentNode[]> {
  'use cache'
  cacheTag('content-tree', `content-tree-${section}`)
  cacheLife('days')
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('content_nodes')
    .select('*')
    .eq('section', section)
    .eq('published', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return []
  return data.map((r) => dbRowToNode(r as Record<string, unknown>))
}

/** Top-level nodes of a section (direct children of the section root). */
export async function getSectionRoots(section: ContentSection): Promise<ContentNode[]> {
  const all = await getSectionNodes(section)
  return all
    .filter((n) => n.parentId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

/** A single node by its path within a section, plus its direct children. */
export async function getNodeByPath(
  section: ContentSection,
  path: string,
): Promise<ContentNodeWithChildren | null> {
  const all = await getSectionNodes(section)
  const node = all.find((n) => n.path === path)
  if (!node) return null
  const children = all
    .filter((n) => n.parentId === node.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  return { ...node, children }
}

/** Breadcrumb trail from the section root down to (and including) the node. */
export async function getBreadcrumb(
  section: ContentSection,
  path: string,
): Promise<ContentNode[]> {
  const all = await getSectionNodes(section)
  const byId = new Map(all.map((n) => [n.id, n]))
  const start = all.find((n) => n.path === path)
  if (!start) return []
  const trail: ContentNode[] = [start]
  let cur = start
  while (cur.parentId) {
    const parent = byId.get(cur.parentId)
    if (!parent) break
    trail.unshift(parent)
    cur = parent
  }
  return trail
}

/** Every path in a section — for generateStaticParams on the catch-all route. */
export async function getSectionPaths(section: ContentSection): Promise<string[]> {
  const all = await getSectionNodes(section)
  return all.map((n) => n.path)
}
