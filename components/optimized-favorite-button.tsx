// Example of optimized favorite button using debouncing
// This replaces the 10+ individual favorite button files

"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useDebouncedAction } from "@/hooks/use-debounced-action"
import { toggleFavorite } from "@/lib/db/generic-favorites"
import { Button } from "@/components/ui/button"

interface OptimizedFavoriteButtonProps {
  profession: string // e.g., "english_teachers"
  itemId: string
  isFavoritedInitial: boolean
}

export function OptimizedFavoriteButton({ profession, itemId, isFavoritedInitial }: OptimizedFavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitial)

  const { execute, isLoading } = useDebouncedAction(
    async () => {
      const singular = profession.replace(/s$/, "")
      return toggleFavorite(singular, itemId)
    },
    {
      delayMs: 300, // Wait 300ms for user interactions to settle
      onSuccess: (result) => {
        if (result.success) {
          setIsFavorited(result.isFavorited ?? false)
        }
      },
    },
  )

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => execute()}
      disabled={isLoading}
      className="transition-transform hover:scale-110"
    >
      <Heart className={`w-6 h-6 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
    </Button>
  )
}
