"use client"

import { ArrowRight, Heart, UserRound } from "lucide-react"
import Link from "next/link"
import { useState } from "react"


import { FavoriteArabicTeacherButton } from "@/components/favorite-arabic-teacher-button"
import { FavoriteBlacksmithButton } from "@/components/favorite-blacksmith-button"
import { FavoriteEnglishTeacherButton } from "@/components/favorite-english-teacher-button"
import { FavoriteTilerButton } from "@/components/favorite-tiler-button"
import { FavoriteTurkishTeacherButton } from "@/components/favorite-turkish-teacher-button"
import { FavoriteUnskilledWorkerButton } from "@/components/favorite-unskilled-worker-button"
import { FavoriteElectricianTeacherButton } from "@/components/favorite-electrician-teacher-button"
import { FavoriteCarRepairmanButton } from "@/components/favorite-car-repairman-button"
import { FavoriteGermanTeacherButton } from "@/components/favorite-german-teacher-button"
import { FavoritePlumberButton } from "@/components/favorite-plumber-button"
import FavoritesList from "./FavoritesList"
import { FavoritesClientProps } from "./favorite-types"

export default function FavoritesPageClient({ englishTeachers, arabicTeachers, turkishTeachers, blacksmiths, tilers, unskilledWorkers, electricianTeachers, carRepairmen, germanTeachers, plumbers }: FavoritesClientProps) {
    const [activeTab, setActiveTab] = useState("english-teachers")

    const tabs = [
        { id: "english-teachers", label: " مدرسين اللغة الانجليزية", count: englishTeachers.length },
        { id: "turkish-teachers", label: "  مدرسين اللغة التركية", count: turkishTeachers.length },
        { id: "german-teachers", label: "مدرسين اللغة الألمانية", count: germanTeachers.length },
        { id: "arabic-teachers", label: "  مدرسين اللغة العربية", count: arabicTeachers.length },
        { id: "unskilled-workers", label: "عمال", count: unskilledWorkers.length },
        { id: "electrician-teachers", label: "معلمين كهرباء", count: electricianTeachers.length },
        { id: "plumbers", label: "معلمين تمديدات صحية", count: plumbers.length },
        { id: "blacksmiths", label: "معلمين حداده", count: blacksmiths.length },
        { id: "tilers", label: "معلمين تبليط", count: tilers.length },
        { id: "car-repairmen", label: "مصلحين سيارات", count: carRepairmen.length },
    ]

    return (
        <div dir="rtl" className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto p-4 md:p-6">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/home" className="p-2 hover:bg-gray-800 rounded-lg">
                        <ArrowRight className="w-6 h-6 text-white" />
                    </Link>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                            <h1 className="text-xl md:text-2xl font-bold text-white">المفضلة</h1>
                        </div>
                        <p className="text-sm text-gray-300">إدارة المفضلة لجميع الأقسام</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-6 border-b border-gray-700 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? "text-white border-b-2 border-white"
                                : "text-gray-400 hover:text-gray-300"
                                }`}
                        >
                            <div className="flex items-center gap-1 md:gap-2">
                                <UserRound className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="text-sm md:text-base">
                                    {tab.label} ({tab.count})
                                </span>
                            </div>
                        </button>
                    ))}
                </div>


                {/* Content */}
                {activeTab === "english-teachers" && (
                    <FavoritesList
                        items={englishTeachers}
                        title="مدرسين اللغة الإنجليزية"
                        browseLink="/english-teachers"
                        baseUrl="english-teachers"
                        FavoriteButton={(id) => (
                            <FavoriteEnglishTeacherButton teacherId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "turkish-teachers" && (
                    <FavoritesList
                        items={turkishTeachers}
                        title="مدرسين اللغة التركية"
                        browseLink="/turkish-teachers"
                        baseUrl="turkish-teachers"
                        FavoriteButton={(id) => (
                            <FavoriteTurkishTeacherButton teacherId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "german-teachers" && (
                    <FavoritesList
                        items={germanTeachers}
                        title="مدرسين اللغة الألمانية"
                        browseLink="/german-teachers"
                        baseUrl="german-teachers"
                        FavoriteButton={(id) => (
                            <FavoriteGermanTeacherButton teacherId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "arabic-teachers" && (
                    <FavoritesList
                        items={arabicTeachers}
                        title="مدرسين اللغة العربية"
                        browseLink="/arabic-teachers"
                        baseUrl="arabic-teachers"
                        FavoriteButton={(id) => (
                            <FavoriteArabicTeacherButton teacherId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "unskilled-workers" && (
                    <FavoritesList
                        items={unskilledWorkers}
                        title="العمال من دون مهنة"
                        browseLink="/unskilled-workers"
                        baseUrl="unskilled-workers"
                        FavoriteButton={(id) => (
                            <FavoriteUnskilledWorkerButton unskilledWorkerId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "electrician-teachers" && (
                    <FavoritesList
                        items={electricianTeachers}
                        title="معلمين كهرباء"
                        browseLink="/electrician-teachers"
                        baseUrl="electrician-teachers"
                        FavoriteButton={(id) => (
                            <FavoriteElectricianTeacherButton teacherId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "plumbers" && (
                    <FavoritesList
                        items={plumbers}
                        title="معلمين تمديدات صحية"
                        browseLink="/plumbers"
                        baseUrl="plumbers"
                        FavoriteButton={(id) => (
                            <FavoritePlumberButton plumberId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "blacksmiths" && (
                    <FavoritesList
                        items={blacksmiths}
                        title="معلمين حداده"
                        browseLink="/blacksmiths"
                        baseUrl="blacksmiths"
                        FavoriteButton={(id) => (
                            <FavoriteBlacksmithButton blacksmithId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "tilers" && (
                    <FavoritesList
                        items={tilers}
                        title="معلمين  تبليط"
                        browseLink="/tilers"
                        baseUrl="tilers"
                        FavoriteButton={(id) => (
                            <FavoriteTilerButton tilerId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}

                {activeTab === "car-repairmen" && (
                    <FavoritesList
                        items={carRepairmen}
                        title="مصلحين سيارات"
                        browseLink="/car-repairmen"
                        baseUrl="car-repairmen"
                        FavoriteButton={(id) => (
                            <FavoriteCarRepairmanButton repairmanId={id} initialIsFavorited size="sm" />
                        )}
                    />
                )}
            </div>
        </div>
    )
}
