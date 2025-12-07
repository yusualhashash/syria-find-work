import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getSupabaseServerClient } from "@/lib/supabase/server"

import type { CarRepairman } from "../car-repairman-types"
import { checkIsCarRepairmanFavorited } from "@/lib/car-repairmen/car-repairmen-favorites-actions"
import CarRepairmanDetail from "./detail"

export default async function CarRepairmanDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const supabase = await getSupabaseServerClient()
    const { data: carRepairman, error } = await supabase.from("car_repairmen").select("*").eq("id", id).single()

    if (error || !carRepairman) {
        console.error("Error fetching Car repairman details:", error || "No car repairman found")
        redirect("/car-repairmen")
    }

    const isFavorited = await checkIsCarRepairmanFavorited(carRepairman.id)

    return <CarRepairmanDetail carRepairman={carRepairman as CarRepairman} isFavorited={isFavorited} />
}
