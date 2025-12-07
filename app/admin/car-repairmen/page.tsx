import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Plus, UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarRepairmenList from "./car-repairmen-list"



export default async function AdminCarRepairmenPage() {
    const user = await getCurrentUser()

    if (!user) redirect("/login")
    if (!user.is_admin) redirect("/home")

    return (
        <div dir="rtl" className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 pb-20">
            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                        {/* ===== Header Section ===== */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            <Link
                                href="/admin"
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                            </Link>

                            <div>
                                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                    <UserRoundPlus className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                                    <h1 className="text-md sm:text-xl font-bold text-gray-900">
                                        إدارة مصلحين السيارات
                                    </h1>
                                </div>

                                <p className="text-sm sm:text-base text-gray-600">
                                    إضافة، تعديل وحذف معلومات المصلحين
                                </p>
                            </div>
                        </div>

                        <Link href="/admin/car-repairmen/new" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                                <Plus className="ml-2 h-4 w-4" />
                                إضافة مصلح جديد
                            </Button>
                        </Link>
                    </div>

                    <CarRepairmenList />
                </div>
            </div>
        </div>
    )
}
