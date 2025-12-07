import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Bell, Volume2, Settings } from "lucide-react"
import NotificationsClient from "./notifications-client"

export default async function NotificationsPage() {
  const user = await getCurrentUser()

  if (!user) redirect("/login")

  return (
    <div dir="rtl" className="min-h-screen bg-black pb-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/home" className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm">
              <ArrowRight className="w-6 h-6" />
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Bell className="w-7 h-7" />
                <h1 className="text-3xl font-bold">الإشعارات</h1>
              </div>
              <p className="text-indigo-100 text-sm mt-2">الإعلانات والتحديثات المهمة</p>
            </div>
          </div>
        </div>

        <div className="bg-bg-black rounded-2xl shadow-xl border border-gray-700">
          <NotificationsClient />
        </div>
      </div>
    </div>
  )
}
