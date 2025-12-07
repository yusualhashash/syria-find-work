"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

export async function checkIsArabicTeacherFavorited(teacherId: string): Promise<boolean> {
  const supabase = await getSupabaseServerClient()
  const user = await getCurrentUser()
  if (!user) return false

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("arabic_teacher_id", teacherId)
    .maybeSingle()

  if (error) {
    console.error("Error checking if Arabic teacher is favorited:", error)
    return false
  }

  return !!data
}

export async function addArabicTeacherToFavorites(teacherId: string) {
  const supabase = await getSupabaseServerClient()
  const user = await getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("favorites").insert({ user_id: user.id, arabic_teacher_id: teacherId })

  if (error) {
    console.error("Error adding Arabic teacher to favorites:", error)
    throw new Error("Failed to add Arabic teacher to favorites.")
  }

  revalidatePath("/arabic-teachers")
  revalidatePath("/arabic-teachers/[id]", "page")
  revalidatePath("/favorites")
}

export async function removeArabicTeacherFromFavorites(teacherId: string) {
  console.log("Attempting to remove favorite Arabic teacher:", teacherId)
  const supabase = await getSupabaseServerClient()
  const user = await getCurrentUser()
  if (!user) throw new Error("User not authenticated")

  const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("arabic_teacher_id", teacherId)

  if (error) {
    console.error("Error removing Arabic teacher from favorites:", error)
    throw new Error("Failed to remove Arabic teacher from favorites.")
  }

  revalidatePath("/arabic-teachers")
  revalidatePath("/arabic-teachers/[id]", "page")
  revalidatePath("/favorites")
}

export async function toggleArabicTeacherFavorite(
  teacherId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
  try {
    const isCurrentlyFavorited = await checkIsArabicTeacherFavorited(teacherId)
    if (isCurrentlyFavorited) {
      await removeArabicTeacherFromFavorites(teacherId)
      return { success: true, isFavorited: false }
    } else {
      await addArabicTeacherToFavorites(teacherId)
      return { success: true, isFavorited: true }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

import type { ArabicTeacher } from "@/app/arabic-teachers/arabic-teacher-types"

export async function getFavoriteArabicTeachers(): Promise<ArabicTeacher[]> {
  const supabase = await getSupabaseServerClient()
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = (await supabase
    .from("favorites")
    .select("arabic_teachers(*)")
    .eq("user_id", user.id)
    .not("arabic_teacher_id", "is", null)) as { data: { arabic_teachers: ArabicTeacher | null }[] | null; error: any }

  if (error) {
    console.error("Error fetching favorite Arabic teachers:", error)
    return []
  }

  if (!data) {
    return []
  }

  return data
    .map((item: { arabic_teachers: ArabicTeacher | null }) => item.arabic_teachers)
    .filter(Boolean) as ArabicTeacher[]
}
