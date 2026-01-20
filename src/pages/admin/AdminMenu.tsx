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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Image as ImageIcon,
  Plus,
  Search,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  description?: string;
  visible: boolean;
  itemCount: number;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  available: boolean;
  tags: Array<"veg" | "vegan" | "spicy">;
  imageUrl?: string;
};

const initialCategories: Category[] = [
  {
    id: "cat_starters",
    name: "Starters",
    description: "Small plates to begin.",
    visible: true,
    itemCount: 8,
  },
  {
    id: "cat_mains",
    name: "Mains",
    description: "House favorites.",
    visible: true,
    itemCount: 14,
  },
  {
    id: "cat_desserts",
    name: "Desserts",
    description: "Sweet finishes.",
    visible: true,
    itemCount: 6,
  },
  {
    id: "cat_drinks",
    name: "Drinks",
    description: "Coffee, tea & soft drinks.",
    visible: true,
    itemCount: 12,
  },
];

const initialItems: MenuItem[] = [
  {
    id: "itm_halloumi",
    name: "Crispy halloumi",
    description: "Honey drizzle, lemon zest, toasted seeds.",
    categoryId: "cat_starters",
    price: 9,
    available: true,
    tags: ["veg"],
    imageUrl: "/placeholder.svg",
  },
  {
    id: "itm_ramen",
    name: "Miso ramen",
    description: "Silky broth, mushrooms, spring onion.",
    categoryId: "cat_mains",
    price: 16,
    available: true,
    tags: ["spicy"],
    imageUrl: "/placeholder.svg",
  },
  {
    id: "itm_fries",
    name: "Truffle fries",
    description: "Parmesan (optional), herb salt.",
    categoryId: "cat_starters",
    price: 7,
    available: false,
    tags: ["veg"],
    imageUrl: "/placeholder.svg",
  },
  {
    id: "itm_tart",
    name: "Citrus tart",
    description: "Candied peel, whipped cream.",
    categoryId: "cat_desserts",
    price: 8,
    available: true,
    tags: ["veg"],
    imageUrl: "/placeholder.svg",
  },
  {
    id: "itm_salad",
    name: "Market salad",
    description: "Seasonal greens, vinaigrette.",
    categoryId: "cat_starters",
    price: 11,
    available: true,
    tags: ["vegan"],
    imageUrl: "/placeholder.svg",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminMenu() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [items, setItems] = useState<MenuItem[]>(initialItems);

  // Categories state
  const [dragId, setDragId] = useState<string | null>(null);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Items state
  const [query, setQuery] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [itemSheetOpen, setItemSheetOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((i) => (q ? i.name.toLowerCase().includes(q) : true))
      .filter((i) => (filterCategoryId === "all" ? true : i.categoryId === filterCategoryId))
      .filter((i) => {
        if (filterAvailability === "all") return true;
        if (filterAvailability === "available") return i.available;
        if (filterAvailability === "unavailable") return !i.available;
        return true;
      });
  }, [items, query, filterCategoryId, filterAvailability]);

  const editingCategory = useMemo(
    () => categories.find((c) => c.id === editingCategoryId) ?? null,
    [categories, editingCategoryId]
  );

  const editingItem = useMemo(
    () => items.find((i) => i.id === editingItemId) ?? null,
    [items, editingItemId]
  );

  // --- actions (UI-only) ---
  const openNewCategory = () => {
    setEditingCategoryId(null);
    setCategorySheetOpen(true);
  };

  const openEditCategory = (id: string) => {
    setEditingCategoryId(id);
    setCategorySheetOpen(true);
  };

  const toggleCategoryVisible = (id: string, visible: boolean) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visible } : c)));
  };

  const reorderCategory = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setCategories((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === fromId);
      const toIndex = prev.findIndex((c) => c.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const moveCategory = (id: string, dir: "up" | "down") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(nextIdx, 0, moved);
      return next;
    });
  };

  const openNewItem = () => {
    setEditingItemId(null);
    setItemSheetOpen(true);
  };

  const openEditItem = (id: string) => {
    setEditingItemId(id);
    setItemSheetOpen(true);
  };

  const toggleItemAvailable = (id: string, available: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, available } : i)));
  };

  // --- sheet local drafts (simple, no RHF; UI-only) ---
  const [categoryDraft, setCategoryDraft] = useState<{
    name: string;
    description: string;
    visible: boolean;
  }>({ name: "", description: "", visible: true });

  const [itemDraft, setItemDraft] = useState<{
    name: string;
    description: string;
    price: string;
    categoryId: string;
    available: boolean;
    tags: Array<"veg" | "vegan" | "spicy">;
  }>({
    name: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id ?? "",
    available: true,
    tags: [],
  });

  const hydrateCategoryDraft = () => {
    if (editingCategory) {
      setCategoryDraft({
        name: editingCategory.name,
        description: editingCategory.description ?? "",
        visible: editingCategory.visible,
      });
      return;
    }
    setCategoryDraft({ name: "", description: "", visible: true });
  };

  const hydrateItemDraft = () => {
    if (editingItem) {
      setItemDraft({
        name: editingItem.name,
        description: editingItem.description,
        price: String(editingItem.price),
        categoryId: editingItem.categoryId,
        available: editingItem.available,
        tags: editingItem.tags,
      });
      return;
    }
    setItemDraft({
      name: "",
      description: "",
      price: "",
      categoryId: categories[0]?.id ?? "",
      available: true,
      tags: [],
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Menu Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Categories and items with mock data only—no API calls.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={openNewCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add category
          </Button>
          <Button onClick={openNewItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add menu item
          </Button>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-3">
        {/* SECTION 1: Categories */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Categories</CardTitle>
              <div className="mt-1 text-xs text-muted-foreground">
                Drag to reorder on desktop.
              </div>
            </div>
            <Button size="sm" variant="secondary" onClick={openNewCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDragId(c.id)}
                onDragOver={(e) => {
                  // Only meaningful on desktop; harmless on mobile
                  e.preventDefault();
                }}
                onDrop={() => {
                  if (dragId) reorderCategory(dragId, c.id);
                  setDragId(null);
                }}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3",
                  dragId === c.id && "opacity-70"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="hidden md:block text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.itemCount} items
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-2 md:flex">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => moveCategory(c.id, "up")}
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => moveCategory(c.id, "down")}
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={c.visible}
                      onCheckedChange={(v) => toggleCategoryVisible(c.id, v)}
                      aria-label="Toggle visibility"
                    />
                    <Badge variant={c.visible ? "secondary" : "destructive"}>
                      {c.visible ? "Shown" : "Hidden"}
                    </Badge>
                  </div>

                  <Button size="sm" variant="secondary" onClick={() => openEditCategory(c.id)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}

            <div className="pt-2 text-xs text-muted-foreground">
              Tip: keep categories under ~9 for faster scanning.
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Menu Items */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-base">Menu Items</CardTitle>
                <div className="mt-1 text-xs text-muted-foreground">
                  Desktop table, mobile cards.
                </div>
              </div>
              <Button size="sm" onClick={openNewItem}>
                <Plus className="mr-2 h-4 w-4" />
                Add item
              </Button>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-3">
              <div className="relative md:col-span-1">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search items…"
                  className="pl-9"
                />
              </div>

              <Select value={filterCategoryId} onValueChange={setFilterCategoryId}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="rounded-xl border border-border bg-background">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[72px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((i) => (
                      <TableRow key={i.id} className="align-middle">
                        <TableCell>
                          <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg border border-border bg-card">
                            {i.imageUrl ? (
                              <img
                                src={i.imageUrl}
                                alt="Item"
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{i.name}</div>
                          <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {i.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {categoryById.get(i.categoryId)?.name ?? "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(i.price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Switch
                              checked={i.available}
                              onCheckedChange={(v) => toggleItemAvailable(i.id, v)}
                              aria-label="Toggle availability"
                            />
                            <Badge variant={i.available ? "secondary" : "destructive"}>
                              {i.available ? "On" : "Off"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="secondary" onClick={() => openEditItem(i.id)}>
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center">
                          <div className="text-sm font-medium">No items found</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            Try clearing filters or search.
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {filteredItems.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg border border-border bg-card">
                      {i.imageUrl ? (
                        <img
                          src={i.imageUrl}
                          alt="Item"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{i.name}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {categoryById.get(i.categoryId)?.name ?? "—"} • {formatPrice(i.price)}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Switch
                          checked={i.available}
                          onCheckedChange={(v) => toggleItemAvailable(i.id, v)}
                          aria-label="Toggle availability"
                        />
                        <Badge variant={i.available ? "secondary" : "destructive"}>
                          {i.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => openEditItem(i.id)}>
                    Edit
                  </Button>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="rounded-xl border border-border bg-background p-6 text-center">
                  <div className="text-sm font-medium">No items found</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Try clearing filters or search.
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Drawer */}
      <Sheet
        open={categorySheetOpen}
        onOpenChange={(open) => {
          setCategorySheetOpen(open);
          if (open) hydrateCategoryDraft();
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {editingCategory ? "Edit Category" : "Add Category"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="cat_name">Name</Label>
              <Input
                id="cat_name"
                value={categoryDraft.name}
                onChange={(e) =>
                  setCategoryDraft((d) => ({ ...d, name: e.target.value }))
                }
                placeholder="e.g., Starters"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat_desc">Description (optional)</Label>
              <Input
                id="cat_desc"
                value={categoryDraft.description}
                onChange={(e) =>
                  setCategoryDraft((d) => ({ ...d, description: e.target.value }))
                }
                placeholder="Short helper text"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
              <div>
                <div className="text-sm font-medium">Visible</div>
                <div className="text-xs text-muted-foreground">
                  Hidden categories won’t show on the public menu.
                </div>
              </div>
              <Switch
                checked={categoryDraft.visible}
                onCheckedChange={(v) =>
                  setCategoryDraft((d) => ({ ...d, visible: v }))
                }
              />
            </div>

            <Separator />

            <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
              UI only: “Save” updates local state; no backend calls.
            </div>
          </div>

          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button variant="secondary">Cancel</Button>
            </SheetClose>
            <Button
              onClick={() => {
                if (!categoryDraft.name.trim()) return;

                if (editingCategory) {
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.id === editingCategory.id
                        ? {
                            ...c,
                            name: categoryDraft.name.trim(),
                            description: categoryDraft.description.trim() || undefined,
                            visible: categoryDraft.visible,
                          }
                        : c
                    )
                  );
                } else {
                  const id = `cat_${Math.random().toString(16).slice(2)}`;
                  setCategories((prev) => [
                    ...prev,
                    {
                      id,
                      name: categoryDraft.name.trim(),
                      description: categoryDraft.description.trim() || undefined,
                      visible: categoryDraft.visible,
                      itemCount: 0,
                    },
                  ]);
                }

                setCategorySheetOpen(false);
              }}
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Item Drawer */}
      <Sheet
        open={itemSheetOpen}
        onOpenChange={(open) => {
          setItemSheetOpen(open);
          if (open) hydrateItemDraft();
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editingItem ? "Edit Item" : "Add Item"}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div className="grid gap-3 rounded-xl border border-border bg-background p-3 sm:grid-cols-[80px_1fr]">
              <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-lg border border-border bg-card">
                {editingItem?.imageUrl ? (
                  <img
                    src={editingItem.imageUrl}
                    alt="Item"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-sm font-medium">Item image</div>
                <div className="text-xs text-muted-foreground">
                  Placeholder only (no upload wired).
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itm_name">Name</Label>
              <Input
                id="itm_name"
                value={itemDraft.name}
                onChange={(e) => setItemDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g., Miso ramen"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itm_desc">Description</Label>
              <Input
                id="itm_desc"
                value={itemDraft.description}
                onChange={(e) =>
                  setItemDraft((d) => ({ ...d, description: e.target.value }))
                }
                placeholder="Short description"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="itm_price">Price</Label>
                <Input
                  id="itm_price"
                  inputMode="decimal"
                  value={itemDraft.price}
                  onChange={(e) =>
                    setItemDraft((d) => ({
                      ...d,
                      price: e.target.value.replace(/[^0-9.]/g, ""),
                    }))
                  }
                  placeholder="e.g., 16"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={itemDraft.categoryId}
                  onValueChange={(v) => setItemDraft((d) => ({ ...d, categoryId: v }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dietary tags</Label>
              <ToggleGroup
                type="multiple"
                value={itemDraft.tags}
                onValueChange={(tags) =>
                  setItemDraft((d) => ({ ...d, tags: tags as MenuItem["tags"] }))
                }
                className="justify-start"
              >
                <ToggleGroupItem value="veg" aria-label="Vegetarian">
                  Veg
                </ToggleGroupItem>
                <ToggleGroupItem value="vegan" aria-label="Vegan">
                  Vegan
                </ToggleGroupItem>
                <ToggleGroupItem value="spicy" aria-label="Spicy">
                  Spicy
                </ToggleGroupItem>
              </ToggleGroup>
              <div className="text-xs text-muted-foreground">
                Tags are visual indicators only in this mock.
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
              <div>
                <div className="text-sm font-medium">Available</div>
                <div className="text-xs text-muted-foreground">
                  Toggle off when an item is sold out.
                </div>
              </div>
              <Switch
                checked={itemDraft.available}
                onCheckedChange={(v) => setItemDraft((d) => ({ ...d, available: v }))}
              />
            </div>

            <Separator />

            <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
              UI only: “Save” updates local state; no backend calls.
            </div>
          </div>

          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button variant="secondary">Cancel</Button>
            </SheetClose>
            <Button
              onClick={() => {
                const name = itemDraft.name.trim();
                const desc = itemDraft.description.trim();
                const priceNum = Number(itemDraft.price);
                if (!name || !desc || !Number.isFinite(priceNum)) return;

                if (editingItem) {
                  setItems((prev) =>
                    prev.map((i) =>
                      i.id === editingItem.id
                        ? {
                            ...i,
                            name,
                            description: desc,
                            price: priceNum,
                            categoryId: itemDraft.categoryId,
                            available: itemDraft.available,
                            tags: itemDraft.tags,
                          }
                        : i
                    )
                  );
                } else {
                  const id = `itm_${Math.random().toString(16).slice(2)}`;
                  setItems((prev) => [
                    {
                      id,
                      name,
                      description: desc,
                      categoryId: itemDraft.categoryId,
                      price: priceNum,
                      available: itemDraft.available,
                      tags: itemDraft.tags,
                      imageUrl: "/placeholder.svg",
                    },
                    ...prev,
                  ]);

                  // bump the category count (mock convenience)
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.id === itemDraft.categoryId
                        ? { ...c, itemCount: c.itemCount + 1 }
                        : c
                    )
                  );
                }

                setItemSheetOpen(false);
              }}
            >
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
