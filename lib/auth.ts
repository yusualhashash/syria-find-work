import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import { parsePhoneNumberFromString } from "libphonenumber-js" // Import parsePhoneNumberFromString

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This client is for server-side operations only
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey)
}

// Validate Syrian phone number
export function validateSyrianPhone(phone: string): boolean {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone)
    return phoneNumber ? (phoneNumber.isValid() && phoneNumber.country === "SY") : false
  } catch (error) {
    return false
  }
}

// Simple password hashing (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  // For now, we'll use a simple hash
  // In production, install bcryptjs: npm install bcryptjs
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}
