"use server"

import { createServerSupabaseClient } from "@/lib/server-actions"
import { getCurrentUser } from "@/lib/server-actions"
import { revalidatePath } from "next/cache"

export async function createJobOpportunity(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "يجب تسجيل الدخول" }
  }

  const job_name = formData.get("job_name") as string
  const description = formData.get("description") as string
  const city = formData.get("city") as string
  const work_address = formData.get("work_address") as string
  const whatsapp_number = formData.get("whatsapp_number") as string
  const notes = formData.get("notes") as string | null

  if (!job_name || !description || !city || !work_address || !whatsapp_number) {
    return { error: "يرجى ملء جميع الحقول المطلوبة" }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("job_opportunities").insert({
    job_name,
    description,
    city,
    work_address,
    whatsapp_number,
    notes: notes || null,
    created_by: user.id,
    is_approved: false, // Pending approval by admin
  })

  if (error) {
    console.error("Error creating job opportunity:", error)
    return { error: "حدث خطأ أثناء إضافة فرصة العمل" }
  }

  revalidatePath("/job-opportunities")
  return { success: true }
}

export async function deleteJobOpportunity(jobId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "يجب تسجيل الدخول" }
  }

  const supabase = await createServerSupabaseClient()

  // Check if user owns this job or is admin
  const { data: job } = await supabase.from("job_opportunities").select("created_by").eq("id", jobId).single()

  if (!job) {
    return { error: "فرصة العمل غير موجودة" }
  }

  if (job.created_by !== user.id && !user.is_admin) {
    return { error: "ليس لديك صلاحية لحذف هذه فرصة العمل" }
  }

  const { error } = await supabase.from("job_opportunities").update({ is_deleted: true }).eq("id", jobId)

  if (error) {
    console.error("Error moving job opportunity to trash:", error)
    return { error: "حدث خطأ أثناء نقل فرصة العمل إلى سلة المهملات" }
  }

  revalidatePath("/job-opportunities")
  revalidatePath("/job-opportunities/my-jobs")
  return { success: true }
}

export async function permanentDeleteJobOpportunity(jobId: string) {
  const user = await getCurrentUser()

  if (!user || !user.is_admin) {
    return { error: "ليس لديك صلاحية لحذف فرص العمل بشكل دائم" }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("job_opportunities").delete().eq("id", jobId)

  if (error) {
    console.error("Error permanently deleting job opportunity:", error)
    return { error: "حدث خطأ أثناء حذف فرصة العمل بشكل دائم" }
  }

  revalidatePath("/admin/job-opportunities")
  revalidatePath("/job-opportunities/my-jobs") // Revalidate user's jobs page
  return { success: true }
}

export async function approveJobOpportunity(jobId: string) {
  const user = await getCurrentUser()

  if (!user || !user.is_admin) {
    return { error: "ليس لديك صلاحية للموافقة على فرص العمل" }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("job_opportunities").update({ is_approved: true, is_deleted: false }).eq("id", jobId)

  if (error) {
    console.error("Error approving job opportunity:", error)
    return { error: "حدث خطأ أثناء الموافقة على فرصة العمل" }
  }

  revalidatePath("/admin/job-opportunities")
  return { success: true }
}

export async function getPendingJobOpportunityCount() {
  const supabase = await createServerSupabaseClient()
  const { count, error } = await supabase
    .from("job_opportunities")
    .select("*", { count: "exact" })
    .eq("is_approved", false)
    .eq("is_deleted", false)

  if (error) {
    console.error("Error fetching pending job opportunity count:", error)
    return { success: false, error: error.message }
  }
  return { success: true, count: count }
}

export async function getJobOpportunityCount() {
  const supabase = await createServerSupabaseClient()
  const { count, error } = await supabase
    .from("job_opportunities")
    .select("*", { count: "exact" })
    .eq("is_approved", true)
    .eq("is_deleted", false)

  if (error) {
    console.error("Error fetching job opportunity count:", error)
    return { success: false, error: error.message }
  }
  return { success: true, count: count }
}


export async function rejectJobOpportunity(jobId: string) {
  const user = await getCurrentUser()

  if (!user || !user.is_admin) {
    return { error: "ليس لديك صلاحية لرفض فرص العمل" }
  }

  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("job_opportunities").update({ is_approved: false, is_deleted: true }).eq("id", jobId)

  if (error) {
    console.error("Error moving job opportunity to trash:", error)
    return { error: "حدث خطأ أثناء نقل فرصة العمل إلى سلة المهملات" }
  }

  revalidatePath("/admin/job-opportunities")
  return { success: true }
}
