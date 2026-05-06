-- GOLD SHE INDUSTRIAL MOBILE ECOSYSTEM MIGRATION
-- Module 2, 3, and 4 Backend Support

-- 1. Node Pairing Tokens
CREATE TABLE IF NOT EXISTS public.node_pairing_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    node_slot INTEGER NOT NULL CHECK (node_slot BETWEEN 1 AND 4),
    role TEXT NOT NULL,
    device_fingerprint TEXT,
    claimed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Node Registrations (The 4-Device Hub)
CREATE TABLE IF NOT EXISTS public.node_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_slot INTEGER UNIQUE NOT NULL CHECK (node_slot BETWEEN 1 AND 4),
    device_name TEXT NOT NULL,
    device_fingerprint TEXT UNIQUE NOT NULL,
    push_token TEXT,
    role TEXT NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    battery_pct INTEGER,
    signal_strength TEXT,
    current_screen TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    linked_by UUID REFERENCES auth.users(id),
    linked_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Node Tasks (PC -> Mobile)
CREATE TABLE IF NOT EXISTS public.node_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_node_id UUID REFERENCES public.node_registrations(id),
    task_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, ACKNOWLEDGED, COMPLETED
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Broadcast Alerts (PC -> Global)
CREATE TABLE IF NOT EXISTS public.broadcast_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'INFO', -- INFO, WARNING, CRITICAL
    sent_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Node Messages (Secure Messenger)
CREATE TABLE IF NOT EXISTS public.node_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_node_id UUID REFERENCES public.node_registrations(id),
    recipient_node_id UUID REFERENCES public.node_registrations(id), -- NULL for broadcast
    sender_role TEXT NOT NULL,
    message_text TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'TEXT',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.node_pairing_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_messages ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Only PC Admins (Admins) can see pairing tokens
CREATE POLICY "Admins see pairing tokens" ON public.node_pairing_tokens
    FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Nodes can see their own registration
CREATE POLICY "Nodes see own reg" ON public.node_registrations
    FOR SELECT USING (device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

-- Public (anonymous) can view tokens to claim them (but token must match)
-- In production, the edge function handles this with service_role.

-- Realtime configuration
ALTER PUBLICATION supabase_realtime ADD TABLE public.node_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.node_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcast_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.node_messages;
