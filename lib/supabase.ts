import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://zzhkoelmqcapuqciimlg.supabase.co" //process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6aGtvZWxtcWNhcHVxY2lpbWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMDE1MDQsImV4cCI6MjA3MTU3NzUwNH0.-O4VCg9DNvJC-ypkcbBGV2l1NAuiHhpjIkYC0FpK_Cc" //process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)