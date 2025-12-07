"use client"

import { Home, Briefcase, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "الرئيسية", icon: Home, href: "/home" },
    { name: "المفضلة", icon: Heart, href: "/favorites" },
    { name: "فرص عمل", icon: Briefcase, href: "/job-opportunities" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-2 py-2 z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors duration-200",
                isActive ? "text-green-400" : "text-white hover:text-green-400",
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
