-- Add support for german_teachers in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS german_teacher_id UUID REFERENCES german_teachers(id) ON DELETE CASCADE;

-- Create index for german_teachers
CREATE INDEX IF NOT EXISTS idx_favorites_german_teacher ON favorites(german_teacher_id);

-- Update constraint to allow only one type of item per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_item;

-- Add new constraint including german_teachers
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_item
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NOT NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NOT NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NOT NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NOT NULL AND car_repairman_id IS NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NOT NULL AND german_teacher_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL AND german_teacher_id IS NOT NULL)
);

-- Add unique constraint for german_teachers
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_german_teacher_idx
ON favorites(user_id, german_teacher_id)
WHERE german_teacher_id IS NOT NULL;
