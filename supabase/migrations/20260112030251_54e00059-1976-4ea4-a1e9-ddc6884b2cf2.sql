-- Fix 1: Update analytics functions to require authentication and return user-specific data only
-- This prevents exposure of all users' mental health data

-- Drop and recreate get_analytics_summary with auth check
CREATE OR REPLACE FUNCTION public.get_analytics_summary()
RETURNS TABLE(
    total_screenings bigint, 
    low_risk bigint, 
    medium_risk bigint, 
    high_risk bigint, 
    avg_sentiment numeric, 
    unique_users bigint
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Require authentication
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Return analytics only for the authenticated user's screenings
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_screenings,
        COUNT(CASE WHEN sr.risk_level = 'rendah' THEN 1 END)::bigint as low_risk,
        COUNT(CASE WHEN sr.risk_level = 'sedang' THEN 1 END)::bigint as medium_risk,
        COUNT(CASE WHEN sr.risk_level = 'tinggi' THEN 1 END)::bigint as high_risk,
        COALESCE(AVG(sr.sentiment_score), 0)::numeric as avg_sentiment,
        1::bigint as unique_users
    FROM public.screening_results sr
    WHERE sr.user_id = auth.uid();
END;
$$;

-- Drop and recreate get_daily_analytics with auth check
CREATE OR REPLACE FUNCTION public.get_daily_analytics(days_back integer DEFAULT 30)
RETURNS TABLE(
    date date, 
    screenings bigint, 
    low_risk bigint, 
    medium_risk bigint, 
    high_risk bigint
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    -- Require authentication
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Return daily analytics only for the authenticated user's screenings
    RETURN QUERY
    SELECT 
        DATE(sr.created_at) as date,
        COUNT(*)::bigint as screenings,
        COUNT(CASE WHEN sr.risk_level = 'rendah' THEN 1 END)::bigint as low_risk,
        COUNT(CASE WHEN sr.risk_level = 'sedang' THEN 1 END)::bigint as medium_risk,
        COUNT(CASE WHEN sr.risk_level = 'tinggi' THEN 1 END)::bigint as high_risk
    FROM public.screening_results sr
    WHERE sr.user_id = auth.uid()
      AND sr.created_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY DATE(sr.created_at)
    ORDER BY date DESC;
END;
$$;

-- Fix 2: Add DELETE policy for screening_results so users can manage their data
-- This addresses privacy concerns - users should be able to delete their mental health data
CREATE POLICY "Users can delete their own screenings"
ON public.screening_results
FOR DELETE
USING (auth.uid() = user_id);