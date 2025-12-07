import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getCarRepairmen } from "@/lib/car-repairmen/car-repairmen-actions"
import CarRepairmenClient from "./car-repairmen-client"
import type { CarRepairman } from "./car-repairman-types"
import { checkIsCarRepairmanFavorited } from "@/lib/car-repairmen/car-repairmen-favorites-actions"


interface CarRepairmanWithFavorite extends CarRepairman {
    isFavorited: boolean
}

export default async function CarRepairmenPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const repairmenData = await getCarRepairmen()
    const repairmenWithFavorites: CarRepairmanWithFavorite[] = await Promise.all(
        repairmenData.map(async (repairman: CarRepairman) => ({
            ...repairman,
            isFavorited: await checkIsCarRepairmanFavorited(repairman.id),
        })),
    )

    return <CarRepairmenClient initialRepairmen={repairmenWithFavorites} />
}
