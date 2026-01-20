import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // Make sure you have this!

export const RequireAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  
  // If not logged in, kick them back to home
  if (!session) return <Navigate to="/" replace />;

  return <Outlet />;
};