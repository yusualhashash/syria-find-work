-- Add support for Turkish teachers in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS turkish_teacher_id UUID REFERENCES turkish_teachers(id) ON DELETE CASCADE;

-- Create index for Turkish teachers
CREATE INDEX IF NOT EXISTS idx_favorites_turkish_teacher ON favorites(turkish_teacher_id);

-- Update constraint to allow only one type of teacher per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_teacher;

-- Add new constraint for unique favorites per user per teacher (English, Arabic, or Turkish)
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_teacher 
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL)
);

-- Add unique constraints for Turkish teachers
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_turkish_teacher_idx 
ON favorites(user_id, turkish_teacher_id) 
WHERE turkish_teacher_id IS NOT NULL;
