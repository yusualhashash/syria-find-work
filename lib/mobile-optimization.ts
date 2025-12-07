// Implements strategies to reduce battery drain and network usage on mobile devices

/**
 * Detect if device is on mobile (native app or mobile browser)
 */
export function isMobileApp(): boolean {
  if (typeof window === "undefined") return false

  // Check for common mobile indicators
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

  // React Native / Expo indicators
  if ((window as any).ReactNativeWebView) return true

  // Regular mobile browser detection
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
}

/**
 * Network connectivity monitoring for mobile apps
 * Helps decide when to batch requests or show offline message
 */
export class MobileNetworkMonitor {
  private isOnline = true
  private listeners: ((isOnline: boolean) => void)[] = []

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.setOnline(true))
      window.addEventListener("offline", () => this.setOnline(false))
    }
  }

  private setOnline(isOnline: boolean) {
    if (this.isOnline !== isOnline) {
      this.isOnline = isOnline
      this.listeners.forEach((listener) => listener(isOnline))
    }
  }

  getIsOnline(): boolean {
    return this.isOnline
  }

  onConnectionChange(callback: (isOnline: boolean) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }
}

export const networkMonitor = new MobileNetworkMonitor()

/**
 * Compression hint: for mobile apps, consider batching operations
 * This reduces the number of network round-trips
 */
export const MOBILE_OPTIMIZATION = {
  // Increase debounce for favorites (avoid rapid toggling)
  FAVORITES_DEBOUNCE_MS: 300,

  // Longer cache TTL for less frequent data refresh
  DATA_CACHE_TTL: 10 * 60 * 1000, // 10 minutes

  // Batch operations to reduce requests
  BATCH_REQUEST_DELAY_MS: 1000,
  MAX_BATCH_SIZE: 100,

  // Request timeout for poor network conditions
  REQUEST_TIMEOUT_MS: 30000, // 30 seconds

  // Whether to prefetch on network change
  PREFETCH_ON_RECONNECT: true,
}
