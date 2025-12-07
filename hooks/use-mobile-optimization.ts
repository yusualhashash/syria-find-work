// Handles network conditions, battery optimization, and connection awareness

"use client"

import { useEffect, useState } from "react"
import { networkMonitor, isMobileApp } from "@/lib/mobile-optimization"

export function useMobileOptimization() {
  const [isOnline, setIsOnline] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileApp())
    setIsOnline(networkMonitor.getIsOnline())

    const unsubscribe = networkMonitor.onConnectionChange((online) => {
      setIsOnline(online)
    })

    return unsubscribe
  }, [])

  return {
    isOnline,
    isMobile,
    shouldOptimize: isMobile && !isOnline, // Aggressive optimization when offline
  }
}
