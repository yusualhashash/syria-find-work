"use server"

import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

// Check if user is admin
export async function checkAdminAccess() {
  const user = await getCurrentUser()

  if (!user || !user.is_admin) {
    throw new Error("Unauthorized: Admin access required")
  }
  return user
}

export async function getNotifications() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("notifications").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getActiveNotifications() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getUnreadNotificationCount() {
  const user = await getCurrentUser()
  if (!user) return 0

  const supabase = await createServerSupabaseClient()

  // Get all active notifications
  const { data: activeNotifications, error: notifError } = await supabase
    .from("notifications")
    .select("id")
    .eq("is_active", true)

  if (notifError || !activeNotifications) return 0

  // Get notifications this user has read
  const { data: readNotifications, error: readError } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", user.id)

  if (readError) return activeNotifications.length

  const readIds = new Set(readNotifications?.map((r) => r.notification_id) || [])
  const unreadCount = activeNotifications.filter((n) => !readIds.has(n.id)).length

  return unreadCount
}

export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser()
  if (!user) return { success: false }

  const supabase = await createServerSupabaseClient()

  // Get all active notifications
  const { data: activeNotifications, error: notifError } = await supabase
    .from("notifications")
    .select("id")
    .eq("is_active", true)

  if (notifError || !activeNotifications) return { success: false }

  // Mark each as read (insert will be ignored if already exists due to UNIQUE constraint)
  const reads = activeNotifications.map((n) => ({
    user_id: user.id,
    notification_id: n.id,
  }))

  const { error } = await supabase.from("notification_reads").upsert(reads, {
    onConflict: "user_id,notification_id",
    ignoreDuplicates: true,
  })

  if (error) {
    console.error("[v0] Error marking notifications as read:", error)
    return { success: false }
  }

  return { success: true }
}

export async function createNotification(formData: FormData) {
  const user = await checkAdminAccess()

  const supabase = await createServerSupabaseClient()

  const notificationData = {
    title: formData.get("title"),
    message: formData.get("message"),
    type: formData.get("type") || "info",
    is_active: formData.get("is_active") === "true",
    created_by: user.id,
  }

  const { error } = await supabase.from("notifications").insert(notificationData)

  if (error) {
    throw error
  }

  revalidatePath("/admin/notifications")
  return { success: true }
}

export async function updateNotification(id: string, formData: FormData) {
  await checkAdminAccess()

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("notifications")
    .update({
      title: formData.get("title"),
      message: formData.get("message"),
      type: formData.get("type") || "info",
      is_active: formData.get("is_active") === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/admin/notifications")
  return { success: true }
}

export async function toggleNotificationStatus(id: string, isActive: boolean) {
  await checkAdminAccess()

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase
    .from("notifications")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) throw error
  revalidatePath("/admin/notifications")
  return { success: true }
}

export async function deleteNotification(id: string) {
  await checkAdminAccess()

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from("notifications").delete().eq("id", id)

  if (error) throw error
  revalidatePath("/admin/notifications")
  return { success: true }
}
