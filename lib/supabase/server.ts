import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

// Client classique (utilisateur)
export const createClient = async () => {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          console.warn("Could not set cookie from server component:", error)
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.delete({ name, ...options })
        } catch (error) {
          console.warn("Could not remove cookie from server component:", error)
        }
      },
    },
  })
}

// Client admin (pour les opérations nécessitant la clé de service)
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role environment variables")
  }

  return createSupabaseJsClient<Database>(supabaseUrl, serviceRoleKey)
}
