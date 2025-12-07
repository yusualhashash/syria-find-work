import { redirect } from "next/navigation"
import { createServerSupabaseClient, getCurrentUser } from "@/lib/server-actions"
import MyJobsClient from "./my-jobs-client"

export default async function MyJobsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await createServerSupabaseClient()

  // Fetch user's job opportunities
  const { data: jobs, error } = await supabase
    .from("job_opportunities")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching my jobs:", error)
  }

  return <MyJobsClient jobs={jobs || []} />
}
