"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import ar from "react-phone-number-input/locale/ar"
import "react-phone-number-input/style.css"
import { updateUserProfile } from "./actions"
import { SYRIAN_CITIES } from "@/lib/utils"


interface ProfileFormProps {
  user: {
    id: string
    phone_number: string
    full_name: string
    city: string
    email?: string
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>(user.city || "")
  const [phoneValue, setPhoneValue] = useState<string | undefined>("")

  const form = useForm({
    defaultValues: {
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      city: user.city,
    },
  })

  useEffect(() => {
    if (user.phone_number) {
      try {
        const phone = parsePhoneNumber(user.phone_number)
        setPhoneValue(phone?.number)
        form.setValue("phone_number", phone?.number || "")
      } catch {
        setPhoneValue(user.phone_number)
        form.setValue("phone_number", user.phone_number)
      }
    }
  }, [user.phone_number, form])

  async function onSubmit(data: any) {
    setError("")
    setIsLoading(true)

    const formData = new FormData()
    formData.append("full_name", data.full_name)
    formData.append("email", data.email)
    formData.append("city", selectedCity)
    formData.append("phone_number", phoneValue || "")

    if (!phoneValue || !data.full_name || !selectedCity || !data.email) {
      setError("يرجى ملء جميع الحقول")
      setIsLoading(false)
      return
    }

    if (!isValidPhoneNumber(phoneValue)) {
      setError("رقم الهاتف غير صالح")
      setIsLoading(false)
      return
    }

    try {
      const result = await updateUserProfile(formData)
      if (result.success) {
        router.push("/home")
        router.refresh()
      } else {
        setError(result.error || "حدث خطأ أثناء التحديث")
      }
    } catch {
      setError("حدث خطأ غير متوقع")
    } finally {
      setIsLoading(false)
    }
  }

  function RequiredLabel({ children }: { children: React.ReactNode }) {
    return (
      <span className="text-sm sm:text-base text-gray-900 text-right">
        {children} <span className="text-red-500">*</span>
      </span>
    )
  }

  const baseInputStyles =
    "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base"
  const focusWithinStyles = "focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 focus-within:ring-offset-0"

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone_number"><RequiredLabel>رقم الهاتف</RequiredLabel></Label>
              <div
                className={`${baseInputStyles} relative flex items-center px-3 ${focusWithinStyles}
                  [&_input]:outline-none! [&_input]:border-none! [&_input]:ring-0! [&_input]:ring-offset-0!
                  [&_.PhoneInputCountrySelect]:bg-transparent! [&_.PhoneInputCountrySelect]:border-none! [&_.PhoneInputCountrySelect]:!focus:ring-0 [&_.PhoneInputCountrySelect]:!focus:ring-offset-0
                  `}
              >
                <PhoneInput
                  international
                  defaultCountry="SY"
                  value={phoneValue}
                  onChange={(value) => {
                    setPhoneValue(value)
                    form.setValue("phone_number", value || "")
                  }}
                  className="w-full h-full text-right bg-transparent"
                  labels={ar}
                  placeholder="أدخل رقم هاتفك"
                  id="phone_number"
                  required
                  inputRef={form.register("phone_number").ref}
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name"><RequiredLabel>الاسم الكامل</RequiredLabel></Label>
              <div className={`relative ${baseInputStyles} ${focusWithinStyles}`}>
                <Input
                  type="text"
                  id="full_name"
                  placeholder="أدخل اسمك الكامل"
                  disabled={isLoading}
                  required
                  className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                  {...form.register("full_name")}
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city"><RequiredLabel>المدينة</RequiredLabel></Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value)
                  form.setValue("city", value)
                }}
                disabled={isLoading}
                required
              >
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
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email"><RequiredLabel>البريد الإلكتروني</RequiredLabel></Label>
              <div className={`relative ${baseInputStyles} ${focusWithinStyles}`}>
                <Input
                  id="email"
                  type="email"
                  placeholder="ادخل بريدك الالكتروني"
                  disabled={isLoading}
                  required
                  className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                  {...form.register("email")}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 sm:h-12 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
              >
                {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
              <Button
                type="button"
                onClick={() => router.back()}
                disabled={isLoading}
                variant="destructive"
                className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
              >
                إلغاء
              </Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
