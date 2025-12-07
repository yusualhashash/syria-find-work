"use client"

import { useEffect, useState } from "react"
import { getUnskilledWorkers, deleteUnskilledWorker } from "@/lib/unskilled-workers/unskilled-workers-actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MapPin, Phone, User, Cake, Home, NotebookText, GraduationCap } from "lucide-react"
import Link from "next/link"
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
import type { UnskilledWorker } from "@/app/unskilled-workers/unskilled-worker-types"

export default function UnskilledWorkersList() {
    const [unskilledWorkers, setUnskilledWorkers] = useState<UnskilledWorker[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadUnskilledWorkers()
    }, [])

    const loadUnskilledWorkers = async () => {
        try {
            const data = await getUnskilledWorkers()
            setUnskilledWorkers(data)
        } catch (error) {
            console.error("Error loading unskilled workers:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteUnskilledWorker(id)
            setUnskilledWorkers(unskilledWorkers.filter((w) => w.id !== id))
        } catch (error) {
            console.error("Error deleting unskilled worker:", error)
            alert("حدث خطأ أثناء حذف العامل")
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-600">جاري التحميل...</div>
    }

    if (unskilledWorkers.length === 0) {
        return <div className="text-center py-12 text-gray-600">لا يوجد عمال من دون مهنة مضافين بعد</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {unskilledWorkers.map((worker) => (
                <Card key={worker.id} className="overflow-hidden rounded-lg shadow-md bg-white text-gray-900">
                    <CardContent className="p-4 sm:p-6 space-y-4">
                        <div className="flex items-center justify-end gap-4 mb-4">
                            <div className="flex flex-col text-right grow">
                                <h3 className="text-xl sm:text-2xl font-bold">{worker.name} {worker.surname}</h3>
                                <div className="flex items-center flex-row-reverse justify-end gap-2 text-gray-600 text-sm mt-1">
                                    <span>{worker.gender === "male" ? "ذكر" : "أنثى"}</span>
                                    <User className="w-4 h-4" />
                                    <span>{worker.age} سنة</span>
                                    <Cake className="w-4 h-4" />
                                </div>
                                <Badge variant="secondary" className="mt-2 w-fit gap-1 text-xs bg-gray-200 text-gray-800 flex-row-reverse">
                                    <span>خبرة {worker.experience_years} سنوات</span>
                                    <GraduationCap className="w-3 h-3" />
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm sm:text-base text-gray-700 text-right">
                            {worker.city && (
                                <div className="flex items-center flex-row-reverse justify-end gap-2">
                                    <span>{worker.city}</span>
                                    <MapPin className="w-4 h-4" />
                                </div>
                            )}
                            {worker.address && (
                                <div className="flex items-center flex-row-reverse justify-end gap-2">
                                    <span>{worker.address}</span>
                                    <Home className="w-4 h-4" />
                                </div>
                            )}
                            {worker.whatsapp_number && (
                                <div className="flex items-center flex-row-reverse justify-end gap-2">
                                    <span dir="ltr">{worker.whatsapp_number}</span>
                                    <Phone className="w-4 h-4" />
                                </div>
                            )}
                            {worker.notes && (
                                <div className="flex items-center flex-row-reverse justify-end gap-2">
                                    <p className="text-gray-600">{worker.notes}</p>
                                    <NotebookText className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="flex-1 gap-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white">
                                        <Trash2 className="w-4 h-4" />
                                        حذف
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent dir="rtl" className="bg-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            سيتم حذف العامل "{worker.name} {worker.surname}" نهائياً ولا يمكن التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex flex-row gap-3 justify-end">
                                        <AlertDialogAction
                                            onClick={() => handleDelete(worker.id)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base py-3"
                                        >
                                            حذف
                                        </AlertDialogAction>
                                        <AlertDialogCancel
                                            className="flex-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 text-base py-3"
                                        >
                                            إلغاء
                                        </AlertDialogCancel>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" className="flex-1 gap-2 text-sm sm:text-base bg-white text-gray-900 border border-gray-300 hover:bg-gray-100" asChild>
                                <Link href={`/admin/unskilled-workers/edit/${worker.id}`}>
                                    <Edit className="w-4 h-4" />
                                    تعديل
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
