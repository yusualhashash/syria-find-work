import { redirect } from "next/navigation"
import { getCurrentUser, createServerSupabaseClient } from "@/lib/server-actions"
import Link from "next/link"
import { ArrowRight, Plus, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import JobOpportunitiesList from "./job-opportunities-list"

export default async function AdminJobOpportunitiesPage() {
  const user = await getCurrentUser()

  if (!user) redirect("/login")
  if (!user.is_admin) redirect("/home")

  const supabase = await createServerSupabaseClient()

  const { data: jobs, error } = await supabase
    .from("job_opportunities")
    .select(`
      *,
      creator:created_by (
        full_name,
        phone_number
      )
    `)
    .order("is_approved", { ascending: true })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching job opportunities:", error)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-black pb-20">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            {/* ===== Header Section ===== */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/admin"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </Link>

              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
                  <h1 className="text-md sm:text-xl font-bold text-white">
                    إدارة فرص العمل
                  </h1>
                </div>
                <p className="text-sm sm:text-base text-gray-400">
                  إضافة، تعديل وحذف فرص العمل الخاصة بالمستخدمين
                </p>
              </div>
            </div>

            <Link href="/job-opportunities/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                <Plus className="ml-2 h-4 w-4" />
                إضافة فرصة عمل جديدة
              </Button>
            </Link>
          </div>

          <JobOpportunitiesList jobs={jobs || []} />
        </div>
      </div>
    </div>
  )
}
