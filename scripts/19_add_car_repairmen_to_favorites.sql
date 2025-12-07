-- Add support for car_repairmen in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS car_repairman_id UUID REFERENCES car_repairmen(id) ON DELETE CASCADE;

-- Create index for car_repairmen
CREATE INDEX IF NOT EXISTS idx_favorites_car_repairman ON favorites(car_repairman_id);

-- Update constraint to allow only one type of item per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_item;

-- Add new constraint including car_repairmen
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_item
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NOT NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NOT NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NOT NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NOT NULL AND car_repairman_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL AND electrician_teacher_id IS NULL AND car_repairman_id IS NOT NULL)
);

-- Add unique constraint for car_repairmen
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_car_repairman_idx
ON favorites(user_id, car_repairman_id)
WHERE car_repairman_id IS NOT NULL;
