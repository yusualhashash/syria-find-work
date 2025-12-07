"use client"

import { useEffect, useState } from "react"
import { getActiveNotifications, markAllNotificationsAsRead } from "@/lib/notifications/notification-actions"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info, AlertTriangle, Bell } from "lucide-react"

type Notification = {
    id: string
    title: string
    message: string
    type: string
    created_at: string
}

export default function NotificationsClient() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadNotifications()
        markAllNotificationsAsRead()
    }, [])

    async function loadNotifications() {
        try {
            const data = await getActiveNotifications()
            setNotifications(data)
        } catch (error) {
            console.error("Failed to load notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-6 h-6 text-green-600" />
            case "warning":
                return <AlertTriangle className="w-6 h-6 text-yellow-600" />
            case "error":
                return <AlertCircle className="w-6 h-6 text-red-600" />
            default:
                return <Info className="w-6 h-6 text-blue-600" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "success":
                return "border-r-green-500 bg-green-100"
            case "warning":
                return "border-r-yellow-500 bg-yellow-100"
            case "error":
                return "border-r-red-500 bg-red-100"
            default:
                return "border-r-blue-500 bg-blue-100"
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "success":
                return "نجاح"
            case "warning":
                return "تحذير"
            case "error":
                return "خطأ"
            default:
                return "معلومات"
        }
    }

    const getBadgeColor = (type: string) => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-800 border-green-300"
            case "warning":
                return "bg-yellow-100 text-yellow-800 border-yellow-300"
            case "error":
                return "bg-red-100 text-red-800 border-red-300"
            default:
                return "bg-blue-100 text-blue-800 border-blue-300"
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                <p className="mt-4 text-gray-600">جاري التحميل...</p>
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12">
                <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">لا توجد إشعارات جديدة</p>
                <p className="text-gray-400 text-sm mt-2">سنعلمك عند وجود تحديثات مهمة</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <Card key={notification.id} className={`p-4 sm:p-6 bg-black ${getTypeColor(notification.type)}`}>
                    <div className="flex gap-4">
                        <div className="shrink-0">{getTypeIcon(notification.type)}</div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                                <Badge className={`text-xs ${getBadgeColor(notification.type)}`}>
                                    {getTypeLabel(notification.type)}
                                </Badge>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-3">{notification.message}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(notification.created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                })}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
