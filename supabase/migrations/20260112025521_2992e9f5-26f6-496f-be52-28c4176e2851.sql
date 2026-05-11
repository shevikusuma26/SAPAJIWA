-- Fix 1: Drop the overly permissive RLS policies that allow any authenticated user to read all anonymous screenings
-- This is a critical security fix for PUBLIC_DATA_EXPOSURE vulnerability

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own screenings" ON public.screening_results;
DROP POLICY IF EXISTS "Users can create screenings" ON public.screening_results;

-- Add session_token column for anonymous access control
ALTER TABLE public.screening_results 
ADD COLUMN IF NOT EXISTS session_token TEXT;

-- Create index for session_token lookups
CREATE INDEX IF NOT EXISTS idx_screening_results_session_token 
ON public.screening_results(session_token) 
WHERE session_token IS NOT NULL;

-- Create new secure SELECT policy - users can only view their own screenings
-- Anonymous users cannot view other anonymous screenings
CREATE POLICY "Users can view their own screenings" 
ON public.screening_results 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create new secure INSERT policy - users can create their own screenings
-- Anonymous screenings require a session_token
CREATE POLICY "Users can create screenings" 
ON public.screening_results 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) OR 
  (user_id IS NULL AND is_anonymous = true AND session_token IS NOT NULL)
);