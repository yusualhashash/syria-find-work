CREATE TABLE tilers (
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

ALTER TABLE tilers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public tilers are viewable by everyone." ON tilers
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create tilers." ON tilers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own tilers." ON tilers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can delete their own tilers." ON tilers
  FOR DELETE USING (auth.uid() = id);
