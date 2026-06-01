/**
 * Old-site guard.
 *
 * Hard rule for this project: NO link anywhere on the new site may point back
 * to the old WordPress site (sivertlindblom.se) under any circumstances. Old
 * content must be imported into internal pages and linked there instead.
 *
 * These helpers are used by the admin write APIs to BLOCK + STRIP any
 * old-site URL before it can be persisted, and to surface a WARNING listing
 * what was removed so the editor knows to import that content as a sub-page.
 */
import type { ExhibitionLink } from '@/lib/exhibitions-data'

/** Matches the old WordPress site in any form (with/without scheme or www). */
export const OLD_SITE_RE = /(^|\/\/|\.)sivertlindblom\.se/i

export function isOldSiteUrl(url: string | undefined | null): boolean {
  if (!url) return false
  return OLD_SITE_RE.test(url)
}

/** Strip a single source_url if it points at the old site. Returns '' + warning. */
export function sanitizeSourceUrl(url: string | undefined): {
  url: string
  warning: string | null
} {
  if (isOldSiteUrl(url)) {
    return {
      url: '',
      warning: `Käll-URL till gamla sajten togs bort: ${url}`,
    }
  }
  return { url: url ?? '', warning: null }
}

/** Remove any links pointing to the old site. Returns kept links + warnings. */
export function sanitizeLinks(links: ExhibitionLink[] | undefined): {
  links: ExhibitionLink[]
  warnings: string[]
} {
  if (!links?.length) return { links: links ?? [], warnings: [] }
  const warnings: string[] = []
  const kept = links.filter((l) => {
    if (isOldSiteUrl(l.url)) {
      warnings.push(
        `Länk till gamla sajten togs bort: "${l.label || l.url}" (${l.url}). Importera innehållet som en intern undersida och länka dit i stället.`
      )
      return false
    }
    return true
  })
  return { links: kept, warnings }
}
