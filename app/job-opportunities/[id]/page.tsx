import { redirect, notFound } from "next/navigation"
import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions"
import JobOpportunityDetail from "./detail"

export default async function JobOpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await createServerSupabaseClient()

  const { data: job, error } = await supabase
    .from("job_opportunities")
    .select(`
      *,
      creator:created_by (
        full_name,
        phone_number
      )
    `)
    .eq("id", id)
    .single()

  if (error || !job) {
    notFound()
  }

  // Check if user can view this job
  if (!job.is_approved && job.created_by !== user.id && !user.is_admin) {
    notFound()
  }

  return <JobOpportunityDetail job={job} user={user} />
}
