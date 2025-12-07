import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import ProfileForm from "./profile-form"
import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, User } from "lucide-react"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/home" className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm">
            <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <User className="w-7 h-7" />
              <h1 className="text-xl font-bold">الملف الشخصي</h1>
            </div>
            <p className="text-gray-400 text-sm mt-2">قم بتحديث بياناتك الشخصية  </p>
          </div>
        </div>
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
