import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  // 1. LISTEN FOR LOGIN
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log("User found! Redirecting to dashboard...");
        navigate("/app/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dine Delight SaaS</h1>
        <p className="text-muted-foreground">Manage your restaurant with ease.</p>
      </div>
      
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to="/auth">Login to Dashboard</Link>
        </Button>

        {/* 2. FIX THE DEMO LINK (Use correct port) */}
        <Button variant="outline" size="lg" asChild>
          {/* Ensure this port matches your running terminal (usually 8080 or 5173) */}
          <a href="http://demo-burger.localhost:8080">Visit Demo Store</a>
        </Button>
      </div>
    </div>
  );
};

export default Index;