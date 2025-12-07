"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { TurkishTeacher } from "@/app/turkish-teachers/turkish-teacher-types"

export async function checkIsTurkishTeacherFavorited(teacherId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("turkish_teacher_id", teacherId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if Turkish teacher is favorited:", error)
        return false
    }

    return !!data
}

export async function addTurkishTeacherToFavorites(teacherId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, turkish_teacher_id: teacherId })

    if (error) {
        console.error("Error adding Turkish teacher to favorites:", error)
        throw new Error("Failed to add Turkish teacher to favorites.")
    }

    revalidatePath("/turkish-teachers")
    revalidatePath("/turkish-teachers/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeTurkishTeacherFromFavorites(teacherId: string) {
    console.log("Attempting to remove favorite Turkish teacher:", teacherId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("turkish_teacher_id", teacherId)

    if (error) {
        console.error("Error removing Turkish teacher from favorites:", error)
        throw new Error("Failed to remove Turkish teacher from favorites.")
    }

    revalidatePath("/turkish-teachers")
    revalidatePath("/turkish-teachers/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleTurkishTeacherFavorite(
    teacherId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsTurkishTeacherFavorited(teacherId)
        if (isCurrentlyFavorited) {
            await removeTurkishTeacherFromFavorites(teacherId)
            return { success: true, isFavorited: false }
        } else {
            await addTurkishTeacherToFavorites(teacherId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteTurkishTeachers(): Promise<TurkishTeacher[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("turkish_teachers(*)")
        .eq("user_id", user.id)
        .not("turkish_teacher_id", "is", null)) as { data: { turkish_teachers: TurkishTeacher | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite Turkish teachers:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { turkish_teachers: TurkishTeacher | null }) => item.turkish_teachers)
        .filter(Boolean) as TurkishTeacher[]
}
