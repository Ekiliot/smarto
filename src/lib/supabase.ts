import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Создаем клиент с улучшенными настройками для мобильных устройств
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Добавляем настройки для мобильных устройств
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'smarto-auth-token'
  },
  global: {
    headers: {
      'X-Client-Info': 'smarto-web'
    }
  }
}) 