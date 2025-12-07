import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"

import type { UnskilledWorker } from "../unskilled-worker-types"
import { checkIsUnskilledWorkerFavorited } from "@/lib/unskilled-workers/unskilled-workers-favorites-actions"
import UnskilledWorkerDetail from "./detail"

export default async function UnskilledWorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: unskilledWorker, error } = await supabase.from("unskilled_workers").select("*").eq("id", id).single()

    if (error || !unskilledWorker) {
        console.error("Error fetching unskilled worker details:", error || "No worker found")
        redirect("/unskilled-workers")
    }

    const isFavorited = await checkIsUnskilledWorkerFavorited(unskilledWorker.id)

    return <UnskilledWorkerDetail unskilledWorker={unskilledWorker as UnskilledWorker} isFavorited={isFavorited} />
}
