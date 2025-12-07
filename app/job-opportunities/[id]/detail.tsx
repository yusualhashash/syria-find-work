"use client"

import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Home,
  MapPin,
  MessageCircle,
  Phone,
  StickyNote
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { JobOpportunity } from "../job-opportunity-types"

interface JobOpportunityDetailProps {
  job: JobOpportunity
  user: {
    id: string
    is_admin: boolean
  }
}

export default function JobOpportunityDetail({ job }: JobOpportunityDetailProps) {
  const phoneNumber = job.whatsapp_number.replace(/\D/g, "")
  const message = encodeURIComponent(`مرحباً، أنا مهتم بفرصة العمل: ${job.job_name}`)
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <div dir="rtl" className="min-h-screen bg-[#1a1a1a]">
      <div className="p-4 space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/job-opportunities" className="p-0 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowRight className="h-6 w-6 text-white" />
            </Link>

            <h1 className="text-xl font-bold text-white">تفاصيل الوظيفة</h1>
          </div>
        </div>

        {/* Job Card */}
        <Card className="p-6 bg-[#2a2a2a] border-gray-700 h-auto!important overflow-visible!important">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-full h-48">
              <Image src="/job-opportunity-logo.png" alt={job.job_name} fill className="object-cover" />
            </div>

            {/* Title */}
            <div className="p-2 flex items-center justify-center gap-2">
              <span className="text-gray-400 text-sm">اسم الوظيفة:</span>
              <h3 className="text-lg font-bold text-white">{job.job_name}</h3>
            </div>

          </div>

          <div className="space-y-4">
            {/* city */}
            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
              <MapPin className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400 mb-1">مدينة العمل </p>
                <p className="text-white font-medium">{job.city}</p>
              </div>
            </div>
            {/* Work Address */}
            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
              <Home className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400 mb-1">عنوان مكان العمل</p>
                <p className="text-white font-medium">{job.work_address}</p>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
              <Briefcase className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400 mb-1">الوصف</p>
                <p className="text-white leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
              <Phone className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400 mb-1">رقم الواتساب</p>
                <p dir="ltr" className="text-white font-medium">{job.whatsapp_number}</p>
              </div>
            </div>

            {/* Notes */}
            {job.notes && (
              <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                <StickyNote className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">ملاحظات إضافية</p>
                  <p className="text-white">{job.notes}</p>
                </div>
              </div>
            )}

            {/* Posted Date */}
            <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
              <Calendar className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-400 mb-1">تاريخ النشر</p>
                <p className="text-white">
                  {new Date(job.created_at)
                    .toLocaleDateString("en-GB")
                    .replace(/\//g, "/")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 bg-linear-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          تواصل عبر الواتساب
        </a>
      </div>
    </div>
  )
}
