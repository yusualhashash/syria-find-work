"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroupTextarea } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createNotification, updateNotification } from "@/lib/notifications/notification-actions"
import { useToast } from "@/hooks/use-toast"

type NotificationFormProps = {
    notification?: {
        id: string
        title: string
        message: string
        type: string
        is_active: boolean
    }
}

export default function NotificationForm({ notification }: NotificationFormProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [selectedType, setSelectedType] = useState(notification?.type || "info")
    const [isActive, setIsActive] = useState(notification?.is_active ?? true)

    const baseInputStyles =
        "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base"

    const textareaGroupStyles =
        "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 transition-colors duration-200 text-sm sm:text-base"

    const focusWithinStyles =
        "focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 focus-within:ring-offset-0"

    function RequiredLabel({ children }: { children: React.ReactNode }) {
        return (
            <span className="text-sm sm:text-base text-gray-900 text-right">
                {children} <span className="text-red-500">*</span>
            </span>
        )
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        try {
            const formData = new FormData(e.currentTarget)
            formData.set("type", selectedType)
            formData.set("is_active", isActive.toString())

            console.log("[v0] Submitting notification with data:", {
                title: formData.get("title"),
                message: formData.get("message"),
                type: selectedType,
                is_active: isActive,
            })

            if (notification) {
                await updateNotification(notification.id, formData)
                toast({
                    title: "تم التحديث",
                    description: "تم تحديث الإشعار بنجاح",
                })
            } else {
                await createNotification(formData)
                toast({
                    title: "تم الإضافة",
                    description: "تم إضافة الإشعار بنجاح",
                })
            }

            router.push("/admin/notifications")
            router.refresh()
        } catch (error) {
            console.error("[v0] Error creating notification:", error)
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "فشل حفظ الإشعار",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardContent className="p-2 sm:p-4">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            <RequiredLabel>عنوان</RequiredLabel>
                        </Label>
                        <div className={`${baseInputStyles} ${focusWithinStyles}`}>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                defaultValue={notification?.title}
                                placeholder="أدخل عنوان الإشعار"
                                required
                                className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">
                            <RequiredLabel>أدخل نص الإشعار</RequiredLabel>
                        </Label>
                        <div className={`${textareaGroupStyles} ${focusWithinStyles}`}>
                            <InputGroupTextarea
                                id="message"
                                name="message"
                                defaultValue={notification?.message || ""}
                                placeholder="أدخل نص الإشعار"
                                rows={4}
                                required
                                className="w-full bg-transparent text-right px-3 py-2 outline-none border-none resize-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">
                            <RequiredLabel>نوع الإشعار</RequiredLabel>
                        </Label>
                        <Select value={selectedType} onValueChange={setSelectedType} required>
                            <SelectTrigger className={`${baseInputStyles} ${focusWithinStyles}`}>
                                <SelectValue placeholder="اختر نوع الإشعار" />
                            </SelectTrigger>
                            <SelectContent className="text-right bg-white border border-gray-200 rounded-md shadow-md">
                                <SelectItem value="info" className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer">
                                    معلومات
                                </SelectItem>
                                <SelectItem
                                    value="success"
                                    className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer"
                                >
                                    نجاح
                                </SelectItem>
                                <SelectItem
                                    value="warning"
                                    className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer"
                                >
                                    تحذير
                                </SelectItem>
                                <SelectItem value="error" className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer">
                                    خطأ
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="type" value={selectedType} />
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center justify-between py-2">
                        <Switch
                            id="is_active"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                            className="data-[state=checked]:bg-green-600"
                        />
                        <Label htmlFor="is_active" className="text-sm sm:text-base text-gray-900 cursor-pointer">
                            تفعيل الإشعار
                        </Label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loading ? "جاري الحفظ..." : notification ? "تحديث الإشعار" : "إضافة"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            variant="destructive"
                            className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-red-600 hover:bg-gray-800 text-white"
                        >
                            إلغاء
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
