import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions"
import { ArrowRight, UserRoundPlus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import UnskilledWorkerForm from "../../unskilled-worker-form"

export async function generateStaticParams() {
    return [{ id: "static-placeholder-id" }]
}

export default async function EditUnskilledWorkerPage({
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
    const { data: unskilledWorker, error } = await supabase
        .from("unskilled_workers")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !unskilledWorker) {
        redirect("/admin/unskilled-workers")
    }

    return (
        <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100">
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
                    {/* ===== Header Section ===== */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link
                            href="/admin/unskilled-workers"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                        </Link>

                        <div>
                            <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                <UserRoundPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                                <h1 className="text-md sm:text-xl font-bold text-gray-900">
                                    تعديل عامل من دون مهنة
                                </h1>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600">
                                تعديل بيانات العامل الحالي
                            </p>
                        </div>
                    </div>

                    <UnskilledWorkerForm unskilledWorker={unskilledWorker} />
                </div>
            </div>
        </div>
    )
}
