"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient as createServerSupabaseClientAuth } from "@/lib/auth" // Renamed to avoid conflict

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set("user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get("user_id")
  return userId?.value || null
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("user_id")
}

export async function createServerSupabaseClient() {
  return createServerSupabaseClientAuth()
}

export async function getCurrentUser() {
  const userId = await getSession()
  if (!userId) return null

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("users")
    .select("id, phone_number, full_name, city, email, is_admin, created_at")
    .eq("id", userId)
    .single()

  if (error) return null
  return data
}
