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
  { to: "/app/qr", label: "QR", icon: QrCode },
  { to: "/app/staff", label: "Staff", icon: Users },
  { to: "/app/branding", label: "Brand", icon: Palette },
  { to: "/app/billing", label: "Billing", icon: CreditCard },
] as const;

export default function AdminBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <ul className="mx-auto grid max-w-lg grid-cols-7 px-2 py-2">
        {navItems.map((item) => (
          <li key={item.to}>
            <RRNavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="leading-none">{item.label}</span>
            </RRNavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
