"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions" // Removed deleteSession as it's not used here
import { parsePhoneNumberFromString } from "libphonenumber-js" // Keep this for general phone parsing
// import { validateSyrianPhone } from "@/lib/auth" // Removed Syrian phone validation

export async function updateUserProfile(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "غير مصرح" }
    }

    const full_name = formData.get("full_name") as string
    const phone_number = formData.get("phone_number") as string
    const city = formData.get("city") as string
    const email = formData.get("email") as string

    if (!full_name || !city || !phone_number) {
      return { success: false, error: "الرجاء ملء جميع الحقول المطلوبة" }
    }

    // Validate phone for all countries
    const phone = parsePhoneNumberFromString(phone_number)
    if (!phone || !phone.isValid()) {
      return { success: false, error: "رقم الهاتف غير صالح" }
    }
    const normalizedPhone = phone.number // E.164 format

    // No longer validating for Syrian phone numbers specifically

    const supabase = await createServerSupabaseClient()

    // Check for duplicate phone number
    if (normalizedPhone !== user.phone_number) { // Only check if phone number has changed
      const { data: existingPhoneUser, error: phoneError } = await supabase
        .from("users")
        .select("id")
        .eq("phone_number", normalizedPhone)
        .single()

      if (phoneError && phoneError.code !== "PGRST116") { // PGRST116 means no rows found
        console.error("Error checking duplicate phone:", phoneError)
        return { success: false, error: "حدث خطأ أثناء التحقق من رقم الهاتف" }
      }
      if (existingPhoneUser) {
        return { success: false, error: "رقم الهاتف هذا مستخدم بالفعل" }
      }
    }

    // Check for duplicate email
    if (email && email !== user.email) { // Only check if email has changed and is provided
      const { data: existingEmailUser, error: emailError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single()

      if (emailError && emailError.code !== "PGRST116") { // PGRST116 means no rows found
        console.error("Error checking duplicate email:", emailError)
        return { success: false, error: "حدث خطأ أثناء التحقق من البريد الإلكتروني" }
      }
      if (existingEmailUser) {
        return { success: false, error: "البريد الإلكتروني هذا مستخدم بالفعل" }
      }
    }

    const { error } = await supabase
      .from("users")
      .update({
        full_name,
        city,
        email,
        phone_number: normalizedPhone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Error updating profile:", error)
      return { success: false, error: "فشل تحديث الملف الشخصي" }
    }

    revalidatePath("/profile")
    revalidatePath("/home")
    return { success: true }
  } catch (error) {
    console.error("Error in updateUserProfile:", error)
    return { success: false, error: "حدث خطأ غير متوقع" }
  }
}
