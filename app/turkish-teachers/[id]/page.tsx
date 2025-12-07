import TurkishTeacherDetail from "./detail"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkIsTurkishTeacherFavorited } from "@/lib/turkish-teachers/turkish-teachers-favorites-actions"
import type { TurkishTeacher } from "../turkish-teacher-types"

export default async function TurkishTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()

    const { data: turkishTeacher, error } = await supabase
        .from("turkish_teachers")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !turkishTeacher) {
        console.error("Error fetching Turkish teacher details:", error || "No teacher found")
        redirect("/turkish-teachers")
    }

    const isFavorited = await checkIsTurkishTeacherFavorited(turkishTeacher.id)

    return (
        <TurkishTeacherDetail
            turkishTeacher={turkishTeacher as TurkishTeacher}
            isFavorited={isFavorited}
        />
    )
}
