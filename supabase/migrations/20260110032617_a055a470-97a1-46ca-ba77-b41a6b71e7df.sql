-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    gender TEXT,
    birth_date DATE,
    occupation TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create screening_results table
CREATE TABLE public.screening_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    screening_type TEXT NOT NULL DEFAULT 'general',
    responses JSONB NOT NULL DEFAULT '[]',
    risk_level TEXT NOT NULL,
    confidence NUMERIC(5,2),
    sentiment_score NUMERIC(5,2),
    dominant_emotion TEXT,
    recommendations JSONB DEFAULT '[]',
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on screening_results
ALTER TABLE public.screening_results ENABLE ROW LEVEL SECURITY;

-- Screening policies
CREATE POLICY "Users can view their own screenings"
ON public.screening_results FOR SELECT
USING (auth.uid() = user_id OR is_anonymous = true);

CREATE POLICY "Users can create screenings"
ON public.screening_results FOR INSERT
WITH CHECK (auth.uid() = user_id OR is_anonymous = true);

-- Create analytics_summary view for dashboard
CREATE OR REPLACE VIEW public.analytics_summary AS
SELECT 
    COUNT(*) as total_screenings,
    COUNT(CASE WHEN risk_level = 'rendah' THEN 1 END) as low_risk,
    COUNT(CASE WHEN risk_level = 'sedang' THEN 1 END) as medium_risk,
    COUNT(CASE WHEN risk_level = 'tinggi' THEN 1 END) as high_risk,
    AVG(sentiment_score) as avg_sentiment,
    COUNT(DISTINCT user_id) as unique_users,
    DATE_TRUNC('day', created_at) as date
FROM public.screening_results
GROUP BY DATE_TRUNC('day', created_at);

-- Create trigger for profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();