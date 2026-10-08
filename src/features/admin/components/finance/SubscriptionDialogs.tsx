"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type FinanceSubscription,
  useGrantPlanMutation,
  useSubscriptionActionMutation,
} from "@/features/admin/services/financeApi";
import { useAdminFinancePlansQuery, useAdminUsersQuery } from "@/features/admin/services/queries";
import { shortDate, useDebouncedValue } from "./shared";

export type SubscriptionActionKind = "extend" | "change_plan" | "cancel";

const ACTION_COPY: Record<
  SubscriptionActionKind,
  { title: string; button: string; destructive?: boolean }
> = {
  extend: { title: "Extend subscription", button: "Extend" },
  change_plan: { title: "Change plan", button: "Change plan" },
  cancel: { title: "Cancel subscription", button: "Cancel subscription", destructive: true },
};

/** Extend, change plan or cancel one subscription. Every action needs a reason; it lands in the audit log. */
export const SubscriptionActionDialog: React.FC<{
  subscription: Pick<
    FinanceSubscription,
    "subscription_id" | "user_name" | "plan_id" | "plan_name" | "end_date"
  > | null;
  action: SubscriptionActionKind | null;
  onClose: () => void;
}> = ({ subscription, action, onClose }) => {
  const mutation = useSubscriptionActionMutation();
  const { data: plans } = useAdminFinancePlansQuery();
  const [days, setDays] = useState("7");
  const [planId, setPlanId] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (action) {
      setDays("7");
      setPlanId("");
      setReason("");
    }
  }, [action]);

  if (!subscription || !action) return null;
  const copy = ACTION_COPY[action];
  const reasonOk = reason.trim().length >= 3;
  const valid =
    reasonOk &&
    (action !== "extend" || Number(days) >= 1) &&
    (action !== "change_plan" || (!!planId && planId !== subscription.plan_id));

  const submit = () => {
    const base = { subscriptionId: subscription.subscription_id, reason: reason.trim() };
    const body =
      action === "extend"
        ? { ...base, action, days: Number(days) }
        : action === "change_plan"
          ? { ...base, action, plan_id: planId }
          : { ...base, action };
    mutation.mutate(body, { onSuccess: onClose });
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>
            {subscription.user_name} · {subscription.plan_name ?? "No plan"} · ends{" "}
            {shortDate(subscription.end_date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {action === "extend" && (
            <div className="space-y-2">
              <Label htmlFor="extend-days">Days to add</Label>
              <Input
                id="extend-days"
                type="number"
                min={1}
                max={3650}
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Free time on the current plan; no invoice is created.
              </p>
            </div>
          )}
          {action === "change_plan" && (
            <div className="space-y-2">
              <Label>New plan</Label>
              <Select value={planId} onValueChange={(v) => v && setPlanId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans
                    ?.filter((p) => p.plan_id !== subscription.plan_id && !p.archived_at)
                    .map((p) => (
                      <SelectItem key={p.plan_id} value={p.plan_id}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Keeps the current end date; nothing is charged or refunded.
              </p>
            </div>
          )}
          {action === "cancel" && (
            <p className="text-sm text-muted-foreground">
              Moves the user to the free tier now. Paid time left is lost; request a refund
              separately if one is owed.
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="action-reason">Reason</Label>
            <Textarea
              id="action-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Recorded in the audit log"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant={copy.destructive ? "destructive" : "default"}
            onClick={submit}
            disabled={!valid || mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : copy.button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/** Give a user a plan without payment, finding them by name, email or phone. */
export const GrantPlanDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  presetUser?: { user_id: string; name: string };
}> = ({ open, onClose, presetUser }) => {
  const mutation = useGrantPlanMutation();
  const { data: plans } = useAdminFinancePlansQuery();
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);
  const { data: users, isFetching } = useAdminUsersQuery({ q, limit: 8 });
  const [user, setUser] = useState<{ user_id: string; name: string } | null>(presetUser ?? null);
  const [planId, setPlanId] = useState("");
  const [duration, setDuration] = useState("30");
  const [isTrial, setIsTrial] = useState(false);
  const [reason, setReason] = useState("");

  // Reset when the dialog opens (keyed on the user id: callers pass a fresh object each render).
  const presetId = presetUser?.user_id;
  const presetName = presetUser?.name;
  useEffect(() => {
    if (open) {
      setSearch("");
      setUser(presetId && presetName ? { user_id: presetId, name: presetName } : null);
      setPlanId("");
      setDuration("30");
      setIsTrial(false);
      setReason("");
    }
  }, [open, presetId, presetName]);

  const valid = !!user && !!planId && Number(duration) >= 1 && reason.trim().length >= 3;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant a plan</DialogTitle>
          <DialogDescription>
            Gives access without payment (VIPs, support fixes, sales trials). It shows as a free
            grant, not revenue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grant-user">Treasurer</Label>
            {user ? (
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <span>{user.name}</span>
                {!presetUser && (
                  <Button variant="link" size="sm" onClick={() => setUser(null)}>
                    Change
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Input
                  id="grant-user"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email or phone"
                  autoComplete="off"
                />
                {q && (
                  <ul className="max-h-48 overflow-y-auto rounded-md border border-border divide-y divide-border">
                    {users?.users.map((u) => (
                      <li key={u.user_id}>
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                          onClick={() => setUser({ user_id: u.user_id, name: u.full_name })}
                        >
                          <span className="font-medium">{u.full_name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {u.email} · {u.plan_name || "No plan"}
                          </span>
                        </button>
                      </li>
                    ))}
                    {!isFetching && users?.users.length === 0 && (
                      <li className="px-3 py-2 text-sm text-muted-foreground">
                        No treasurers match.
                      </li>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={planId} onValueChange={(v) => v && setPlanId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans
                    ?.filter((p) => !p.archived_at && p.monthly_price > 0)
                    .map((p) => (
                      <SelectItem key={p.plan_id} value={p.plan_id}>
                        {p.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grant-days">Days</Label>
              <Input
                id="grant-days"
                type="number"
                min={1}
                max={3650}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <div>
              <Label htmlFor="grant-trial">Mark as a trial</Label>
              <p className="text-xs text-muted-foreground">
                Counts toward trial conversion instead of free grants.
              </p>
            </div>
            <Switch id="grant-trial" checked={isTrial} onCheckedChange={setIsTrial} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-reason">Reason</Label>
            <Textarea
              id="grant-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Recorded in the audit log"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() =>
              user &&
              mutation.mutate(
                {
                  user_id: user.user_id,
                  plan_id: planId,
                  duration: Number(duration),
                  is_trial: isTrial,
                  reason: reason.trim(),
                },
                { onSuccess: onClose },
              )
            }
            disabled={!valid || mutation.isPending}
          >
            {mutation.isPending ? "Granting…" : "Grant plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
