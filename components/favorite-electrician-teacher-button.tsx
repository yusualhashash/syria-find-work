"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toggleElectricianTeacherFavorite } from "@/lib/electrician-teachers/electrician-teachers-favorites-actions"

interface FavoriteElectricianTeacherButtonProps {
    teacherId: string
    initialIsFavorited: boolean
    size?: "sm" | "md" | "lg"
}

export function FavoriteElectricianTeacherButton({ teacherId, initialIsFavorited, size = "md" }: FavoriteElectricianTeacherButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
    }

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    }

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        startTransition(async () => {
            const result = await toggleElectricianTeacherFavorite(teacherId);
            if (result.success) {
                setIsFavorited(result.isFavorited ?? false);
                router.refresh();
            } else {
                alert(result.error || "حدث خطأ أثناء حفظ المعلم");
            }
        })
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all ${isFavorited ? "bg-red-500 hover:bg-red-600" : "bg-gray-800 hover:bg-gray-700"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={isFavorited ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
            <Heart className={`${iconSizes[size]} ${isFavorited ? "fill-white text-white" : "text-white"}`} />
        </button>
    )
}
