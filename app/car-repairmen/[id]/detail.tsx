"use client"


import { Card } from "@/components/ui/card"
import { ArrowRight, Calendar, Home, MapPin, MessageCircle, StickyNote, User } from "lucide-react"
import Link from "next/link"
import type { CarRepairman } from "../car-repairman-types"
import { FavoriteCarRepairmanButton } from "@/components/favorite-car-repairman-button"

interface CarRepairmanDetailProps {
    carRepairman: CarRepairman
    isFavorited: boolean
}

export default function CarRepairmanDetail({ carRepairman, isFavorited }: CarRepairmanDetailProps) {
    const phoneNumber = carRepairman.whatsapp_number.replace(/\D/g, "")
    const whatsappLink = `https://wa.me/${phoneNumber}`
    const message = encodeURIComponent(`مرحباً، أحتاج للاستفسار عن ${carRepairman.name} ${carRepairman.surname}`)
    const whatsappLinkWithMessage = `${whatsappLink}?text=${message}`

    const repairman = carRepairman

    return (
        <div dir="rtl" className="min-h-screen bg-[#1a1a1a]">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/car-repairmen" className="p-0 hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Link>
                        <h1 className="text-xl font-bold text-white">تفاصيل المصلح</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <FavoriteCarRepairmanButton repairmanId={repairman.id} initialIsFavorited={isFavorited} size="md" />
                    </div>
                </div>

                {/* Repairman Card */}
                <Card className="p-6 bg-[#2a2a2a] border-gray-700">
                    <div className="flex flex-col items-center text-center mb-6">
                        <img
                            src={repairman.gender === "male" ? "/men.png" : "/woman.png"}
                            alt="Repairman"
                            className="w-24 h-24 rounded-full bg-gray-800 object-cover mb-3"
                        />

                        <h2 className="text-2xl font-bold text-white mb-1">
                            {repairman.name} {repairman.surname}
                        </h2>

                        <p className="text-gray-400">مصلح سيارات</p>
                    </div>

                    <div className="space-y-4">

                        {/* City */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <MapPin className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">المدينة</p>
                                <p className="text-white font-medium">{repairman.city}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <Home className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">العنوان</p>
                                <p className="text-white font-medium">{repairman.address}</p>
                            </div>
                        </div>

                        {/* Gender & Age */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <User className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">العمر</p>
                                <p className="text-white font-medium">
                                    {repairman.age} سنة
                                </p>
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <Calendar className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">سنوات الخبرة</p>
                                <p className="text-white font-medium">{repairman.experience_years} سنة</p>
                            </div>
                        </div>

                        {/* Notes */}
                        {repairman.notes && (
                            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                                <StickyNote className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">ملاحظات إضافية</p>
                                    <p className="text-white">{repairman.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* WhatsApp Button */}
                <a
                    href={whatsappLinkWithMessage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                >
                    <MessageCircle className="h-6 w-6" />
                    تواصل عبر الواتساب
                </a>
            </div>
        </div>
    )
}
