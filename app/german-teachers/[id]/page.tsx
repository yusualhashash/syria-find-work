import GermanTeacherDetail from "./detail"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"

import type { GermanTeacher } from "../german-teacher-types"
import { checkIsGermanTeacherFavorited } from "@/lib/german-teachers/german-teachers-favorites-actions"

export default async function GermanTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: germanTeacher, error } = await supabase.from("german_teachers").select("*").eq("id", id).single()

    if (error || !germanTeacher) {
        console.error("Error fetching German teacher details:", error || "No German teacher found")
        redirect("/german-teachers")
    }

    const isFavorited = await checkIsGermanTeacherFavorited(germanTeacher.id)

    return <GermanTeacherDetail germanTeacher={germanTeacher as GermanTeacher} isFavorited={isFavorited} />
}
