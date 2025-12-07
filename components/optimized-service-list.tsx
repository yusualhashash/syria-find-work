// Example of optimized list using caching and debouncing

"use client"

import { useCachedData } from "@/hooks/use-cached-data"
import { getFromTable } from "@/lib/db/generic-crud"
import { OptimizedFavoriteButton } from "./optimized-favorite-button"

interface OptimizedServiceListProps {
  profession: string // e.g., "english_teachers"
  city?: string
}

export function OptimizedServiceList({ profession, city }: OptimizedServiceListProps) {
  const {
    data: services,
    isLoading,
    error,
    refetch,
  } = useCachedData(
    () =>
      getFromTable(profession, {
        filter: city ? { city } : undefined,
        orderBy: { column: "created_at", ascending: false },
        limit: 50,
      }),
    {
      cacheKey: `${profession}-${city || "all"}`,
      cacheTTL: 10 * 60 * 1000, // Cache for 10 minutes
    },
  )

  if (error) {
    return <div className="p-4 bg-red-50 text-red-800 rounded">خطأ في تحميل البيانات: {error.message}</div>
  }

  if (isLoading && !services) {
    return <div className="p-4 animate-pulse">جاري التحميل...</div>
  }

  return (
    <div className="space-y-4">
      {!services || services.length === 0 ? (
        <div className="p-4 text-center text-gray-500">لا توجد خدمات متاحة</div>
      ) : (
        <div className="grid gap-4">
          {services.map((service: any) => (
            <div key={service.id} className="p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {service.name} {service.surname}
                  </h3>
                  <p className="text-sm text-gray-600">{service.city}</p>
                  <p className="text-sm text-gray-500">{service.address}</p>
                </div>
                <OptimizedFavoriteButton profession={profession} itemId={service.id} isFavoritedInitial={false} />
              </div>
            </div>
          ))}
        </div>
      )}

      {services && services.length > 0 && (
        <button
          onClick={refetch}
          disabled={isLoading}
          className="w-full p-2 text-center text-blue-600 hover:bg-blue-50 rounded"
        >
          {isLoading ? "جاري التحديث..." : "تحديث"}
        </button>
      )}
    </div>
  )
}
