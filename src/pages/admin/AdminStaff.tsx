import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const staff = [
  { name: "Mina Lee", role: "Manager", status: "Active" },
  { name: "Jordan Park", role: "Staff", status: "Active" },
  { name: "Casey Diaz", role: "Staff", status: "Invited" },
];

export default function AdminStaff() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite, assign roles, and manage access (mock UI).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Role presets</Button>
          <Button>Invite staff</Button>
        </div>
      </header>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {staff.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
            >
              <div>
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.role}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={s.status === "Invited" ? "secondary" : "default"}>
                  {s.status}
                </Badge>
                <Button size="sm" variant="secondary">
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
