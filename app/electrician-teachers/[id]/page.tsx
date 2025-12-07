import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { ElectricianTeacher } from "../electrician-teacher-types"
import { checkIsElectricianTeacherFavorited } from "@/lib/electrician-teachers/electrician-teachers-favorites-actions"
import ElectricianTeacherDetail from "./detail"

export default async function ElectricianTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: electricianTeacher, error } = await supabase.from("electrician_teachers").select("*").eq("id", id).single()

    if (error || !electricianTeacher) {
        console.error("Error fetching Electrician teacher details:", error || "No electrician teacher found")
        redirect("/electrician-teachers")
    }

    const isFavorited = await checkIsElectricianTeacherFavorited(electricianTeacher.id)

    return <ElectricianTeacherDetail electricianTeacher={electricianTeacher as ElectricianTeacher} isFavorited={isFavorited} />
}
