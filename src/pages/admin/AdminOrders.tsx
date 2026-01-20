import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const columns = ["New", "Preparing", "Ready", "Completed"] as const;

const mockOrders: Record<(typeof columns)[number], Array<{ id: string; meta: string; items: string }>> = {
  New: [
    { id: "#1042", meta: "Table 12 • 12:08", items: "Halloumi • Salad • Soda" },
    { id: "#1043", meta: "Table 2 • 12:10", items: "Burger • Fries" },
  ],
  Preparing: [{ id: "#1041", meta: "Table 4 • 12:03", items: "Ramen • Tea" }],
  Ready: [{ id: "#1039", meta: "Takeaway • 11:52", items: "5 items" }],
  Completed: [{ id: "#1036", meta: "Table 9 • 11:31", items: "2 items" }],
};

export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live-style layout (mock data). Move orders through statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live
          </span>
          <Button variant="secondary">Filters</Button>
          <Button>Focus mode</Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-4">
        {columns.map((col) => (
          <Card key={col} className="shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <span>{col}</span>
                <Badge variant="secondary">{mockOrders[col].length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockOrders[col].map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-border bg-background p-3 transition hover:shadow-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{o.id}</div>
                    <Badge variant="secondary">{col}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{o.meta}</div>
                  <div className="mt-2 text-sm">{o.items}</div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-1">
                      Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Next
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
