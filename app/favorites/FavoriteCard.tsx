import Link from "next/link"
import { MapPin, Home, Cake, Phone, BookOpenText } from "lucide-react"

export default function FavoriteCard({
  item,
  link,
  FavoriteButton,
}: {
  item: any
  link: string
  FavoriteButton: React.ReactNode
}) {
  return (
    <Link href={link} className="h-full">
      <div className="bg-gray-900 border border-gray-700 overflow-hidden h-full flex flex-col relative">

        {/* Favorite Button */}
        <div className="absolute top-2 left-2 z-10">{FavoriteButton}</div>

        <div className="p-2 md:p-6 grow flex flex-col">
          <div className="mb-2">
            <img
              src={item.gender === "male" ? "/men.png" : "/woman.png"}
              alt={item.name}
              className="w-full h-36 object-cover mb-2"
            />

            <h3 className="text-md md:text-md font-bold text-white text-center">
              {item.name} {item.surname}
            </h3>
          </div>

          <div className="space-y-1 md:space-y-2 mt-auto">
            {item.city && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{item.city}</span>
              </div>
            )}

            {item.address && (
              <div className="flex items-center gap-2 text-gray-400">
                <Home className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{item.address}</span>
              </div>
            )}

            {item.age && (
              <div className="flex items-center gap-2 text-gray-400">
                <Cake className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{item.age} سنة</span>
              </div>
            )}

            {item.whatsapp_number && (
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">{item.whatsapp_number}</span>
              </div>
            )}

            {item.experience_years && (
              <div className="flex items-center gap-2 text-gray-400">
                <BookOpenText className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">
                  خبرة: {item.experience_years} سنوات
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
