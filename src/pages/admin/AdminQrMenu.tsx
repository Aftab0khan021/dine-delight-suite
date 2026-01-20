import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";

export default function AdminQrMenu() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">QR Menu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate table QR packs (UI placeholder).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Download PDF</Button>
          <Button>Generate</Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Type</div>
              <div className="mt-1 text-sm text-muted-foreground">Table-specific</div>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Tables</div>
              <div className="mt-1 text-sm text-muted-foreground">1 → 20</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                Template
              </Button>
              <Button className="flex-1">Preview</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>Preview</span>
              <Badge variant="secondary">20 codes</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="grid place-items-center rounded-xl border border-border bg-background p-4"
                >
                  <div className="grid place-items-center gap-2">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <div className="text-sm font-medium">Table {idx + 1}</div>
                    <div className="text-xs text-muted-foreground">/m/table/{idx + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
