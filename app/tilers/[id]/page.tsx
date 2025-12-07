import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import TilerDetail from "./detail"
import { checkIsTilerFavorited } from "@/lib/tilers/tilers-favorites-actions"
import type { Tiler } from "../tiler-types"

export default async function TilerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: tiler, error } = await supabase
        .from("tilers")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !tiler) redirect("/tilers")

    const isFavorited = await checkIsTilerFavorited(tiler.id)

    return <TilerDetail tiler={tiler as Tiler} isFavorited={isFavorited} />
}
