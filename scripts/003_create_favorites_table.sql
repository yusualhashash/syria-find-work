-- Drop existing favorites table and recreate with proper setup for custom auth
DROP TABLE IF EXISTS favorites CASCADE;

-- Recreate favorites table supporting only English teachers
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  english_teacher_id UUID NOT NULL REFERENCES english_teachers(id) ON DELETE CASCADE, -- Only English Teachers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure unique favorites per user per English teacher
  CONSTRAINT unique_user_english_teacher UNIQUE(user_id, english_teacher_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_english_teacher ON favorites(english_teacher_id);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies that work with custom cookie-based authentication
-- Since auth.uid() doesn't work with custom auth, we use permissive policies
-- and rely on application-level security (server actions check user session)

-- Allow users to view all favorites (application filters by user_id)
CREATE POLICY "Allow viewing favorites"
  ON favorites
  FOR SELECT
  USING (true);

-- Allow inserting favorites if user_id exists in users table
CREATE POLICY "Allow inserting favorites"
  ON favorites
  FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = user_id)
  );

-- Allow deleting favorites (application ensures user owns the favorite)
CREATE POLICY "Allow deleting favorites"
  ON favorites
  FOR DELETE
  USING (true);

-- Grant necessary permissions
GRANT ALL ON favorites TO authenticated;
GRANT ALL ON favorites TO anon;
