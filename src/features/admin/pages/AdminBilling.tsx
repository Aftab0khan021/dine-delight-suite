import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, CreditCard, Download, ShieldAlert } from "lucide-react";

type Plan = {
  id: string;
  name: string;
  price: string;
  renewalDate: string;
};

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Open";
};

const plans: Plan[] = [
  { id: "starter", name: "Starter", price: "$29 / mo", renewalDate: "Feb 20, 2026" },
  { id: "pro", name: "Pro", price: "$59 / mo", renewalDate: "Feb 20, 2026" },
  { id: "growth", name: "Growth", price: "$99 / mo", renewalDate: "Feb 20, 2026" },
];

const invoices: Invoice[] = [
  { id: "INV-1042", date: "Jan 20, 2026", amount: "$59.00", status: "Paid" },
  { id: "INV-0998", date: "Dec 20, 2025", amount: "$59.00", status: "Paid" },
  { id: "INV-0951", date: "Nov 20, 2025", amount: "$59.00", status: "Paid" },
];

function ProgressBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
      <div className="h-full rounded-full bg-primary" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export default function AdminBilling() {
  const { toast } = useToast();
  const [currentPlanId, setCurrentPlanId] = useState<string>("pro");
  const currentPlan = useMemo(
    () => plans.find((p) => p.id === currentPlanId) ?? plans[1],
    [currentPlanId],
  );

  // mock usage
  const usage = {
    qrScans: { used: 2140, limit: 10000 },
    staffSeats: { used: 6, limit: 10 },
  };

  const qrPct = Math.round((usage.qrScans.used / usage.qrScans.limit) * 100);
  const seatsPct = Math.round((usage.staffSeats.used / usage.staffSeats.limit) * 100);

  const [cancelText, setCancelText] = useState<string>("");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscription, usage, and invoices (UI only—no payments wired).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download invoices
          </Button>
          <Button>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Change plan
          </Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        {/* Current plan */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Current subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">{currentPlan.name}</div>
                  <Badge>Active</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {currentPlan.price} • Renews on {currentPlan.renewalDate}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrentPlanId("starter");
                    toast({ title: "Downgraded", description: "Changed plan (mock)." });
                  }}
                >
                  Downgrade
                </Button>
                <Button
                  onClick={() => {
                    setCurrentPlanId("growth");
                    toast({ title: "Upgraded", description: "Changed plan (mock)." });
                  }}
                >
                  Upgrade
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-medium">Usage</div>
              <div className="mt-3 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">QR scans</span>
                    <span className="font-medium">
                      {usage.qrScans.used.toLocaleString()} / {usage.qrScans.limit.toLocaleString()}
                    </span>
                  </div>
                  <ProgressBar value={qrPct} />
                  <div className="text-xs text-muted-foreground">{qrPct}% used</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Staff seats</span>
                    <span className="font-medium">
                      {usage.staffSeats.used} / {usage.staffSeats.limit}
                    </span>
                  </div>
                  <ProgressBar value={seatsPct} />
                  <div className="text-xs text-muted-foreground">{seatsPct}% used</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
              UI only: plan changes and usage are mock values.
            </div>
          </CardContent>
        </Card>

        {/* Payment method / summary */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Payment method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-3">
              <div>
                <div className="text-sm font-medium">Card</div>
                <div className="mt-1 text-sm text-muted-foreground">•••• 4242</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => toast({ title: "Not wired", description: "Payment updates are UI only." })}
            >
              Update payment method
            </Button>

            <Separator />

            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Available plans</div>
              <div className="mt-2 space-y-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setCurrentPlanId(p.id);
                      toast({ title: "Plan selected", description: "Selection saved (mock)." });
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-left text-sm transition hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-medium">{p.name}</span>
                    <span className="text-muted-foreground">{p.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Invoices */}
      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block">
              <div className="rounded-xl border border-border bg-background">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.id}</TableCell>
                        <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                        <TableCell>
                          <Badge variant={inv.status === "Paid" ? "secondary" : "default"}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{inv.amount}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => toast({ title: "Download", description: "Invoice download (mock)." })}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-2 md:hidden">
              {invoices.map((inv) => (
                <div key={inv.id} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{inv.id}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{inv.date}</div>
                    </div>
                    <Badge variant={inv.status === "Paid" ? "secondary" : "default"}>
                      {inv.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm">{inv.amount}</div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toast({ title: "Download", description: "Invoice download (mock)." })}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cancel subscription */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Cancel subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium">Be careful</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    This is a mock confirmation UI—no billing changes occur.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel">Type CANCEL to confirm</Label>
              <Input
                id="cancel"
                value={cancelText}
                onChange={(e) => setCancelText(e.target.value)}
                placeholder="CANCEL"
              />
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={cancelText !== "CANCEL"}>
                  Cancel subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This is a UI-only demo. In a real app, this would immediately stop renewals and
                    update access rules.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      toast({ title: "Cancelled", description: "Subscription cancelled (mock)." });
                      setCancelText("");
                    }}
                  >
                    Confirm cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="text-xs text-muted-foreground">
              Tip: you can replace this with a cancellation survey later.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
