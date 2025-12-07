"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/server-actions"

// Electrician Teachers Management
export async function getElectricianTeachers() {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("electrician_teachers").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data
}

export async function createElectricianTeacher(formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase.from("electrician_teachers").insert({
        name: formData.get("name") as string,
        surname: formData.get("surname") as string,
        whatsapp_number: formData.get("whatsapp_number") as string,
        gender: formData.get("gender") as string,
        age: Number.parseInt(formData.get("age") as string),
        city: formData.get("city") as string,
        address: formData.get("address") as string,
        experience_years: Number.parseInt(formData.get("experience_years") as string),
        notes: formData.get("notes") as string,
        created_by: user.id,
    })

    if (error) throw error
    revalidatePath("/admin/electrician-teachers")
}

export async function updateElectricianTeacher(id: string, formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
        .from("electrician_teachers")
        .update({
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            whatsapp_number: formData.get("whatsapp_number") as string,
            gender: formData.get("gender") as string,
            age: Number.parseInt(formData.get("age") as string),
            city: formData.get("city") as string,
            address: formData.get("address") as string,
            experience_years: Number.parseInt(formData.get("experience_years") as string),
            notes: formData.get("notes") as string,
        })
        .eq("id", id)

    if (error) throw error
    revalidatePath("/admin/electrician-teachers")
}

export async function deleteElectricianTeacher(id: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) throw new Error("Unauthorized")
    const { error } = await supabase.from("electrician_teachers").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/admin/electrician-teachers")
}
