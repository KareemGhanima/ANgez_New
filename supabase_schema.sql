-- 1. Users Table
-- Ties directly to Supabase Auth using the REFERENCES auth.users(id)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    avatar_url TEXT,
    avatar_config JSONB DEFAULT '{}'::jsonb,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Attributes Table
-- One-to-One mapping with the users table.
CREATE TABLE public.attributes (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    academic INT DEFAULT 0,
    discipline INT DEFAULT 0,
    fitness INT DEFAULT 0,
    social INT DEFAULT 0
);

-- 3. Missions Table
-- Global dictionary of available missions
CREATE TABLE public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    xp_reward INT NOT NULL DEFAULT 0,
    type TEXT NOT NULL
);

-- 4. User Missions Table
-- Junction table mapping many-to-many relationship tracking mission progress per user
CREATE TABLE public.user_missions (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, mission_id)
);

-- 5. Inventory Table
-- Tracks item possession and equip status
CREATE TABLE public.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    equipped BOOLEAN DEFAULT false,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- SECURING XP UPDATES (PREVENTING RACE CONDITIONS)
-- =========================================================================
-- 
-- WARNING: 
-- Never let the client read XP, add an amount, and write it back.
-- If a user completes two missions within milliseconds, both operations might
-- read the same base XP, resulting in the final write overwriting the first's reward.
--
-- SOLUTION:
-- Use a Postgres Remote Procedure Call (RPC) to calculate the addition securely 
-- at the database level where row-level locking ensures atomicity.
--
-- Execute this snippet in Supabase SQL editor to create the RPC:

CREATE OR REPLACE FUNCTION award_xp(user_id_param UUID, xp_addition INT)
RETURNS void AS $$
BEGIN
    UPDATE public.users 
    SET xp = xp + xp_addition
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- To call this safely from Next.js (Supabase Client):
-- const { error } = await supabase.rpc('award_xp', { 
--    user_id_param: session.user.id, 
--    xp_addition: 250 
-- });
