/**
 * Supabase admin client — uses the service role key to bypass RLS.
 * Only import this in API route handlers (server-side only).
 * Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key || url.includes('your_')) {
    return null
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
