import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  ClipboardList,
  Plus,
  QrCode,
  ReceiptText,
  Sparkles,
} from "lucide-react";

type SparklineProps = {
  values: number[];
  className?: string;
};

function Sparkline({ values, className }: SparklineProps) {
  const w = 96;
  const h = 32;
  const pad = 2;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * (w - pad * 2) + pad;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const last = values[values.length - 1];
  const first = values[0];
  const up = last >= first;

  return (
    <div className={cn("w-24", className)} aria-hidden>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(up ? "text-primary" : "text-muted-foreground")}
        />
      </svg>
    </div>
  );
}

const kpis = [
  {
    label: "Today’s Orders",
    value: "47",
    delta: "+12%",
    trend: [28, 31, 29, 34, 38, 41, 47],
    tone: "good" as const,
  },
  {
    label: "Revenue",
    value: "$1,284",
    delta: "+6%",
    trend: [860, 920, 910, 980, 1040, 1180, 1284],
    tone: "good" as const,
  },
  {
    label: "Avg Prep Time",
    value: "14m",
    delta: "-2m",
    trend: [18, 17, 18, 16, 16, 15, 14],
    tone: "good" as const,
  },
  {
    label: "Top Selling Item",
    value: "Crispy halloumi",
    delta: "18 sold",
    trend: [9, 10, 11, 12, 14, 16, 18],
    tone: "neutral" as const,
  },
];

const liveOrders = [
  { id: "#1047", table: "Table 3", items: "2 items", status: "New" },
  { id: "#1046", table: "Table 12", items: "3 items", status: "Preparing" },
  { id: "#1045", table: "Table 7", items: "1 item", status: "New" },
  { id: "#1044", table: "Takeaway", items: "5 items", status: "Ready" },
  { id: "#1043", table: "Table 2", items: "2 items", status: "Preparing" },
];

const setupChecklist = [
  { label: "Branding", detail: "Logo + cover", status: "Pending" as const },
  { label: "First Menu Item", detail: "Create at least 1 item", status: "Pending" as const },
  { label: "QR Published", detail: "Generate & print", status: "Pending" as const },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "New":
      return "default" as const;
    case "Preparing":
      return "secondary" as const;
    case "Ready":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A clear snapshot of today—built for busy service.
          </p>
        </div>

        {/* Quick actions (top) */}
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            View orders
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
          <Button>
            Add menu item
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {k.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="text-2xl font-semibold tracking-tight">
                  {k.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Last 7 days</div>
              </div>

              <div className="flex items-end gap-3">
                <Sparkline values={k.trend} />
                <Badge variant={k.tone === "good" ? "default" : "secondary"}>
                  {k.delta}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Body grid */}
      <section className="grid gap-3 lg:grid-cols-3">
        {/* Live Orders */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Live orders</CardTitle>
              <div className="mt-1 text-xs text-muted-foreground">
                Latest 5 (mock). Status chips show current stage.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {liveOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{o.id}</span>
                      <span className="text-xs text-muted-foreground">{o.table}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{o.items}</div>
                  </div>
                  <Badge variant={statusVariant(o.status)} className="shrink-0">
                    {o.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="secondary">
                View orders
                <ReceiptText className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="secondary">
                Print QR
                <QrCode className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Setup + quick actions */}
        <div className="space-y-3">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Setup checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <div className="text-sm font-medium">Ready in 3 steps</div>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  {setupChecklist.map((i) => (
                    <li key={i.label} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{i.label}</div>
                        <div className="text-xs text-muted-foreground">{i.detail}</div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {i.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="w-full" variant="secondary">
                Open setup
                <ClipboardList className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="w-full justify-between" variant="secondary">
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Menu Item
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button className="w-full justify-between" variant="secondary">
                <span className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Print QR
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button className="w-full justify-between" variant="secondary">
                <span className="flex items-center gap-2">
                  <ReceiptText className="h-4 w-4" />
                  View Orders
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <div className="pt-1 text-xs text-muted-foreground">
                No API calls yet—buttons are placeholders.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
