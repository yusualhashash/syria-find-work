"use server"

import { parsePhoneNumberFromString } from "libphonenumber-js"
import { hashPassword } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createServerSupabaseClient, createSession } from "@/lib/server-actions"

export async function registerUser(formData: FormData) {
    const phone = formData.get("phone") as string
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    const city = formData.get("city") as string
    const password = formData.get("password") as string

    // Validate phone for all countries
    const phoneNumber = parsePhoneNumberFromString(phone)
    if (!phoneNumber || !phoneNumber.isValid()) {
        return { error: "رقم الهاتف غير صالح" }
    }
    const normalizedPhone = phoneNumber.number // E.164 format

    if (password.length < 6) {
        return { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }
    }

    const supabase = await createServerSupabaseClient()

    const { data: existingUser } = await supabase
        .from("users")
        .select("phone_number, email")
        .or(`phone_number.eq.${normalizedPhone},email.eq.${email}`)
        .maybeSingle()

    if (existingUser) {
        if (existingUser.phone_number === normalizedPhone) return { error: "رقم الهاتف مسجل مسبقاً" }
        if (existingUser.email === email) return { error: "البريد الإلكتروني مسجل مسبقاً" }
    }

    const passwordHash = await hashPassword(password)

    const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
            phone_number: normalizedPhone,
            email,
            password_hash: passwordHash,
            full_name: fullName,
            city,
        })
        .select()
        .single()

    if (insertError) {
        console.error("[v0] User creation error:", insertError)
        return { error: "فشل إنشاء الحساب. تأكد من تشغيل السكريبت SQL أولاً" }
    }

    await createSession(newUser.id)
    redirect("/home")
}
