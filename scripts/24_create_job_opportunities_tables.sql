-- Create job opportunities table with admin approval
CREATE TABLE IF NOT EXISTS public.job_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  work_address TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  notes TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false, -- Added is_deleted column
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Create indexes for searching
CREATE INDEX IF NOT EXISTS idx_job_opportunities_city
  ON public.job_opportunities(city);

CREATE INDEX IF NOT EXISTS idx_job_opportunities_approved
  ON public.job_opportunities(is_approved);

CREATE INDEX IF NOT EXISTS idx_job_opportunities_deleted
  ON public.job_opportunities(is_deleted); -- Added index for is_deleted

CREATE INDEX IF NOT EXISTS idx_job_opportunities_created_by
  ON public.job_opportunities(created_by);

-- Create updated_at trigger
CREATE TRIGGER set_job_opportunities_updated_at
  BEFORE UPDATE ON public.job_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.job_opportunities ENABLE ROW LEVEL SECURITY;

-- Users can view approved jobs that are not deleted, or their own jobs that are not deleted, admins can view all
CREATE POLICY "Users can view approved/own non-deleted jobs, admins all"
  ON public.job_opportunities
  FOR SELECT
  USING (
    (is_approved = true AND is_deleted = false)
    OR (created_by = auth.uid() AND is_deleted = false)
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Any authenticated user can insert jobs (will be pending approval and not deleted)
CREATE POLICY "Authenticated users can insert jobs"
  ON public.job_opportunities
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
    AND is_deleted = false
  );

-- Users can update only their own non-deleted jobs, admins can update any
CREATE POLICY "Users can update own non-deleted jobs, admins all"
  ON public.job_opportunities
  FOR UPDATE
  USING (
    (created_by = auth.uid() AND is_deleted = false)
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Users can "delete" (mark as deleted) their own jobs, admins can "delete" any
CREATE POLICY "Users can mark own jobs as deleted, admins all"
  ON public.job_opportunities
  FOR UPDATE
  USING (
    (created_by = auth.uid() AND is_deleted = false)
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Admins can permanently delete any job
CREATE POLICY "Admins can permanently delete jobs"
  ON public.job_opportunities
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
