"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { Blacksmith } from "@/app/blacksmiths/blacksmith-types"

export async function checkIsBlacksmithFavorited(blacksmithId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("blacksmith_id", blacksmithId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if blacksmith is favorited:", error)
        return false
    }

    return !!data
}

export async function addBlacksmithToFavorites(blacksmithId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, blacksmith_id: blacksmithId })

    if (error) {
        console.error("Error adding blacksmith to favorites:", error)
        throw new Error("Failed to add blacksmith to favorites.")
    }

    revalidatePath("/blacksmiths")
    revalidatePath("/blacksmiths/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeBlacksmithFromFavorites(blacksmithId: string) {
    console.log("Attempting to remove favorite blacksmith:", blacksmithId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("blacksmith_id", blacksmithId)

    if (error) {
        console.error("Error removing blacksmith from favorites:", error)
        throw new Error("Failed to remove blacksmith from favorites.")
    }

    revalidatePath("/blacksmiths")
    revalidatePath("/blacksmiths/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleBlacksmithFavorite(
    blacksmithId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsBlacksmithFavorited(blacksmithId)
        if (isCurrentlyFavorited) {
            await removeBlacksmithFromFavorites(blacksmithId)
            return { success: true, isFavorited: false }
        } else {
            await addBlacksmithToFavorites(blacksmithId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteBlacksmiths(): Promise<Blacksmith[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("blacksmiths(*)")
        .eq("user_id", user.id)
        .not("blacksmith_id", "is", null)) as { data: { blacksmiths: Blacksmith | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite blacksmiths:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { blacksmiths: Blacksmith | null }) => item.blacksmiths)
        .filter(Boolean) as Blacksmith[]
}
