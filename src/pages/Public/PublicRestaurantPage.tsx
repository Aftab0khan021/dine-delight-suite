import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore as useCart } from "@/lib/cart-store";
import { CheckoutModal } from "@/components/CheckoutModal"; // Ensure you copied this component!
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Tenant = Tables<"tenants">;
type MenuItem = Tables<"menu_items">;

interface PublicRestaurantPageProps {
  subdomain: string;
}

export default function PublicRestaurantPage({ subdomain }: PublicRestaurantPageProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addItem, items, getTotalAmount } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    async function loadRestaurant() {
      try {
        setLoading(true);
        // 1. Find the restaurant ID using the subdomain (slug)
        const { data: tenantData, error: tenantError } = await supabase
          .from("tenants")
          .select("*")
          .eq("slug", subdomain)
          .single();

        if (tenantError || !tenantData) {
          console.error("Restaurant not found", tenantError);
          toast({
            variant: "destructive",
            title: "Restaurant not found",
            description: `The restaurant "${subdomain}" could not be found.`,
          });
          setLoading(false);
          return;
        }

        setTenant(tenantData);

        // 2. Fetch the menu for this restaurant
        const { data: menuData } = await supabase
          .from("menu_items")
          .select("*")
          .eq("tenant_id", tenantData.id)
          .eq("is_available", true);

        setMenuItems(menuData || []);
      } catch (error) {
        console.error("Error loading page:", error);
        toast({
          variant: "destructive",
          title: "Error loading menu",
          description: "Failed to load restaurant menu. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }

    if (subdomain) loadRestaurant();
  }, [subdomain, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex h-screen items-center justify-center flex-col">
        <h1 className="text-3xl font-bold">Restaurant Not Found</h1>
        <p className="text-gray-500">The subdomain "{subdomain}" does not exist.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- HERO HEADER --- */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <img src={tenant.logo_url} alt={tenant.name} className="h-10 w-10 rounded-full object-cover" />
            )}
            <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
          </div>
          {/* Cart Trigger */}
          <Button variant="outline" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="font-semibold">{items.length}</span>
          </Button>
        </div>
      </div>

      {/* --- MENU GRID --- */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video w-full bg-gray-200 relative">
                 {item.image_url ? (
                   <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                 )}
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <span className="font-bold text-lg">${item.price}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    addItem({ 
                      id: item.id, 
                      name: item.name, 
                      price: item.price, 
                      image_url: item.image_url || undefined 
                    });
                    toast({ title: "Added to cart", description: `${item.name} added.` });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add to Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- FLOATING CHECKOUT BAR (Mobile) --- */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg md:hidden">
          <Button className="w-full size-lg text-lg" onClick={() => setIsCartOpen(true)}>
            View Order (${getTotalAmount().toFixed(2)})
          </Button>
        </div>
      )}

      {/* --- CHECKOUT MODAL --- */}
      <CheckoutModal 
        open={isCartOpen} 
        onOpenChange={setIsCartOpen} 
        tenantId={tenant.id}
      />
    </div>
  );
}