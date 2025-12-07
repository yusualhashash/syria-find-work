"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroupTextarea } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import ar from "react-phone-number-input/locale/ar"
import "react-phone-number-input/style.css"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SYRIAN_CITIES } from "@/lib/utils"
import { createJobOpportunity } from "@/lib/job-opportunities/job-opportunities-actions"

type JobOpportunity = {
  id: string
  job_name: string
  description: string
  city: string
  work_address: string
  whatsapp_number: string
  notes?: string | null
}

export default function JobOpportunityForm({ jobOpportunity }: { jobOpportunity?: JobOpportunity }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedCity, setSelectedCity] = useState(jobOpportunity?.city || "")
  const [whatsappNumberValue, setWhatsappNumberValue] = useState<string | undefined>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (jobOpportunity?.whatsapp_number) {
      try {
        const phone = parsePhoneNumber(jobOpportunity.whatsapp_number)
        setWhatsappNumberValue(phone?.number)
      } catch {
        setWhatsappNumberValue(jobOpportunity.whatsapp_number)
      }
    }
  }, [jobOpportunity?.whatsapp_number])

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!whatsappNumberValue || !isValidPhoneNumber(whatsappNumberValue)) {
      setError("رقم الواتساب غير صالح")
      setLoading(false)
      return
    }

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("city", selectedCity)
      formData.set("whatsapp_number", whatsappNumberValue || "")
      await createJobOpportunity(formData)
      router.push("/job-opportunities/my-jobs")
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء حفظ البيانات")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert className="bg-blue-50 border border-blue-300 text-blue-700 text-sm">
            <AlertDescription>
              ستتم مراجعة فرصة العمل من قبل الإدارة قبل نشرها
            </AlertDescription>
          </Alert>

          {/* Job Name */}
          <div className="space-y-2">
            <Label htmlFor="job_name"><RequiredLabel>اسم الوظيفة</RequiredLabel></Label>
            <div className={`${baseInputStyles} ${focusWithinStyles}`}>
              <Input
                id="job_name"
                name="job_name"
                type="text"
                defaultValue={jobOpportunity?.job_name || ""}
                placeholder="مثال: موظف مبيعات"
                required
                className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description"><RequiredLabel>الوصف</RequiredLabel></Label>
            <div className={`${textareaGroupStyles} ${focusWithinStyles}`}>
              <InputGroupTextarea
                id="description"
                name="description"
                defaultValue={jobOpportunity?.description || ""}
                placeholder="اكتب وصفاً تفصيلياً عن الوظيفة والمتطلبات..."
                required
                rows={4}
                className="w-full bg-transparent text-right px-3 py-2 outline-none border-none resize-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city"><RequiredLabel>المدينة</RequiredLabel></Label>
            <Select value={selectedCity} onValueChange={setSelectedCity} required>
              <SelectTrigger className={`${baseInputStyles} ${focusWithinStyles}`}>
                <SelectValue placeholder="اختر المدينة" />
              </SelectTrigger>
              <SelectContent className="text-right bg-white border border-gray-200 rounded-md shadow-md">
                {SYRIAN_CITIES.map(city => (
                  <SelectItem key={city} value={city} className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="city" value={selectedCity} />
          </div>

          {/* Work Address */}
          <div className="space-y-2">
            <Label htmlFor="work_address"><RequiredLabel>عنوان العمل</RequiredLabel></Label>
            <div className={`${baseInputStyles} ${focusWithinStyles}`}>
              <Input
                id="work_address"
                name="work_address"
                defaultValue={jobOpportunity?.work_address || ""}
                placeholder="العنوان التفصيلي لمكان العمل"
                required
                className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number"><RequiredLabel>رقم الواتساب</RequiredLabel></Label>
            <div
              className={`${baseInputStyles} relative flex items-center px-3 ${focusWithinStyles}
                [&_input]:outline-none! [&_input]:border-none! [&_input]:ring-0! [&_input]:ring-offset-0!
                [&_.PhoneInputCountrySelect]:bg-transparent! [&_.PhoneInputCountrySelect]:border-none! [&_.PhoneInputCountrySelect]:!focus:ring-0 [&_.PhoneInputCountrySelect]:!focus:ring-offset-0`}
            >
              <PhoneInput
                international
                defaultCountry="SY"
                value={whatsappNumberValue}
                onChange={setWhatsappNumberValue}
                className="w-full h-full text-right bg-transparent"
                labels={ar}
                placeholder="أدخل رقم الواتساب"
                id="whatsapp_number"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات إضافية</Label>
            <div className={`${textareaGroupStyles} ${focusWithinStyles}`}>
              <InputGroupTextarea
                id="notes"
                name="notes"
                defaultValue={jobOpportunity?.notes || ""}
                placeholder="أي معلومات إضافية..."
                rows={3}
                className="w-full bg-transparent text-right px-3 py-2 outline-none border-none resize-none focus:ring-0 focus:ring-offset-0"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white h-11 sm:h-12"
            >
              {loading ? "جاري الحفظ..." : jobOpportunity ? "تحديث فرصة العمل" : "إضافة فرصة العمل"}
            </Button>

            <Button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              variant="destructive"
              className="flex-1 h-11 sm:h-12 bg-red-600 hover:bg-red-700 text-white"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
