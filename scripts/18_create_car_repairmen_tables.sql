-- Create table for Car repairman directory
CREATE TABLE IF NOT EXISTS public.car_repairmen (
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
CREATE INDEX IF NOT EXISTS idx_car_repairmen_city
  ON public.car_repairmen(city);

CREATE INDEX IF NOT EXISTS idx_car_repairmen_gender
  ON public.car_repairmen(gender);

CREATE INDEX IF NOT EXISTS idx_car_repairmen_created_by
  ON public.car_repairmen(created_by);

-- Create updated_at trigger
CREATE TRIGGER set_car_repairmen_updated_at
  BEFORE UPDATE ON public.car_repairmen
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.car_repairmen ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read car_repairmen
CREATE POLICY "Anyone can view car_repairmen"
  ON public.car_repairmen
  FOR SELECT
  USING (true);

-- Only admins can insert
DROP POLICY IF EXISTS "Admins can insert car_repairmen" ON public.car_repairmen;
CREATE POLICY "Admins can insert car_repairmen"
  ON public.car_repairmen
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can update
CREATE POLICY "Admins can update car_repairmen"
  ON public.car_repairmen
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );

-- Only admins can delete
CREATE POLICY "Admins can delete car_repairmen"
  ON public.car_repairmen
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.is_admin = true
    )
  );
