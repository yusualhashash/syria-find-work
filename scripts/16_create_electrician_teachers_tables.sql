-- Create teachers table for Electrician teacher directory
CREATE TABLE IF NOT EXISTS public.electrician_teachers (
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
CREATE INDEX IF NOT EXISTS idx_electrician_teachers_city
  ON public.electrician_teachers(city);

CREATE INDEX IF NOT EXISTS idx_electrician_teachers_gender
  ON public.electrician_teachers(gender);

CREATE INDEX IF NOT EXISTS idx_electrician_teachers_created_by
  ON public.electrician_teachers(created_by);

-- Create updated_at trigger
CREATE TRIGGER set_electrician_teachers_updated_at
  BEFORE UPDATE ON public.electrician_teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.electrician_teachers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read electrician_teachers
CREATE POLICY "Anyone can view electrician_teachers"
  ON public.electrician_teachers
  FOR SELECT
  USING (true);

-- Only admins can insert
DROP POLICY IF EXISTS "Admins can insert electrician_teachers" ON public.electrician_teachers;
CREATE POLICY "Admins can insert electrician_teachers"
  ON public.electrician_teachers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can update
CREATE POLICY "Admins can update electrician_teachers"
  ON public.electrician_teachers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can delete
CREATE POLICY "Admins can delete electrician_teachers"
  ON public.electrician_teachers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
