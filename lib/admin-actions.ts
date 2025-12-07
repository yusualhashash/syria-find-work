"use server"

import { createServerSupabaseClient } from "@/lib/server-actions"

export async function getUsers() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.from("users").select("*")

    if (error) {
        console.error("Error fetching users:", error)
        return { success: false, error: error.message }
    }
    return { success: true, data: data }
}

export async function getUserCount() {
    const supabase = await createServerSupabaseClient()
    const { count, error } = await supabase.from("users").select("*", { count: "exact" })

    if (error) {
        console.error("Error fetching user count:", error)
        return { success: false, error: error.message }
    }
    return { success: true, count: count }
}

export async function getTotalWorkerCount() {
    const supabase = await createServerSupabaseClient()
    let totalCount = 0

    const professionalTables = [
        "english_teachers",
        "arabic_teachers",
        "turkish_teachers",
        "german_teachers",
        "unskilled_workers",
        "electrician_teachers",
        "plumbers",
        "blacksmiths",
        "tilers",
        "car_repairmen",
    ]

    for (const table of professionalTables) {
        const { count, error } = await supabase.from(table).select("*", { count: "exact" })
        if (error) {
            console.error(`Error fetching count for ${table}:`, error)
            // Optionally, handle error more gracefully, e.g., skip this table or return an error
        } else {
            totalCount += count || 0
        }
    }

    return { success: true, count: totalCount }
}

export async function toggleUserAdmin(userId: string, isAdmin: boolean) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from("users")
        .update({ is_admin: isAdmin })
        .eq("id", userId)
        .select()

    if (error) {
        console.error("Error toggling admin status:", error)
        return { success: false, error: error.message }
    }
    return { success: true, data: data }
}
