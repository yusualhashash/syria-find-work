"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { changePassword } from "./actions"

// Required label helper
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm sm:text-base text-gray-900 text-right">
      {children} <span className="text-red-500">*</span>
    </span>
  )
}

interface ChangePasswordFormProps {
  userId: string
}

export default function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("يرجى ملء جميع الحقول")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      setIsLoading(false)
      return
    }

    const result = await changePassword(userId, currentPassword, newPassword)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/home")
      }, 2000)
    } else {
      setError(result.error || "حدث خطأ أثناء تغيير كلمة المرور")
    }

    setIsLoading(false)
  }

  const inputClasses =
    "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 focus:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0 transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base pr-10"

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-2 ">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword"><RequiredLabel>كلمة المرور الحالية</RequiredLabel></Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="أدخل كلمة المرور الحالية"
                className={inputClasses}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword"><RequiredLabel>كلمة المرور الجديدة</RequiredLabel></Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="أدخل كلمة المرور الجديدة"
                className={inputClasses}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword"><RequiredLabel>تأكيد كلمة المرور الجديدة</RequiredLabel></Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={isLoading}
                placeholder="أدخل تأكيد كلمة المرور الجديدة"
                className={inputClasses}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs sm:text-sm text-right">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-xs sm:text-sm text-right">
              تم تغيير كلمة المرور بنجاح! جاري التحويل...
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "جاري الحفظ..." : "حفظ كلمة المرور"}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              disabled={isLoading}
              variant="destructive"
              className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
