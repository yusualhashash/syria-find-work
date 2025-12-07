/**
 * Debounce function to delay execution until user stops interacting
 * Perfect for: favorites toggle, search, form inputs on mobile
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delayMs)
  }
}

/**
 * Throttle function to limit how often a function executes
 * Perfect for: scroll events, input changes, rapid clicks
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return function throttled(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limitMs)
    }
  }
}

/**
 * Batch multiple requests together and execute as one
 * Perfect for: bulk favorites, bulk updates, multiple operations at once
 */
export class RequestBatcher<T> {
  private batch: T[] = []
  private timeoutId: NodeJS.Timeout | null = null
  private onBatch: (items: T[]) => void

  constructor(onBatch: (items: T[]) => void, batchDelayMs = 500, maxBatchSize = 50) {
    this.onBatch = onBatch
    this.batchDelayMs = batchDelayMs
    this.maxBatchSize = maxBatchSize
  }

  private batchDelayMs: number
  private maxBatchSize: number

  add(item: T): void {
    this.batch.push(item)

    // If we hit max batch size, execute immediately
    if (this.batch.length >= this.maxBatchSize) {
      this.flush()
      return
    }

    // Reset timer
    if (this.timeoutId) clearTimeout(this.timeoutId)
    this.timeoutId = setTimeout(() => {
      this.flush()
    }, this.batchDelayMs)
  }

  flush(): void {
    if (this.batch.length === 0) return
    if (this.timeoutId) clearTimeout(this.timeoutId)

    const itemsToProcess = [...this.batch]
    this.batch = []
    this.onBatch(itemsToProcess)
  }
}

/**
 * Request deduplication - prevent identical requests from running concurrently
 * Perfect for: preventing duplicate API calls when component renders multiple times
 */
export class RequestDeduplicator<T> {
  private pendingRequests: Map<string, Promise<T>> = new Map()

  async execute<U>(key: string, request: () => Promise<U>): Promise<U> {
    // If request is already pending, return the same promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<U>
    }

    // Execute new request
    const promise = request().finally(() => {
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise as any)
    return promise
  }
}
