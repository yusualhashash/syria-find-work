import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getElectricianTeachers } from "@/lib/electrician-teachers/electrician-teachers-actions"
import ElectricianTeachersClient from "./electrician-teachers-client"
import type { ElectricianTeacher } from "./electrician-teacher-types"
import { checkIsElectricianTeacherFavorited } from "@/lib/electrician-teachers/electrician-teachers-favorites-actions"

interface ElectricianTeacherWithFavorite extends ElectricianTeacher {
    isFavorited: boolean
}

export default async function ElectricianTeachersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const teachersData = await getElectricianTeachers()
    const teachersWithFavorites: ElectricianTeacherWithFavorite[] = await Promise.all(
        teachersData.map(async (teacher: ElectricianTeacher) => ({
            ...teacher,
            isFavorited: await checkIsElectricianTeacherFavorited(teacher.id),
        })),
    )

    return <ElectricianTeachersClient initialTeachers={teachersWithFavorites} />
}
