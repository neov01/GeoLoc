import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types d'endroits
export const PLACE_TYPES = [
  { value: 'restaurant', label: '🍽️ Restaurant', color: 'bg-red-500' },
  { value: 'bar', label: '🍻 Bar/Café', color: 'bg-amber-500' },
  { value: 'entertainment', label: '🎯 Divertissement', color: 'bg-purple-500' },
  { value: 'culture', label: '🎭 Culture', color: 'bg-blue-500' },
  { value: 'shopping', label: '🛍️ Shopping', color: 'bg-green-500' },
  { value: 'outdoor', label: '🌳 Plein air', color: 'bg-emerald-500' },
  { value: 'nightlife', label: '🌙 Vie nocturne', color: 'bg-indigo-500' },
  { value: 'other', label: '📍 Autre', color: 'bg-gray-500' }
]

// Helper functions
export const getPlaceTypeInfo = (type) => {
  return PLACE_TYPES.find(t => t.value === type) || PLACE_TYPES[PLACE_TYPES.length - 1]
}