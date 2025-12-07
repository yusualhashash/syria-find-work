"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import type { TurkishTeacher } from "@/app/turkish-teachers/turkish-teacher-types"

export async function getTurkishTeachers(): Promise<TurkishTeacher[]> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("turkish_teachers").select("*").order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching Turkish teachers:", error)
        return []
    }

    return data.filter(teacher => teacher.id) as TurkishTeacher[]
}

export async function getTurkishTeacherById(id: string): Promise<TurkishTeacher | null> {
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("turkish_teachers").select("*").eq("id", id).single()

    if (error) {
        console.error("Error fetching Turkish teacher by ID:", error)
        return null
    }

    return data as TurkishTeacher
}

export async function createTurkishTeacher(formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase.from("turkish_teachers").insert({
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
        console.error("Error creating Turkish teacher:", error)
        throw new Error("Failed to create Turkish teacher.")
    }

    revalidatePath("/admin/turkish-teachers")
    revalidatePath("/turkish-teachers")
}

export async function updateTurkishTeacher(id: string, formData: FormData) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { data, error } = await supabase
        .from("turkish_teachers")
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
        console.error("Error updating Turkish teacher:", error)
        throw new Error("Failed to update Turkish teacher.")
    }

    revalidatePath("/admin/turkish-teachers")
    revalidatePath("/turkish-teachers")
    revalidatePath(`/admin/turkish-teachers/edit/${id}`)
    revalidatePath(`/turkish-teachers/${id}`)
}

export async function deleteTurkishTeacher(id: string) {
    const supabase = await getSupabaseServerClient()
    const user = await getCurrentUser()
    if (!user || !user.is_admin) {
        redirect("/login")
    }

    const { error } = await supabase.from("turkish_teachers").delete().eq("id", id)

    if (error) {
        console.error("Error deleting Turkish teacher:", error)
        throw new Error("Failed to delete Turkish teacher.")
    }

    revalidatePath("/admin/turkish-teachers")
    revalidatePath("/turkish-teachers")
}
