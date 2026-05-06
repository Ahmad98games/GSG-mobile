import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"
import { verify } from "https://deno.land/x/djwt@v2.8/mod.ts"

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
    // 1. Verify Tier from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')

    const token = authHeader.replace('Bearer ', '')
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SUPABASE_JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    )

    const payload = await verify(token, key)
    const { tier, tenantId, licenseId, deviceFingerprint } = payload as any

    if (tier === 'lite') {
      return new Response(JSON.stringify({ error: 'INSUFFICIENT_TIER', required: 'pro' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { fileName } = await req.json()
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 2. Generate signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from('downloads')
      .createSignedUrl(fileName, 900) // 15 minutes

    if (signedError) throw signedError

    // 3. Log download
    await supabase.from('downloads_log').insert({
      license_id: licenseId,
      file_name: fileName,
      device_fingerprint: deviceFingerprint,
      downloaded_at: new Date().toISOString()
    })

    return new Response(JSON.stringify({ 
      url: signedData.signedUrl, 
      expiresAt: new Date(Date.now() + 900000).toISOString(),
      fileName
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
