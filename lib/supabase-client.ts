import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials are missing. Auth features will not work.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          tier: "free" | "pro"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          tier?: "free" | "pro"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          tier?: "free" | "pro"
          created_at?: string
          updated_at?: string
        }
      }
      ai_usage: {
        Row: {
          id: string
          user_id: string
          tokens_used: number
          model: string
          feature: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tokens_used: number
          model: string
          feature: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tokens_used?: number
          model?: string
          feature?: string
          created_at?: string
        }
      }
      usage_quotas: {
        Row: {
          id: string
          user_id: string
          month: string
          tokens_used: number
          tokens_limit: number
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          tokens_used: number
          tokens_limit: number
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          tokens_used?: number
          tokens_limit?: number
        }
      }
    }
  }
}
