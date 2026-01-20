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
import PublicRestaurantPage from "./pages/public/PublicRestaurantPage"; // Import the page you just created

const queryClient = new QueryClient();

// --- SUBDOMAIN HELPER ---
const getSubdomain = () => {
  const hostname = window.location.hostname;
  // Localhost: "demo.localhost" -> ["demo", "localhost"]
  // Production: "burger.yoursaas.com" -> ["burger", "yoursaas", "com"]
  const parts = hostname.split(".");
  
  // Adjust this logic based on your actual live domain depth
  // For localhost, parts[0] is subdomain if length > 1
  if (parts.length >= 2 && parts[0] !== "www" && parts[0] !== "app") {
    // If testing on localhost (e.g. demo.localhost), return 'demo'
    // If on production, logic might need 'parts.length > 2' depending on domain
    return parts[0]; 
  }
  return null;
};

// --- AUTH GUARD COMPONENT ---
// Blocks access to /app routes if not logged in
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
  if (!session) return <Navigate to="/" replace />; // Redirect to landing page if not logged in

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
            {/* ------------------------------------------------------------------
                SCENARIO 1: PUBLIC TENANT VIEW (e.g. burger.yoursaas.com)
                If a subdomain is detected, we HIJACK the router and only show the menu.
               ------------------------------------------------------------------ */}
            {subdomain ? (
              <Route path="*" element={<PublicRestaurantPage subdomain={subdomain} />} />
            ) : (
              /* ------------------------------------------------------------------
                 SCENARIO 2: MAIN APP VIEW (app.yoursaas.com or localhost:3000)
                 Includes Landing Page and Protected Admin Dashboard.
                 ------------------------------------------------------------------ */
              <>
                <Route path="/" element={<Index />} />
                
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