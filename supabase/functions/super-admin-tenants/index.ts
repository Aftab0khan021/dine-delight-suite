import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TenantOut = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_email: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";

    // Verify caller identity
    const authed = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authed.auth.getUser();
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Server-side super_admin check (never trust client)
    const { data: roleRows, error: roleError } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "super_admin")
      .limit(1);

    if (roleError) throw roleError;
    if (!roleRows || roleRows.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: tenants, error: tenantsError } = await admin
      .from("tenants")
      .select("id,name,slug,logo_url,owner_id");

    if (tenantsError) throw tenantsError;

    const tenantIds = (tenants ?? []).map((t) => t.id);

    const { data: subs, error: subsError } = await admin
      .from("subscriptions")
      .select("tenant_id,status,plan_id,subscription_plans(name)")
      .in("tenant_id", tenantIds);

    if (subsError) throw subsError;

    const subsByTenant = new Map<string, any>();
    (subs ?? []).forEach((s) => subsByTenant.set(s.tenant_id, s));

    const ownerIds = Array.from(new Set((tenants ?? []).map((t) => t.owner_id)));
    const ownerEmailById = new Map<string, string>();

    // Fetch owner emails via admin auth API
    for (const ownerId of ownerIds) {
      const { data, error } = await admin.auth.admin.getUserById(ownerId);
      if (!error && data?.user?.email) {
        ownerEmailById.set(ownerId, data.user.email);
      }
    }

    const out: TenantOut[] = (tenants ?? []).map((t) => {
      const s = subsByTenant.get(t.id);
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        logo_url: t.logo_url,
        owner_email: ownerEmailById.get(t.owner_id) ?? null,
        subscription_plan: s?.subscription_plans?.name ?? null,
        subscription_status: s?.status ?? null,
      };
    });

    return new Response(JSON.stringify({ tenants: out }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
