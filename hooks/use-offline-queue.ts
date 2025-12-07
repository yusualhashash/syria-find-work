// React hook to manage offline queue on client side

"use client"

import { useEffect, useState } from "react"
import { offlineQueue } from "@/lib/offline/offline-queue"
import { networkMonitor } from "@/lib/mobile-optimization"

export function useOfflineQueue() {
  const [queuedItems, setQueuedItems] = useState(offlineQueue.getQueue())
  const [hasPendingSync, setHasPendingSync] = useState(false)

  useEffect(() => {
    // Subscribe to queue changes
    const unsubscribe = offlineQueue.subscribe((queue) => {
      setQueuedItems(queue)
      setHasPendingSync(queue.length > 0)
    })

    return unsubscribe
  }, [])

  // Auto-sync when connection restored
  useEffect(() => {
    const unsubscribe = networkMonitor.onConnectionChange((isOnline) => {
      if (isOnline && hasPendingSync) {
        // Note: In real app, you'd call sync here
        // offlineQueue.syncAll(executeAction)
      }
    })

    return unsubscribe
  }, [hasPendingSync])

  return {
    queuedItems,
    hasPendingSync,
    queueSize: queuedItems.length,
  }
}
