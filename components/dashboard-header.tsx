"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteSession } from "@/lib/server-actions"
import { Bell, Key, LogOut, Menu, MessageCircle, User, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { getUnreadNotificationCount } from "@/lib/notifications/notification-actions"

interface DashboardHeaderProps {
  user: {
    full_name: string
    phone_number: string
    is_admin: boolean
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)
  const [mounted, setMounted] = useState(false) // New state for client-side mounting

  useEffect(() => {
    setMounted(true) // Set mounted to true after component mounts on client
    const fetchNotificationCount = async () => {
      try {
        const count = await getUnreadNotificationCount()
        setNotificationCount(count)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }
    fetchNotificationCount()
  }, [pathname])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await deleteSession()
    router.push("/login")
  }

  const handleWhatsAppSupport = () => {
    const phoneNumber = "905312400068"
    const message = encodeURIComponent(
      `مرحباً، أحتاج إلى مساعدة\n\nالاسم: ${user?.full_name || ''}\nرقم الهاتف: ${user?.phone_number || ''}`,
    )
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <header className="bg-black text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg rounded-es-sm rounded-ee-sm">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white">
          <AvatarImage src="/placeholder.svg?height=48&width=48" />
          <AvatarFallback className="bg-green-400 text-white text-sm sm:text-base">
            {user?.full_name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm sm:text-base">{user?.full_name}</p>
          <p className="text-xs sm:text-sm text-blue-100">{user?.phone_number}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user.is_admin && (
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 sm:h-10 sm:w-10 ${pathname === "/admin" ? "text-green-400" : "text-white hover:bg-green-400"
                }`}
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </Link>
        )}
        <Link href="/notifications">
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 sm:h-10 sm:w-10 relative ${pathname === "/notifications" ? "text-green-400" : "text-white hover:bg-green-400"
              }`}
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-400 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Button>
        </Link>
        {mounted && ( // Conditionally render DropdownMenu only on client
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-green-400 h-9 w-9 sm:h-10 sm:w-10">
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/profile/information" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>تعديل المعلومات</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/change-password" className="flex items-center gap-2 cursor-pointer">
                  <Key className="h-4 w-4" />
                  <span>تغيير كلمة المرور</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleWhatsAppSupport} className="cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                <span>الدعم الفني</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="destructive"
                className="cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}
