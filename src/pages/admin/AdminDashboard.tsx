import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Sparkles } from "lucide-react";

const stats = [
  { label: "Today’s orders", value: "47", meta: "+12%", tone: "good" as const },
  { label: "Revenue", value: "$1,284", meta: "+6%", tone: "good" as const },
  { label: "Avg prep time", value: "14m", meta: "-2m", tone: "good" as const },
  { label: "Top item", value: "Crispy halloumi", meta: "18 sold", tone: "neutral" as const },
];

const liveOrders = [
  { id: "#1042", table: "Table 12", items: "3 items", status: "New" },
  { id: "#1041", table: "Table 4", items: "2 items", status: "Preparing" },
  { id: "#1039", table: "Takeaway", items: "5 items", status: "Ready" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A calm overview for today—no busywork.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Print QR pack</Button>
          <Button>
            Quick add item
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <div className="text-2xl font-semibold tracking-tight">{s.value}</div>
              <Badge variant={s.tone === "good" ? "default" : "secondary"}>
                {s.meta}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Live orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {liveOrders.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{o.id}</span>
                      <span className="text-xs text-muted-foreground">{o.table}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{o.items}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 motion-reduce:hidden" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    <Badge variant="secondary">{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Setup checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <div className="text-sm font-medium">Get ready for service</div>
              </div>
              <ul className="mt-2 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upload logo</span>
                  <Badge variant="secondary">Pending</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Add first category</span>
                  <Badge variant="secondary">Pending</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Print QR codes</span>
                  <Badge variant="secondary">Pending</Badge>
                </li>
              </ul>
            </div>
            <Button className="w-full" variant="secondary">
              Open setup
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
