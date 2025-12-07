"use client"

import { logoutUser } from "@/app/home/actions"
import { useState } from "react"

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await logoutUser()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
    </button>
  )
}
