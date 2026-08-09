import { createAdminClient } from './supabase/admin'

export interface Translation {
  id: string
  entity_type: 'text' | 'biography_entry'
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
  entityType: 'text' | 'biography_entry',
  entityId: string,
  locale: string
): Promise<Translation | null> {
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
  entityType: 'text' | 'biography_entry',
  entityId: string
): Promise<Translation[]> {
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
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data } = await supabase
    .from('translations')
    .select('*')
    .order('updated_at', { ascending: false })
  return data ?? []
}
