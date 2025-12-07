"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/server-actions"

// Car Repairmen Management
export async function getCarRepairmen() {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("car_repairmen").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data
}

export async function createCarRepairman(formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) throw new Error("Unauthorized")

    const { error } = await supabase.from("car_repairmen").insert({
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
    revalidatePath("/admin/car-repairmen")
}

export async function updateCarRepairman(id: string, formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const { error } = await supabase
        .from("car_repairmen")
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
    revalidatePath("/admin/car-repairmen")
}

export async function deleteCarRepairman(id: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) throw new Error("Unauthorized")
    const { error } = await supabase.from("car_repairmen").delete().eq("id", id)
    if (error) throw error
    revalidatePath("/admin/car-repairmen")
}
