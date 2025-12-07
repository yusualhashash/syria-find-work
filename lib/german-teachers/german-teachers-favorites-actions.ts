"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { GermanTeacher } from "@/app/german-teachers/german-teacher-types"

export async function checkIsGermanTeacherFavorited(teacherId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("german_teacher_id", teacherId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if German teacher is favorited:", error)
        return false
    }

    return !!data
}

export async function addGermanTeacherToFavorites(teacherId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, german_teacher_id: teacherId })

    if (error) {
        console.error("Error adding German teacher to favorites:", error)
        throw new Error("Failed to add German teacher to favorites.")
    }

    revalidatePath("/german-teachers")
    revalidatePath("/german-teachers/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeGermanTeacherFromFavorites(teacherId: string) {
    console.log("Attempting to remove favorite German teacher:", teacherId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("german_teacher_id", teacherId)

    if (error) {
        console.error("Error removing German teacher from favorites:", error)
        throw new Error("Failed to remove German teacher from favorites.")
    }

    revalidatePath("/german-teachers")
    revalidatePath("/german-teachers/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleGermanTeacherFavorite(
    teacherId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsGermanTeacherFavorited(teacherId)
        if (isCurrentlyFavorited) {
            await removeGermanTeacherFromFavorites(teacherId)
            return { success: true, isFavorited: false }
        } else {
            await addGermanTeacherToFavorites(teacherId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteGermanTeachers(): Promise<GermanTeacher[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("german_teachers(*)")
        .eq("user_id", user.id)
        .not("german_teacher_id", "is", null)) as { data: { german_teachers: GermanTeacher | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite German teachers:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { german_teachers: GermanTeacher | null }) => item.german_teachers)
        .filter(Boolean) as GermanTeacher[]
}
