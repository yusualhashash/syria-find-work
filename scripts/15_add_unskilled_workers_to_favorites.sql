-- Add support for unskilled_workers in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS unskilled_worker_id UUID REFERENCES unskilled_workers(id) ON DELETE CASCADE;

-- Create index for unskilled_workers
CREATE INDEX IF NOT EXISTS idx_favorites_unskilled_worker ON favorites(unskilled_worker_id);

-- Update constraint to allow only one type of item per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_item;

-- Add new constraint including unskilled_workers
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_item 
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NOT NULL AND tiler_id IS NULL AND unskilled_worker_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NOT NULL AND unskilled_worker_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL AND unskilled_worker_id IS NOT NULL)
);

-- Add unique constraint for unskilled_workers
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_unskilled_worker_idx 
ON favorites(user_id, unskilled_worker_id) 
WHERE unskilled_worker_id IS NOT NULL;
