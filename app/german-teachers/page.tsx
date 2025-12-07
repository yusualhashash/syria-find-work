import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getGermanTeachers } from "@/lib/german-teachers/german-teachers-actions"
import GermanTeachersClient from "./german-teachers-client"
import type { GermanTeacher } from "./german-teacher-types"
import { checkIsGermanTeacherFavorited } from "@/lib/german-teachers/german-teachers-favorites-actions"



interface GermanTeacherWithFavorite extends GermanTeacher {
    isFavorited: boolean
}

export default async function GermanTeachersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const teachersData = await getGermanTeachers()
    const teachersWithFavorites: GermanTeacherWithFavorite[] = await Promise.all(
        teachersData.map(async (teacher: GermanTeacher) => ({
            ...teacher,
            isFavorited: await checkIsGermanTeacherFavorited(teacher.id),
        })),
    )

    return <GermanTeachersClient initialTeachers={teachersWithFavorites} />
}
