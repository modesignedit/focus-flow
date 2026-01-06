-- Add category column to habits table
ALTER TABLE public.habits 
ADD COLUMN category TEXT DEFAULT 'personal';

-- Add an index for faster category filtering
CREATE INDEX idx_habits_category ON public.habits(category);