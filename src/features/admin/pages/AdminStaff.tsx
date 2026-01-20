import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, RefreshCw, Shield, UserPlus, UserX } from "lucide-react";

type Role = "Owner" | "Manager" | "Staff";

type StaffStatus = "Active" | "Invited";

type StaffMember = {
  id: string;
  name: string;
  role: Role;
  status: StaffStatus;
  contact: string;
};

const initialStaff: StaffMember[] = [
  {
    id: "u_owner",
    name: "Alex Owner",
    role: "Owner",
    status: "Active",
    contact: "alex@oliveember.com",
  },
  {
    id: "u_mina",
    name: "Mina Lee",
    role: "Manager",
    status: "Active",
    contact: "mina@oliveember.com",
  },
  {
    id: "u_jordan",
    name: "Jordan Park",
    role: "Staff",
    status: "Active",
    contact: "+1 (555) 013-0021",
  },
  {
    id: "u_casey",
    name: "Casey Diaz",
    role: "Staff",
    status: "Invited",
    contact: "casey@oliveember.com",
  },
];

const activity = [
  { id: "a1", time: "Today 12:22", text: "Order #1047 moved to Preparing" },
  { id: "a2", time: "Today 11:58", text: "Menu item “Miso ramen” updated" },
  { id: "a3", time: "Yesterday 18:06", text: "QR pack generated (Tables 1–20)" },
  { id: "a4", time: "Yesterday 16:40", text: "Casey Diaz invited as Staff" },
];

const roleBadgeVariant = (role: Role) => {
  if (role === "Owner") return "default" as const;
  return "secondary" as const;
};

const statusBadgeVariant = (status: StaffStatus) => {
  if (status === "Active") return "default" as const;
  return "secondary" as const;
};

const inviteSchema = z.object({
  contact: z
    .string()
    .trim()
    .min(3, "Enter an email or phone")
    .max(255, "Too long")
    .refine(
      (v) => {
        const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phone = /^\+?[0-9()\-\s]{7,}$/;
        return email.test(v) || phone.test(v);
      },
      { message: "Must be a valid email or phone" },
    ),
  role: z.enum(["Owner", "Manager", "Staff"]),
});

type InviteForm = z.infer<typeof inviteSchema>;

export default function AdminStaff() {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleTargetId, setRoleTargetId] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState<Role>("Staff");

  const roleTarget = useMemo(
    () => staff.find((s) => s.id === roleTargetId) ?? null,
    [staff, roleTargetId],
  );

  const inviteForm = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { contact: "", role: "Staff" },
    mode: "onChange",
  });

  const openChangeRole = (member: StaffMember) => {
    setRoleTargetId(member.id);
    setRoleValue(member.role);
    setRoleDialogOpen(true);
  };

  const deactivate = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Deactivated", description: "Staff member removed (mock)." });
  };

  const resendInvite = (id: string) => {
    const m = staff.find((s) => s.id === id);
    toast({
      title: "Invite sent",
      description: m ? `Resent invite to ${m.contact} (mock).` : "Invite resent (mock).",
    });
  };

  const onSubmitInvite = (values: InviteForm) => {
    const nameGuess = values.contact.includes("@")
      ? values.contact.split("@")[0]
      : "New staff";

    const newMember: StaffMember = {
      id: `u_${Math.random().toString(16).slice(2)}`,
      name: nameGuess
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .slice(0, 24),
      role: values.role,
      status: "Invited",
      contact: values.contact.trim(),
    };

    setStaff((prev) => [newMember, ...prev]);
    toast({ title: "Invited", description: "Invitation created (mock)." });
    setInviteOpen(false);
    inviteForm.reset({ contact: "", role: "Staff" });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite staff, change roles, and review recent activity (UI only).
          </p>
        </div>

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Invite staff</DialogTitle>
            </DialogHeader>

            <form
              className="mt-2 space-y-4"
              onSubmit={inviteForm.handleSubmit(onSubmitInvite)}
            >
              <div className="space-y-2">
                <Label htmlFor="contact">Email or phone</Label>
                <Input
                  id="contact"
                  placeholder="name@restaurant.com or +1 555…"
                  {...inviteForm.register("contact")}
                />
                {inviteForm.formState.errors.contact?.message && (
                  <div className="text-sm text-destructive">
                    {inviteForm.formState.errors.contact.message}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={inviteForm.watch("role")}
                  onValueChange={(v) => inviteForm.setValue("role", v as Role, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
                UI only: this creates a mock “Invited” staff member.
              </div>

              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!inviteForm.formState.isValid}>
                  Invite
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <section className="grid gap-3 lg:grid-cols-3">
        {/* Staff list */}
        <Card className="shadow-soft lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Team</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Desktop table */}
            <div className="hidden md:block">
              <div className="rounded-xl border border-border bg-background">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((s) => (
                      <TableRow key={s.id} className="align-middle">
                        <TableCell>
                          <div className="font-medium">{s.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {s.contact}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleBadgeVariant(s.role)}>
                            {s.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(s.status)}>
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm">
                                <MoreHorizontal className="mr-2 h-4 w-4" />
                                Manage
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-50 bg-popover">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onSelect={() => openChangeRole(s)}>
                                <Shield className="mr-2 h-4 w-4" />
                                Change role
                              </DropdownMenuItem>
                              {s.status === "Invited" && (
                                <DropdownMenuItem onSelect={() => resendInvite(s.id)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Resend invite
                                </DropdownMenuItem>
                              )}
                              {s.role !== "Owner" && (
                                <DropdownMenuItem onSelect={() => deactivate(s.id)} className="text-destructive">
                                  <UserX className="mr-2 h-4 w-4" />
                                  Deactivate staff
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 md:hidden">
              {staff.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {s.contact}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={roleBadgeVariant(s.role)}>{s.role}</Badge>
                      <Badge variant={statusBadgeVariant(s.status)}>{s.status}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" aria-label="Manage">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-50 bg-popover">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => openChangeRole(s)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Change role
                      </DropdownMenuItem>
                      {s.status === "Invited" && (
                        <DropdownMenuItem onSelect={() => resendInvite(s.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Resend invite
                        </DropdownMenuItem>
                      )}
                      {s.role !== "Owner" && (
                        <DropdownMenuItem onSelect={() => deactivate(s.id)} className="text-destructive">
                          <UserX className="mr-2 h-4 w-4" />
                          Deactivate staff
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity panel */}
        <Card className="shadow-soft lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.map((a) => (
              <div key={a.id} className="rounded-xl border border-border bg-background p-3">
                <div className="text-xs text-muted-foreground">{a.time}</div>
                <div className="mt-1 text-sm">{a.text}</div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground">
              UI-only feed—wire to your audit log later.
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Change role dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
          </DialogHeader>
          <div className="mt-2 space-y-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <div className="text-sm font-medium">Staff member</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {roleTarget?.name ?? "—"}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={roleValue} onValueChange={(v) => setRoleValue(v as Role)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
              No permissions logic here—this is a visual mock only.
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!roleTarget) return;
                setStaff((prev) => prev.map((s) => (s.id === roleTarget.id ? { ...s, role: roleValue } : s)));
                toast({ title: "Role updated", description: "Role changed (mock)." });
                setRoleDialogOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
