import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions"
import { ArrowRight, UserRoundPen } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import ArabicTeacherForm from "../../arabic-teacher-form"

export async function generateStaticParams() {
  return [{ id: "static-placeholder-id" }]
}

export default async function EditArabicTeacherPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.is_admin) {
    redirect("/home")
  }

  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: arabicTeacher, error } = await supabase
    .from("arabic_teachers")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !arabicTeacher) {
    redirect("/admin/arabic-teachers")
  }

  return (
    <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          {/* ===== Header Section ===== */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link
              href="/admin/arabic-teachers"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <UserRoundPen className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                <h1 className="text-md sm:text-xl font-bold text-gray-900">
                  تعديل مدرس لغة عربية
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600">
                تحديث بيانات المدرس بشكل كامل
              </p>
            </div>
          </div>

          <ArabicTeacherForm arabicTeacher={arabicTeacher} />
        </div>
      </div>
    </div>
  )
}
