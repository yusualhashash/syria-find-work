"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { CarRepairman } from "@/app/car-repairmen/car-repairman-types"

export async function checkIsCarRepairmanFavorited(repairmanId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("car_repairman_id", repairmanId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if Car repairman is favorited:", error)
        return false
    }

    return !!data
}

export async function addCarRepairmanToFavorites(repairmanId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({ user_id: user.id, car_repairman_id: repairmanId })

    if (error) {
        console.error("Error adding Car repairman to favorites:", error)
        throw new Error("Failed to add Car repairman to favorites.")
    }

    revalidatePath("/car-repairmen")
    revalidatePath("/car-repairmen/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeCarRepairmanFromFavorites(repairmanId: string) {
    console.log("Attempting to remove favorite Car repairman:", repairmanId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("car_repairman_id", repairmanId)

    if (error) {
        console.error("Error removing Car repairman from favorites:", error)
        throw new Error("Failed to remove Car repairman from favorites.")
    }

    revalidatePath("/car-repairmen")
    revalidatePath("/car-repairmen/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleCarRepairmanFavorite(
    repairmanId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsCarRepairmanFavorited(repairmanId)
        if (isCurrentlyFavorited) {
            await removeCarRepairmanFromFavorites(repairmanId)
            return { success: true, isFavorited: false }
        } else {
            await addCarRepairmanToFavorites(repairmanId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteCarRepairmen(): Promise<CarRepairman[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("car_repairmen(*)")
        .eq("user_id", user.id)
        .not("car_repairman_id", "is", null)) as { data: { car_repairmen: CarRepairman | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite Car repairmen:", error)
        return []
    }

    if (!data) {
        return []
    }

    return data
        .map((item: { car_repairmen: CarRepairman | null }) => item.car_repairmen)
        .filter(Boolean) as CarRepairman[]
}
