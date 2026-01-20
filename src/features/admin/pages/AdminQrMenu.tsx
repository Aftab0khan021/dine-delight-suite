import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Printer, QrCode } from "lucide-react";

type QrType = "general" | "table" | "takeaway";

type PrintLayout = "cards" | "stickers" | "tent";

type QrPreview = {
  label: string;
  path: string;
};

function clampInt(value: string, fallback: number) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function buildPreviewList(type: QrType, from: number, to: number, prefix: string): QrPreview[] {
  if (type === "general") return [{ label: "General Menu", path: "/m" }];
  if (type === "takeaway") return [{ label: "Takeaway", path: "/m/takeaway" }];

  const safeFrom = Math.max(1, Math.min(from, to));
  const safeTo = Math.max(safeFrom, Math.max(from, to));

  // Keep preview light: only show first 18 in UI.
  const maxPreview = 18;
  const list: QrPreview[] = [];

  for (let t = safeFrom; t <= safeTo && list.length < maxPreview; t += 1) {
    const label = prefix?.trim() ? `${prefix.trim()}${t}` : `Table ${t}`;
    list.push({ label, path: `/m/table/${t}` });
  }

  return list;
}

export default function AdminQrMenu() {
  const { toast } = useToast();

  const [qrType, setQrType] = useState<QrType>("table");
  const [fromTable, setFromTable] = useState("1");
  const [toTable, setToTable] = useState("20");
  const [prefix, setPrefix] = useState("T-");
  const [layout, setLayout] = useState<PrintLayout>("cards");

  const shortUrl = "https://rsto.app/olive"; // placeholder

  const from = clampInt(fromTable, 1);
  const to = clampInt(toTable, 20);

  const previews = useMemo(
    () => buildPreviewList(qrType, from, to, prefix),
    [qrType, from, to, prefix]
  );

  const totalCount = useMemo(() => {
    if (qrType === "general" || qrType === "takeaway") return 1;
    const safeFrom = Math.max(1, Math.min(from, to));
    const safeTo = Math.max(safeFrom, Math.max(from, to));
    return safeTo - safeFrom + 1;
  }, [qrType, from, to]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast({ title: "Copied", description: "Short URL copied to clipboard." });
    } catch {
      toast({
        title: "Copy failed",
        description: "Your browser blocked clipboard access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">QR Menu Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mock previews only—no real QR generation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        {/* Generator */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>QR type</Label>
              <Select value={qrType} onValueChange={(v) => setQrType(v as QrType)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="general">General Menu</SelectItem>
                  <SelectItem value="table">Table-wise Menu</SelectItem>
                  <SelectItem value="takeaway">Takeaway Menu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className={cn("space-y-3", qrType !== "table" && "opacity-60")}
              aria-disabled={qrType !== "table"}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="from">From table</Label>
                  <Input
                    id="from"
                    inputMode="numeric"
                    value={fromTable}
                    onChange={(e) => setFromTable(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={qrType !== "table"}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To table</Label>
                  <Input
                    id="to"
                    inputMode="numeric"
                    value={toTable}
                    onChange={(e) => setToTable(e.target.value.replace(/[^0-9]/g, ""))}
                    disabled={qrType !== "table"}
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prefix">Optional prefix</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  disabled={qrType !== "table"}
                  placeholder="T-"
                />
                <div className="text-xs text-muted-foreground">
                  Example: <span className="font-medium">T-</span> → T-1, T-2
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Print layout</Label>
              <Select value={layout} onValueChange={(v) => setLayout(v as PrintLayout)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="stickers">Stickers</SelectItem>
                  <SelectItem value="tent">Table tents</SelectItem>
                </SelectContent>
              </Select>
              <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
                UI only: layout changes preview framing (no real export).
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button className="flex-1">Generate preview</Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>QR preview</span>
              <Badge variant="secondary">
                {totalCount} code{totalCount === 1 ? "" : "s"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {previews.map((p) => (
                <div
                  key={p.path}
                  className={cn(
                    "rounded-xl border border-border bg-background p-4 shadow-soft",
                    layout === "stickers" && "p-3",
                    layout === "tent" && "p-5"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{p.label}</div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">
                        {p.path}
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      Mock
                    </Badge>
                  </div>

                  <div className="mt-4 grid place-items-center">
                    <div className="grid h-28 w-28 place-items-center rounded-2xl bg-accent text-accent-foreground">
                      <QrCode className="h-10 w-10" />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Print-ready card preview
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(qrType === "table" && totalCount > previews.length) && (
              <div className="mt-3 text-xs text-muted-foreground">
                Showing {previews.length} of {totalCount} (preview is capped for performance).
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Download + test */}
      <section className="grid gap-3 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Download</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download as PNG
            </Button>
            <Button className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
            <div className="rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
              Exports are placeholders—wire to your backend later.
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Test on your phone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Short URL</div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input value={shortUrl} readOnly aria-label="Short URL" />
                <Button variant="secondary" className="sm:w-auto" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Tip: open the URL on your phone to confirm the menu loads fast.
              </div>
            </div>

            <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
              This is UI-only. Replace the URL with your real short link service.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
