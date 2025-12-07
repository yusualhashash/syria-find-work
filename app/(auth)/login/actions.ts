"use server"

import { parsePhoneNumberFromString } from "libphonenumber-js"
import { verifyPassword } from "@/lib/auth"
import { createServerSupabaseClient, createSession } from "@/lib/server-actions"
import { redirect } from "next/navigation"

export async function loginUser(formData: FormData) {
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string

    const phoneNumber = parsePhoneNumberFromString(phone)
    if (!phoneNumber || !phoneNumber.isValid()) {
        return { error: "رقم الهاتف غير صالح" }
    }
    const normalizedPhone = phoneNumber.number // E.164

    const supabase = await createServerSupabaseClient()

    const { data: user, error } = await supabase
        .from("users")
        .select("id, password_hash")
        .eq("phone_number", normalizedPhone)
        .single()

    if (error || !user) {
        return { error: "رقم الهاتف أو كلمة المرور غير صحيحة" }
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
        return { error: "رقم الهاتف أو كلمة المرور غير صحيحة" }
    }

    await createSession(user.id)
    redirect("/home")
}
