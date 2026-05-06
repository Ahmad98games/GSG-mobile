-- FIX 8: SYNC ENGINE IDEMPOTENCY
ALTER TABLE public.node_registrations ADD COLUMN IF NOT EXISTS last_synced_op_id TEXT;

CREATE OR REPLACE FUNCTION public.check_idempotency(
  p_node_id UUID,
  p_op_id TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  last_id TEXT;
BEGIN
  SELECT last_synced_op_id INTO last_id FROM public.node_registrations WHERE id = p_node_id;
  
  IF last_id = p_op_id THEN
    RETURN FALSE; -- Already processed
  END IF;
  
  UPDATE public.node_registrations SET last_synced_op_id = p_op_id WHERE id = p_node_id;
  RETURN TRUE; -- New operation
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
