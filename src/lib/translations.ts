import { cacheTag, cacheLife } from 'next/cache'
import { createAdminClient } from './supabase/admin'

export type TranslatableEntityType = 'text' | 'biography_entry' | 'exhibition' | 'public_work'

export interface Translation {
  id: string
  entity_type: TranslatableEntityType
  entity_id: string
  locale: string
  title: string | null
  content: string | null
  description: string | null
  author_bio: string | null
  machine_translated: boolean
  reviewed_by: string | null
  reviewed_at: string | null
  updated_at: string
}

export async function getTranslation(
  entityType: TranslatableEntityType,
  entityId: string,
  locale: string
): Promise<Translation | null> {
  'use cache'
  cacheTag('translations', `translation-${entityType}-${entityId}-${locale}`)
  cacheLife('hours')
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data } = await supabase
    .from('translations')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('locale', locale)
    .single()
  return data ?? null
}

export async function getTranslationsForEntity(
  entityType: TranslatableEntityType,
  entityId: string
): Promise<Translation[]> {
  'use cache'
  cacheTag('translations', `translations-${entityType}-${entityId}`)
  cacheLife('hours')
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data } = await supabase
    .from('translations')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
  return data ?? []
}

export async function getAllTranslations(): Promise<Translation[]> {
  'use cache'
  cacheTag('translations')
  cacheLife('hours')
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data } = await supabase
    .from('translations')
    .select('*')
    .order('updated_at', { ascending: false })
  return data ?? []
}
