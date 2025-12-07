"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import type { Blacksmith } from "@/app/blacksmiths/blacksmith-types"

export async function getBlacksmiths(): Promise<Blacksmith[]> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("blacksmiths").select("*").order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching blacksmiths:", error)
        return []
    }

    return data.filter(blacksmith => blacksmith.id) as Blacksmith[]
}

export async function getBlacksmithById(id: string): Promise<Blacksmith | null> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("blacksmiths").select("*").eq("id", id).single()

    if (error) {
        console.error("Error fetching blacksmith by ID:", error)
        return null
    }

    return data as Blacksmith
}

export async function createBlacksmith(formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase.from("blacksmiths").insert({
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
        console.error("Error creating blacksmith:", error)
        throw new Error("Failed to create blacksmith.")
    }

    revalidatePath("/admin/blacksmiths")
    revalidatePath("/blacksmiths")
}

export async function updateBlacksmith(id: string, formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase
        .from("blacksmiths")
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
        console.error("Error updating blacksmith:", error)
        throw new Error("Failed to update blacksmith.")
    }

    revalidatePath("/admin/blacksmiths")
    revalidatePath("/blacksmiths")
    revalidatePath(`/admin/blacksmiths/edit/${id}`)
    revalidatePath(`/blacksmiths/${id}`)
}

export async function deleteBlacksmith(id: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { error } = await supabase.from("blacksmiths").delete().eq("id", id)

    if (error) {
        console.error("Error deleting blacksmith:", error)
        throw new Error("Failed to delete blacksmith.")
    }

    revalidatePath("/admin/blacksmiths")
    revalidatePath("/blacksmiths")
}
