"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { verifyPassword, hashPassword } from "@/lib/auth"

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", userId)
      .single()

    if (fetchError || !userData) {
      return { success: false, error: "المستخدم غير موجود" }
    }

    const isValidPassword = await verifyPassword(currentPassword, userData.password_hash)

    if (!isValidPassword) {
      return { success: false, error: "كلمة المرور الحالية غير صحيحة" }
    }

    const newPasswordHash = await hashPassword(newPassword)

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newPasswordHash })
      .eq("id", userId)

    if (updateError) {
      return { success: false, error: "فشل تحديث كلمة المرور" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: "حدث خطأ غير متوقع" }
  }
}
