"use client"


import { Card } from "@/components/ui/card"
import { ArrowRight, Calendar, Home, MapPin, MessageCircle, StickyNote, User } from "lucide-react"
import Link from "next/link"
import type { Plumber } from "../plumber-types"
import { FavoritePlumberButton } from "@/components/favorite-plumber-button"

interface PlumberDetailProps {
    plumber: Plumber
    isFavorited: boolean
}

export default function PlumberDetail({ plumber, isFavorited }: PlumberDetailProps) {
    const phoneNumber = plumber.whatsapp_number.replace(/\D/g, "")
    const whatsappLink = `https://wa.me/${phoneNumber}`
    const message = encodeURIComponent(`مرحباً، أحتاج للاستفسار عن ${plumber.name} ${plumber.surname}`)
    const whatsappLinkWithMessage = `${whatsappLink}?text=${message}`

    const currentPlumber = plumber

    return (
        <div dir="rtl" className="min-h-screen bg-[#1a1a1a]">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/plumbers" className="p-0 hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Link>
                        <h1 className="text-xl font-bold text-white">تفاصيل المعلم</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <FavoritePlumberButton plumberId={currentPlumber.id} initialIsFavorited={isFavorited} size="md" />
                    </div>
                </div>

                {/* Plumber Card */}
                <Card className="p-6 bg-[#2a2a2a] border-gray-700">
                    <div className="flex flex-col items-center text-center mb-6">
                        <img
                            src={currentPlumber.gender === "male" ? "/men.png" : "/woman.png"}
                            alt="Plumber"
                            className="w-24 h-24 rounded-full bg-gray-800 object-cover mb-3"
                        />

                        <h2 className="text-2xl font-bold text-white mb-1">
                            {currentPlumber.name} {currentPlumber.surname}
                        </h2>

                        <p className="text-gray-400">{currentPlumber.gender === "male" ? "معلم تمديدات صحية" : "معلمة تمديدات صحية"}
                        </p>
                    </div>

                    <div className="space-y-4">

                        {/* City */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <MapPin className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">المدينة</p>
                                <p className="text-white font-medium">{currentPlumber.city}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <Home className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">العنوان</p>
                                <p className="text-white font-medium">{currentPlumber.address}</p>
                            </div>
                        </div>

                        {/* Gender & Age */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <User className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">العمر</p>
                                <p className="text-white font-medium">
                                    {currentPlumber.age} سنة
                                </p>
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <Calendar className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">سنوات الخبرة</p>
                                <p className="text-white font-medium">{currentPlumber.experience_years} سنة</p>
                            </div>
                        </div>

                        {/* Notes */}
                        {currentPlumber.notes && (
                            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                                <StickyNote className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">ملاحظات إضافية</p>
                                    <p className="text-white">{currentPlumber.notes}</p>
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
