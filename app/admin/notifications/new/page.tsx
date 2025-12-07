import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import NotificationForm from "../notification-form"

export default async function NewNotificationPage() {
    const user = await getCurrentUser()

    if (!user) redirect("/login")
    if (!user.is_admin) redirect("/home")

    return (
        <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100">
            <div className="max-w-3xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <Link href="/admin/notifications" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إضافة إشعار جديد</h1>
                            <p className="text-sm sm:text-base text-gray-600">نشر إعلان مهم لجميع المستخدمين</p>
                        </div>
                    </div>

                    <NotificationForm />
                </div>
            </div>
        </div>
    )
}
