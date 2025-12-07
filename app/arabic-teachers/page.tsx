import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getArabicTeachers } from "@/lib/arabic-teachers/arabic-teachers-actions"
import { checkIsArabicTeacherFavorited } from "@/lib/arabic-teachers/arabic-teachers-favorites-actions"
import ArabicTeachersClient from "./arabic-teachers-client"
import type { ArabicTeacher } from "./arabic-teacher-types"

interface ArabicTeacherWithFavorite extends ArabicTeacher {
  isFavorited: boolean
}

export default async function ArabicTeachersPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const teachersData = await getArabicTeachers()
  const teachersWithFavorites: ArabicTeacherWithFavorite[] = await Promise.all(
    teachersData.map(async (teacher: ArabicTeacher) => ({
      ...teacher,
      isFavorited: await checkIsArabicTeacherFavorited(teacher.id),
    })),
  )

  return <ArabicTeachersClient initialTeachers={teachersWithFavorites} />
}
