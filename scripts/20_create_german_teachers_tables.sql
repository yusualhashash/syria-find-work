-- Create table for German teacher directory
CREATE TABLE IF NOT EXISTS public.german_teachers (
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
CREATE INDEX IF NOT EXISTS idx_german_teachers_city
  ON public.german_teachers(city);

CREATE INDEX IF NOT EXISTS idx_german_teachers_gender
  ON public.german_teachers(gender);

CREATE INDEX IF NOT EXISTS idx_german_teachers_created_by
  ON public.german_teachers(created_by);

-- Create updated_at trigger
CREATE TRIGGER set_german_teachers_updated_at
  BEFORE UPDATE ON public.german_teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.german_teachers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read german_teachers
CREATE POLICY "Anyone can view german_teachers"
  ON public.german_teachers
  FOR SELECT
  USING (true);

-- Only admins can insert
DROP POLICY IF EXISTS "Admins can insert german_teachers" ON public.german_teachers;
CREATE POLICY "Admins can insert german_teachers"
  ON public.german_teachers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can update
CREATE POLICY "Admins can update german_teachers"
  ON public.german_teachers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can delete
CREATE POLICY "Admins can delete german_teachers"
  ON public.german_teachers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
