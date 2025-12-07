"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import type { UnskilledWorker } from "@/app/unskilled-workers/unskilled-worker-types"

export async function getUnskilledWorkers(): Promise<UnskilledWorker[]> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
        .from("unskilled_workers")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching unskilled workers:", error)
        return []
    }

    return data.filter(worker => worker.id) as UnskilledWorker[]
}

export async function getUnskilledWorkerById(id: string): Promise<UnskilledWorker | null> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
        .from("unskilled_workers")
        .select("*")
        .eq("id", id)
        .single()

    if (error) {
        console.error("Error fetching unskilled worker by ID:", error)
        return null
    }

    return data as UnskilledWorker
}

export async function createUnskilledWorker(unskilledWorkerData: Omit<UnskilledWorker, "id" | "created_at" | "updated_at">) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()

    // Only admin can create
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase.from("unskilled_workers").insert(unskilledWorkerData)

    if (error) {
        console.error("Error creating unskilled worker:", error)
        throw new Error("Failed to create unskilled worker.")
    }

    revalidatePath("/admin/unskilled-workers")
    revalidatePath("/unskilled-workers")
}

export async function updateUnskilledWorker(id: string, unskilledWorkerData: Partial<Omit<UnskilledWorker, "id" | "created_at" | "updated_at">>) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()

    // Only admin can update
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase
        .from("unskilled_workers")
        .update(unskilledWorkerData)
        .eq("id", id)

    if (error) {
        console.error("Error updating unskilled worker:", error)
        throw new Error("Failed to update unskilled worker.")
    }

    revalidatePath("/admin/unskilled-workers")
    revalidatePath("/unskilled-workers")
    revalidatePath(`/admin/unskilled-workers/edit/${id}`)
    revalidatePath(`/unskilled-workers/${id}`)
}

export async function deleteUnskilledWorker(id: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()

    // Only admin can delete
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { error } = await supabase
        .from("unskilled_workers")
        .delete()
        .eq("id", id)

    if (error) {
        console.error("Error deleting unskilled worker:", error)
        throw new Error("Failed to delete unskilled worker.")
    }

    revalidatePath("/admin/unskilled-workers")
    revalidatePath("/unskilled-workers")
}
