"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { Tiler } from "@/app/tilers/tiler-types"

export async function checkIsTilerFavorited(tilerId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("tiler_id", tilerId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if tiler is favorited:", error)
        return false
    }

    return !!data
}

export async function addTilerToFavorites(tilerId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, tiler_id: tilerId })

    if (error) {
        console.error("Error adding tiler to favorites:", error)
        throw new Error("Failed to add tiler to favorites.")
    }

    revalidatePath("/tilers")
    revalidatePath("/tilers/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeTilerFromFavorites(tilerId: string) {
    console.log("Attempting to remove favorite tiler:", tilerId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("tiler_id", tilerId)

    if (error) {
        console.error("Error removing tiler from favorites:", error)
        throw new Error("Failed to remove tiler from favorites.")
    }

    revalidatePath("/tilers")
    revalidatePath("/tilers/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleTilerFavorite(
    tilerId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsTilerFavorited(tilerId)
        if (isCurrentlyFavorited) {
            await removeTilerFromFavorites(tilerId)
            return { success: true, isFavorited: false }
        } else {
            await addTilerToFavorites(tilerId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteTilers(): Promise<Tiler[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("tilers(*)")
        .eq("user_id", user.id)
        .not("tiler_id", "is", null)) as { data: { tilers: Tiler | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite tilers:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { tilers: Tiler | null }) => item.tilers)
        .filter(Boolean) as Tiler[]
}
