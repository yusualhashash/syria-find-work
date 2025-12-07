import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"

import type { Plumber } from "../plumber-types"
import { checkIsPlumberFavorited } from "@/lib/plumbers/plumbers-favorites-actions"
import PlumberDetail from "./detail"

export default async function PlumberDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: plumber, error } = await supabase.from("plumbers").select("*").eq("id", id).single()

    if (error || !plumber) {
        console.error("Error fetching Plumber details:", error || "No plumber found")
        redirect("/plumbers")
    }

    const isFavorited = await checkIsPlumberFavorited(plumber.id)

    return <PlumberDetail plumber={plumber as Plumber} isFavorited={isFavorited} />
}
