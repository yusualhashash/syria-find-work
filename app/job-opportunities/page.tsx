import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/server-actions"
import { getCurrentUser } from "@/lib/server-actions"
import JobOpportunitiesClient from "./job-opportunities-client"

export default async function JobOpportunitiesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await createServerSupabaseClient()

  // Fetch job opportunities: approved jobs for all, and user's own unapproved jobs
  const { data: jobs, error } = await supabase
    .from("job_opportunities")
    .select(
      `
      *,
      creator:created_by (
        full_name,
        phone_number
      )
    `,
    )
    .eq("is_approved", true)
    .eq("is_deleted", false) // Ensure only approved and non-deleted jobs are fetched
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching job opportunities:", error)
  }

  return <JobOpportunitiesClient jobs={jobs || []} user={user} />
}
