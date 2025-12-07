CREATE TABLE turkish_teachers (
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

ALTER TABLE turkish_teachers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public turkish_teachers are viewable by everyone." ON turkish_teachers
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can create turkish_teachers." ON turkish_teachers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their own turkish_teachers." ON turkish_teachers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can delete their own turkish_teachers." ON turkish_teachers
  FOR DELETE USING (auth.uid() = id);
