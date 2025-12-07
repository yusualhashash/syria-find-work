import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import { ArrowRight, UserRoundPlus } from "lucide-react"
import Link from "next/link"
import ArabicTeacherForm from "../arabic-teacher-form"

export default async function NewArabicTeacherPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.is_admin) {
    redirect("/home")
  }

  return (
    <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link
              href="/admin/arabic-teachers"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <UserRoundPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                <h1 className="text-md sm:text-xl font-bold text-gray-900">
                  إضافة مدرس لغة عربية جديد
                </h1>
              </div>

              <p className="text-sm sm:text-base text-gray-600">
                أدخل بيانات المدرس الجديد لإضافته إلى القائمة
              </p>
            </div>
          </div>

          <ArabicTeacherForm />
        </div>
      </div>
    </div>
  )
}
