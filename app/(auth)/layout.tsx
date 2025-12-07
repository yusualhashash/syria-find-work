import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import type React from "react"
import "../globals.css"

const cairo = Cairo({ subsets: ["latin", "arabic"] })

export const metadata: Metadata = {
    title: "سوريا موني - Syria Money",
    description: "تطبيق سوريا موني لإدارة الأموال والخدمات",
    generator: "v0.app",
}

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="min-h-screen">{children}</main>
    )
}
