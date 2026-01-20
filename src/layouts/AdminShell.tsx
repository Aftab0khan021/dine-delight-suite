import { Outlet } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

export default function AdminShell() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Desktop layout */}
      <div className="hidden min-h-screen w-full md:flex">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />
          <main className="min-w-0 flex-1 px-4 py-5 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex min-h-screen w-full flex-col md:hidden">
        <AdminHeader />
        <main className="flex-1 px-4 py-5 pb-20">
          <Outlet />
        </main>
        <AdminBottomNav />
      </div>
    </div>
  );
}
