import BottomNav from "@/components/bottom-nav"
import { getCurrentUser } from "@/lib/server-actions"
import { Settings, UserRound, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const services = [
    {
      name: "مدرسين اللغة الإنجليزية",
      icon: UserRound,
      href: "/english-teachers",
      color: "text-blue-400",
    },
    {
      name: "مدرسين اللغة العربية",
      icon: UserRound,
      href: "/arabic-teachers",
      color: "text-green-400",
    },
    {
      name: "مدرسين اللغة الالمانية",
      icon: UserRound,
      href: "/german-teachers",
      color: "text-yellow-400",
    },
    {
      name: "مدرسين اللغة التركية",
      icon: UserRound,
      href: "/turkish-teachers",
      color: "text-orange-400",
    },
    {
      name: "عمال من دون مهنة",
      icon: UserRound,
      href: "/unskilled-workers",
      color: "text-red-400",
    },
    {
      name: "معلمين كهرباء",
      icon: UserRound,
      href: "/electrician-teachers",
      color: "text-indigo-400",
    },
    {
      name: "معلمين تمديدات صحية",
      icon: UserRound,
      href: "/plumbers",
      color: "text-cyan-400",
    },
    {
      name: "معلمين حداده",
      icon: UserRound,
      href: "/blacksmiths",
      color: "text-gray-400",
    },
    {
      name: "معلمين تبليط",
      icon: UserRound,
      href: "/tilers",
      color: "text-teal-400",
    },
    {
      name: "مصلحين سيارات",
      icon: UserRound,
      href: "/car-repairmen",
      color: "text-purple-400",
    },
  ];


  return (
    <div dir="rtl" className="min-h-screen bg-black">
      <main className="px-4 py-4 space-y-4">

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <h2 className="text-lg font-bold text-white">الفئات الرئيسية</h2>
          </div>
        </div>

        {/* Services Grid */}
        <div dir="rtl" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {services.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="flex flex-col items-center gap-2 p-4 bg-black rounded-lg border border-gray-700 hover:border-green-400 transition-colors group"
                >
                  <Icon className={`w-6 h-6 ${section.color || "text-gray-400"} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs text-center text-white">{section.name}</span>
                </Link>
              )
            })}
          </div>
          <BottomNav />
        </div>
      </main>
    </div>
  )
}
