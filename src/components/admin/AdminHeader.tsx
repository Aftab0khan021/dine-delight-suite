import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ChevronDown } from "lucide-react";

type Restaurant = {
  id: string;
  name: string;
  location: string;
};

const mockRestaurants: Restaurant[] = [
  { id: "r_1", name: "Olive & Ember", location: "Downtown" },
  { id: "r_2", name: "Riverstone Café", location: "Waterfront" },
  { id: "r_3", name: "Citrus Noodle Bar", location: "Midtown" },
];

const mockNotifications = [
  {
    id: "n1",
    title: "New order received",
    detail: "Table 12 • 3 items",
    time: "Just now",
  },
  {
    id: "n2",
    title: "Item out of stock",
    detail: "Truffle Fries",
    time: "12m",
  },
  {
    id: "n3",
    title: "QR scans spiking",
    detail: "Lunch rush trending",
    time: "1h",
  },
];

export default function AdminHeader() {
  const [restaurantId, setRestaurantId] = useState(mockRestaurants[0].id);

  const activeRestaurant = useMemo(
    () => mockRestaurants.find((r) => r.id === restaurantId) ?? mockRestaurants[0],
    [restaurantId]
  );

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-8">
        {/* Restaurant switcher */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Select value={restaurantId} onValueChange={setRestaurantId}>
              <SelectTrigger className="h-10 max-w-[340px] bg-card shadow-soft">
                <SelectValue placeholder="Select restaurant" />
              </SelectTrigger>
              <SelectContent>
                {mockRestaurants.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} — {r.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge variant="secondary" className="h-7 rounded-full px-2.5">
              Owner
            </Badge>
          </div>
          <div className="mt-1 hidden text-xs text-muted-foreground md:block">
            Managing: {activeRestaurant.name} • {activeRestaurant.location}
          </div>
        </div>

        <Separator orientation="vertical" className="hidden h-7 md:block" />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[340px]">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockNotifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5">
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="text-sm font-medium">{n.title}</span>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.detail}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>AO</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Alex Owner</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Workspace settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
