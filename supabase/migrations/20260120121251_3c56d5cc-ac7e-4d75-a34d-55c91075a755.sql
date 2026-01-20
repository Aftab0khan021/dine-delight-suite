-- =====================================================
-- STRICT RLS POLICIES FOR PRODUCTION
-- =====================================================

-- ================== USER ROLES POLICIES ==================

-- Super admins can view all user roles
CREATE POLICY "Super admins can view all user roles"
  ON public.user_roles FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Super admins can insert user roles
CREATE POLICY "Super admins can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Super admins can update user roles
CREATE POLICY "Super admins can update user roles"
  ON public.user_roles FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Super admins can delete user roles
CREATE POLICY "Super admins can delete user roles"
  ON public.user_roles FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- ================== SUBSCRIPTION PLANS POLICIES ==================

-- Everyone can view subscription plans (public pricing)
CREATE POLICY "Anyone can view subscription plans"
  ON public.subscription_plans FOR SELECT
  USING (true);

-- Super admins can manage subscription plans
CREATE POLICY "Super admins can insert subscription plans"
  ON public.subscription_plans FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update subscription plans"
  ON public.subscription_plans FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete subscription plans"
  ON public.subscription_plans FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- ================== SUBSCRIPTIONS POLICIES ==================

-- Super admins can view all subscriptions
CREATE POLICY "Super admins can view all subscriptions"
  ON public.subscriptions FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Restaurant owners can view their own subscription
CREATE POLICY "Restaurant owners can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id(auth.uid()) AND
    public.has_role(auth.uid(), 'restaurant_owner')
  );

-- Super admins can manage all subscriptions
CREATE POLICY "Super admins can insert subscriptions"
  ON public.subscriptions FOR INSERT
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update subscriptions"
  ON public.subscriptions FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete subscriptions"
  ON public.subscriptions FOR DELETE
  USING (public.is_super_admin(auth.uid()));

-- ================== UPDATED TENANTS POLICIES ==================

-- Drop old demo policies
DROP POLICY IF EXISTS "Public can view demo tenant" ON public.tenants;

-- Super admins can view all tenants
CREATE POLICY "Super admins can view all tenants"
  ON public.tenants FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Restaurant owners and managers can view their own tenant
CREATE POLICY "Owners and managers can view own tenant"
  ON public.tenants FOR SELECT
  USING (
    id = public.get_user_tenant_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'restaurant_owner') OR public.has_role(auth.uid(), 'manager'))
  );

-- Super admins can update all tenants
CREATE POLICY "Super admins can update all tenants"
  ON public.tenants FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Restaurant owners can update their own tenant
CREATE POLICY "Owners can update own tenant"
  ON public.tenants FOR UPDATE
  USING (
    id = public.get_user_tenant_id(auth.uid()) AND
    public.has_role(auth.uid(), 'restaurant_owner')
  );

-- ================== UPDATED ORDERS POLICIES ==================

-- Drop old demo policies
DROP POLICY IF EXISTS "Public can view demo orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update demo orders" ON public.orders;

-- Super admins can view all orders
CREATE POLICY "Super admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Restaurant staff can view orders for their tenant
CREATE POLICY "Restaurant staff can view own tenant orders"
  ON public.orders FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'restaurant_owner') OR 
     public.has_role(auth.uid(), 'manager') OR 
     public.has_role(auth.uid(), 'staff'))
  );

-- Super admins can update all orders
CREATE POLICY "Super admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Restaurant staff can update orders for their tenant
CREATE POLICY "Restaurant staff can update own tenant orders"
  ON public.orders FOR UPDATE
  USING (
    tenant_id = public.get_user_tenant_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'restaurant_owner') OR 
     public.has_role(auth.uid(), 'manager') OR 
     public.has_role(auth.uid(), 'staff'))
  );

-- ================== UPDATED MENU ITEMS POLICIES ==================

-- Drop old demo policies
DROP POLICY IF EXISTS "Public can view demo menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Public can update demo menu items" ON public.menu_items;

-- Super admins can view all menu items
CREATE POLICY "Super admins can view all menu items"
  ON public.menu_items FOR SELECT
  USING (public.is_super_admin(auth.uid()));

-- Restaurant staff can view their tenant's menu items
CREATE POLICY "Restaurant staff can view own tenant menu items"
  ON public.menu_items FOR SELECT
  USING (
    tenant_id = public.get_user_tenant_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'restaurant_owner') OR 
     public.has_role(auth.uid(), 'manager') OR 
     public.has_role(auth.uid(), 'staff'))
  );

-- Super admins can update all menu items
CREATE POLICY "Super admins can update all menu items"
  ON public.menu_items FOR UPDATE
  USING (public.is_super_admin(auth.uid()));

-- Restaurant owners and managers can update their tenant's menu items
CREATE POLICY "Owners and managers can update own tenant menu items"
  ON public.menu_items FOR UPDATE
  USING (
    tenant_id = public.get_user_tenant_id(auth.uid()) AND
    (public.has_role(auth.uid(), 'restaurant_owner') OR public.has_role(auth.uid(), 'manager'))
  );
