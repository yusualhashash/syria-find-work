// Example of optimized form using debouncing to prevent redundant submissions

"use client"

import { type FormEvent, useState } from "react"
import { useDebouncedAction } from "@/hooks/use-debounced-action"
import { updateInTable } from "@/lib/db/generic-crud"
import { Button } from "@/components/ui/button"

interface OptimizedProfileFormProps {
  userId: string
  initialData: any
}

export function OptimizedProfileForm({ userId, initialData }: OptimizedProfileFormProps) {
  const [formData, setFormData] = useState(initialData)

  const { execute, isLoading } = useDebouncedAction(
    async (data) => {
      return updateInTable("users", userId, data, {
        revalidatePaths: ["/profile"],
      })
    },
    {
      delayMs: 1000, // Wait 1 second after user stops typing
      onSuccess: () => {
        console.log("Profile updated")
      },
    },
  )

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget
    const updated = { ...formData, [name]: value }
    setFormData(updated)
    execute(updated) // Debounced
  }

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium">الاسم الكامل</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">رقم الهاتف</label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">المدينة</label>
        <input
          type="text"
          name="city"
          value={formData.city || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          disabled={isLoading}
        />
      </div>

      <Button disabled={isLoading} type="button" className="w-full">
        {isLoading ? "جاري الحفظ..." : "حفظ"}
      </Button>
    </form>
  )
}
