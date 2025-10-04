-- Add user ownership to mcq_questions
ALTER TABLE public.mcq_questions
ADD COLUMN user_id uuid;

-- Remove existing questions to enforce user scoping
DELETE FROM public.mcq_questions WHERE user_id IS NULL;

-- Ensure the user_id is always populated and references auth.users
ALTER TABLE public.mcq_questions
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.mcq_questions
ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE public.mcq_questions
ADD CONSTRAINT mcq_questions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update row level security policies to be user-specific
DROP POLICY IF EXISTS "Anyone can view questions" ON public.mcq_questions;
DROP POLICY IF EXISTS "Anyone can create questions" ON public.mcq_questions;
DROP POLICY IF EXISTS "Anyone can update questions" ON public.mcq_questions;
DROP POLICY IF EXISTS "Anyone can delete questions" ON public.mcq_questions;

CREATE POLICY "Users can view own questions"
ON public.mcq_questions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own questions"
ON public.mcq_questions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions"
ON public.mcq_questions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own questions"
ON public.mcq_questions
FOR DELETE
USING (auth.uid() = user_id);
