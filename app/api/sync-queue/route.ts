// API endpoint for syncing offline queue changes
// Called when device comes back online

import { getCurrentUser } from "@/lib/server-actions"
import { updateInTable, createInTable } from "@/lib/db/generic-crud"
import { NextResponse } from "next/server"

interface SyncRequest {
  action: string
  tableName: string
  data: any
  id?: string
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { requests } = await request.json()

    if (!Array.isArray(requests)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const results: any[] = []

    // Process each queued request
    for (const req of requests) {
      try {
        let result

        switch (req.action) {
          case "create":
            result = await createInTable(req.tableName, req.data, {
              revalidatePaths: [`/${req.tableName}`],
            })
            break

          case "update":
            result = await updateInTable(req.tableName, req.id, req.data, {
              revalidatePaths: [`/${req.tableName}`],
            })
            break

          default:
            throw new Error(`Unknown action: ${req.action}`)
        }

        results.push({
          success: true,
          id: req.id,
          result,
        })
      } catch (error: any) {
        results.push({
          success: false,
          id: req.id,
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      synced: results.length,
      results,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
