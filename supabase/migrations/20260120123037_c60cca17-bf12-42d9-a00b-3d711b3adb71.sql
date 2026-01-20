-- Fix infinite recursion in tenants RLS by using a SECURITY DEFINER helper function

-- Helper: check whether a tenant has any available menu items
CREATE OR REPLACE FUNCTION public.tenant_has_active_menu(_tenant_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.tenant_id = _tenant_id
      AND mi.is_available = true
    LIMIT 1
  );
$$;

-- Replace the public tenants policy that referenced menu_items directly (can recurse)
DROP POLICY IF EXISTS "Public can view active tenants" ON public.tenants;

CREATE POLICY "Public can view active tenants"
ON public.tenants
FOR SELECT
USING (public.tenant_has_active_menu(id));

-- Ensure public can view available menu items (unauthenticated)
DROP POLICY IF EXISTS "Public can view active menu items" ON public.menu_items;

CREATE POLICY "Public can view active menu items"
ON public.menu_items
FOR SELECT
USING (is_available = true);
