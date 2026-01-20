import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminBranding() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Branding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Logo, colors, and website style (placeholders only).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Preview website</Button>
          <Button>Save</Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Brand assets</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-medium">Logo</div>
              <div className="mt-2 h-24 rounded-lg bg-accent" />
              <Button className="mt-3" variant="secondary">
                Upload
              </Button>
            </div>
            <div className="rounded-xl border border-border bg-background p-4">
              <div className="text-sm font-medium">Cover image</div>
              <div className="mt-2 h-24 rounded-lg bg-accent" />
              <Button className="mt-3" variant="secondary">
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Primary color</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Deep olive</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Status</div>
              <div className="mt-2 flex gap-2">
                <Badge>Published</Badge>
                <Badge variant="secondary">Draft changes</Badge>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              Reset to default
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
