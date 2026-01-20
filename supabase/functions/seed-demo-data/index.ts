import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create a demo tenant
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .upsert({
        name: 'Burger King Demo',
        slug: 'demo-burger',
        owner_id: '00000000-0000-0000-0000-000000000000', // Dummy owner for demo
      }, { onConflict: 'slug' })
      .select()
      .single()

    if (tenantError && tenantError.code !== '23505') {
      throw tenantError
    }

    // Get existing tenant if upsert returned existing
    let tenantId = tenant?.id
    if (!tenantId) {
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', 'demo-burger')
        .single()
      tenantId = existingTenant?.id
    }

    if (!tenantId) {
      throw new Error('Failed to create or fetch tenant')
    }

    // Delete existing menu items for this tenant (for re-seeding)
    await supabase
      .from('menu_items')
      .delete()
      .eq('tenant_id', tenantId)

    // Create demo menu items
    const menuItems = [
      {
        tenant_id: tenantId,
        name: 'Burger',
        description: 'Juicy beef burger with melted cheese, lettuce, and tomatoes',
        price: 12.99,
        category: 'Mains',
        is_available: true,
      },
      {
        tenant_id: tenantId,
        name: 'Pasta',
        description: 'Creamy carbonara with parmesan and herbs',
        price: 14.99,
        category: 'Mains',
        is_available: true,
      },
      {
        tenant_id: tenantId,
        name: 'Wings',
        description: 'Crispy chicken wings with your choice of sauce',
        price: 9.99,
        category: 'Starters',
        is_available: true,
      },
      {
        tenant_id: tenantId,
        name: 'Salad',
        description: 'Fresh Caesar salad with croutons and parmesan',
        price: 8.99,
        category: 'Starters',
        is_available: true,
      },
      {
        tenant_id: tenantId,
        name: 'Fries',
        description: 'Golden crispy French fries',
        price: 4.99,
        category: 'Sides',
        is_available: true,
      },
    ]

    const { error: itemsError } = await supabase
      .from('menu_items')
      .insert(menuItems)

    if (itemsError) throw itemsError

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demo data seeded successfully!',
        tenant_id: tenantId,
        items_count: menuItems.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
