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
import { Textarea } from "@/components/ui/textarea";
import {
  REFUND_REASONS,
  type RefundReasonCode,
  useRequestRefundMutation,
} from "@/features/admin/services/financeApi";
import { money } from "./shared";

/** Opens a refund request; a different finance user approves it before anything is recorded. */
export const RefundRequestDialog: React.FC<{
  payment: { payment_id: string; amount: number; user_name: string | null } | null;
  onClose: () => void;
}> = ({ payment, onClose }) => {
  const mutation = useRequestRefundMutation();
  const [amount, setAmount] = useState("");
  const [reasonCode, setReasonCode] = useState<RefundReasonCode>("other");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (payment) {
      setAmount(String(payment.amount));
      setReasonCode("other");
      setReason("");
    }
  }, [payment]);

  if (!payment) return null;
  const value = Number(amount);
  const amountOk = value > 0 && value <= payment.amount;
  const valid = amountOk && reason.trim().length >= 3;
  const partial = amountOk && value < payment.amount;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a refund</DialogTitle>
          <DialogDescription>
            {payment.user_name} paid {money(payment.amount)}. A different finance user must approve
            this before it is recorded. Pay the money back through M-Pesa or the card provider
            yourself.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refund-amount">Amount (KES)</Label>
              <Input
                id="refund-amount"
                type="number"
                min={1}
                max={payment.amount}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={!amountOk}
              />
              <p className="text-xs text-muted-foreground">
                {amountOk
                  ? partial
                    ? "Partial refund"
                    : "Full refund"
                  : `Between 1 and ${money(payment.amount)}`}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Reason type</Label>
              <Select
                value={reasonCode}
                onValueChange={(v) => v && setReasonCode(v as RefundReasonCode)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFUND_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Details</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Charged twice for September"
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
              mutation.mutate(
                {
                  payment_id: payment.payment_id,
                  amount: value,
                  reason_code: reasonCode,
                  reason: reason.trim(),
                },
                { onSuccess: onClose },
              )
            }
            disabled={!valid || mutation.isPending}
          >
            {mutation.isPending ? "Requesting…" : "Request refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
