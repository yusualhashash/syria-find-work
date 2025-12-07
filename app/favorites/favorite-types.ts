import type { EnglishTeacher } from "@/app/english-teachers/english-teacher-types"
import type { ArabicTeacher } from "@/app/arabic-teachers/arabic-teacher-types"
import type { TurkishTeacher } from "@/app/turkish-teachers/turkish-teacher-types"
import type { Blacksmith } from "@/app/blacksmiths/blacksmith-types"
import type { Tiler } from "@/app/tilers/tiler-types" // Import Tiler
import type { UnskilledWorker } from "@/app/unskilled-workers/unskilled-worker-types"
import type { ElectricianTeacher } from "@/app/electrician-teachers/electrician-teacher-types"
import type { CarRepairman } from "@/app/car-repairmen/car-repairman-types"
import type { GermanTeacher } from "@/app/german-teachers/german-teacher-types"
import type { Plumber } from "@/app/plumbers/plumber-types"

interface EnglishTeacherWithFavorite extends EnglishTeacher {
  isFavorited: boolean
}

interface ArabicTeacherWithFavorite extends ArabicTeacher {
  isFavorited: boolean
}

interface TurkishTeacherWithFavorite extends TurkishTeacher {
  isFavorited: boolean
}

interface BlacksmithWithFavorite extends Blacksmith {
  isFavorited: boolean
}

interface TilerWithFavorite extends Tiler {
  isFavorited: boolean
}

interface UnskilledWorkerWithFavorite extends UnskilledWorker {
  isFavorited: boolean
}

interface ElectricianTeacherWithFavorite extends ElectricianTeacher {
  isFavorited: boolean
}

interface CarRepairmanWithFavorite extends CarRepairman {
  isFavorited: boolean
}

interface GermanTeacherWithFavorite extends GermanTeacher {
  isFavorited: boolean
}

interface PlumberWithFavorite extends Plumber {
  isFavorited: boolean
}

export interface FavoritesClientProps {
  englishTeachers: EnglishTeacherWithFavorite[]
  arabicTeachers: ArabicTeacherWithFavorite[]
  turkishTeachers: TurkishTeacherWithFavorite[]
  blacksmiths: BlacksmithWithFavorite[]
  tilers: TilerWithFavorite[] // Add Tilers
  unskilledWorkers: UnskilledWorkerWithFavorite[]
  electricianTeachers: ElectricianTeacherWithFavorite[]
  carRepairmen: CarRepairmanWithFavorite[]
  germanTeachers: GermanTeacherWithFavorite[]
  plumbers: PlumberWithFavorite[]
}
