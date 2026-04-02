import { createClient } from "@supabase/supabase-js";

// Uses process.env in production or falls back to mock strings allowing build to pass
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-key";

// Supabase client won't function without real credentials, but provides the structure
export const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
