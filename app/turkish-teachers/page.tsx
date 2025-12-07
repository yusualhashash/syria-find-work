import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import { getTurkishTeachers } from "@/lib/turkish-teachers/turkish-teachers-actions"
import { checkIsTurkishTeacherFavorited } from "@/lib/turkish-teachers/turkish-teachers-favorites-actions"

import type { TurkishTeacher } from "./turkish-teacher-types"
import TurkishTeachersClient from "./turkish-teachers-client"

interface TurkishTeacherWithFavorite extends TurkishTeacher {
    isFavorited: boolean
}

export default async function TurkishTeachersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const teachersData = await getTurkishTeachers()
    const teachersWithFavorites: TurkishTeacherWithFavorite[] = await Promise.all(
        teachersData.map(async (teacher: TurkishTeacher) => ({
            ...teacher,
            isFavorited: await checkIsTurkishTeacherFavorited(teacher.id),
        }))
    )

    return <TurkishTeachersClient initialTeachers={teachersWithFavorites} />
}
