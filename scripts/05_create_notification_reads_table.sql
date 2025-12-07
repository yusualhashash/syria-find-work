-- Create table to track which users have seen which notifications
CREATE TABLE IF NOT EXISTS public.notification_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, notification_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON public.notification_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_reads_notification_id ON public.notification_reads(notification_id);

-- Enable RLS
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notification reads" ON public.notification_reads;
DROP POLICY IF EXISTS "Users can mark notifications as read" ON public.notification_reads;

-- Create permissive policies for custom auth
CREATE POLICY "Users can view their own notification reads"
  ON public.notification_reads FOR SELECT
  USING (true);

CREATE POLICY "Users can mark notifications as read"
  ON public.notification_reads FOR INSERT
  WITH CHECK (true);
