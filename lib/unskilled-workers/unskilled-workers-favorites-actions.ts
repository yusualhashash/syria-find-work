"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"
import type { UnskilledWorker } from "@/app/unskilled-workers/unskilled-worker-types"

export async function checkIsUnskilledWorkerFavorited(workerId: string): Promise<boolean> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return false

    const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("unskilled_worker_id", workerId)
        .maybeSingle()

    if (error) {
        console.error("Error checking if unskilled worker is favorited:", error)
        return false
    }

    return !!data
}

export async function addUnskilledWorkerToFavorites(workerId: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        unskilled_worker_id: workerId,
    })

    if (error) {
        console.error("Error adding unskilled worker to favorites:", error)
        throw new Error("Failed to add unskilled worker to favorites.")
    }

    revalidatePath("/unskilled-workers")
    revalidatePath("/unskilled-workers/[id]", "page")
    revalidatePath("/favorites")
}

export async function removeUnskilledWorkerFromFavorites(workerId: string) {
    console.log("Attempting to remove favorite unskilled worker:", workerId)
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) throw new Error("User not authenticated")

    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("unskilled_worker_id", workerId)

    if (error) {
        console.error("Error removing unskilled worker from favorites:", error)
        throw new Error("Failed to remove unskilled worker from favorites.")
    }

    revalidatePath("/unskilled-workers")
    revalidatePath("/unskilled-workers/[id]", "page")
    revalidatePath("/favorites")
}

export async function toggleUnskilledWorkerFavorite(
    workerId: string,
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
    try {
        const isCurrentlyFavorited = await checkIsUnskilledWorkerFavorited(workerId)

        if (isCurrentlyFavorited) {
            await removeUnskilledWorkerFromFavorites(workerId)
            return { success: true, isFavorited: false }
        } else {
            await addUnskilledWorkerToFavorites(workerId)
            return { success: true, isFavorited: true }
        }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getFavoriteUnskilledWorkers(): Promise<UnskilledWorker[]> {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user) return []

    const { data, error } = (await supabase
        .from("favorites")
        .select("unskilled_workers(*)")
        .eq("user_id", user.id)
        .not("unskilled_worker_id", "is", null)) as { data: { unskilled_workers: UnskilledWorker | null }[] | null; error: any }

    if (error) {
        console.error("Error fetching favorite unskilled workers:", error)
        return []
    }

    if (!data) return []

    return data
        .map((item: { unskilled_workers: UnskilledWorker | null }) => item.unskilled_workers)
        .filter(Boolean) as UnskilledWorker[]
}
