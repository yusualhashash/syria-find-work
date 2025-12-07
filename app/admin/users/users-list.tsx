"use client"

import { useEffect, useState } from "react"
import { getUsers, toggleUserAdmin } from "@/lib/admin-actions"
import Link from "next/link"
import { ArrowRight, Shield, ShieldOff, Loader2, User, Phone, MapPin, User2Icon, Mail, Calendar } from "lucide-react" // Added Mail icon
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type User = {
  id: string
  phone_number: string
  full_name: string | null
  city: string | null
  email: string | null
  is_admin: boolean
  created_at: string
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const result = await getUsers()
    if (result.success && result.data) {
      setUsers(result.data)
    } else {
      toast({
        title: "خطأ",
        description: result.error || "فشل تحميل المستخدمين",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  async function handleToggleAdmin(userId: string, currentStatus: boolean) {
    setUpdatingUserId(userId)
    const result = await toggleUserAdmin(userId, !currentStatus)

    if (result?.success) {
      toast({
        title: "تم التحديث",
        description: currentStatus
          ? "تم إزالة صلاحيات المدير"
          : "تم منح صلاحيات المدير",
      })
      await loadUsers()
    } else {
      toast({
        title: "خطأ",
        description: result.error || "فشل تحديث الصلاحيات",
        variant: "destructive",
      })
    }

    setUpdatingUserId(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-gray-100">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowRight className="w-6 h-6 text-green-600" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
            <p className="text-gray-600 text-sm">عرض وإدارة صلاحيات المستخدمين</p>
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-5">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-6 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

                {/* User Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-1 gap-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User2Icon className="w-4 h-4 text-green-600" />
                        <h3 className="text-md font-bold text-gray-900">
                          {user.full_name || "بدون اسم"}
                        </h3>
                      </div>

                      {user.is_admin && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-green-700 rounded-full text-xs font-medium">
                          <Shield className="w-4 h-4 text-green-600" />
                          مدير
                        </span>
                      )}
                    </div>


                    <div className="text-gray-600 text-sm space-y-1">
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> {user.phone_number}</p>
                      {user.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-600" /> {user.email}</p>}
                      {user.city && <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600" /> {user.city}</p>}
                      <p className="text-gray-500 text-xs flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {new Date(user.created_at).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                  disabled={updatingUserId === user.id}
                  variant={user.is_admin ? "destructive" : "default"}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm shrink-0 transition-colors hover:scale-105"
                >
                  {updatingUserId === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : user.is_admin ? (
                    <>
                      <ShieldOff className="w-4 h-4 text-white" />
                      إزالة صلاحيات المدير
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 text-white" />
                      منح صلاحيات المدير
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-lg">
              لا يوجد مستخدمين
            </div>
          )}
        </div>
      </div>
    </div>

  )
}
