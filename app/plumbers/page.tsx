import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getPlumbers } from "@/lib/plumbers/plumbers-actions"
import PlumbersClient from "./plumbers-client"
import type { Plumber } from "./plumber-types"
import { checkIsPlumberFavorited } from "@/lib/plumbers/plumbers-favorites-actions"



interface PlumberWithFavorite extends Plumber {
    isFavorited: boolean
}

export default async function PlumbersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const plumbersData = await getPlumbers()
    const plumbersWithFavorites: PlumberWithFavorite[] = await Promise.all(
        plumbersData.map(async (plumber: Plumber) => ({
            ...plumber,
            isFavorited: await checkIsPlumberFavorited(plumber.id),
        })),
    )

    return <PlumbersClient initialPlumbers={plumbersWithFavorites} />
}
