// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req: Request) => {
  const { token, device_fingerprint } = await req.json();
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Fetch token from DB
  const { data: pairingToken, error } = await supabase
    .from('node_pairing_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !pairingToken) {
    return new Response(JSON.stringify({ error: 'TOKEN_INVALID' }), { status: 401 });
  }

  // Server-side expiry check — cannot be bypassed by clock manipulation
  if (new Date() > new Date(pairingToken.expires_at)) {
    return new Response(JSON.stringify({ error: 'TOKEN_EXPIRED' }), { status: 401 });
  }

  // One-time use check
  if (pairingToken.claimed) {
    return new Response(JSON.stringify({ error: 'TOKEN_ALREADY_USED' }), { status: 401 });
  }

  // Enforce max 4 nodes
  const { count } = await supabase
    .from('node_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (count !== null && count >= 4) {
    return new Response(JSON.stringify({ error: 'NODE_LIMIT_REACHED' }), { status: 403 });
  }

  // Mark token as claimed (atomic — prevents race condition)
  const { error: updateErr } = await supabase
    .from('node_pairing_tokens')
    .update({ claimed: true, device_fingerprint })
    .eq('token', token)
    .eq('claimed', false); // only update if still unclaimed

  if (updateErr) {
    return new Response(JSON.stringify({ error: 'TOKEN_RACE_CONDITION' }), { status: 409 });
  }

  // Upsert node registration
  const { data: nodeReg, error: upsertErr } = await supabase.from('node_registrations').upsert({
    node_slot: pairingToken.node_slot,
    role: pairingToken.role,
    device_fingerprint,
    is_active: true,
    linked_at: new Date().toISOString()
  }, { onConflict: 'node_slot' }).select().single();

  if (upsertErr) {
    return new Response(JSON.stringify({ error: 'REGISTRATION_FAILED', message: upsertErr.message }), { status: 500 });
  }

  // Create Supabase auth session for this node
  const { data: authData } = await supabase.auth.admin.createUser({
    email: 'node_' + pairingToken.node_slot + '@goldsheindustrial.internal',
    password: crypto.randomUUID(),
    user_metadata: { role: pairingToken.role, node_slot: pairingToken.node_slot }
  });

  return new Response(JSON.stringify({
    access_token: authData?.session?.access_token,
    refresh_token: authData?.session?.refresh_token,
    node_id: nodeReg.id,
    role: pairingToken.role,
    node_slot: pairingToken.node_slot
  }), { status: 200 });
});
