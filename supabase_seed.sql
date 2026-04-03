-- SEED DATA FOR MISSIONS
INSERT INTO public.missions (title, xp_reward, type)
VALUES 
    ('Deep Work Session', 300, 'Academic'),
    ('Iron Core Protocol', 250, 'Fitness'),
    ('Guild Networking', 150, 'Social'),
    ('Base Maintenance', 100, 'Other')
ON CONFLICT (id) DO NOTHING;
