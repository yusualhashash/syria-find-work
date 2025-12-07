// This replaces lib/arabic-teachers/arabic-teachers-actions.ts completely
// Delete the old file once this is tested and integrated

"use server"

import { ServiceProviderOps } from "@/lib/db/generic-service-provider"

const TABLE_NAME = "arabic_teachers"
const ADMIN_PATHS = ["/admin/arabic-teachers"]

// All these functions now just delegate to the generic system
export async function getArabicTeachers() {
  return ServiceProviderOps.getAll(TABLE_NAME)
}

export async function createArabicTeacher(formData: FormData) {
  return ServiceProviderOps.create(
    TABLE_NAME,
    {
      name: formData.get("name"),
      surname: formData.get("surname"),
      whatsapp_number: formData.get("whatsapp_number"),
      gender: formData.get("gender"),
      age: Number.parseInt(formData.get("age") as string),
      city: formData.get("city"),
      address: formData.get("address"),
      experience_years: Number.parseInt(formData.get("experience_years") as string),
      notes: formData.get("notes"),
    },
    ADMIN_PATHS,
  )
}

export async function updateArabicTeacher(id: string, formData: FormData) {
  return ServiceProviderOps.update(
    TABLE_NAME,
    id,
    {
      name: formData.get("name"),
      surname: formData.get("surname"),
      whatsapp_number: formData.get("whatsapp_number"),
      gender: formData.get("gender"),
      age: Number.parseInt(formData.get("age") as string),
      city: formData.get("city"),
      address: formData.get("address"),
      experience_years: Number.parseInt(formData.get("experience_years") as string),
      notes: formData.get("notes"),
    },
    ADMIN_PATHS,
  )
}

export async function deleteArabicTeacher(id: string) {
  return ServiceProviderOps.delete(TABLE_NAME, id, ADMIN_PATHS)
}

// Favorites are handled by generic system now
export async function checkIsArabicTeacherFavorited(id: string) {
  return ServiceProviderOps.isFavorited(TABLE_NAME, id)
}

export async function toggleArabicTeacherFavorite(id: string) {
  return ServiceProviderOps.toggleFavorite(TABLE_NAME, id)
}

export async function getFavoriteArabicTeachers() {
  return ServiceProviderOps.getFavorites(TABLE_NAME)
}
