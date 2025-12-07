export interface QueuedRequest {
  id: string
  action: string
  payload: any
  timestamp: number
  retries: number
}

export class OfflineQueue {
  private queue: Map<string, QueuedRequest> = new Map()
  private listeners: ((queue: QueuedRequest[]) => void)[] = []
  private syncInProgress = false

  /**
   * Add request to offline queue
   * @param action The server action to execute
   * @param payload The data to pass to the action
   */
  enqueue(action: string, payload: any): string {
    const id = `${action}-${Date.now()}-${Math.random()}`

    const queuedRequest: QueuedRequest = {
      id,
      action,
      payload,
      timestamp: Date.now(),
      retries: 0,
    }

    this.queue.set(id, queuedRequest)
    this.notifyListeners()

    console.log(`[v0] Queued offline request: ${action} (ID: ${id})`)
    return id
  }

  /**
   * Process all queued requests
   * Called when connection is restored
   */
  async syncAll(executeAction: (action: string, payload: any) => Promise<any>): Promise<void> {
    if (this.syncInProgress || this.queue.size === 0) return

    this.syncInProgress = true
    const requests = Array.from(this.queue.values())

    console.log(`[v0] Starting offline sync: ${requests.length} requests`)

    for (const request of requests) {
      try {
        await executeAction(request.action, request.payload)
        this.queue.delete(request.id)
        console.log(`[v0] Synced: ${request.action}`)
      } catch (error) {
        request.retries++
        if (request.retries > 3) {
          // Give up after 3 retries
          this.queue.delete(request.id)
          console.error(`[v0] Failed to sync after 3 retries: ${request.action}`)
        } else {
          console.warn(`[v0] Retry ${request.retries} for ${request.action}`)
        }
      }
    }

    this.syncInProgress = false
    this.notifyListeners()
  }

  /**
   * Get all queued requests
   */
  getQueue(): QueuedRequest[] {
    return Array.from(this.queue.values())
  }

  /**
   * Remove specific queued request
   */
  remove(id: string): void {
    this.queue.delete(id)
    this.notifyListeners()
  }

  /**
   * Clear entire queue
   */
  clear(): void {
    this.queue.clear()
    this.notifyListeners()
  }

  /**
   * Subscribe to queue changes
   */
  subscribe(listener: (queue: QueuedRequest[]) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    const queue = this.getQueue()
    this.listeners.forEach((listener) => listener(queue))
  }

  /**
   * Get queue size for monitoring
   */
  size(): number {
    return this.queue.size
  }
}

export const offlineQueue = new OfflineQueue()
