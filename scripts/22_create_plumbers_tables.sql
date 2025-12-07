-- Create table for Plumber directory
CREATE TABLE IF NOT EXISTS public.plumbers (
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
CREATE INDEX IF NOT EXISTS idx_plumbers_city
  ON public.plumbers(city);

CREATE INDEX IF NOT EXISTS idx_plumbers_gender
  ON public.plumbers(gender);

CREATE INDEX IF NOT EXISTS idx_plumbers_created_by
  ON public.plumbers(created_by);

-- Create updated_at trigger
CREATE TRIGGER set_plumbers_updated_at
  BEFORE UPDATE ON public.plumbers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.plumbers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read plumbers
CREATE POLICY "Anyone can view plumbers"
  ON public.plumbers
  FOR SELECT
  USING (true);

-- Only admins can insert
DROP POLICY IF EXISTS "Admins can insert plumbers" ON public.plumbers;
CREATE POLICY "Admins can insert plumbers"
  ON public.plumbers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can update
CREATE POLICY "Admins can update plumbers"
  ON public.plumbers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can delete
CREATE POLICY "Admins can delete plumbers"
  ON public.plumbers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
