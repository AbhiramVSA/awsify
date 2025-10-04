-- Create the mcq_questions table
CREATE TABLE public.mcq_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mcq_questions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (personal study tool)
CREATE POLICY "Anyone can view questions" 
ON public.mcq_questions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create questions" 
ON public.mcq_questions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update questions" 
ON public.mcq_questions 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete questions" 
ON public.mcq_questions 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mcq_questions_updated_at
BEFORE UPDATE ON public.mcq_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_mcq_questions_category ON public.mcq_questions(category);
CREATE INDEX idx_mcq_questions_difficulty ON public.mcq_questions(difficulty);
CREATE INDEX idx_mcq_questions_service ON public.mcq_questions(service_name);