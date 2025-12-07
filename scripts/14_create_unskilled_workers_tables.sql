CREATE TABLE unskilled_workers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL UNIQUE,
  gender TEXT NOT NULL,
  age INTEGER NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE unskilled_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public unskilled workers are viewable by everyone." ON unskilled_workers
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create unskilled workers." ON unskilled_workers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own unskilled workers." ON unskilled_workers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can delete their own unskilled workers." ON unskilled_workers
  FOR DELETE USING (auth.uid() = id);
