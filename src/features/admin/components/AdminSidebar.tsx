import { NavLink as RRNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  CreditCard,
  LayoutDashboard,
  Palette,
  QrCode,
  ReceiptText,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/orders", label: "Orders", icon: ReceiptText },
  { to: "/app/menu", label: "Menu", icon: ChefHat },
  { to: "/app/qr", label: "QR Menu", icon: QrCode },
  { to: "/app/staff", label: "Staff", icon: Users },
  { to: "/app/branding", label: "Branding", icon: Palette },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
] as const;

export default function AdminSidebar() {
  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft">
          <ChefHat className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">Restaurant OS</div>
          <div className="text-xs text-muted-foreground">Admin Panel</div>
        </div>
      </div>

      <nav className="px-3 py-3">
        <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">Workspace</div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <RRNavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive &&
                      "bg-accent text-accent-foreground shadow-soft ring-1 ring-border"
                  )
                }
              >
                <item.icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
                <span className="truncate">{item.label}</span>
              </RRNavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-4 pb-4">
        <div className="rounded-xl border border-border bg-background p-3 shadow-soft">
          <div className="text-xs font-medium">Tip</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Keep the menu simple: 6–9 categories max.
          </div>
        </div>
      </div>
    </aside>
  );
}
