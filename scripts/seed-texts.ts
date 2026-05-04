/**
 * Seed texts directly into Supabase using the JS client.
 * Run: npx tsx scripts/seed-texts.ts
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { execSync } from 'child_process'

const SUPABASE_URL = 'https://ixlvwwllvpweltntbsou.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4bHZ3d2xsdnB3ZWx0bnRic291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjIyMzksImV4cCI6MjA5MzQ5ODIzOX0.OUUg2Oqfm72UTI9mbe86EwtVYvbMkGH8_NQ6ILiJIHc'

const supabase = createClient(SUPABASE_URL, ANON_KEY)

async function main() {
  // Parse texts-data.ts source file
  const src = readFileSync('./src/lib/texts-data.ts', 'utf8')

  // Remove imports and TypeScript type annotation
  const cleaned = src
    .replace(/^import\s+.*?;\s*$/gm, '')
    .replace(/const RAW_TEXTS_DATA:\s*Omit<[^>]+>\[\]\s*=/, 'const RAW_TEXTS_DATA =')
    .replace(/^export\s+interface[\s\S]*?^}/gm, '')
    .replace(/^export\s+type[\s\S]*?^}/gm, '')

  // Write temp .mjs file with export
  const tmpPath = '/tmp/texts-extract-' + Date.now() + '.mjs'
  writeFileSync(tmpPath, cleaned + '\nexport { RAW_TEXTS_DATA };\n')

  // Dynamic import (ESM)
  let textItems: any[] = []
  try {
    const mod = await import(tmpPath)
    textItems = mod.RAW_TEXTS_DATA || []
    unlinkSync(tmpPath)
  } catch(e) {
    console.error('Import failed:', e)
    try { unlinkSync(tmpPath) } catch {}
    process.exit(1)
  }

  console.log(`Found ${textItems.length} texts`)

  const rows = textItems.map((t: any) => ({
    slug: t.slug,
    title: t.title,
    author: t.author || null,
    text_type: t.type,
    publication: t.publication || null,
    year: t.year || null,
    language: t.lang || 'sv',
    content: t.body || null,
    published: true,
  }))

  // Upsert in small batches (texts are large)
  const batchSize = 3
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize)
    const { error } = await supabase
      .from('texts')
      .upsert(batch, { onConflict: 'slug' })
    if (error) {
      console.error(`Batch ${Math.floor(i/batchSize)+1} error:`, error.message)
    } else {
      console.log(`✓ Batch ${Math.floor(i/batchSize)+1}: ${batch.map((r: any) => r.slug).join(', ')}`)
    }
  }

  // Verify
  const { data: count } = await supabase.from('texts').select('slug')
  console.log(`\n✅ Done! ${count?.length ?? 0} texts in database`)
}

main().catch(console.error)
