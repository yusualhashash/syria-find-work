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
import { Button } from "@/components/ui/button"

import { deleteJobOpportunity } from "@/lib/job-opportunities/job-opportunities-actions"
import { ArrowRight, Briefcase, Calendar, CheckCircle, Clock, Home, MapPin, NotebookIcon, Phone, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { JobOpportunity } from "../job-opportunity-types"
interface MyJobsClientProps {
  jobs: JobOpportunity[]
}

export default function MyJobsClient({ jobs }: MyJobsClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(jobId: string) {
    setDeletingId(jobId)
    const result = await deleteJobOpportunity(jobId)

    if (result.error) {
      alert(result.error)
      setDeletingId(null)
    } else {
      router.refresh()
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-black pb-20">
      <main className="px-4 py-4 space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/job-opportunities" className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm">
            <ArrowRight className="w-6 h-6" />
          </Link>

          <div className="flex-1">
            <div className="flex items-center gap-3">
              <NotebookIcon className="w-7 h-7" />
              <h1 className="text-xl font-bold">فرص العمل الخاصة بي</h1>
            </div>
            <p className="text-gray-400 text-sm mt-2"> نظرة عامة على فرص العمل الخاصة بي</p>
          </div>
        </div>
        {jobs.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 max-w-md w-full text-center">
              <Briefcase className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <p className="text-gray-400 mb-6">لم تقم بإضافة أي فرص عمل بعد</p>
              <Link href="/job-opportunities/new" className="inline-block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Plus className="h-5 w-5" />
                  إضافة فرصة عمل
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-900 border border-gray-700 rounded-md overflow-hidden shadow hover:shadow-lg transition-shadow"
            >
              {/* Status + Delete */}
              <div className="flex items-center justify-between p-3">
                {job.is_deleted ? (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <Trash2 className="w-4 h-4" />
                    <span>محذوف</span>
                  </div>
                ) : job.is_approved ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>منشورة</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>قيد المراجعة</span>
                  </div>
                )}
              </div>

              {/* Job Image */}
              <div className="relative w-full h-48">
                <Image
                  src="/job-opportunity-logo.png"
                  alt={job.job_name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Title */}
              <div className=" flex items-center justify-center gap-2">
                <span className="text-gray-400 text-sm">اسم الوظيفة:</span>
                <h3 className="text-lg font-bold text-white">{job.job_name}</h3>
              </div>

              {/* Details (Same style as your grid items) */}
              <div className="space-y-2 p-3">
                {job.description && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                    <span className="text-sm">{job.description}</span>
                  </div>
                )}

                {job.city && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span className="text-sm">{job.city}</span>
                  </div>
                )}

                {job.work_address && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span className="text-sm">{job.work_address}</span>
                  </div>
                )}

                {job.whatsapp_number && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span className="text-sm">{job.whatsapp_number}</span>
                  </div>
                )}
                {job.notes && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <NotebookIcon className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    <span>{job.notes}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                  <p >
                    {new Date(job.created_at)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "/")}
                  </p>
                </div>
              </div>

              {/* Delete Button and Edit Button */}
              <div className="flex gap-3 p-3">
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
                        سيتم حذف فرصة العمل "{job.job_name}" بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.

                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row gap-3 justify-end">
                      <AlertDialogAction
                        onClick={() => handleDelete(job.id)}
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
                {/* <Button variant="outline" className="flex-1 gap-2 text-sm sm:text-base bg-white text-gray-900 border border-gray-300 hover:bg-gray-100" asChild>
                  <Link href={`/job-opportunities/edit/${job.id}`}>
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Link>
                </Button> */}

              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}
