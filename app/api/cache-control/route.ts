// Allows mobile clients to clear cache when needed (after sync, etc.)

import { requestCache } from "@/lib/cache/request-cache"
import { getCurrentUser } from "@/lib/server-actions"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { action, cacheKey } = await req.json()

  try {
    switch (action) {
      case "clear-all":
        requestCache.clearAll()
        return NextResponse.json({ success: true, message: "All cache cleared" })

      case "clear-key":
        if (!cacheKey) throw new Error("Cache key required")
        requestCache.clear(cacheKey)
        return NextResponse.json({
          success: true,
          message: `Cache key "${cacheKey}" cleared`,
        })

      case "get-size":
        return NextResponse.json({
          success: true,
          size: requestCache.size(),
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
