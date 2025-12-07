import { getCurrentUser } from "@/lib/server-actions"
import { ArrowRight, UserRound, Briefcase, BarChart3, Bell, CheckCircle, Clock, Users, HardHat } from "lucide-react" // Added Users and HardHat icons
import Link from "next/link"
import { redirect } from "next/navigation"
import { getUserCount, getTotalWorkerCount } from "@/lib/admin-actions" // Import new admin actions
import { getJobOpportunityCount, getPendingJobOpportunityCount } from "@/lib/job-opportunities/job-opportunities-actions"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (!user.is_admin) {
    redirect("/home")
  }

  // Fetch counts for quick stats
  const { count: userCount } = await getUserCount()
  const { count: jobOpportunityCount } = await getJobOpportunityCount()
  const { count: workerCount } = await getTotalWorkerCount()
  const { count: pendingJobOpportunityCount } = await getPendingJobOpportunityCount()

  const adminSections = [
    {
      name: "إدارة اساتذة اللغة الإنجليزية",
      icon: UserRound,
      href: "/admin/english-teachers",
      iconColor: "text-blue-400",
      description: "إضافة وتعديل وحذف مدرسي اللغة الإنجليزية",
    },
    {
      name: "إدارة اساتذة اللغة العربية",
      icon: UserRound,
      href: "/admin/arabic-teachers",
      iconColor: "text-green-400",
      description: "إضافة وتعديل وحذف مدرسي اللغة العربية",
    },
    {
      name: "إدارة اساتذة اللغة التركية",
      icon: UserRound,
      href: "/admin/turkish-teachers",
      iconColor: "text-orange-400",
      description: "إضافة وتعديل وحذف مدرسي اللغة التركية",
    },
    {
      name: "إدارة معلمين اللغة الألمانية",
      icon: UserRound,
      href: "/admin/german-teachers",
      iconColor: "text-yellow-400",
      description: "إضافة وتعديل وحذف معلومات معلمي اللغة الألمانية",
    },
    {
      name: "إدارة العمال من دون مهنة",
      icon: UserRound,
      href: "/admin/unskilled-workers",
      iconColor: "text-red-400",
      description: "إضافة وتعديل وحذف معلومات العمال",
    },
    {
      name: "إدارة معلمين الكهرباء",
      icon: UserRound,
      href: "/admin/electrician-teachers",
      iconColor: "text-yellow-400",
      description: "إضافة وتعديل وحذف معلومات معلمين كهرباء",
    },
    {
      name: "إدارة معلمين تمديدات صحية",
      icon: UserRound,
      href: "/admin/plumbers",
      iconColor: "text-cyan-400",
      description: "إضافة وتعديل وحذف معلومات معلمي تمديدات صحية",
    },
    {
      name: "إدارة معلمين الحدادة",
      icon: UserRound,
      href: "/admin/blacksmiths",
      iconColor: "text-gray-400",
      description: "إضافة وتعديل وحذف معلومات الحدادين",
    },
    {
      name: "إدارة معلمين التبليط",
      icon: UserRound,
      href: "/admin/tilers",
      iconColor: "text-teal-400",
      description: "إضافة وتعديل وحذف معلومات المبلطين",
    },
    {
      name: "إدارة مصلحين السيارات",
      icon: UserRound,
      href: "/admin/car-repairmen",
      iconColor: "text-purple-400",
      description: "إضافة وتعديل وحذف معلومات مصلحي السيارات",
    },
  ]
  const admingeneralsections = [
    {
      name: "إدارة فرص العمل",
      icon: Briefcase,
      href: "/admin/job-opportunities",
      iconColor: "text-yellow-400",
      description: "مراجعة والموافقة على فرص العمل المقدمة من المستخدمين",
    },
    {
      name: "إدارة الإشعارات",
      icon: Bell,
      href: "/admin/notifications",
      iconColor: "text-purple-400",
      description: "نشر إعلانات مهمة للمستخدمين",
    },
    {
      name: "إدارة المستخدمين",
      icon: UserRound,
      href: "/admin/users",
      iconColor: "text-green-400",
      description: "عرض وإدارة المستخدمين",
    },
  ]

  const quickStats = [
    { label: "إجمالي المستخدمين", value: (userCount ?? "N/A").toString(), icon: Users, color: "text-blue-400" },
    { label: "فرص العمل المتاحة", value: (jobOpportunityCount ?? "N/A").toString(), icon: Briefcase, color: "text-yellow-400" },
    { label: "فرص عمل بانتظار الموافقة", value: (pendingJobOpportunityCount ?? "N/A").toString(), icon: Briefcase, color: "text-orange-400" },
    { label: "إجمالي العمال", value: (workerCount ?? "N/A").toString(), icon: HardHat, color: "text-green-400" },
  ]

  return (
    <div dir="rtl" className="min-h-screen bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-linear-to-br from-purple-600 to-purple-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 text-white">


          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {quickStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <p className="text-xs text-purple-100">{stat.label}</p>
                  </div>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* general Section Title */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pb-5">
          {admingeneralsections.map((generalSection) => {
            const Icon = generalSection.icon
            return (
              <Link
                key={generalSection.href}
                href={generalSection.href}
                className="flex flex-col items-center gap-2 p-4 bg-[#2a2a2a] rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group"
              >
                <Icon className={`w-6 h-6 ${generalSection.iconColor || "text-gray-400"} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-center text-gray-400">{generalSection.name}</span>
              </Link>
            )
          })}
        </div>


        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">إدارة الأقسام</h2>
          <p className="text-gray-400 text-sm mt-1">إدارة جميع فئات المحترفين والخدمات</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="flex flex-col items-center gap-2 p-4 bg-[#2a2a2a] rounded-lg border border-gray-700 hover:border-blue-500 transition-colors group"
              >
                <Icon className={`w-6 h-6 ${section.iconColor || "text-gray-400"} group-hover:scale-110 transition-transform`} />
                <span className="text-xs text-center text-gray-400">{section.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
