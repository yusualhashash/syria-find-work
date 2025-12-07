import EnglishTeacherDetail from "./detail"
import { getCurrentUser } from "@/lib/server-actions"
import { redirect, notFound } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { checkIsEnglishTeacherFavorited } from "@/lib/english-techers/english-teachers-favorites-actions"
import type { EnglishTeacher } from "../english-teacher-types" // Import EnglishTeacher type

export default async function EnglishTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const { id } = await params // Correctly unwrap the params Promise
    const supabase = getSupabaseClient()

    const { data: englishTeacher, error } = await supabase
        .from("english_teachers")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !englishTeacher) {
        console.error("Error fetching English teacher details:", error || "No teacher found");
        notFound() // Use notFound for 404 if teacher not found
    }

    const isFavorited = await checkIsEnglishTeacherFavorited(englishTeacher.id)

    return (
        <div dir="rtl" className="min-h-screen bg-black text-white"> {/* Changed bg-[#1a1a1a] to bg-black and removed pb-20 */}
            <EnglishTeacherDetail englishTeacher={englishTeacher as EnglishTeacher} isFavorited={isFavorited} />
        </div>
    )
}
