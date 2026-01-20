import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// --- LAYOUTS & PAGES ---
import AdminShell from "./layouts/AdminShell";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminQrMenu from "./pages/admin/AdminQrMenu";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminBranding from "./pages/admin/AdminBranding";
import AdminBilling from "./pages/admin/AdminBilling";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PublicRestaurantPage from "./pages/Public/PublicRestaurantPage";
import Auth from "./pages/Auth"; // <--- 1. NEW IMPORT

const queryClient = new QueryClient();

// --- SUBDOMAIN HELPER ---
const getSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  if (parts.length >= 2 && parts[0] !== "www" && parts[0] !== "app") {
    return parts[0]; 
  }
  return null;
};

// --- AUTH GUARD COMPONENT ---
const RequireAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  
  // 2. FIX: Redirect to /auth instead of / to prevent loop
  if (!session) return <Navigate to="/auth" replace />; 

  return <Outlet />;
};

// --- MAIN APP COMPONENT ---
const App = () => {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    const sub = getSubdomain();
    if (sub && sub !== "localhost") {
      setSubdomain(sub);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* SCENARIO 1: PUBLIC TENANT VIEW */}
            {subdomain ? (
              <Route path="*" element={<PublicRestaurantPage subdomain={subdomain} />} />
            ) : (
              /* SCENARIO 2: MAIN APP VIEW */
              <>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} /> {/* <--- 3. ADDED ROUTE */}
                
                {/* Protected Admin Routes */}
                <Route element={<RequireAuth />}>
                  <Route path="/app" element={<AdminShell />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="menu" element={<AdminMenu />} />
                    <Route path="qr" element={<AdminQrMenu />} />
                    <Route path="staff" element={<AdminStaff />} />
                    <Route path="branding" element={<AdminBranding />} />
                    <Route path="billing" element={<AdminBilling />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;