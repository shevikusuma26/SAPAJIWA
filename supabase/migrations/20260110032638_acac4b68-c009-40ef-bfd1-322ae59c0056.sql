-- Drop the security definer view and recreate as regular view
DROP VIEW IF EXISTS public.analytics_summary;

-- Create analytics_summary as a function instead (more secure)
CREATE OR REPLACE FUNCTION public.get_analytics_summary()
RETURNS TABLE (
    total_screenings BIGINT,
    low_risk BIGINT,
    medium_risk BIGINT,
    high_risk BIGINT,
    avg_sentiment NUMERIC,
    unique_users BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT 
        COUNT(*) as total_screenings,
        COUNT(CASE WHEN risk_level = 'rendah' THEN 1 END) as low_risk,
        COUNT(CASE WHEN risk_level = 'sedang' THEN 1 END) as medium_risk,
        COUNT(CASE WHEN risk_level = 'tinggi' THEN 1 END) as high_risk,
        COALESCE(AVG(sentiment_score), 0) as avg_sentiment,
        COUNT(DISTINCT user_id) as unique_users
    FROM public.screening_results;
$$;

-- Create daily analytics function
CREATE OR REPLACE FUNCTION public.get_daily_analytics(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
    date DATE,
    screenings BIGINT,
    low_risk BIGINT,
    medium_risk BIGINT,
    high_risk BIGINT
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as screenings,
        COUNT(CASE WHEN risk_level = 'rendah' THEN 1 END) as low_risk,
        COUNT(CASE WHEN risk_level = 'sedang' THEN 1 END) as medium_risk,
        COUNT(CASE WHEN risk_level = 'tinggi' THEN 1 END) as high_risk
    FROM public.screening_results
    WHERE created_at >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
    ORDER BY date DESC;
$$;