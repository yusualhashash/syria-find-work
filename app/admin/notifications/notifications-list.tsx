"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
    deleteNotification,
    getNotifications,
    toggleNotificationStatus,
} from "@/lib/notifications/notification-actions"
import { Edit, Eye, EyeOff, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type Notification = {
    id: string
    title: string
    message: string
    type: string
    is_active: boolean
    created_at: string
}

export default function NotificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        loadNotifications()
    }, [])

    async function loadNotifications() {
        try {
            const data = await getNotifications()
            setNotifications(data)
        } catch (error) {
            toast({
                title: "خطأ",
                description: "فشل تحميل الإشعارات",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        try {
            await toggleNotificationStatus(id, !currentStatus)
            toast({
                title: "تم التحديث",
                description: currentStatus
                    ? "تم إخفاء الإشعار"
                    : "تم تفعيل الإشعار",
            })
            loadNotifications()
        } catch (error) {
            toast({
                title: "خطأ",
                description: "فشل تحديث حالة الإشعار",
                variant: "destructive",
            })
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteNotification(id)
            toast({
                title: "تم الحذف",
                description: "تم حذف الإشعار بنجاح",
            })
            loadNotifications()
        } catch (error) {
            toast({
                title: "خطأ",
                description: "فشل حذف الإشعار",
                variant: "destructive",
            })
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "success":
                return "bg-green-100 text-green-800"
            case "warning":
                return "bg-yellow-100 text-yellow-800"
            case "error":
                return "bg-red-100 text-red-800"
            default:
                return "bg-blue-100 text-blue-800"
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

    if (loading) {
        return <div className="text-center py-8">جاري التحميل...</div>
    }

    if (notifications.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">لا توجد إشعارات حالياً</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <Card key={notification.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {notification.title}
                                </h3>
                                <Badge className={getTypeColor(notification.type)}>
                                    {getTypeLabel(notification.type)}
                                </Badge>
                                {notification.is_active ? (
                                    <Badge className="bg-green-100 text-green-800">نشط</Badge>
                                ) : (
                                    <Badge className="bg-gray-100 text-gray-800">مخفي</Badge>
                                )}
                            </div>
                            <p className="text-gray-600 mb-2">{notification.message}</p>
                            <p className="text-sm text-gray-400">
                                {new Date(notification.created_at).toLocaleDateString("En-SY")} -{" "}
                                {new Date(notification.created_at).toLocaleTimeString("En-SY", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        <div className="flex sm:flex-col gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    handleToggleStatus(notification.id, notification.is_active)
                                }
                                className="bg-white hover:bg-gray-100 border-gray-300"
                            >
                                {notification.is_active ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>

                            <Link href={`/admin/notifications/edit/${notification.id}`}>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-white hover:bg-gray-100 border-gray-300"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </Link>

                            {/* Delete with confirmation dialog */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="bg-white hover:bg-red-50 border-gray-300"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent dir="rtl" className="bg-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            سيتم حذف الإشعار "{notification.title}" نهائياً ولا يمكن
                                            التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter className="flex flex-row gap-3 justify-end">
                                        <AlertDialogAction
                                            onClick={() => handleDelete(notification.id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base py-3"
                                        >
                                            حذف
                                        </AlertDialogAction>

                                        <AlertDialogCancel className="flex-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 text-base py-3">
                                            إلغاء
                                        </AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
