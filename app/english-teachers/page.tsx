import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import { getEnglishTeachers } from "@/lib/english-techers/english-teachers-actions"
import { checkIsEnglishTeacherFavorited } from "@/lib/english-techers/english-teachers-favorites-actions"
import EnglishTeachersClient from "./english-teachers-client"
import type { EnglishTeacher } from "./english-teacher-types"

interface EnglishTeacherWithFavorite extends EnglishTeacher {
    isFavorited: boolean
}

export default async function EnglishTeachersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const teachersData = await getEnglishTeachers()
    const teachersWithFavorites: EnglishTeacherWithFavorite[] = await Promise.all(
        teachersData.map(async (teacher: EnglishTeacher) => ({
            ...teacher,
            isFavorited: await checkIsEnglishTeacherFavorited(teacher.id),
        }))
    )

    return <EnglishTeachersClient initialTeachers={teachersWithFavorites} />
}
