-- Add support for Arabic teachers in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS arabic_teacher_id UUID REFERENCES arabic_teachers(id) ON DELETE CASCADE;

-- Create index for Arabic teachers
CREATE INDEX IF NOT EXISTS idx_favorites_arabic_teacher ON favorites(arabic_teacher_id);

-- Update constraint to allow either English or Arabic teacher
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_english_teacher;

-- Add new constraint for unique favorites per user per teacher (English or Arabic)
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_teacher 
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL)
);

-- Add unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_english_teacher_idx 
ON favorites(user_id, english_teacher_id) 
WHERE english_teacher_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS unique_user_arabic_teacher_idx 
ON favorites(user_id, arabic_teacher_id) 
WHERE arabic_teacher_id IS NOT NULL;
