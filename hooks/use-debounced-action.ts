// Prevents excessive network calls during rapid user interactions

"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseDebouncedActionOptions {
  delayMs?: number
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
}

export function useDebouncedAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options: UseDebouncedActionOptions = {},
) {
  const { delayMs = 500, onSuccess, onError } = options
  const [isLoading, setIsLoading] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const execute = useCallback(
    async (...args: Parameters<T>) => {
      // Clear previous timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setIsLoading(true)

      // Set new timeout
      timeoutRef.current = setTimeout(async () => {
        try {
          const result = await action(...args)
          onSuccess?.(result)
        } catch (error) {
          onError?.(error as Error)
        } finally {
          setIsLoading(false)
        }
      }, delayMs)
    },
    [action, delayMs, onSuccess, onError],
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return { execute, isLoading }
}
