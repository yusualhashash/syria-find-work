"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { Plumber } from "@/app/plumbers/plumber-types"

export async function checkIsPlumberFavorited(plumberId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("plumber_id", plumberId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if Plumber is favorited:", error)
        return false
    }

    return !!data
}

export async function addPlumberToFavorites(plumberId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, plumber_id: plumberId })

    if (error) {
        console.error("Error adding Plumber to favorites:", error)
        throw new Error("Failed to add Plumber to favorites.")
    }

    revalidatePath("/plumbers")
    revalidatePath("/plumbers/[id]", "page")
    revalidatePath("/favorites")
}

export async function removePlumberFromFavorites(plumberId: string) {
    console.log("Attempting to remove favorite Plumber:", plumberId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("plumber_id", plumberId)

    if (error) {
        console.error("Error removing Plumber from favorites:", error)
        throw new Error("Failed to remove Plumber from favorites.")
    }

    revalidatePath("/plumbers")
    revalidatePath("/plumbers/[id]", "page")
    revalidatePath("/favorites")
}

export async function togglePlumberFavorite(
    plumberId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsPlumberFavorited(plumberId)
        if (isCurrentlyFavorited) {
            await removePlumberFromFavorites(plumberId)
            return { success: true, isFavorited: false }
        } else {
            await addPlumberToFavorites(plumberId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoritePlumbers(): Promise<Plumber[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("plumbers(*)")
        .eq("user_id", user.id)
        .not("plumber_id", "is", null)) as { data: { plumbers: Plumber | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite Plumbers:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { plumbers: Plumber | null }) => item.plumbers)
        .filter(Boolean) as Plumber[]
}
