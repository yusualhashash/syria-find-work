-- Add support for electrician_teachers in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS electrician_teacher_id UUID REFERENCES electrician_teachers(id) ON DELETE CASCADE;

-- Create index for electrician_teachers
CREATE INDEX IF NOT EXISTS idx_favorites_electrician_teacher ON favorites(electrician_teacher_id);

-- Update constraint to allow only one type of item per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_item;

-- Add new constraint including electrician_teachers
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_item 
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NOT NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NOT NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NOT NULL AND electrician_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NOT NULL)
);

-- Add unique constraint for electrician_teachers
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_electrician_teacher_idx 
ON favorites(user_id, electrician_teacher_id) 
WHERE electrician_teacher_id IS NOT NULL;
