-- GOLD SHE INDUSTRIAL MESSENGER V2.0 & NOTIFICATION ECOSYSTEM

-- 1. Messenger Channels
CREATE TABLE IF NOT EXISTS public.messenger_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('BROADCAST', 'DIRECT', 'ROLE')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Channel Members
CREATE TABLE IF NOT EXISTS public.channel_members (
    channel_id UUID REFERENCES public.messenger_channels(id) ON DELETE CASCADE,
    member_type TEXT NOT NULL CHECK (member_type IN ('PC', 'NODE')),
    member_id UUID NOT NULL, -- auth.users.id for PC, node_registrations.id for NODE
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (channel_id, member_id)
);

-- 3. Messenger Messages
CREATE TABLE IF NOT EXISTS public.messenger_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES public.messenger_channels(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('PC', 'NODE')),
    sender_id UUID NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'TEXT', -- TEXT, IMAGE, VOICE, COMMAND, SYSTEM
    content TEXT,
    file_url TEXT,
    voice_url TEXT,
    voice_duration INTEGER,
    voice_amplitude JSONB,
    reply_to_id UUID REFERENCES public.messenger_messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 4. Message Reads
CREATE TABLE IF NOT EXISTS public.message_reads (
    message_id UUID REFERENCES public.messenger_messages(id) ON DELETE CASCADE,
    reader_id UUID NOT NULL,
    reader_type TEXT NOT NULL CHECK (reader_type IN ('PC', 'NODE')),
    read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, reader_id)
);

-- 5. Message Reactions
CREATE TABLE IF NOT EXISTS public.message_reactions (
    message_id UUID REFERENCES public.messenger_messages(id) ON DELETE CASCADE,
    reactor_id UUID NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (message_id, reactor_id, emoji)
);

-- 6. Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    node_id UUID REFERENCES public.node_registrations(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    dnd_start INTEGER, -- 0-23 hour
    dnd_end INTEGER,   -- 0-23 hour
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (node_id, notification_type)
);

-- 7. Scan Logs
CREATE TABLE IF NOT EXISTS public.scan_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL,
    scan_type TEXT NOT NULL,
    node_id UUID REFERENCES public.node_registrations(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.messenger_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messenger_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Channels: Members can see channels
CREATE POLICY "Members see channels" ON public.messenger_channels
    FOR SELECT USING (
        id IN (SELECT channel_id FROM public.channel_members WHERE (member_type = 'NODE' AND member_id IN (SELECT id FROM public.node_registrations WHERE device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')))
        OR (auth.jwt() ->> 'role' = 'admin')
    );

-- Channel Members: Members can see other members
CREATE POLICY "Members see others" ON public.channel_members
    FOR SELECT USING (
        channel_id IN (SELECT channel_id FROM public.channel_members WHERE (member_type = 'NODE' AND member_id IN (SELECT id FROM public.node_registrations WHERE device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')))
        OR (auth.jwt() ->> 'role' = 'admin')
    );

-- Messages: Members can see messages
CREATE POLICY "Members see messages" ON public.messenger_messages
    FOR SELECT USING (
        channel_id IN (SELECT channel_id FROM public.channel_members WHERE (member_type = 'NODE' AND member_id IN (SELECT id FROM public.node_registrations WHERE device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')))
        OR (auth.jwt() ->> 'role' = 'admin')
    );

-- Messages: Members can send messages
CREATE POLICY "Members send messages" ON public.messenger_messages
    FOR INSERT WITH CHECK (
        channel_id IN (SELECT channel_id FROM public.channel_members WHERE (member_type = 'NODE' AND member_id IN (SELECT id FROM public.node_registrations WHERE device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')))
        OR (auth.jwt() ->> 'role' = 'admin')
    );

-- Notification Prefs: Nodes see own
CREATE POLICY "Nodes see own prefs" ON public.notification_preferences
    FOR ALL USING (
        node_id IN (SELECT id FROM public.node_registrations WHERE device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')
        OR (auth.jwt() ->> 'role' = 'admin')
    );

-- Scan Logs: Nodes can insert
CREATE POLICY "Nodes insert scan logs" ON public.scan_logs
    FOR INSERT WITH CHECK (
        node_id IN (SELECT id FROM public.node_registrations WHERE device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')
        OR (auth.jwt() ->> 'role' = 'admin')
    );

-- Realtime configuration
ALTER PUBLICATION supabase_realtime ADD TABLE public.messenger_channels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messenger_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notification_preferences;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_logs;
