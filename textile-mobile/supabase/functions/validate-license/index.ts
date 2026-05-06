import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ""
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ""
const SUPABASE_JWT_SECRET = Deno.env.get('SUPABASE_JWT_SECRET') || ""

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { licenseKey, deviceFingerprint, deviceLabel } = await req.json()
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Query licenses
    const { data: license, error: licenseError } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', licenseKey)
      .single()

    if (licenseError || !license) {
      return new Response(JSON.stringify({ error: 'INVALID_LICENSE' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Check status and expiry
    if (license.status === 'expired' || license.status === 'suspended') {
      return new Response(JSON.stringify({ error: 'LICENSE_EXPIRED', tier: license.tier }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      await supabase.from('licenses').update({ status: 'expired' }).eq('id', license.id)
      return new Response(JSON.stringify({ error: 'LICENSE_EXPIRED', tier: license.tier }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Check authorized devices
    const { data: devices, error: deviceError } = await supabase
      .from('authorized_devices')
      .select('*')
      .eq('license_id', license.id)
      .eq('is_active', true)

    if (deviceError) throw deviceError

    const existingDevice = devices?.find((d: any) => d.device_fingerprint === deviceFingerprint)

    if (existingDevice) {
      await supabase.from('authorized_devices')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', existingDevice.id)
    } else if (devices.length < license.max_devices) {
      await supabase.from('authorized_devices').insert({
        license_id: license.id,
        device_fingerprint: deviceFingerprint,
        device_label: deviceLabel || `Node ${devices.length + 1}`,
        last_seen_at: new Date().toISOString()
      })
    } else {
      return new Response(JSON.stringify({ 
        error: 'DEVICE_LIMIT_REACHED', 
        maxDevices: license.max_devices,
        message: 'De-authorize an existing device from your dashboard to add this one.'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. Generate Session JWT
    const payload = {
      tier: license.tier,
      tenantId: license.tenant_id,
      licenseId: license.id,
      deviceFingerprint,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SUPABASE_JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    )

    const token = await create({ alg: "HS256", typ: "JWT" }, payload, key)

    return new Response(JSON.stringify({ 
      tier: license.tier, 
      tenantId: license.tenant_id, 
      token 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
