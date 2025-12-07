"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import type { Tiler } from "@/app/tilers/tiler-types"

export async function getTilers(): Promise<Tiler[]> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("tilers").select("*").order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching tilers:", error)
        return []
    }

    return data.filter(tiler => tiler.id) as Tiler[]
}

export async function getTilerById(id: string): Promise<Tiler | null> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("tilers").select("*").eq("id", id).single()

    if (error) {
        console.error("Error fetching tiler by ID:", error)
        return null
    }

    return data as Tiler
}

export async function createTiler(formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase.from("tilers").insert({
        name: formData.get("name") as string,
        surname: formData.get("surname") as string,
        whatsapp_number: formData.get("whatsapp_number") as string,
        gender: formData.get("gender") as string,
        age: parseInt(formData.get("age") as string),
        city: formData.get("city") as string,
        address: formData.get("address") as string,
        experience_years: parseInt(formData.get("experience_years") as string),
        notes: formData.get("notes") as string,
    })

    if (error) {
        console.error("Error creating tiler:", error)
        throw new Error("Failed to create tiler.")
    }

    revalidatePath("/admin/tilers")
    revalidatePath("/tilers")
}

export async function updateTiler(id: string, formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase
        .from("tilers")
        .update({
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            whatsapp_number: formData.get("whatsapp_number") as string,
            gender: formData.get("gender") as string,
            age: parseInt(formData.get("age") as string),
            city: formData.get("city") as string,
            address: formData.get("address") as string,
            experience_years: parseInt(formData.get("experience_years") as string),
            notes: formData.get("notes") as string,
        })
        .eq("id", id)

    if (error) {
        console.error("Error updating tiler:", error)
        throw new Error("Failed to update tiler.")
    }

    revalidatePath("/admin/tilers")
    revalidatePath("/tilers")
    revalidatePath(`/admin/tilers/edit/${id}`)
    revalidatePath(`/tilers/${id}`)
}

export async function deleteTiler(id: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { error } = await supabase.from("tilers").delete().eq("id", id)

    if (error) {
        console.error("Error deleting tiler:", error)
        throw new Error("Failed to delete tiler.")
    }

    revalidatePath("/admin/tilers")
    revalidatePath("/tilers")
}
