-- IMPORTANT: Use these DROP statements only if you want to completely reset the table and its policies.
-- DROP TRIGGER IF EXISTS set_english_teachers_updated_at ON public.english_teachers;
-- DROP POLICY IF EXISTS "Admins can delete english_teachers" ON public.english_teachers;
-- DROP POLICY IF EXISTS "Admins can update english_teachers" ON public.english_teachers;
-- DROP POLICY IF EXISTS "Admins can insert english_teachers" ON public.english_teachers;
-- DROP POLICY IF EXISTS "Anyone can view english_teachers" ON public.english_teachers;
-- DROP INDEX IF EXISTS idx_english_teachers_created_by;
-- DROP INDEX IF EXISTS idx_english_teachers_gender;
-- DROP INDEX IF EXISTS idx_english_teachers_city;
-- DROP TABLE IF EXISTS public.english_teachers;

-- Create teachers table for English teacher directory
CREATE TABLE IF NOT EXISTS public.english_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  age INTEGER NOT NULL CHECK (age > 0 AND age < 100),
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

-- Create indexes for searching
CREATE INDEX IF NOT EXISTS idx_english_teachers_city
  ON public.english_teachers(city);

CREATE INDEX IF NOT EXISTS idx_english_teachers_gender
  ON public.english_teachers(gender);

CREATE INDEX IF NOT EXISTS idx_english_teachers_created_by
  ON public.english_teachers(created_by);

-- Create updated_at trigger
CREATE TRIGGER set_english_teachers_updated_at
  BEFORE UPDATE ON public.english_teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.english_teachers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read english_teachers
CREATE POLICY "Anyone can view english_teachers"
  ON public.english_teachers
  FOR SELECT
  USING (true);

-- Only admins can insert (UPDATED POLICY)
DROP POLICY IF EXISTS "Admins can insert english_teachers" ON public.english_teachers;
CREATE POLICY "Admins can insert english_teachers"
  ON public.english_teachers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can update
CREATE POLICY "Admins can update english_teachers"
  ON public.english_teachers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can delete
CREATE POLICY "Admins can delete english_teachers"
  ON public.english_teachers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
