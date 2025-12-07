"use client"

import { useMobileOptimization } from "@/hooks/use-mobile-optimization"
import { useOfflineQueue } from "@/hooks/use-offline-queue"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline, isMobile } = useMobileOptimization()
  const { hasPendingSync, queueSize } = useOfflineQueue()

  if (!isMobile) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-yellow-500 text-black px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg animate-pulse">
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-semibold">أنت في وضع غير متصل</span>
        </div>
      )}

      {hasPendingSync && (
        <div className="bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg mt-2 animate-pulse">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{queueSize} تغييرات قيد الانتظار</span>
        </div>
      )}

      {isOnline && !hasPendingSync && (
        <div className="bg-green-500 text-white px-4 py-3 rounded-lg flex items-center gap-2 shadow-lg">
          <Wifi className="w-5 h-5" />
          <span className="text-sm font-semibold">متصل</span>
        </div>
      )}
    </div>
  )
}
