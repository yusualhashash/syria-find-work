// Ensures browser and CDN respect our cache settings for mobile apps

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Set cache headers for API responses
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Cache API responses for 1 minute (mobile can handle stale data)
    response.headers.set("Cache-Control", "private, max-age=60, stale-while-revalidate=300")
  }

  // Set cache headers for static assets
  if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|svg|ico|webp)$/i)) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable")
  }

  // Add headers for mobile optimization
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Disable service worker on development to avoid caching issues
  if (process.env.NODE_ENV === "development") {
    response.headers.set("Service-Worker-Allowed", "/")
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
}
