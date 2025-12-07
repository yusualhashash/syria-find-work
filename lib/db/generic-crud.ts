// Reduces codebase by ~70% for data operations

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

interface CrudOperationOptions {
  revalidatePaths?: string[]
  tableName: string
}

/**
 * Generic GET operation for any table
 * Usage: getFromTable('teachers', { filter: { city: 'Damascus' } })
 */
export async function getFromTable<T = any>(
  tableName: string,
  options?: {
    select?: string
    filter?: Record<string, any>
    orderBy?: { column: string; ascending: boolean }
    limit?: number
  },
): Promise<T[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase.from(tableName).select(options?.select || "*")

  // Apply filters
  if (options?.filter) {
    Object.entries(options.filter).forEach(([key, value]) => {
      query = query.eq(key, value) as any
    })
  }

  // Apply ordering
  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending,
    }) as any
  }

  // Apply limit
  if (options?.limit) {
    query = query.limit(options.limit) as any
  }

  const { data, error } = await query

  if (error) throw error
  return (data as T[]) || []
}

/**
 * Generic CREATE operation for any table
 * Usage: createInTable('teachers', formData, { revalidatePaths: ['/admin/teachers'] })
 */
export async function createInTable<T = any>(
  tableName: string,
  data: Record<string, any>,
  crudOptions?: CrudOperationOptions,
): Promise<T> {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized: User not logged in")

  const supabase = await getSupabaseServerClient()

  // Add metadata
  const insertData = {
    ...data,
    created_by: user.id,
    created_at: new Date().toISOString(),
  }

  const { data: result, error } = await supabase.from(tableName).insert(insertData).select().single()

  if (error) throw error

  // Revalidate specified paths
  if (crudOptions?.revalidatePaths) {
    crudOptions.revalidatePaths.forEach((path) => revalidatePath(path))
  }

  return result as T
}

/**
 * Generic UPDATE operation for any table
 * Usage: updateInTable('teachers', id, formData, { revalidatePaths: ['/admin/teachers'] })
 */
export async function updateInTable<T = any>(
  tableName: string,
  id: string,
  data: Record<string, any>,
  crudOptions?: CrudOperationOptions,
): Promise<T> {
  const supabase = await getSupabaseServerClient()

  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  const { data: result, error } = await supabase.from(tableName).update(updateData).eq("id", id).select().single()

  if (error) throw error

  // Revalidate specified paths (only once for efficiency)
  if (crudOptions?.revalidatePaths) {
    crudOptions.revalidatePaths.forEach((path) => revalidatePath(path))
  }

  return result as T
}

/**
 * Generic DELETE operation for any table
 * Usage: deleteFromTable('teachers', id, { revalidatePaths: ['/admin/teachers'] })
 */
export async function deleteFromTable(
  tableName: string,
  id: string,
  crudOptions?: CrudOperationOptions,
): Promise<void> {
  const user = await getCurrentUser()
  if (!user || !user.is_admin) throw new Error("Unauthorized: Admin only")

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from(tableName).delete().eq("id", id)

  if (error) throw error

  // Revalidate specified paths (only once for efficiency)
  if (crudOptions?.revalidatePaths) {
    crudOptions.revalidatePaths.forEach((path) => revalidatePath(path))
  }
}

/**
 * Bulk DELETE operation for efficient admin operations
 * Usage: bulkDeleteFromTable('jobs', ['id1', 'id2', 'id3'])
 */
export async function bulkDeleteFromTable(
  tableName: string,
  ids: string[],
  crudOptions?: CrudOperationOptions,
): Promise<void> {
  if (ids.length === 0) return

  const user = await getCurrentUser()
  if (!user || !user.is_admin) throw new Error("Unauthorized: Admin only")

  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from(tableName).delete().in("id", ids)

  if (error) throw error

  // Single revalidation for all items
  if (crudOptions?.revalidatePaths) {
    crudOptions.revalidatePaths.forEach((path) => revalidatePath(path))
  }
}

/**
 * Generic batch update operation
 * Usage: batchUpdateInTable('teachers', [{ id: '1', name: 'New' }, { id: '2', name: 'Name' }])
 */
export async function batchUpdateInTable<T = any>(
  tableName: string,
  items: (Record<string, any> & { id: string })[],
  crudOptions?: CrudOperationOptions,
): Promise<T[]> {
  const supabase = await getSupabaseServerClient()

  const updateData = items.map((item) => ({
    ...item,
    updated_at: new Date().toISOString(),
  }))

  const { data: result, error } = await supabase.from(tableName).upsert(updateData, { onConflict: "id" }).select()

  if (error) throw error

  // Single revalidation for efficiency
  if (crudOptions?.revalidatePaths) {
    crudOptions.revalidatePaths.forEach((path) => revalidatePath(path))
  }

  return (result as T[]) || []
}
