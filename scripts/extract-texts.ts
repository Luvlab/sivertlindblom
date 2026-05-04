/**
 * Extract texts data using tsx (handles TypeScript properly).
 */
import { readFileSync } from 'fs'

// We can't import texts-data.ts directly because it imports TEXT_TRANSLATIONS
// which may have issues. Instead, parse the source.
const src = readFileSync('./src/lib/texts-data.ts', 'utf8')

// Extract the RAW_TEXTS_DATA array - find the matching bracket pair
const startMatch = src.match(/const RAW_TEXTS_DATA[^=]+=\s*\[/)
if (!startMatch || startMatch.index === undefined) {
  process.stdout.write('[]')
  process.exit(0)
}

// Use a bracket counter to find the complete array
const start = startMatch.index + startMatch[0].indexOf('[')
let depth = 0
let end = start
for (let i = start; i < src.length; i++) {
  if (src[i] === '[') depth++
  else if (src[i] === ']') {
    depth--
    if (depth === 0) { end = i; break }
  }
}

const arrayStr = src.slice(start, end + 1)

// Use eval with a safe wrapper - strip TypeScript-specific syntax from template literals
// The array contains only string properties and template literals, no TS types inside
let data: any[]
try {
  // biome-ignore lint: seeding script only
  data = eval(arrayStr) as any[]
} catch (e) {
  process.stderr.write(`eval error: ${e}\n`)
  process.stdout.write('[]')
  process.exit(0)
}

const rows = data.map((t: any) => ({
  slug: t.slug as string,
  title: t.title as string,
  author: (t.author as string) || null,
  text_type: t.type as string,
  publication: (t.publication as string) || null,
  year: (t.year as number) || null,
  language: (t.lang as string) || 'sv',
  content: (t.body as string) || null,
  published: true,
}))

process.stdout.write(JSON.stringify(rows))
