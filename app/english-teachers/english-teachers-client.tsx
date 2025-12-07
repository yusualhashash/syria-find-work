"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SYRIAN_CITIES } from "@/lib/utils"
import { UserRound, MapPin, Phone, BookOpenText, ArrowLeft, Home, Cake, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import type { EnglishTeacher } from "./english-teacher-types"
import { FavoriteEnglishTeacherButton } from "@/components/favorite-english-teacher-button"
import { Button } from "@/components/ui/button" // Import Button

interface EnglishTeacherWithFavorite extends EnglishTeacher {
    isFavorited: boolean
}

export default function EnglishTeachersClient({ initialTeachers }: { initialTeachers: EnglishTeacherWithFavorite[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCity, setSelectedCity] = useState<string | null>(null)
    const [allTeachers, setAllTeachers] = useState<EnglishTeacherWithFavorite[]>(initialTeachers)

    const filteredTeachers = useMemo(() => {
        return allTeachers.filter((teacher) => {
            const matchesSearchTerm = teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.surname?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCity = selectedCity ? teacher.city === selectedCity : true
            return matchesSearchTerm && matchesCity
        })
    }, [allTeachers, searchTerm, selectedCity])

    return (
        <div dir="rtl" className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto p-4 md:p-6">
                {/* Header + Sticky Search */}
                <div className="sticky top-0 z-20 bg-black pb-3 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-4">
                            <Link href="/home" className="p-0 hover:bg-gray-800 rounded-lg transition-colors">
                                <ArrowRight className="w-6 h-6 text-white" />
                            </Link>
                            <div className="flex items-center gap-2">
                                <UserRound className="w-6 h-6 text-white" />
                                <h1 className="text-xl md:text-2xl font-bold text-white"> مدرسين لغة إنجليزية </h1>
                            </div>
                        </div>
                    </div>

                    {/* Search Input (sticks under the header) */}
                    <div className="px-1 md:px-2 pb-2">
                        <Input
                            type="text"
                            placeholder="🔍 البحث بالاسم أو الكنية..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>

                    {/* City Filter */}
                    <div className="px-1 md:px-2 pb-2">
                        <Select onValueChange={(value) => setSelectedCity(value === "all" ? null : value)}>
                            <SelectTrigger className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
                                <SelectValue placeholder="اختر المدينة..." />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 text-white border border-gray-700">
                                <SelectItem value="all">كل المدن</SelectItem>
                                {SYRIAN_CITIES.map((city) => (
                                    <SelectItem key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* English Teacher List */}
                {filteredTeachers.length === 0 ? (
                    <div className="text-center py-12 pt-4">
                        <UserRound className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">لا يوجد مدرسين لغة انجليزية متاحين حالياً</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                        {filteredTeachers.map((teacher) => (
                            <Link key={teacher.id} href={`/english-teachers/${teacher.id}`} className="h-full">
                                <div className="bg-gray-900 border border-gray-700 rounded-none overflow-hidden transition-shadow h-full flex flex-col relative">
                                    <div className="absolute top-2 left-2 z-10">
                                        <FavoriteEnglishTeacherButton
                                            teacherId={teacher.id}
                                            initialIsFavorited={teacher.isFavorited}
                                            size="sm"
                                        />
                                    </div>

                                    <div className="p-2 md:p-6 grow flex flex-col">
                                        <div className="mb-2">
                                            <img
                                                src={teacher.gender === "male" ? "/men.png" : "/woman.png"}
                                                alt={teacher.gender === "male" ? "Male Teacher" : "Female Teacher"}
                                                className="w-full h-36 object-cover bg-gray-800 mb-2"
                                            />
                                            <h3 className="text-lg md:text-xl font-bold text-white text-center">{teacher.name} {teacher.surname}</h3>
                                        </div>
                                        <div className="space-y-1 md:space-y-2 mt-auto">
                                            {teacher.city && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">{teacher.city}</span>
                                                </div>
                                            )}
                                            {teacher.address && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Home className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">{teacher.address}</span>
                                                </div>
                                            )}
                                            {teacher.age && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Cake className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">{teacher.age} سنة</span>
                                                </div>
                                            )}
                                            {teacher.whatsapp_number && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">{teacher.whatsapp_number}</span>
                                                </div>
                                            )}
                                            {teacher.experience_years && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <BookOpenText className="w-3 h-3 md:w-4 md:h-4" />
                                                    <span className="text-xs md:text-sm">خبرة: {teacher.experience_years} سنوات</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
