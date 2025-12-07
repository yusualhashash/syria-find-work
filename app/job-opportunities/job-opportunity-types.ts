export interface JobOpportunity {
  id: string
  job_name: string
  description: string
  city: string
  work_address: string
  whatsapp_number: string
  notes: string | undefined | null
  is_approved: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
  created_by: string
  creator?: {
    full_name: string
    phone_number: string
  }
}
