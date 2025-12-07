import { getSession } from "@/lib/server-actions"
import { redirect } from "next/navigation"

import { getFavoriteEnglishTeachers } from "@/lib/english-techers/english-teachers-favorites-actions"
import { getFavoriteArabicTeachers } from "@/lib/arabic-teachers/arabic-teachers-favorites-actions"
import { getFavoriteTurkishTeachers } from "@/lib/turkish-teachers/turkish-teachers-favorites-actions"
import { getFavoriteBlacksmiths } from "@/lib/blacksmiths/blacksmiths-favorites-actions"
import { getFavoriteTilers } from "@/lib/tilers/tilers-favorites-actions"
import { getFavoriteUnskilledWorkers } from "@/lib/unskilled-workers/unskilled-workers-favorites-actions"
import { getFavoriteElectricianTeachers } from "@/lib/electrician-teachers/electrician-teachers-favorites-actions"
import { getFavoriteCarRepairmen } from "@/lib/car-repairmen/car-repairmen-favorites-actions"
import { getFavoriteGermanTeachers } from "@/lib/german-teachers/german-teachers-favorites-actions"
import { getFavoritePlumbers } from "@/lib/plumbers/plumbers-favorites-actions"

import type { EnglishTeacher } from "../english-teachers/english-teacher-types"
import type { ArabicTeacher } from "../arabic-teachers/arabic-teacher-types"
import type { TurkishTeacher } from "../turkish-teachers/turkish-teacher-types"
import type { Blacksmith } from "../blacksmiths/blacksmith-types"
import type { Tiler } from "../tilers/tiler-types"
import type { UnskilledWorker } from "../unskilled-workers/unskilled-worker-types"
import type { ElectricianTeacher } from "../electrician-teachers/electrician-teacher-types"
import type { CarRepairman } from "../car-repairmen/car-repairman-types"
import type { GermanTeacher } from "../german-teachers/german-teacher-types"
import type { Plumber } from "../plumbers/plumber-types"
import FavoritesPageClient from "./FavoritesPageClient"

// Generic mapper
function markFavorited<T extends { id: string }>(items: T[]) {
  return items.map((item) => ({
    ...item,
    isFavorited: true,
  }))
}

export default async function FavoritesPage() {
  const userId = await getSession()
  if (!userId) redirect("/login")

  // Fetch all favorites in parallel (faster)
  const [
    favoriteEnglishTeachers,
    favoriteArabicTeachers,
    favoriteTurkishTeachers,
    favoriteBlacksmiths,
    favoriteTilers,
    favoriteUnskilledWorkers,
    favoriteElectricianTeachers,
    favoriteCarRepairmen,
    favoriteGermanTeachers,
    favoritePlumbers,
  ] = await Promise.all([
    getFavoriteEnglishTeachers(),
    getFavoriteArabicTeachers(),
    getFavoriteTurkishTeachers(),
    getFavoriteBlacksmiths(),
    getFavoriteTilers(),
    getFavoriteUnskilledWorkers(),
    getFavoriteElectricianTeachers(),
    getFavoriteCarRepairmen(),
    getFavoriteGermanTeachers(),
    getFavoritePlumbers(),
  ])

  return (
    <FavoritesPageClient
      englishTeachers={markFavorited<EnglishTeacher>(favoriteEnglishTeachers)}
      arabicTeachers={markFavorited<ArabicTeacher>(favoriteArabicTeachers)}
      turkishTeachers={markFavorited<TurkishTeacher>(favoriteTurkishTeachers)}
      blacksmiths={markFavorited<Blacksmith>(favoriteBlacksmiths)}
      tilers={markFavorited<Tiler>(favoriteTilers)}
      unskilledWorkers={markFavorited<UnskilledWorker>(favoriteUnskilledWorkers)}
      electricianTeachers={markFavorited<ElectricianTeacher>(favoriteElectricianTeachers)}
      carRepairmen={markFavorited<CarRepairman>(favoriteCarRepairmen)}
      germanTeachers={markFavorited<GermanTeacher>(favoriteGermanTeachers)}
      plumbers={markFavorited<Plumber>(favoritePlumbers)}
    />
  )
}
