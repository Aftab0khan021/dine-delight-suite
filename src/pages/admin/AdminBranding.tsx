import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, RotateCcw, Save, X } from "lucide-react";

type BrandingDraft = {
  name: string;
  description: string;
  phone: string;
  email: string;
  brandColor: string; // hex for picker UI
  logoFileName?: string;
  coverFileName?: string;
};

const brandingSchema = z.object({
  name: z.string().trim().min(2, "Restaurant name is required").max(60, "Keep it under 60 characters"),
  description: z.string().trim().min(10, "Add a short description").max(280, "Keep it under 280 characters"),
  phone: z.string().trim().min(7, "Enter a phone number").max(30, "Phone is too long"),
  email: z.string().trim().email("Enter a valid email").max(255, "Email is too long"),
  brandColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Pick a valid color"),
});

type BrandingForm = z.infer<typeof brandingSchema>;

const initialDraft: BrandingDraft = {
  name: "Olive & Ember",
  description: "Modern Mediterranean plates with a warm, relaxed vibe.",
  phone: "+1 (555) 013-0101",
  email: "hello@oliveember.com",
  brandColor: "#1f4a3a", // deep olive
  logoFileName: "logo.png",
  coverFileName: "cover.jpg",
};

export default function AdminBranding() {
  const { toast } = useToast();
  const [draft, setDraft] = useState<BrandingDraft>(initialDraft);

  const form = useForm<BrandingForm>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      name: draft.name,
      description: draft.description,
      phone: draft.phone,
      email: draft.email,
      brandColor: draft.brandColor,
    },
    mode: "onChange",
  });

  const dirty = useMemo(() => {
    const values = form.getValues();
    return (
      values.name !== draft.name ||
      values.description !== draft.description ||
      values.phone !== draft.phone ||
      values.email !== draft.email ||
      values.brandColor !== draft.brandColor
    );
  }, [draft, form]);

  const onCancel = () => {
    form.reset({
      name: draft.name,
      description: draft.description,
      phone: draft.phone,
      email: draft.email,
      brandColor: draft.brandColor,
    });
    toast({ title: "Changes discarded", description: "Reverted to saved mock values." });
  };

  const onSave = (values: BrandingForm) => {
    setDraft((prev) => ({
      ...prev,
      name: values.name.trim(),
      description: values.description.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      brandColor: values.brandColor,
    }));
    toast({ title: "Saved", description: "Branding updated (mock)." });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Branding</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Restaurant info, brand assets, and a simple website preview (UI only).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSave)}
            disabled={!form.formState.isValid || !dirty}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        {/* Left: form + uploads */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Restaurant profile & branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic info */}
            <div className="space-y-4">
              <div className="text-sm font-medium">Basic info</div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Restaurant name</Label>
                  <Input id="name" {...form.register("name")} />
                  {form.formState.errors.name?.message && (
                    <div className="text-sm text-destructive">{form.formState.errors.name.message}</div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Short description for your website and QR menu"
                    {...form.register("description")}
                  />
                  {form.formState.errors.description?.message && (
                    <div className="text-sm text-destructive">{form.formState.errors.description.message}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact phone</Label>
                  <Input id="phone" inputMode="tel" {...form.register("phone")} />
                  {form.formState.errors.phone?.message && (
                    <div className="text-sm text-destructive">{form.formState.errors.phone.message}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Contact email</Label>
                  <Input id="email" inputMode="email" {...form.register("email")} />
                  {form.formState.errors.email?.message && (
                    <div className="text-sm text-destructive">{form.formState.errors.email.message}</div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Uploads */}
            <div className="space-y-4">
              <div className="text-sm font-medium">Assets</div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">Logo</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {draft.logoFileName ?? "No file selected"}
                      </div>
                    </div>
                    <Badge variant="secondary">Mock</Badge>
                  </div>

                  <div className="mt-3 grid h-24 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => toast({ title: "Upload", description: "Upload not wired (UI only)." })}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        setDraft((d) => ({ ...d, logoFileName: undefined }));
                        toast({ title: "Removed", description: "Logo removed (mock)." });
                      }}
                      aria-label="Remove logo"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">Cover image</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {draft.coverFileName ?? "No file selected"}
                      </div>
                    </div>
                    <Badge variant="secondary">Mock</Badge>
                  </div>

                  <div className="mt-3 grid h-24 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <ImageIcon className="h-6 w-6" />
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => toast({ title: "Upload", description: "Upload not wired (UI only)." })}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        setDraft((d) => ({ ...d, coverFileName: undefined }));
                        toast({ title: "Removed", description: "Cover removed (mock)." });
                      }}
                      aria-label="Remove cover"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium">Brand color (primary accent)</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Used for buttons, highlights, and badges.
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-full border border-border"
                      style={{ backgroundColor: form.watch("brandColor") }}
                      aria-hidden
                    />
                    <Input
                      type="color"
                      className="h-10 w-14 p-1"
                      value={form.watch("brandColor")}
                      onChange={(e) => form.setValue("brandColor", e.target.value, { shouldValidate: true })}
                      aria-label="Brand color"
                    />
                    <Input
                      className="w-28"
                      value={form.watch("brandColor")}
                      onChange={(e) => form.setValue("brandColor", e.target.value, { shouldValidate: true })}
                      aria-label="Brand color hex"
                    />
                  </div>
                </div>
                {form.formState.errors.brandColor?.message && (
                  <div className="mt-2 text-sm text-destructive">
                    {form.formState.errors.brandColor.message}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
              UI only: uploads and theme propagation are placeholders.
            </div>
          </CardContent>
        </Card>

        {/* Right: website preview */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Website preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-xs text-muted-foreground">Preview (mock)</div>
              <div className="mt-2 rounded-lg border border-border bg-card p-4 shadow-soft">
                <div className="text-lg font-semibold">{form.watch("name")}</div>
                <div className="mt-1 text-sm text-muted-foreground line-clamp-3">
                  {form.watch("description")}
                </div>
                <div className="mt-3 flex gap-2">
                  <div
                    className="inline-flex h-9 items-center rounded-xl px-3 text-sm shadow-soft"
                    style={{ backgroundColor: form.watch("brandColor"), color: "white" }}
                  >
                    Primary CTA
                  </div>
                  <div className="inline-flex h-9 items-center rounded-xl border border-border bg-background px-3 text-sm">
                    Secondary
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-3 text-sm">
              <div className="text-xs text-muted-foreground">Contact</div>
              <div className="mt-2 space-y-1">
                <div className="text-sm">{form.watch("phone")}</div>
                <div className="text-sm text-muted-foreground">{form.watch("email")}</div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Later: render the real public site preview here.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
