// Service worker for offline support and caching on mobile apps
// Enables offline functionality and background sync

const CACHE_NAME = "syriawork-v1"
const API_CACHE_NAME = "syriawork-api-v1"

// Files to cache on install
const STATIC_ASSETS = ["/", "/manifest.json", "/offline.html"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets")
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => {
            console.log("[SW] Deleting old cache:", name)
            return caches.delete(name)
          }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - network first for API, cache first for static
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Don't cache POST/PUT/DELETE requests (mutations)
  if (request.method !== "GET") {
    return
  }

  // API requests - network first with cache fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached response if offline
          return caches.match(request)
        }),
    )
    return
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response
      }

      return fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return offline page if available
          return caches.match("/offline.html")
        })
    }),
  )
})

// Background sync for offline requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-queue") {
    event.waitUntil(
      (async () => {
        try {
          console.log("[SW] Syncing offline queue...")
          const response = await fetch("/api/sync-queue", { method: "POST" })
          if (response.ok) {
            console.log("[SW] Offline queue synced successfully")
          }
        } catch (error) {
          console.error("[SW] Failed to sync offline queue:", error)
          throw error // Retry sync
        }
      })(),
    )
  }
})
