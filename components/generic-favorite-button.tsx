// Replaces 10+ nearly identical favorite button files

"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useDebouncedAction } from "@/hooks/use-debounced-action"
import { toggleFavorite } from "@/lib/db/generic-favorites"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GenericFavoriteButtonProps {
  professionTableName: string // e.g., "english_teachers"
  itemId: string
  isFavoritedInitial: boolean
  className?: string
  size?: "sm" | "md" | "lg"
}

export function GenericFavoriteButton({
  professionTableName,
  itemId,
  isFavoritedInitial,
  className,
  size = "md",
}: GenericFavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitial)

  const { execute, isLoading } = useDebouncedAction(
    async () => {
      const singular = professionTableName.replace(/s$/, "")
      return toggleFavorite(singular, itemId)
    },
    {
      delayMs: 300, // Mobile: wait for user to stop clicking before sending
      onSuccess: (result) => {
        if (result.success) {
          setIsFavorited(result.isFavorited ?? isFavorited)
        }
      },
    },
  )

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(sizeClasses[size], className)}
      onClick={() => execute()}
      disabled={isLoading}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500",
        )}
      />
    </Button>
  )
}
