-- RUN THIS IN YOUR SUPABASE SQL EDITOR

-- 1. UPGRADE PROFILES TABLE
-- We assume the `profiles` table exists (or `users` table). Next.js Supabase tutorials usually define a `profiles` table.
-- If your table is named `users`, replace `profiles` with `users` below.

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS path text DEFAULT 'default',
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user',
ADD COLUMN IF NOT EXISTS avatar_styles jsonb DEFAULT '{"skin": "base", "eyes": "normal", "outfit": "starter_neutral"}'::jsonb,
ADD COLUMN IF NOT EXISTS stats jsonb DEFAULT '{"academic": 0, "fitness": 0, "discipline": 0, "social": 0}'::jsonb,
ADD COLUMN IF NOT EXISTS subscription_status boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en';

-- 2. CREATE PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payment_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    transaction_id text,
    screenshot_url text NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES FOR PAYMENT_REQUESTS
-- Users can insert their own payment requests
CREATE POLICY "Users can create their own payment requests" 
ON public.payment_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can view their own payment requests
CREATE POLICY "Users can view their own payment requests" 
ON public.payment_requests FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view and update all payment requests
-- (Requirement: The users table must have role = 'admin' for your UID)
CREATE POLICY "Admins can view all payment requests" 
ON public.payment_requests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
  )
);

CREATE POLICY "Admins can update payment requests" 
ON public.payment_requests FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE public.users.id = auth.uid() AND public.users.role = 'admin'
  )
);

-- 5. REALTIME CONFIGURATION
-- Ensure replication is enabled for profiles/users and payments so our JS listeners work
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.payment_requests;
