// Replaces 10+ nearly identical files with one universal implementation

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

/**
 * Generic check if an item is favorited
 * Usage: checkIsFavorited('english_teachers', 'teacher-id')
 */
export async function checkIsFavorited(tableNameSingular: string, itemId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const supabase = await getSupabaseServerClient()
  const foreignKeyName = `${tableNameSingular}_id`

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq(foreignKeyName, itemId)
    .single()

  if (error && error.code !== "PGRST116") {
    console.error(`[v0] Error checking favorite status:`, error)
    return false
  }

  return !!data
}

/**
 * Generic add to favorites
 */
export async function addToFavorites(tableNameSingular: string, itemId: string, revalidatePaths?: string[]) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized: User not logged in")

  const supabase = await getSupabaseServerClient()
  const foreignKeyName = `${tableNameSingular}_id`

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    [foreignKeyName]: itemId,
  })

  if (error) {
    console.error("[v0] Error adding to favorites:", error)
    throw new Error("Failed to add to favorites")
  }

  // Revalidate paths if provided
  revalidatePaths?.forEach((path) => revalidatePath(path))

  return { success: true, isFavorited: true }
}

/**
 * Generic remove from favorites
 */
export async function removeFromFavorites(tableNameSingular: string, itemId: string, revalidatePaths?: string[]) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized: User not logged in")

  const supabase = await getSupabaseServerClient()
  const foreignKeyName = `${tableNameSingular}_id`

  const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq(foreignKeyName, itemId)

  if (error) {
    console.error("[v0] Error removing from favorites:", error)
    throw new Error("Failed to remove from favorites")
  }

  // Revalidate paths if provided
  revalidatePaths?.forEach((path) => revalidatePath(path))

  return { success: true, isFavorited: false }
}

/**
 * Generic toggle favorite status
 */
export async function toggleFavorite(
  tableNameSingular: string,
  itemId: string,
  revalidatePaths?: string[],
): Promise<{ success: boolean; isFavorited?: boolean; error?: string }> {
  try {
    const isFavorited = await checkIsFavorited(tableNameSingular, itemId)

    if (isFavorited) {
      return await removeFromFavorites(tableNameSingular, itemId, revalidatePaths)
    } else {
      return await addToFavorites(tableNameSingular, itemId, revalidatePaths)
    }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

/**
 * Get all favorites for current user
 * Usage: getFavorites('english_teachers')
 */
export async function getFavorites<T = any>(tableNameSingular: string): Promise<T[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = await getSupabaseServerClient()
  const foreignKeyName = `${tableNameSingular}_id`
  const joinTableName = `${tableNameSingular}s` // Handle pluralization

  const { data, error } = (await supabase
    .from("favorites")
    .select(`${joinTableName}(*)`)
    .eq("user_id", user.id)
    .not(foreignKeyName, "is", null)) as {
    data: { [key: string]: T | null }[] | null
    error: any
  }

  if (error) {
    console.error("[v0] Error fetching favorites:", error)
    return []
  }

  if (!data) return []

  // Extract nested items from favorites join
  return data
    .map((item: any) => {
      const nested = item[joinTableName]
      return nested
    })
    .filter(Boolean) as T[]
}
