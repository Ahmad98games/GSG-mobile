-- NOXIS SENTINEL v11.5: Core SaaS Schema
-- Author: Ahmad bhai (via Antigravity)

-- 1. Tenants
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Licenses
CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    license_key TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('lite', 'pro', 'elite')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
    max_devices INTEGER NOT NULL DEFAULT 1,
    activated_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Authorized Devices
CREATE TABLE IF NOT EXISTS public.authorized_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL,
    device_fingerprint TEXT NOT NULL,
    device_label TEXT,
    authorized_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(license_id, device_fingerprint)
);

-- 4. CCTV Nodes
CREATE TABLE IF NOT EXISTS public.cctv_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    node_label TEXT NOT NULL,
    rtsp_url TEXT NOT NULL, -- Encrypted at rest recommended
    location TEXT,
    status TEXT DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'obscured', 'unknown')),
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. CCTV Telemetry
CREATE TABLE IF NOT EXISTS public.cctv_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID REFERENCES public.cctv_nodes(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    bitrate_kbps REAL,
    latency_ms REAL,
    frame_variance REAL,
    avg_brightness REAL,
    fault_type TEXT CHECK (fault_type IN ('lens_obscured', 'node_offline', 'bitrate_low', 'lens_dirty')),
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Alert Logs
CREATE TABLE IF NOT EXISTS public.alert_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    node_id UUID REFERENCES public.cctv_nodes(id) ON DELETE CASCADE NOT NULL,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    triggered_at TIMESTAMPTZ DEFAULT now(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES auth.users(id),
    ack_token TEXT,
    details JSONB
);

-- 7. Subscription Checks
CREATE TABLE IF NOT EXISTS public.subscription_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES public.licenses(id) ON DELETE CASCADE NOT NULL,
    device_fingerprint TEXT NOT NULL,
    checked_at TIMESTAMPTZ DEFAULT now(),
    result TEXT NOT NULL CHECK (result IN ('active', 'expired', 'device_unauthorized'))
);

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorized_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cctv_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cctv_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_checks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Tenant Isolation)
-- Assuming tenant_id is stored in JWT app_metadata or user_metadata
-- Policy: Every SELECT/INSERT/UPDATE must check tenant_id

CREATE POLICY tenant_isolation_tenants ON public.tenants
    FOR SELECT USING (id = (auth.jwt()->>'tenant_id')::uuid);

CREATE POLICY tenant_isolation_licenses ON public.licenses
    FOR SELECT USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

CREATE POLICY tenant_isolation_devices ON public.authorized_devices
    FOR SELECT USING (license_id IN (SELECT id FROM public.licenses WHERE tenant_id = (auth.jwt()->>'tenant_id')::uuid));

CREATE POLICY tenant_isolation_nodes ON public.cctv_nodes
    FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

CREATE POLICY tenant_isolation_telemetry ON public.cctv_telemetry
    FOR SELECT USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

CREATE POLICY tenant_isolation_alerts ON public.alert_logs
    FOR ALL USING (tenant_id = (auth.jwt()->>'tenant_id')::uuid);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_telemetry_node_recorded ON public.cctv_telemetry(node_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_fault ON public.cctv_telemetry(tenant_id, fault_type) WHERE fault_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_alerts_tenant_severity_triggered ON public.alert_logs(tenant_id, severity, triggered_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_pending ON public.alert_logs(tenant_id) WHERE acknowledged_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_devices_license_fingerprint ON public.authorized_devices(license_id, device_fingerprint);
