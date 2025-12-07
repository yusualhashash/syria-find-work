"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useState } from "react"

import { SYRIAN_CITIES } from "@/lib/utils"
import { FormProvider, useForm } from "react-hook-form"; // Import useForm and FormProvider
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import ar from "react-phone-number-input/locale/ar"
import "react-phone-number-input/style.css"
import { registerUser } from "./actions"

// Helper for required label
function RequiredLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-sm sm:text-base text-gray-900 text-right">
            {children} <span className="text-red-500">*</span>
        </span>
    )
}

export default function RegisterPage() {
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedCity, setSelectedCity] = useState<string>("")
    const [phoneValue, setPhoneValue] = useState<string | undefined>("")

    const form = useForm() // Initialize react-hook-form

    async function onSubmit(data: any) { // Use onSubmit for react-hook-form
        setError("")
        setLoading(true)

        const formData = new FormData() // Create new FormData
        formData.append("fullName", data.fullName)
        formData.append("email", data.email)
        formData.append("password", data.password)
        formData.append("confirmPassword", data.confirmPassword)
        formData.append("city", selectedCity)
        formData.append("phone", phoneValue || "")

        if (!phoneValue || !data.email || !data.fullName || !selectedCity || !data.password || !data.confirmPassword) {
            setError("يرجى ملء جميع الحقول")
            setLoading(false)
            return
        }

        if (!isValidPhoneNumber(phoneValue)) {
            setError("رقم الهاتف غير صالح")
            setLoading(false)
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            setError("البريد الإلكتروني غير صحيح")
            setLoading(false)
            return
        }

        if (data.password.length < 6) {
            setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل")
            setLoading(false)
            return
        }

        if (data.password !== data.confirmPassword) {
            setError("كلمات المرور غير متطابقة")
            setLoading(false)
            return
        }

        const result = await registerUser(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    const baseInputStyles =
        "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base"

    const focusWithinStyles = "focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 focus-within:ring-offset-0"

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md shadow-2xl bg-white">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">إنشاء حساب</CardTitle>
                    <CardDescription className="text-sm sm:text-base">انضم إلى سوريا موني اليوم</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormProvider {...form}> {/* Wrap with FormProvider */}
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> {/* Use form.handleSubmit */}

                            {/* Phone Input */}
                            <div className="space-y-2">
                                <Label htmlFor="phone"><RequiredLabel>رقم الهاتف</RequiredLabel></Label>
                                <div
                                    className={`${baseInputStyles} relative flex items-center px-3 ${focusWithinStyles}
                    [&_input]:outline-none! [&_input]:border-none! [&_input]:ring-0! [&_input]:ring-offset-0! [&_input]:border-0
                    [&_.PhoneInputCountrySelect]:bg-transparent! [&_.PhoneInputCountrySelect]:border-none! [&_.PhoneInputCountrySelect]:!focus:ring-0 [&_.PhoneInputCountrySelect]:!focus:ring-offset-0 [&_.PhoneInputCountrySelect]:border-0
                  `}
                                >
                                    <PhoneInput
                                        international
                                        defaultCountry="SY"
                                        value={phoneValue}
                                        onChange={(value) => {
                                            setPhoneValue(value)
                                            form.setValue("phone", value || "")
                                        }}
                                        className="w-full h-full text-right bg-transparent"
                                        placeholder="أدخل رقم هاتفك"
                                        labels={ar}
                                        id="phone"
                                        required
                                        inputRef={form.register("phone").ref}
                                    />
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName"><RequiredLabel>الاسم الكامل</RequiredLabel></Label>
                                <div className={`relative ${baseInputStyles} ${focusWithinStyles}`}>
                                    <Input
                                        type="text"
                                        id="fullName"
                                        placeholder="أدخل اسمك الكامل"
                                        disabled={loading}
                                        required
                                        className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                                        {...form.register("fullName")}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email"><RequiredLabel>البريد الإلكتروني</RequiredLabel></Label>
                                <div className={`relative ${baseInputStyles} ${focusWithinStyles}`}>
                                    <Input
                                        type="email"
                                        id="email"
                                        placeholder="example@gmail.com"
                                        disabled={loading}
                                        required
                                        className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                                        {...form.register("email")}
                                    />
                                </div>
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <Label htmlFor="city"><RequiredLabel>المدينة</RequiredLabel></Label>
                                <Select value={selectedCity} onValueChange={(value) => {
                                    setSelectedCity(value)
                                    form.setValue("city", value)
                                }} disabled={loading} required>
                                    <SelectTrigger className={`${baseInputStyles} ${focusWithinStyles}`}><SelectValue placeholder="اختر المدينة" /></SelectTrigger>
                                    <SelectContent className="text-right bg-white border border-gray-200 rounded-md shadow-md">
                                        {SYRIAN_CITIES.map(city => (
                                            <SelectItem key={city} value={city} className="text-right text-sm sm:text-base hover:bg-gray-100 cursor-pointer">
                                                {city}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password"><RequiredLabel>كلمة المرور</RequiredLabel></Label>
                                <div className={`relative ${baseInputStyles} ${focusWithinStyles}`}>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="أدخل كلمة المرور"
                                        disabled={loading}
                                        required
                                        className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                                        {...form.register("password")}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute left-0 top-0 h-full px-3 hover:bg-transparent" tabIndex={-1}>
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword"><RequiredLabel>تأكيد كلمة المرور</RequiredLabel></Label>
                                <div className={`relative ${baseInputStyles} ${focusWithinStyles}`}>
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="أكد كلمة المرور"
                                        disabled={loading}
                                        required
                                        className="w-full h-full text-right bg-transparent px-3 outline-none border-none focus:ring-0 focus:ring-offset-0"
                                        {...form.register("confirmPassword")}
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-0 top-0 h-full px-3 hover:bg-transparent" tabIndex={-1}>
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Submit */}
                            <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold h-11 sm:h-12 text-sm sm:text-base">
                                {loading ? "جاري إنشاء الحساب..." : "تسجيل"}
                            </Button>

                            <div className="text-center pt-2">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    لديك حساب بالفعل؟{" "}
                                    <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                                        تسجيل الدخول
                                    </Link>
                                </p>
                            </div>

                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>
    )
}
