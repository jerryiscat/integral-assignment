import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// import { REACT_NATIVE_SUPABASE_URL, REACT_NATIVE_SUPABASE_ANON_KEY } from 'react-native-dotenv';
// const supabaseUrl = REACT_NATIVE_SUPABASE_URL
// const supabaseAnonKey = REACT_NATIVE_SUPABASE_ANON_KEY

// REACT_NATIVE_SUPABASE_URL=https://nxajlfqtadlelymdtrly.supabase.co
// REACT_NATIVE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54YWpsZnF0YWRsZWx5bWR0cmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTU0MzEsImV4cCI6MjA1NDAzMTQzMX0.HCCGGTqo581dnzysSpUuACHSZRAjAc8jt2f9I_3Tm0g


// EXPO_PUBLIC_SUPABASE_URL=https://nxajlfqtadlelymdtrly.supabase.co
// EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54YWpsZnF0YWRsZWx5bWR0cmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTU0MzEsImV4cCI6MjA1NDAzMTQzMX0.HCCGGTqo581dnzysSpUuACHSZRAjAc8jt2f9I_3Tm0g

const supabaseUrl = 'https://nxajlfqtadlelymdtrly.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54YWpsZnF0YWRsZWx5bWR0cmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0NTU0MzEsImV4cCI6MjA1NDAzMTQzMX0.HCCGGTqo581dnzysSpUuACHSZRAjAc8jt2f9I_3Tm0g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})