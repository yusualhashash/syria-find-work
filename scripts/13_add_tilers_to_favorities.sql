-- Add support for tilers in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS tiler_id UUID REFERENCES tilers(id) ON DELETE CASCADE;

-- Create index for tilers
CREATE INDEX IF NOT EXISTS idx_favorites_tiler ON favorites(tiler_id);

-- Update constraint to allow only one type of item per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_item;

-- Add new constraint including tilers
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_item 
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL AND blacksmith_id IS NULL AND tiler_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NOT NULL AND tiler_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL AND tiler_id IS NOT NULL)
);

-- Add unique constraint for tilers
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_tiler_idx 
ON favorites(user_id, tiler_id) 
WHERE tiler_id IS NOT NULL;
