/**
 * SUPABASE EDGE FUNCTIONS (Deno)
 * Rebuild: Module 2, 5, 7 logic
 */

/**
 * 1. claim-pairing-token
 * Validates the UUID token, creates node_registrations, and returns an auth session.
 */
// deno-lint-ignore no-explicit-any
export async function claimPairingToken(supabase: any, body: { token: string, device_fingerprint: string, device_name: string }) {
  const { data: tokenData, error: tokenErr } = await supabase
    .from('node_pairing_tokens')
    .select('*')
    .eq('token', body.token)
    .single();

  if (tokenErr || !tokenData || tokenData.claimed || new Date(tokenData.expires_at) < new Date()) {
    throw new Error('TOKEN_EXPIRED_OR_INVALID');
  }

  // Claim it
  await supabase.from('node_pairing_tokens').update({ claimed: true, device_fingerprint: body.device_fingerprint }).eq('id', tokenData.id);

  // Register Node
  const { data: node, error: nodeErr } = await supabase
    .from('node_registrations')
    .upsert({
      node_slot: tokenData.node_slot,
      device_name: body.device_name,
      device_fingerprint: body.device_fingerprint,
      role: tokenData.role,
      is_active: true
    })
    .select()
    .single();

  if (nodeErr) throw nodeErr;

  return { 
    access_token: 'SUPABASE_JWT', // Mocked return for conceptual guide
    refresh_token: 'REFRESH_TOKEN',
    node_id: node.id,
    role: node.role 
  };
}

/**
 * 2. run-chori-guard
 * Backend validation of fabric math to prevent manipulation.
 */
// deno-lint-ignore no-explicit-any
export async function runChoriGuard(supabase: any, body: { job_id: string, suits_received: number, reported_tukra: number }) {
  const { data: job } = await supabase.from('job_orders').select('*, article:articles(*)').eq('id', body.job_id).single();
  
  const expected_per_suit = job.article.expected_gaz_per_suit;
  const expected_tukra = job.gaz_issued - (body.suits_received * expected_per_suit);
  const variance = body.reported_tukra - expected_tukra;

  const TOLERANCE = -0.500; // 0.5 GZ threshold

  if (variance < TOLERANCE) {
    return { result: 'RED_ALERT', message: `FABRIC DEFICIT: ${variance} GZ` };
  }

  // Update JO status
  await supabase.from('job_orders').update({ status: 'SUBMITTED' }).eq('id', body.job_id);
  return { result: 'PASS' };
}

/**
 * 3. send-push-notification
 * Gateway to Expo Push API.
 */
// deno-lint-ignore no-explicit-any
export async function sendPushNotification(pushToken: string, title: string, body: string, data: any) {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: pushToken, title, body, data }),
  });
  return response.json();
}
