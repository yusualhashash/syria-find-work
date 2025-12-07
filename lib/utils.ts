import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SYRIAN_CITIES = [
  "دمشق",
  "حلب",
  "إدلب",
  "ريف دمشق",
  "حمص",
  "حماة",
  "درعا",
  "اللاذقية",
  "دير الزور",
  "طرطوس",
  "الرقة",
  "الحسكة",
  "السويداء",
  "القنيطرة",
]
