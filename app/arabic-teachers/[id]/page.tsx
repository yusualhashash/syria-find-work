import ArabicTeacherDetail from "./detail"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkIsArabicTeacherFavorited } from "@/lib/arabic-teachers/arabic-teachers-favorites-actions"
import type { ArabicTeacher } from "../arabic-teacher-types"

export default async function ArabicTeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const supabase = await getSupabaseServerClient()
  const { data: arabicTeacher, error } = await supabase.from("arabic_teachers").select("*").eq("id", id).single()

  if (error || !arabicTeacher) {
    console.error("Error fetching Arabic teacher details:", error || "No teacher found")
    redirect("/arabic-teachers")
  }

  const isFavorited = await checkIsArabicTeacherFavorited(arabicTeacher.id)

  return <ArabicTeacherDetail arabicTeacher={arabicTeacher as ArabicTeacher} isFavorited={isFavorited} />
}
