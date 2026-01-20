import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminBilling() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscription and invoices (UI placeholders only).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">View invoices</Button>
          <Button>Upgrade</Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Current plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
              <div>
                <div className="text-sm font-medium">Pro</div>
                <div className="text-xs text-muted-foreground">
                  Renews on Feb 20, 2026
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge>Active</Badge>
                <Button variant="secondary">Change plan</Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-medium">Usage</div>
              <div className="mt-2 text-sm text-muted-foreground">
                QR scans: 2,140 / 10,000 • Staff seats: 6 / 10
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Card</div>
              <div className="mt-1 text-sm text-muted-foreground">•••• 4242</div>
            </div>
            <Button variant="secondary" className="w-full">
              Update payment method
            </Button>
            <Button variant="destructive" className="w-full">
              Cancel subscription
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
