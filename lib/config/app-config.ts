// Controls optimization behavior, caching, timeouts, and mobile settings

export const APP_CONFIG = {
  // Mobile-specific settings
  MOBILE: {
    enabled: true,
    networkAware: true,
    batteryOptimization: true,
    offlineSyncEnabled: true,
  },

  // Caching configuration
  CACHE: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // max cache entries
    clearOnLogout: true,
  },

  // Request optimization
  REQUESTS: {
    // Debouncing delays (in ms)
    favoritesDebounceMs: 300,
    searchDebounceMs: 500,
    inputDebounceMs: 1000,

    // Request batching
    batchingEnabled: true,
    batchDelayMs: 1000,
    maxBatchSize: 50,

    // Timeout settings
    timeoutMs: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelayMs: 1000,
  },

  // Data refresh settings
  REFRESH: {
    // Auto-refresh intervals
    autoRefreshEnabled: false,
    autoRefreshIntervalMs: 10 * 60 * 1000, // 10 minutes

    // When to refresh data
    refreshOnFocus: true, // Refresh when app regains focus
    refreshOnReconnect: true, // Refresh when connection restored
  },

  // Admin-specific settings
  ADMIN: {
    // Admin operations
    bulkOperationsBatchSize: 50,
    bulkDeleteConfirmation: true,
    enableAnalytics: true,

    // Caching for admin data
    adminDataCacheTTL: 2 * 60 * 1000, // 2 minutes - shorter for admin
  },

  // Logging and monitoring
  DEBUG: {
    logApiCalls: false, // Set to true for debugging
    logCacheHits: false,
    logNetworkStatus: false,
    performanceMetrics: false,
  },
}

/**
 * Get environment-specific config
 */
export function getConfig() {
  const isDev = process.env.NODE_ENV === "development"

  return {
    ...APP_CONFIG,
    DEBUG: {
      ...APP_CONFIG.DEBUG,
      logApiCalls: isDev,
      logNetworkStatus: isDev,
    },
  }
}
