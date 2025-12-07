"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SYRIAN_CITIES } from "@/lib/utils"
import { ArrowRight, Briefcase, Calendar, Home, MapPin, Notebook, Phone, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import type { JobOpportunity } from "./job-opportunity-types"

interface JobOpportunitiesClientProps {
  jobs: JobOpportunity[]
  user: {
    id: string
    full_name: string
    phone_number: string
    is_admin: boolean
  }
}

export default function JobOpportunitiesClient({ jobs, user }: JobOpportunitiesClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch =
        job.job_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCity = selectedCity ? job.city === selectedCity : true
      return matchesSearch && matchesCity
    })
  }, [jobs, searchTerm, selectedCity])

  return (
    <div dir="rtl" className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header + Sticky Search */}
        <div className="sticky top-0 z-20 bg-black pb-3 shadow-sm">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <Link href="/home" className="p-0 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowRight className="w-6 h-6 text-white" />
              </Link> <div className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-white" />
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  فرص العمل المتاحة
                </h1>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="px-1 md:px-2 pb-2">
            <Input
              type="text"
              placeholder="🔍 البحث باسم الوظيفة أو الوصف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>

          {/* City Filter */}
          <div className="px-1 md:px-2 pb-2">
            <Select onValueChange={(value) => setSelectedCity(value === "all" ? null : value)}>
              <SelectTrigger className="w-full p-2 border border-gray-700 bg-gray-900 text-white rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500">
                <SelectValue placeholder="اختر المدينة..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 text-white border border-gray-700">
                <SelectItem value="all">كل المدن</SelectItem>
                {SYRIAN_CITIES.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link href="/job-opportunities/new" className="flex-1">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white h-11 sm:h-12 rounded-md flex items-center justify-center gap-2">
              <Plus className="h-5 w-5 text-white" />
              إضافة فرصة عمل
            </button>
          </Link>
          <Link href="/job-opportunities/my-jobs" className="flex-1">
            <button className="w-full border border-gray-700 text-white bg-transparent hover:bg-gray-800 h-11 sm:h-12 rounded-md flex items-center justify-center gap-2">
              <Briefcase className="h-5 w-5 text-white" />
              فرص العمل الخاصة بي
            </button>
          </Link>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 pt-4 text-gray-400">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>لا توجد فرص عمل متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredJobs.map(job => (
              <Link key={job.id} href={`/job-opportunities/${job.id}`} className="h-full">
                <div className="bg-gray-900 border border-gray-700 rounded-md overflow-hidden shadow hover:shadow-lg transition-shadow h-full flex flex-col">
                  {/* Job Image */}
                  <div className="relative w-full h-48">
                    <Image src="/job-opportunity-logo.png" alt={job.job_name} fill className="object-cover" />
                  </div>
                  {/* Title */}
                  <div className="p-2 flex items-center justify-center gap-2">
                    <span className="text-gray-400 text-sm">اسم الوظيفة:</span>
                    <h3 className="text-lg font-bold text-white">{job.job_name}</h3>
                  </div>


                  <div className="space-y-1 md:space-y-2 mt-auto p-2">

                    {job.city && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <span className="text-sm md:text-sm">{job.city}</span>
                      </div>
                    )}
                    {job.work_address && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Home className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <span className="text-sm md:text-sm">{job.work_address}</span>
                      </div>
                    )}
                    {job.whatsapp_number && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <span className="text-sm md:text-sm">{job.whatsapp_number}</span>
                      </div>
                    )}
                    {job.notes && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                        <span className="text-sm md:text-sm">{job.notes}</span>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>


  )
}
