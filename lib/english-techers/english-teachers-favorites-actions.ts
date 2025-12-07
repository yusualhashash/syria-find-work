"use server"

import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

export async function checkIsEnglishTeacherFavorited(teacherId: string): Promise<boolean> {
    const user = await getCurrentUser()
    if (!user) return false

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("english_teacher_id", teacherId)
        .single()

    if (error && error.code !== "PGRST116") { // PGRST116 means no rows found
        console.error("Error checking if English teacher is favorited:", error)
        return false
    }

    return !!data
}

export async function addEnglishTeacherToFavorites(teacherId: string) {
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized: User not logged in")

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, english_teacher_id: teacherId })

    if (error) {
        console.error("Error adding English teacher to favorites:", error)
        throw new Error("Failed to add English teacher to favorites.")
    }

    revalidatePath("/english-teachers")
    revalidatePath("/english-teachers/[id]", "page")
    revalidatePath("/favorites")
    return { success: true, isFavorited: true }
}

export async function removeEnglishTeacherFromFavorites(teacherId: string) {
    console.log("Attempting to remove favorite English teacher:", teacherId); // Log for debugging
    const user = await getCurrentUser()
    if (!user) throw new Error("Unauthorized: User not logged in")

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("english_teacher_id", teacherId)

    if (error) {
        console.error("Error removing English teacher from favorites:", error)
        throw new Error("Failed to remove English teacher from favorites.")
    }

    revalidatePath("/english-teachers")
    revalidatePath("/english-teachers/[id]", "page")
    revalidatePath("/favorites")
    return { success: true, isFavorited: false }
}

export async function toggleEnglishTeacherFavorite(teacherId: string): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsEnglishTeacherFavorited(teacherId);

        if (isCurrentlyFavorited) {
            return await removeEnglishTeacherFromFavorites(teacherId);
        } else {
            return await addEnglishTeacherToFavorites(teacherId);
        }
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

import type { EnglishTeacher } from "@/app/english-teachers/english-teacher-types" // Corrected import path for EnglishTeacher type

// ... (previous code)

export async function getFavoriteEnglishTeachers(): Promise<EnglishTeacher[]> {
    const user = await getCurrentUser()
    if (!user) return []

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("favorites")
        .select("english_teachers(*)")
        .eq("user_id", user.id)
        .not("english_teacher_id", "is", null) as { data: { english_teachers: EnglishTeacher | null }[] | null; error: any }; // Explicitly type data after the query

    if (error) {
        console.error("Error fetching favorite English teachers:", error)
        return []
    }

    if (!data) {
        return [];
    }

    return data.map((item: { english_teachers: EnglishTeacher | null }) => item.english_teachers).filter(Boolean) as EnglishTeacher[];
}
