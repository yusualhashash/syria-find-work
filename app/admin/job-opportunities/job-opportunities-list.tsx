"use client"
import type { JobOpportunity } from "@/app/job-opportunities/job-opportunity-types"
import { Button } from "@/components/ui/button"
import { approveJobOpportunity, rejectJobOpportunity } from "@/lib/job-opportunities/job-opportunities-actions"
import { Briefcase, Calendar, CheckCircle, Home, MapPin, NotebookIcon, Phone, Trash2, XCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
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

import { SYRIAN_CITIES } from "@/lib/utils"
import { permanentDeleteJobOpportunity } from "@/lib/job-opportunities/job-opportunities-actions"

interface JobOpportunitiesListProps {
  jobs: JobOpportunity[]
}

export default function JobOpportunitiesList({ jobs }: JobOpportunitiesListProps) {
  const router = useRouter()
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterCity, setFilterCity] = useState<string>("all")

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesCity = filterCity === "all" || job.city === filterCity
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "pending" && !job.is_approved && !job.is_deleted) ||
        (filterStatus === "approved" && job.is_approved && !job.is_deleted) ||
        (filterStatus === "deleted" && job.is_deleted)
      return matchesCity && matchesStatus
    })
  }, [jobs, filterCity, filterStatus])

  const statusCounts = {
    all: filteredJobs.length,
    pending: filteredJobs.filter((job) => !job.is_approved && !job.is_deleted).length,
    approved: filteredJobs.filter((job) => job.is_approved && !job.is_deleted).length,
    deleted: filteredJobs.filter((job) => job.is_deleted).length,
  }

  const cityCounts = SYRIAN_CITIES.reduce(
    (acc, city) => {
      acc[city] = filteredJobs.filter((job) => job.city && job.city.trim() !== "" && job.city === city).length
      return acc
    },
    {} as Record<string, number>,
  )

  async function handleApprove(jobId: string) {
    setProcessingId(jobId)
    const result = await approveJobOpportunity(jobId)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setProcessingId(null)
  }

  async function handleReject(jobId: string) {
    setProcessingId(jobId)
    const result = await rejectJobOpportunity(jobId)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setProcessingId(null)
  }

  async function handleRestore(jobId: string) {
    setProcessingId(jobId)
    const result = await approveJobOpportunity(jobId)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setProcessingId(null)
  }

  async function handlePermanentDelete(jobId: string) {
    setProcessingId(jobId)
    const result = await permanentDeleteJobOpportunity(jobId)

    if (result.error) {
      alert(result.error)
    } else {
      router.refresh()
    }
    setProcessingId(null)
  }

  function JobCard({ job }: { job: JobOpportunity }) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Job Image */}
          <div className="relative w-full md:w-48 h-48 shrink-0">
            <Image src="/job-opportunity-logo.png" alt={job.job_name} fill className="object-cover rounded-lg p-2" />
          </div>

          {/* Job Details */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">اسم الوظيفة:</span>
              <h3 className="text-lg font-bold text-white">{job.job_name}</h3>
            </div>

            {job.description && (
              <div className="flex items-start gap-2 text-gray-400">
                <Briefcase className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm">{job.description}</span>
              </div>
            )}

            {job.city && (
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-sm">{job.city}</span>
              </div>
            )}

            {job.work_address && (
              <div className="flex items-center gap-2 text-gray-400">
                <Home className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-sm">{job.work_address}</span>
              </div>
            )}

            {job.whatsapp_number && (
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-sm">{job.whatsapp_number}</span>
              </div>
            )}

            {job.notes && (
              <div className="flex items-start gap-2 text-gray-400">
                <NotebookIcon className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm">{job.notes}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-5 h-5 text-green-400 shrink-0" />
              <p>{new Date(job.created_at).toLocaleDateString("ar-SY")}</p>
            </div>

            {job.creator && <div className="text-xs text-gray-500">المنشئ: {job.creator.full_name}</div>}
          </div>
        </div>

        {!job.is_deleted && !job.is_approved && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleApprove(job.id)}
              disabled={processingId === job.id}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              موافقة
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={processingId === job.id} variant="destructive" className="flex-1">
                  <XCircle className="h-4 w-4 ml-2" />
                  رفض
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl" className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                  <AlertDialogDescription>سيتم وضع فرصة العمل "{job.job_name}" في سلة المهملات.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-3 justify-end">
                  <AlertDialogAction
                    onClick={() => handleReject(job.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base py-3"
                  >
                    نقل إلى سلة المهملات
                  </AlertDialogAction>
                  <AlertDialogCancel className="flex-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 text-base py-3">
                    إلغاء
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {!job.is_deleted && job.is_approved && (
          <div className="flex gap-2 mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4" />
                  نقل إلى سلة المهملات
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl" className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                  <AlertDialogDescription>سيتم وضع فرصة العمل "{job.job_name}" في سلة المهملات.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row gap-3 justify-end">
                  <AlertDialogAction
                    onClick={() => handleReject(job.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base py-3"
                  >
                    نقل إلى سلة المهملات
                  </AlertDialogAction>
                  <AlertDialogCancel className="flex-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 text-base py-3">
                    إلغاء
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {job.is_deleted && (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleRestore(job.id)}
              disabled={processingId === job.id}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 ml-2" />
              استعادة
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={processingId === job.id} variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف نهائي
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
                    onClick={() => handlePermanentDelete(job.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base py-3"
                  >
                    حذف نهائي
                  </AlertDialogAction>
                  <AlertDialogCancel className="flex-1 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 text-base py-3">
                    إلغاء
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-900">
      <main className="space-y-6 sm:space-y-8">
        {/* Status Filter */}
        <div className="flex gap-2 md:gap-4 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap ${filterStatus === "all" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-300"
              }`}
          >
            الكل ({statusCounts.all})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap ${filterStatus === "pending"
              ? "text-yellow-500 border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            قيد المراجعة ({statusCounts.pending})
          </button>
          <button
            onClick={() => setFilterStatus("approved")}
            className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap ${filterStatus === "approved"
              ? "text-green-500 border-b-2 border-green-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            المنشورة ({statusCounts.approved})
          </button>
          <button
            onClick={() => setFilterStatus("deleted")}
            className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap ${filterStatus === "deleted"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-400 hover:text-gray-300"
              }`}
          >
            المحذوفة ({statusCounts.deleted})
          </button>
        </div>

        {/* City Filter */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>تصفية حسب المدينة:</span>
          </div>
          <div className="flex gap-2 md:gap-4 border-b border-gray-700 overflow-x-auto">
            <button
              onClick={() => setFilterCity("all")}
              className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap text-sm ${filterCity === "all" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-gray-300"
                }`}
            >
              الكل ({filteredJobs.length})
            </button>
            {SYRIAN_CITIES.map((city) => {
              const count = cityCounts[city] || 0
              if (count === 0) return null
              return (
                <button
                  key={city}
                  onClick={() => setFilterCity(city)}
                  className={`pb-3 px-2 md:px-4 font-semibold transition-colors whitespace-nowrap text-sm ${filterCity === city
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-gray-300"
                    }`}
                >
                  {city} ({count})
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد فرص عمل مطابقة للفلاتر المحددة</p>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
