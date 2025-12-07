-- Add support for blacksmiths in favorites table
ALTER TABLE public.favorites
ADD COLUMN IF NOT EXISTS blacksmith_id UUID REFERENCES blacksmiths(id) ON DELETE CASCADE;

-- Create index for blacksmiths
CREATE INDEX IF NOT EXISTS idx_favorites_blacksmith ON favorites(blacksmith_id);

-- Update constraint to allow only one type of item per favorite
ALTER TABLE public.favorites
DROP CONSTRAINT IF EXISTS unique_user_teacher;

-- Add new constraint for unique favorites per user per item (English/Arabic/Turkish teacher or blacksmith)
ALTER TABLE public.favorites
ADD CONSTRAINT unique_user_item 
CHECK (
  (english_teacher_id IS NOT NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NOT NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NOT NULL AND blacksmith_id IS NULL) OR
  (english_teacher_id IS NULL AND arabic_teacher_id IS NULL AND turkish_teacher_id IS NULL AND blacksmith_id IS NOT NULL)
);

-- Add unique constraint for blacksmiths
CREATE UNIQUE INDEX IF NOT EXISTS unique_user_blacksmith_idx 
ON favorites(user_id, blacksmith_id) 
WHERE blacksmith_id IS NOT NULL;
