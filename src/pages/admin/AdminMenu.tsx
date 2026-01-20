import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const categories = [
  { name: "Starters", count: 8, visible: true },
  { name: "Mains", count: 14, visible: true },
  { name: "Desserts", count: 6, visible: true },
  { name: "Drinks", count: 12, visible: true },
];

const items = [
  { name: "Crispy halloumi", category: "Starters", price: "$9", status: "In stock" },
  { name: "Miso ramen", category: "Mains", price: "$16", status: "In stock" },
  { name: "Truffle fries", category: "Starters", price: "$7", status: "Sold out" },
  { name: "Citrus tart", category: "Desserts", price: "$8", status: "In stock" },
];

export default function AdminMenu() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Menu</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage categories and items (mock UI only).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">New category</Button>
          <Button>New item</Button>
        </div>
      </header>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="bg-card shadow-soft">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-3">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.count} items
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={c.visible ? "secondary" : "destructive"}>
                      {c.visible ? "Visible" : "Hidden"}
                    </Badge>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-3">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((i) => (
                <div
                  key={i.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3"
                >
                  <div>
                    <div className="text-sm font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {i.category} • {i.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={i.status === "Sold out" ? "destructive" : "secondary"}>
                      {i.status}
                    </Badge>
                    <Button size="sm" variant="secondary">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
