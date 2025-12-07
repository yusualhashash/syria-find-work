import { getCurrentUser, createServerSupabaseClient } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NotificationForm from "../../notification-form"

export default async function EditNotificationPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser()

    if (!user) redirect("/login")
    if (!user.is_admin) redirect("/home")

    const { id } = await params

    const supabase = await createServerSupabaseClient()
    const { data: notification } = await supabase.from("notifications").select("*").eq("id", id).single()

    if (!notification) {
        redirect("/admin/notifications")
    }

    return (
        <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100">
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link href="/admin/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">تعديل الإشعار</h1>
                            <p className="text-sm sm:text-base text-gray-600">تحديث معلومات الإشعار</p>
                        </div>
                    </div>

                    <NotificationForm notification={notification} />
                </div>
            </div>
        </div>
    )
}
