-- Add policies to allow public access to demo tenant for testing
-- These policies should be removed in production

-- Allow anyone to view demo tenant
CREATE POLICY "Public can view demo tenant"
  ON public.tenants FOR SELECT
  USING (slug = 'demo-burger');

-- Allow anyone to view demo menu items  
CREATE POLICY "Public can view demo menu items"
  ON public.menu_items FOR SELECT
  USING (tenant_id IN (
    SELECT id FROM public.tenants WHERE slug = 'demo-burger'
  ));

-- Allow anyone to update demo menu items (for testing availability toggle)
CREATE POLICY "Public can update demo menu items"
  ON public.menu_items FOR UPDATE
  USING (tenant_id IN (
    SELECT id FROM public.tenants WHERE slug = 'demo-burger'
  ));

-- Allow anyone to view demo orders
CREATE POLICY "Public can view demo orders"
  ON public.orders FOR SELECT
  USING (tenant_id IN (
    SELECT id FROM public.tenants WHERE slug = 'demo-burger'
  ));

-- Allow anyone to update demo orders (for status changes)
CREATE POLICY "Public can update demo orders"
  ON public.orders FOR UPDATE
  USING (tenant_id IN (
    SELECT id FROM public.tenants WHERE slug = 'demo-burger'
  ));
