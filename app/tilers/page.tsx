import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import { getTilers } from "@/lib/tilers/tilers-actions"
import { checkIsTilerFavorited } from "@/lib/tilers/tilers-favorites-actions"

import type { Tiler } from "./tiler-types"
import TilersClient from "./tilers-client"

interface TilerWithFavorite extends Tiler {
    isFavorited: boolean
}

export default async function TilersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const tilersData = await getTilers()
    const tilersWithFavorites: TilerWithFavorite[] = await Promise.all(
        tilersData.map(async (tiler: Tiler) => ({
            ...tiler,
            isFavorited: await checkIsTilerFavorited(tiler.id),
        }))
    )

    return <TilersClient initialTilers={tilersWithFavorites} />
}
