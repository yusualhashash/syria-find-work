// Replace scattered type definitions with one source of truth

export interface ServiceProvider {
  id: string
  name: string
  surname: string
  phone_number?: string
  whatsapp_number: string
  gender?: string
  age?: number
  city: string
  address?: string
  experience_years?: number
  notes?: string
  created_at: string
  updated_at?: string
  created_by?: string
}

export interface ServiceProviderWithFavorite extends ServiceProvider {
  isFavorited?: boolean
}

export type ProfessionType =
  | "english_teachers"
  | "arabic_teachers"
  | "german_teachers"
  | "turkish_teachers"
  | "plumbers"
  | "electrician_teachers"
  | "blacksmiths"
  | "car_repairmen"
  | "tilers"
  | "unskilled_workers"

export const PROFESSION_NAMES: Record<ProfessionType, string> = {
  english_teachers: "معلمو الإنجليزية",
  arabic_teachers: "معلمو اللغة العربية",
  german_teachers: "معلمو الألمانية",
  turkish_teachers: "معلمو التركية",
  plumbers: "السباكون",
  electrician_teachers: "معلمو الكهربائيين",
  blacksmiths: "الحدادون",
  car_repairmen: "مصلحو السيارات",
  tilers: "البلاطون",
  unskilled_workers: "العمال غير المهرة",
}
