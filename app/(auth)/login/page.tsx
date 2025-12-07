"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import ar from "react-phone-number-input/locale/ar"
import "react-phone-number-input/style.css"
import { loginUser } from "./actions"


// Helper for required label
function RequiredLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-sm sm:text-base text-gray-900 text-right">
            {children} <span className="text-red-500">*</span>
        </span>
    )
}

export default function LoginPage() {
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [phoneValue, setPhoneValue] = useState<string | undefined>("")
    const [savedPhone, setSavedPhone] = useState("")

    useEffect(() => {
        const saved = localStorage.getItem("rememberMe")
        if (saved) {
            const { phone } = JSON.parse(saved)
            setSavedPhone(phone)
            setPhoneValue(phone)
            setRememberMe(true)
        }
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const password = formData.get("password") as string
        const phone = phoneValue

        if (!phone || !password) {
            setError("يرجى ملء جميع الحقول")
            setLoading(false)
            return
        }

        // Validate for all countries
        if (!isValidPhoneNumber(phone)) {
            setError("رقم الهاتف غير صالح")
            setLoading(false)
            return
        }

        if (rememberMe) {
            localStorage.setItem("rememberMe", JSON.stringify({ phone }))
        } else {
            localStorage.removeItem("rememberMe")
        }

        formData.set("phone", phone) // include phone in formData

        const result = await loginUser(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    const inputClasses =
        "w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 focus:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-0 transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base"

    return (
        <div dir="rtl" className="min-h-screen flex items-center justify-center bg-black pb-24 p-4">
            <Card className="w-full max-w-md shadow-2xl bg-white">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">مرحباً بعودتك</CardTitle>
                    <CardDescription className="text-sm sm:text-base">تسجيل الدخول</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Phone Input */}
                        <div className="space-y-2">
                            <Label htmlFor="phone"><RequiredLabel>رقم الهاتف</RequiredLabel></Label>
                            <div
                                className={`w-full text-right border border-gray-300 rounded-md bg-white text-gray-900 
                  transition-colors duration-200 h-11 sm:h-12 text-sm sm:text-base 
                  relative flex items-center px-3 
                  focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500 focus-within:ring-offset-0
                  [&_input]:outline-none! [&_input]:border-none! [&_input]:ring-0! [&_input]:ring-offset-0!
                  [&_.PhoneInputCountrySelect]:bg-transparent! [&_.PhoneInputCountrySelect]:border-none! [&_.PhoneInputCountrySelect]:!focus:ring-0 [&_.PhoneInputCountrySelect]:!focus:ring-offset-0
                `}
                            >
                                <PhoneInput
                                    international
                                    defaultCountry="SY"
                                    value={phoneValue}
                                    onChange={setPhoneValue}
                                    className="w-full h-full text-right bg-transparent"
                                    placeholder="أدخل رقم هاتفك"
                                    labels={ar}
                                    id="phone"
                                    name="phone"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password"><RequiredLabel>كلمة المرور</RequiredLabel></Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="أدخل كلمة المرور"
                                    disabled={loading}
                                    required
                                    className={inputClasses}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-0 top-0 h-full px-3 hover:bg-transparent"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                disabled={loading}
                            />
                            <Label htmlFor="remember" className="text-xs px-1 sm:text-sm font-medium leading-none cursor-pointer">
                                تذكرني
                            </Label>
                        </div>

                        {/* Error */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white h-11 sm:h-12 text-sm sm:text-base"
                        >
                            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                        </Button>

                        {/* Register Link */}
                        <div className="text-center pt-2">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                ليس لديك حساب؟{" "}
                                <Link href="/register" className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                                    إنشاء حساب
                                </Link>
                            </p>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
