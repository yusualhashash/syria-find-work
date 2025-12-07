import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/server-actions"
import { getUnskilledWorkers } from "@/lib/unskilled-workers/unskilled-workers-actions"

import UnskilledWorkersClient from "./unskilled-workers-client"
import type { UnskilledWorker } from "./unskilled-worker-types"
import { checkIsUnskilledWorkerFavorited } from "@/lib/unskilled-workers/unskilled-workers-favorites-actions"

interface UnskilledWorkerWithFavorite extends UnskilledWorker {
    isFavorited: boolean
}

export default async function UnskilledWorkersPage() {
    const user = await getCurrentUser()
    if (!user) redirect("/login")

    const workersData = await getUnskilledWorkers()
    const workersWithFavorites: UnskilledWorkerWithFavorite[] = await Promise.all(
        workersData.map(async (worker: UnskilledWorker) => ({
            ...worker,
            isFavorited: await checkIsUnskilledWorkerFavorited(worker.id),
        })),
    )

    return <UnskilledWorkersClient initialUnskilledWorkers={workersWithFavorites} />
}
