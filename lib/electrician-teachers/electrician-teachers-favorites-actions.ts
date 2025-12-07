"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { ElectricianTeacher } from "@/app/electrician-teachers/electrician-teacher-types"

export async function checkIsElectricianTeacherFavorited(teacherId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("electrician_teacher_id", teacherId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if Electrician teacher is favorited:", error)
        return false
    }

    return !!data
}

export async function addElectricianTeacherToFavorites(teacherId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, electrician_teacher_id: teacherId })

    if (error) {
        console.error("Error adding Electrician teacher to favorites:", error)
        throw new Error("Failed to add Electrician teacher to favorites.")
    }

    revalidatePath("/electrician-teachers")
    revalidatePath("/electrician-teachers/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeElectricianTeacherFromFavorites(teacherId: string) {
    console.log("Attempting to remove favorite Electrician teacher:", teacherId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("electrician_teacher_id", teacherId)

    if (error) {
        console.error("Error removing Electrician teacher from favorites:", error)
        throw new Error("Failed to remove Electrician teacher from favorites.")
    }

    revalidatePath("/electrician-teachers")
    revalidatePath("/electrician-teachers/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleElectricianTeacherFavorite(
    teacherId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsElectricianTeacherFavorited(teacherId)
        if (isCurrentlyFavorited) {
            await removeElectricianTeacherFromFavorites(teacherId)
            return { success: true, isFavorited: false }
        } else {
            await addElectricianTeacherToFavorites(teacherId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteElectricianTeachers(): Promise<ElectricianTeacher[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("electrician_teachers(*)")
        .eq("user_id", user.id)
        .not("electrician_teacher_id", "is", null)) as { data: { electrician_teachers: ElectricianTeacher | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite Electrician teachers:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { electrician_teachers: ElectricianTeacher | null }) => item.electrician_teachers)
        .filter(Boolean) as ElectricianTeacher[]
}
