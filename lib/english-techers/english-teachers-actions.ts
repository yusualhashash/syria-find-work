"use server"

import { createServerSupabaseClient, getCurrentUser, getSession } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

// Check if user is admin
async function checkAdminAccess() {
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        throw new Error("Unauthorized: Admin access required")
    }
    return user
}

// English Teachers Management
export async function getEnglishTeachers() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.from("english_teachers").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function createEnglishTeacher(formData: FormData) {
    const user = await checkAdminAccess()
    const userId = user.id

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from("english_teachers").insert({
        name: formData.get("name"),
        surname: formData.get("surname"),
        whatsapp_number: formData.get("whatsapp_number"),
        gender: formData.get("gender"),
        age: Number.parseInt(formData.get("age")?.toString() || "0"),
        city: formData.get("city"),
        address: formData.get("address"),
        experience_years: Number.parseInt(formData.get("experience_years")?.toString() || "0"),
        notes: formData.get("notes"),
        created_by: userId,
    })

    if (error) throw error
    revalidatePath("/admin/english-teachers")
    return { success: true }
}

export async function updateEnglishTeacher(id: string, formData: FormData) {
    await checkAdminAccess()

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase
        .from("english_teachers")
        .update({
            name: formData.get("name"),
            surname: formData.get("surname"),
            whatsapp_number: formData.get("whatsapp_number"),
            gender: formData.get("gender"),
            age: Number.parseInt(formData.get("age")?.toString() || "0"),
            city: formData.get("city"),
            address: formData.get("address"),
            experience_years: Number.parseInt(formData.get("experience_years")?.toString() || "0"),
            notes: formData.get("notes"),
            updated_at: new Date().toISOString(),
        })
        .eq("id", id)

    if (error) throw error
    revalidatePath("/admin/english-teachers")
    return { success: true }
}

export async function deleteEnglishTeacher(id: string) {
    await checkAdminAccess()

    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from("english_teachers").delete().eq("id", id)

    if (error) throw error
    revalidatePath("/admin/english-teachers")
    return { success: true }
}
