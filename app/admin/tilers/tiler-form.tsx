"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputGroupTextarea } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SYRIAN_CITIES } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState, useEffect } from "react"
import { createTiler, updateTiler } from "@/lib/tilers/tilers-actions"
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import ar from "react-phone-number-input/locale/ar"
import "react-phone-number-input/style.css"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Tiler } from "@/app/tilers/tiler-types"

export default function TilerForm({ tiler }: { tiler?: Tiler }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [selectedCity, setSelectedCity] = useState(tiler?.city || "")
    const [selectedGender, setSelectedGender] = useState(tiler?.gender || "")
    const [whatsappNumberValue, setWhatsappNumberValue] = useState<string | undefined>("")
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (tiler?.whatsapp_number) {
            try {
                const phone = parsePhoneNumber(tiler.whatsapp_number)
                setWhatsappNumberValue(phone?.number)
            } catch {
                setWhatsappNumberValue(tiler.whatsapp_number)
            }
        }
    }, [tiler?.whatsapp_number])

    const baseInputStyles =
        "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base"

    const textareaGroupStyles =
        "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 transition-colors duration-200 text-sm sm:text-base"

    const focusWithinStyles = "focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 focus-within:ring-offset-0"
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
            formData.set("gender", selectedGender)
            formData.set("city", selectedCity)
            formData.set("whatsapp_number", whatsappNumberValue || "")

            if (tiler) {
                await updateTiler(tiler.id, formData)
            } else {
                await createTiler(formData)
            }

            router.push("/admin/tilers")
            router.refresh()
        } catch (error: any) {
            console.error("Error saving tiler:", error)
            setError(error.message || "حدث خطأ أثناء حفظ البيانات")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardContent className="p-2 sm:p-4">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name"><RequiredLabel>الاسم</RequiredLabel></Label>
                        <div className={`${baseInputStyles} ${focusWithinStyles}`}>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                defaultValue={tiler?.name}
                                placeholder="أدخل اسم المبلط"
                                required
                                className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Surname */}
                    <div className="space-y-2">
                        <Label htmlFor="surname"><RequiredLabel>الكنية</RequiredLabel></Label>
                        <div className={`${baseInputStyles} ${focusWithinStyles}`}>
                            <Input
                                id="surname"
                                name="surname"
                                type="text"
                                defaultValue={tiler?.surname}
                                placeholder="أدخل كنية المبلط"
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
                                [&_.PhoneInputCountrySelect]:bg-transparent! [&_.PhoneInputCountrySelect]:border-none! [&_.PhoneInputCountrySelect]:!focus:ring-0 [&_.PhoneInputCountrySelect]:!focus:ring-offset-0
                                `}
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
                        {error && whatsappNumberValue && !isValidPhoneNumber(whatsappNumberValue) && (
                            <p className="text-red-500 text-sm mt-1">رقم الواتساب غير صالح</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                        <Label htmlFor="gender"><RequiredLabel>الجنس</RequiredLabel></Label>
                        <Select
                            value={selectedGender}
                            onValueChange={setSelectedGender}
                            required
                        >
                            <SelectTrigger className={`${baseInputStyles} ${focusWithinStyles}`}>
                                <SelectValue placeholder="اختر الجنس" />
                            </SelectTrigger>
                            <SelectContent className="text-right bg-white border border-gray-200 rounded-md shadow-md">
                                <SelectItem value="male" className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer">ذكر</SelectItem>
                                <SelectItem value="female" className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer">أنثى</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="gender" value={selectedGender} />
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <Label htmlFor="age"><RequiredLabel>العمر</RequiredLabel></Label>
                        <div className={`${baseInputStyles} ${focusWithinStyles}`}>
                            <Input
                                id="age"
                                name="age"
                                type="number"
                                min="1"
                                max="99"
                                defaultValue={tiler?.age}
                                placeholder="أدخل العمر"
                                required
                                className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Label htmlFor="city"><RequiredLabel>المدينة</RequiredLabel></Label>
                        <Select
                            value={selectedCity}
                            onValueChange={setSelectedCity}
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
                        <input type="hidden" name="city" value={selectedCity} />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address"><RequiredLabel>العنوان</RequiredLabel></Label>
                        <div className={`${textareaGroupStyles} ${focusWithinStyles}`}>
                            <InputGroupTextarea
                                id="address"
                                name="address"
                                defaultValue={tiler?.address || ""}
                                placeholder="أدخل عنوان المبلط"
                                required
                                rows={4}
                                className="w-full bg-transparent text-right px-3 py-2 outline-none border-none resize-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Experience Years */}
                    <div className="space-y-2">
                        <Label htmlFor="experience_years"><RequiredLabel>سنوات الخبرة</RequiredLabel></Label>
                        <div className={`${baseInputStyles} ${focusWithinStyles}`}>
                            <Input
                                id="experience_years"
                                name="experience_years"
                                type="number"
                                min="0"
                                defaultValue={tiler?.experience_years}
                                placeholder="أدخل سنوات الخبرة"
                                required
                                className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">ملاحظات</Label>
                        <div className={`${textareaGroupStyles} ${focusWithinStyles}`}>
                            <InputGroupTextarea
                                id="notes"
                                name="notes"
                                defaultValue={tiler?.notes || ""}
                                placeholder="أدخل أي ملاحظات إضافية"
                                rows={4}
                                className="w-full bg-transparent text-right px-3 py-2 outline-none border-none resize-none focus:ring-0 focus:ring-offset-0"
                            />
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white"
                        >
                            {loading ? "جاري الحفظ..." : tiler ? "تحديث المبلط" : "إضافة المبلط"}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            variant="destructive"
                            className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white"
                        >
                            إلغاء
                        </Button>
                    </div>

                </form >
            </CardContent>
        </Card >
    )
}
