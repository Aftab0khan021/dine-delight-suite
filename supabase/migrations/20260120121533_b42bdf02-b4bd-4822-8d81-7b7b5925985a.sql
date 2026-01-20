-- =====================================================
-- Fix Public Menu Access + Tenant Visibility
-- =====================================================

-- TENANTS: allow unauthenticated visitors to load a tenant by slug
-- so the public menu page can resolve tenant_id.
-- We scope it to tenants that actually have at least one available menu item.
DROP POLICY IF EXISTS "Public can view active tenants" ON public.tenants;
CREATE POLICY "Public can view active tenants"
ON public.tenants
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.menu_items mi
    WHERE mi.tenant_id = tenants.id
      AND mi.is_available = true
  )
);

-- MENU_ITEMS: allow unauthenticated visitors to view available items
DROP POLICY IF EXISTS "Public can view active menu items" ON public.menu_items;
CREATE POLICY "Public can view active menu items"
ON public.menu_items
FOR SELECT
USING (is_available = true);
