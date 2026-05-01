-- Create Sessions table for custom session management
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);

-- Enable RLS
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own sessions" 
    ON public.sessions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
    ON public.sessions FOR DELETE 
    USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
