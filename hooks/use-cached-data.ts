// Reduces redundant network calls and battery drain

"use client"

import { useEffect, useState } from "react"
import { requestCache, CACHE_TTL } from "@/lib/cache/request-cache"

interface UseCachedDataOptions {
  cacheKey: string
  cacheTTL?: number
  enabled?: boolean
}

export function useCachedData<T>(fetcher: () => Promise<T>, options: UseCachedDataOptions) {
  const { cacheKey, cacheTTL = CACHE_TTL.MEDIUM, enabled = true } = options
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(!enabled)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Check cache first
    const cached = requestCache.get<T>(cacheKey)
    if (cached) {
      setData(cached)
      setIsLoading(false)
      return
    }

    // Fetch if not cached
    setIsLoading(true)
    fetcher()
      .then((result) => {
        requestCache.set(cacheKey, result, cacheTTL)
        setData(result)
        setError(null)
      })
      .catch((err) => {
        setError(err)
        setData(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [cacheKey, cacheTTL, enabled, fetcher])

  const refetch = () => {
    requestCache.clear(cacheKey)
    setIsLoading(true)
    fetcher()
      .then((result) => {
        requestCache.set(cacheKey, result, cacheTTL)
        setData(result)
        setError(null)
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }

  return { data, isLoading, error, refetch }
}
