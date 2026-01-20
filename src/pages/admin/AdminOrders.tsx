import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type OrderStatus = "New" | "Preparing" | "Ready" | "Completed";

type OrderSource = "QR" | "Staff";

type Order = {
  id: string;
  placedAt: string; // e.g. 12:08
  sourceLabel: string; // e.g. Table 12 / Takeaway
  sourceType: OrderSource;
  items: string[];
  status: OrderStatus;
};

const columns: OrderStatus[] = ["New", "Preparing", "Ready", "Completed"];

const initialOrders: Order[] = [
  {
    id: "#1047",
    placedAt: "12:18",
    sourceLabel: "Table 3",
    sourceType: "QR",
    items: ["Crispy halloumi", "Market salad", "Soda"],
    status: "New",
  },
  {
    id: "#1046",
    placedAt: "12:15",
    sourceLabel: "Table 12",
    sourceType: "QR",
    items: ["Miso ramen", "Tea"],
    status: "Preparing",
  },
  {
    id: "#1045",
    placedAt: "12:13",
    sourceLabel: "Staff (counter)",
    sourceType: "Staff",
    items: ["Truffle fries", "Soda"],
    status: "New",
  },
  {
    id: "#1044",
    placedAt: "12:09",
    sourceLabel: "Takeaway",
    sourceType: "Staff",
    items: ["5 items"],
    status: "Ready",
  },
  {
    id: "#1043",
    placedAt: "12:01",
    sourceLabel: "Table 2",
    sourceType: "QR",
    items: ["Burger", "Fries"],
    status: "Preparing",
  },
  {
    id: "#1041",
    placedAt: "11:53",
    sourceLabel: "Table 4",
    sourceType: "QR",
    items: ["Ramen", "Tea"],
    status: "Ready",
  },
  {
    id: "#1036",
    placedAt: "11:31",
    sourceLabel: "Table 9",
    sourceType: "QR",
    items: ["2 items"],
    status: "Completed",
  },
];

const statusVariant = (s: OrderStatus) => {
  switch (s) {
    case "New":
      return "default" as const;
    case "Preparing":
      return "secondary" as const;
    case "Ready":
      return "secondary" as const;
    case "Completed":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
};

function nextStatus(current: OrderStatus): OrderStatus {
  if (current === "New") return "Preparing";
  if (current === "Preparing") return "Ready";
  if (current === "Ready") return "Completed";
  return "Completed";
}

function OrderCard({
  order,
  onMove,
}: {
  order: Order;
  onMove: (id: string, next: OrderStatus) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">{order.id}</div>
            <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {order.placedAt} • {order.sourceLabel} • {order.sourceType}
          </div>
        </div>
      </div>

      <div className="mt-2 text-sm">
        {order.items.slice(0, 3).join(" • ")}
        {order.items.length > 3 ? " • …" : ""}
      </div>

      <div className="mt-3 grid gap-2">
        {order.status === "New" && (
          <Button className="w-full" onClick={() => onMove(order.id, "Preparing")}>
            Start Preparing
          </Button>
        )}
        {order.status === "Preparing" && (
          <Button className="w-full" onClick={() => onMove(order.id, "Ready")}>
            Mark Ready
          </Button>
        )}
        {order.status === "Ready" && (
          <Button className="w-full" onClick={() => onMove(order.id, "Completed")}>
            Complete
          </Button>
        )}
        {order.status === "Completed" && (
          <Button className="w-full" variant="secondary" disabled>
            Completed
          </Button>
        )}

        {/* Secondary (always visible) */}
        {order.status !== "Completed" && (
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => onMove(order.id, nextStatus(order.status))}
          >
            Move to {nextStatus(order.status)}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("today");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => (q ? o.id.toLowerCase().includes(q) : true))
      .filter((o) => (statusFilter === "all" ? true : o.status === statusFilter))
      // UI-only: we don’t compute real timestamps; this is just a visual control.
      .filter((o) => {
        if (timeFilter === "today") return true;
        if (timeFilter === "24h") return true;
        return true;
      });
  }, [orders, search, statusFilter, timeFilter]);

  const byColumn = useMemo(() => {
    const map: Record<OrderStatus, Order[]> = {
      New: [],
      Preparing: [],
      Ready: [],
      Completed: [],
    };
    filtered.forEach((o) => map[o.status].push(o));
    return map;
  }, [filtered]);

  const moveOrder = (id: string, next: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kanban view with mock orders—no realtime logic.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-background px-3 py-1.5 text-sm shadow-soft">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-muted-foreground">Live</span>
            <Badge variant="secondary">UI only</Badge>
          </div>
        </div>

        {/* Top toolbar */}
        <Card className="shadow-soft">
          <CardContent className="grid gap-2 p-3 md:grid-cols-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">All statuses</SelectItem>
                {columns.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order ID (e.g., #1047)"
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Desktop Kanban */}
      <section className="hidden gap-3 lg:grid lg:grid-cols-4">
        {columns.map((col) => (
          <Card key={col} className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{col}</span>
                <Badge variant="secondary">{byColumn[col].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {byColumn[col].map((o) => (
                <OrderCard key={o.id} order={o} onMove={moveOrder} />
              ))}

              {byColumn[col].length === 0 && (
                <div className="rounded-xl border border-border bg-background p-4 text-center text-sm text-muted-foreground">
                  Nothing here.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Mobile stacked columns */}
      <section className="space-y-3 lg:hidden">
        {columns.map((col) => (
          <Card key={col} className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{col}</span>
                <Badge variant="secondary">{byColumn[col].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {byColumn[col].map((o) => (
                <OrderCard key={o.id} order={o} onMove={moveOrder} />
              ))}
              {byColumn[col].length === 0 && (
                <div className="rounded-xl border border-border bg-background p-4 text-center text-sm text-muted-foreground">
                  Nothing here.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="text-xs text-muted-foreground">
        This page is UI-only. “Live” indicator and actions are local mock state.
      </div>
    </div>
  );
}
