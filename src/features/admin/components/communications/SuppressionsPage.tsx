"use client";

import type React from "react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type Suppression,
  useAddSuppressionMutation,
  useRemoveSuppressionMutation,
  useSuppressionsQuery,
} from "@/features/admin/services/communicationsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { dateTime, EmptyRow, FilterSelect, Pagination, useDebouncedValue } from "./shared";

const LIMIT = 50;

const REASONS: Record<Suppression["reason"], string> = {
  unsubscribed: "Unsubscribed",
  hard_bounce: "Bounced",
  complaint: "Spam complaint",
  manual: "Blocked by staff",
};

const AddDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const mutation = useAddSuppressionMutation();
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [category, setCategory] = useState<"all" | "marketing">("all");
  const [destination, setDestination] = useState("");
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block a destination</DialogTitle>
          <DialogDescription>
            Use this when someone asks to stop receiving messages outside the unsubscribe link, or
            for an address that should never be contacted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup
            value={channel}
            onValueChange={(v) => setChannel(v as "email" | "whatsapp")}
            className="flex gap-6"
            aria-label="Channel"
          >
            <Label className="flex items-center gap-2 font-normal">
              <RadioGroupItem value="email" /> Email
            </Label>
            <Label className="flex items-center gap-2 font-normal">
              <RadioGroupItem value="whatsapp" /> WhatsApp
            </Label>
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="sup-dest">
              {channel === "email" ? "Email address" : "Phone number"}
            </Label>
            <Input
              id="sup-dest"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={channel === "email" ? "name@example.com" : "+254 7…"}
            />
          </div>
          <RadioGroup
            value={category}
            onValueChange={(v) => setCategory(v as "all" | "marketing")}
            className="space-y-2"
            aria-label="What to block"
          >
            <Label className="flex items-center gap-2 font-normal">
              <RadioGroupItem value="all" /> Everything except security messages (OTPs)
            </Label>
            <Label className="flex items-center gap-2 font-normal">
              <RadioGroupItem value="marketing" /> Marketing only
            </Label>
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="sup-note">Note (optional)</Label>
            <Input
              id="sup-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!destination.trim() || mutation.isPending}
            onClick={() =>
              mutation.mutate(
                { channel, destination, category, note: note.trim() || undefined },
                {
                  onSuccess: () => {
                    setDestination("");
                    setNote("");
                    onClose();
                  },
                },
              )
            }
          >
            {mutation.isPending ? "Saving…" : "Block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const SuppressionsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [channel, setChannel] = useState("");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const q = useDebouncedValue(search);
  const { data, isLoading } = useSuppressionsQuery({ page, limit: LIMIT, channel, q });
  const remove = useRemoveSuppressionMutation();

  return (
    <PageLayout
      title="Suppressions"
      subtitle="Addresses and numbers we must not message. Unsubscribes and spam complaints can only be reversed by the person opting back in."
      actionButton={<Button onClick={() => setAdding(true)}>Block a destination</Button>}
      controls={
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search address or number"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="sm:max-w-xs"
            aria-label="Search suppressions"
          />
          <FilterSelect
            value={channel}
            onChange={(v) => {
              setChannel(v);
              setPage(1);
            }}
            options={[
              { value: "email", label: "Email" },
              { value: "whatsapp", label: "WhatsApp" },
            ]}
            allLabel="All channels"
            label="Channel"
          />
        </div>
      }
      pagination={
        data && <Pagination page={page} limit={LIMIT} total={data.total} onPage={setPage} />
      }
    >
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Destination</TableHead>
              <TableHead>Blocks</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Since</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <EmptyRow colSpan={5}>Loading…</EmptyRow>
            ) : !data?.items.length ? (
              <EmptyRow colSpan={5}>Nothing is suppressed.</EmptyRow>
            ) : (
              data.items.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="font-medium">{s.destination}</div>
                    <div className="text-xs text-muted-foreground">
                      {s.channel === "email" ? "Email" : "WhatsApp"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {s.category === "all" ? "All messages" : "Marketing"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {REASONS[s.reason]}
                    {s.note && <div className="text-xs text-muted-foreground">{s.note}</div>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dateTime(s.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {(s.reason === "manual" || s.reason === "hard_bounce") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={remove.isPending}
                        onClick={() => remove.mutate(s.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AddDialog open={adding} onClose={() => setAdding(false)} />
    </PageLayout>
  );
};
