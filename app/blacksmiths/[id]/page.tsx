import BlacksmithDetail from "./detail"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { checkIsBlacksmithFavorited } from "@/lib/blacksmiths/blacksmiths-favorites-actions"
import type { Blacksmith } from "../blacksmith-types"

export default async function BlacksmithDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: blacksmith, error } = await supabase
        .from("blacksmiths")
        .select("*")
        .eq("id", id)
        .single()

    if (error || !blacksmith) {
        console.error("Error fetching blacksmith details:", error || "No blacksmith found")
        redirect("/blacksmiths")
    }

    const isFavorited = await checkIsBlacksmithFavorited(blacksmith.id)

    return <BlacksmithDetail blacksmith={blacksmith as Blacksmith} isFavorited={isFavorited} />
}
