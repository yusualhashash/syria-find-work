import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import { UsersList } from "./users-list"

export default async function AdminUsersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.is_admin) {
    redirect("/home")
  }

  return (
    <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100">
      <UsersList />
    </div>
  )
}
