-- FIX 7: OPTIMISTIC LOCKING FOR DISPATCH
ALTER TABLE public.batches ADD COLUMN IF NOT EXISTS version INT DEFAULT 1;

CREATE OR REPLACE FUNCTION public.pick_batch_stock(
  p_batch_id UUID,
  p_quantity INT,
  p_expected_version INT,
  p_order_id UUID,
  p_performed_by UUID
) RETURNS jsonb AS $$
DECLARE
  current_version INT;
  current_stock INT;
BEGIN
  -- Obtain exclusive lock for this row
  SELECT version, suits_count INTO current_version, current_stock FROM public.batches WHERE id = p_batch_id FOR UPDATE;

  -- 1. Version Check
  IF current_version != p_expected_version THEN
    RETURN json_build_object('success', false, 'error', 'VERSION_CONFLICT', 'current_version', current_version);
  END IF;

  -- 2. Stock Check
  IF current_stock < p_quantity THEN
    RETURN json_build_object('success', false, 'error', 'INSUFFICIENT_STOCK', 'available', current_stock);
  END IF;

  -- 3. Atomic Update
  UPDATE public.batches 
  SET suits_count = suits_count - p_quantity, 
      version = version + 1 
  WHERE id = p_batch_id;

  INSERT INTO public.stock_movements (batch_id, movement_type, quantity, reference_id, performed_by) 
  VALUES (p_batch_id, 'OUT', p_quantity, p_order_id, p_performed_by);

  RETURN json_build_object('success', true, 'new_version', current_version + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
