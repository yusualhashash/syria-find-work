import { getCurrentUser } from "@/lib/server-actions"
import { redirect } from "next/navigation"
import { getBlacksmiths } from "@/lib/blacksmiths/blacksmiths-actions"
import { checkIsBlacksmithFavorited } from "@/lib/blacksmiths/blacksmiths-favorites-actions"

import type { Blacksmith } from "./blacksmith-types"
import BlacksmithsClient from "./blacksmiths-client"

interface BlacksmithWithFavorite extends Blacksmith {
    isFavorited: boolean
}

export default async function BlacksmithsPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const blacksmithsData = await getBlacksmiths()
    const blacksmithsWithFavorites: BlacksmithWithFavorite[] = await Promise.all(
        blacksmithsData.map(async (blacksmith: Blacksmith) => ({
            ...blacksmith,
            isFavorited: await checkIsBlacksmithFavorited(blacksmith.id),
        }))
    )

    return <BlacksmithsClient initialBlacksmiths={blacksmithsWithFavorites} />
}
