-- Fix function search path using CREATE OR REPLACE (no need to drop)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix overly permissive RLS policy for orders INSERT
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Public can create orders for valid tenants"
  ON public.orders FOR INSERT
  WITH CHECK (
    tenant_id IN (SELECT id FROM public.tenants)
  );