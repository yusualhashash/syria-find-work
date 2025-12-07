"use client"

import { FavoriteBlacksmithButton } from "@/components/favorite-blacksmith-button"
import { Card } from "@/components/ui/card"
import { ArrowRight, MapPin, Home, Phone, Cake, BookOpenText, UserRound } from "lucide-react"
import Link from "next/link"
import type { Blacksmith } from "../blacksmith-types"

interface BlacksmithDetailProps {
    blacksmith: Blacksmith
    isFavorited: boolean
}

export default function BlacksmithDetail({ blacksmith, isFavorited }: BlacksmithDetailProps) {
    const phoneNumber = blacksmith.whatsapp_number?.replace(/\D/g, "")
    const whatsappLink = phoneNumber ? `https://wa.me/${phoneNumber}` : null
    const message = encodeURIComponent(`مرحباً، أحتاج للاستفسار عن ${blacksmith.name} ${blacksmith.surname}`)
    const whatsappLinkWithMessage = whatsappLink ? `${whatsappLink}?text=${message}` : null

    const smith = blacksmith

    return (
        <div dir="rtl" className="min-h-screen bg-[#1a1a1a]">
            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/blacksmiths" className="p-0 hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Link>
                        <h1 className="text-xl font-bold text-white">تفاصيل الحداد</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <FavoriteBlacksmithButton blacksmithId={smith.id} initialIsFavorited={isFavorited} size="md" />
                    </div>
                </div>

                {/* Blacksmith Card */}
                <Card className="p-6 bg-[#2a2a2a] border-gray-700">
                    <div className="flex flex-col items-center text-center mb-6">
                        <img
                            src={smith.gender === "male" ? "/men.png" : "/woman.png"}
                            alt="Tiler"
                            className="w-24 h-24 rounded-full bg-gray-800 object-cover mb-3"
                        />

                        <h2 className="text-2xl font-bold text-white mb-1">
                            {smith.name} {smith.surname}
                        </h2>

                        <p className="text-gray-400">حداد</p>
                    </div>

                    <div className="space-y-4">
                        {/* City */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <MapPin className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">المدينة</p>
                                <p className="text-white font-medium">{smith.city}</p>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <Home className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">العنوان</p>
                                <p className="text-white font-medium">{smith.address}</p>
                            </div>
                        </div>


                        {/* Age */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <UserRound className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">العمر</p>
                                <p className="text-white font-medium">{smith.age} سنة</p>
                            </div>
                        </div>


                        {/* Experience */}
                        <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                            <BookOpenText className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-400 mb-1">سنوات الخبرة</p>
                                <p className="text-white font-medium">{smith.experience_years} سنة</p>
                            </div>
                        </div>


                        {/* Notes */}
                        {smith.notes && (
                            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                                <BookOpenText className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">ملاحظات إضافية</p>
                                    <p className="text-white">{smith.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* WhatsApp Button */}
                {whatsappLinkWithMessage && (
                    <a
                        href={whatsappLinkWithMessage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                    >
                        <Phone className="h-6 w-6" />
                        تواصل عبر الواتساب
                    </a>
                )}
            </div>
        </div>
    )
}
