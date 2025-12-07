// One file replaces 20+ nearly identical action files

import { getFromTable, createInTable, updateInTable, deleteFromTable } from "./generic-crud"
import { checkIsFavorited, toggleFavorite, getFavorites } from "./generic-favorites"

interface ServiceProvider {
  id: string
  name: string
  surname: string
  whatsapp_number: string
  city: string
  created_at: string
}

/**
 * Unified service provider operations
 * Pass the table name to work with any profession
 *
 * Usage:
 * - ServiceProviderOps.getAll("english_teachers")
 * - ServiceProviderOps.create("plumbers", formData)
 * - ServiceProviderOps.delete("tilers", id)
 */
export const ServiceProviderOps = {
  /**
   * Get all providers of a specific profession
   */
  async getAll<T extends ServiceProvider = ServiceProvider>(
    professionTableName: string,
    options?: { limit?: number; city?: string },
  ): Promise<T[]> {
    return getFromTable<T>(professionTableName, {
      select: "*",
      filter: options?.city ? { city: options.city } : undefined,
      orderBy: { column: "created_at", ascending: false },
      limit: options?.limit || 100,
    })
  },

  /**
   * Get single provider by ID
   */
  async getById<T extends ServiceProvider = ServiceProvider>(
    professionTableName: string,
    id: string,
  ): Promise<T | null> {
    const results = await getFromTable<T>(professionTableName, {
      filter: { id },
      limit: 1,
    })
    return results[0] || null
  },

  /**
   * Create new provider
   */
  async create<T extends ServiceProvider = ServiceProvider>(
    professionTableName: string,
    data: Partial<ServiceProvider>,
    adminPaths?: string[],
  ): Promise<T> {
    return createInTable<T>(professionTableName, data, {
      revalidatePaths: adminPaths,
      tableName: professionTableName,
    })
  },

  /**
   * Update provider
   */
  async update<T extends ServiceProvider = ServiceProvider>(
    professionTableName: string,
    id: string,
    data: Partial<ServiceProvider>,
    adminPaths?: string[],
  ): Promise<T> {
    return updateInTable<T>(professionTableName, id, data, {
      revalidatePaths: adminPaths,
      tableName: professionTableName,
    })
  },

  /**
   * Delete provider
   */
  async delete(professionTableName: string, id: string, adminPaths?: string[]): Promise<void> {
    return deleteFromTable(professionTableName, id, {
      revalidatePaths: adminPaths,
      tableName: professionTableName,
    })
  },

  /**
   * Check if provider is favorited by current user
   */
  async isFavorited(professionTableName: string, providerId: string): Promise<boolean> {
    // Convert table name to singular (english_teachers -> english_teacher)
    const singular = professionTableName.replace(/s$/, "")
    return checkIsFavorited(singular, providerId)
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(
    professionTableName: string,
    providerId: string,
  ): Promise<{ success: boolean; isFavorited?: boolean }> {
    const singular = professionTableName.replace(/s$/, "")
    const result = await toggleFavorite(singular, providerId, [`/${professionTableName}`, "/favorites"])
    return { success: result.success, isFavorited: result.isFavorited }
  },

  /**
   * Get user's favorite providers of a profession
   */
  async getFavorites<T extends ServiceProvider = ServiceProvider>(professionTableName: string): Promise<T[]> {
    const singular = professionTableName.replace(/s$/, "")
    return getFavorites<T>(singular)
  },
}
