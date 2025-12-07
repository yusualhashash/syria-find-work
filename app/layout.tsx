import "./globals.css"
import { getCurrentUser } from "@/lib/server-actions"
import { headers } from "next/headers" // Import headers
import { Cairo } from "next/font/google"
import type { Metadata } from "next"
import type React from "react"
import DashboardHeader from "@/components/dashboard-header"
import BottomNav from "@/components/bottom-nav"
import { Analytics } from "@vercel/analytics/next"

const cairo = Cairo({ subsets: ["latin", "arabic"] })

export const metadata: Metadata = {
  title: "سوريا عمل - Syria Work",
  description: "تطبيق سوريا عمل لإدارة  الخدمات في سوريا",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "سوريا عمل",
  },
  generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getCurrentUser()
  const headersList = await headers()
  const pathname = headersList.get("x-invoke-path") || "/"
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

  return (
    <html lang="ar" dir="rtl" className="bg-black">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${cairo.className} antialiased bg-black text-white`}>
        {/* 🧭 Top Header */}
        {user && !isAuthPage && <DashboardHeader user={{ ...user, is_admin: user.is_admin }} />}

        {/* 🧱 Main Content Area (with bottom padding for fixed nav) */}
        <main className="min-h-screen pb-20">{children}</main>
        {user && !isAuthPage && <BottomNav />}
      </body>
    </html>
  )
}
