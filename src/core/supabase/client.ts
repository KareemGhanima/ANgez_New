import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase env vars not set. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
    // Return a minimal mock so the app doesn't crash
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }), limit: async () => ({ data: [], error: null }) }), limit: async () => ({ data: [], error: null }) }),
        upsert: async () => ({ error: null }),
        insert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) }),
      }),
    } as any
  }

  return createBrowserClient(url, key)
}
