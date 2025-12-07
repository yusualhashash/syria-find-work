import Link from "next/link"
import { UserRound } from "lucide-react"
import FavoriteCard from "./FavoriteCard"

export default function FavoritesList({
    items,
    title,
    browseLink,
    FavoriteButton,
    baseUrl,
}: {
    items: any[]
    title: string
    browseLink: string
    FavoriteButton: (id: string) => React.ReactNode
    baseUrl: string // e.g.: "english-teachers"
}) {
    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 max-w-md w-full text-center">
                    <UserRound className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-white mb-3">{title} فارغة</h2>
                    <p className="text-gray-400 mb-6">لا يوجد عناصر بعد</p>

                    <Link
                        href={browseLink}
                        className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                    >
                        تصفح {title}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <FavoriteCard
                    key={item.id}
                    item={item}
                    link={`/${baseUrl}/${item.id}`}
                    FavoriteButton={FavoriteButton(item.id)}
                />
            ))}
        </div>
    )
}
