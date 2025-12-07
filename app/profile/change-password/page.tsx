import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import ChangePasswordForm from "./change-password-form"
import Link from "next/link"
import { ArrowRight, Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function ChangePasswordPage() {
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
              < Shield className="w-7 h-7" />
              <h1 className="text-xl font-bold"> تغيير كلمة المرور</h1>
            </div>
            <p className="text-gray-400 text-sm mt-2"> قم بتحديث كلمة المرور </p>
          </div>
        </div>
        <ChangePasswordForm userId={user.id} />
      </div>
    </div>
  )
}
