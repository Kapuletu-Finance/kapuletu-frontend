"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  type BroadcastInput,
  type Channel,
  type TestSendResult,
  useTestSendMutation,
  useWhatsAppTemplatesQuery,
  type WhatsAppTemplate,
} from "@/features/admin/services/communicationsApi";
import { CHANNEL_LABELS } from "./shared";

const templateKey = (t: { name: string; language: string }) => `${t.name}|${t.language}`;

/** Fills {{1}}, {{2}}… in a template body with the composer's values, for the preview. */
const fillBody = (body: string, params: string[]) =>
  body.replace(/\{\{\s*(\d+)\s*\}\}/g, (m, n: string) => params[Number(n) - 1] || m);

export const WhatsAppTemplateFields = ({
  template,
  language,
  params,
  onChange,
}: {
  template: string;
  language: string;
  params: string[];
  onChange: (next: { template: string; language: string; params: string[] }) => void;
}) => {
  const { data, isLoading, isError, refetch, isFetching } = useWhatsAppTemplatesQuery(true);
  const selected = data?.templates.find((t) => t.name === template && t.language === language);

  const pick = (t: WhatsAppTemplate) =>
    onChange({
      template: t.name,
      language: t.language,
      params: Array.from({ length: t.variables }, (_, i) => params[i] ?? ""),
    });

  const setParam = (i: number, value: string) =>
    onChange({ template, language, params: params.map((p, j) => (j === i ? value : p)) });

  const catalogue = data?.configured;

  return (
    <div className="space-y-3 border-t border-border pt-4">
      <h3 className="text-sm font-semibold">WhatsApp template</h3>
      {isError ? (
        <p role="alert" className="text-sm text-destructive">
          Couldn't load templates from Meta.{" "}
          <button type="button" className="underline" onClick={() => refetch()}>
            Try again
          </button>
        </p>
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading approved templates…</p>
      ) : catalogue ? (
        <>
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-2">
              <Label>Approved template</Label>
              <Select
                value={selected ? templateKey(selected) : ""}
                onValueChange={(v) => {
                  const t = data.templates.find((x) => templateKey(x) === v);
                  if (t) pick(t);
                }}
              >
                <SelectTrigger aria-label="Approved template">
                  <SelectValue>
                    {() =>
                      selected ? `${selected.name} · ${selected.language}` : "Choose a template"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {data.templates.map((t) => (
                    <SelectItem key={templateKey(t)} value={templateKey(t)} disabled={!t.sendable}>
                      {t.name} · {t.language}
                      {t.sendable
                        ? ` · ${t.category}`
                        : ` (can't broadcast: ${t.unsupported_reason})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={isFetching}
              onClick={() => refetch()}
              title="Reload from Meta"
            >
              {isFetching ? "Loading…" : "Reload"}
            </Button>
          </div>
          {!data.templates.length && (
            <p className="text-xs text-muted-foreground">
              No approved templates yet. Create one in Meta Business Manager and wait for approval.
            </p>
          )}
          {selected && (
            <>
              {selected.category === "marketing" && (
                <p className="text-xs text-muted-foreground">
                  Marketing templates are charged per message by Meta.
                </p>
              )}
              {params.map((p, i) => (
                <div key={i} className="space-y-2">
                  <Label htmlFor={`bc-wa-${i}`}>{`Variable {{${i + 1}}}`}</Label>
                  <Input
                    id={`bc-wa-${i}`}
                    value={p}
                    onChange={(e) => setParam(i, e.target.value)}
                    placeholder="e.g. {{first_name}}"
                  />
                </div>
              ))}
              <div className="rounded-lg bg-[#e7fcd7] dark:bg-emerald-950/50 p-3 text-sm whitespace-pre-wrap max-w-sm">
                {fillBody(selected.body, params) || "(empty body)"}
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Type the exact name of a template approved in Meta Business Manager. Set META_WABA_ID on
            the server to pick from the approved list instead.
          </p>
          <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2">
              <Label htmlFor="bc-wa-template">Template name</Label>
              <Input
                id="bc-wa-template"
                value={template}
                onChange={(e) => onChange({ template: e.target.value.trim(), language, params })}
                placeholder="october_update"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bc-wa-lang">Language</Label>
              <Input
                id="bc-wa-lang"
                value={language}
                onChange={(e) => onChange({ template, language: e.target.value.trim(), params })}
                placeholder="en"
              />
            </div>
          </div>
          {params.map((p, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`bc-wa-${i}`}>{`Variable {{${i + 1}}}`}</Label>
                <Input
                  id={`bc-wa-${i}`}
                  value={p}
                  onChange={(e) => setParam(i, e.target.value)}
                  placeholder="e.g. {{first_name}}"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onChange({ template, language, params: params.filter((_, j) => j !== i) })
                }
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ template, language, params: [...params, ""] })}
          >
            Add variable
          </Button>
        </>
      )}
    </div>
  );
};

/** Problems with the WhatsApp fields that the catalogue can tell us about before submitting. */
export const useWhatsAppProblems = (
  enabled: boolean,
  template: string,
  language: string,
  params: string[],
): string[] => {
  const { data } = useWhatsAppTemplatesQuery(enabled);
  if (!enabled) return [];
  if (!data?.configured) {
    return /^[a-z0-9_]+$/.test(template)
      ? []
      : ["WhatsApp needs an approved template name (lower-case letters, digits and _)."];
  }
  const t = data.templates.find((x) => x.name === template && x.language === language);
  if (!t) return ["Choose an approved WhatsApp template."];
  if (params.some((p) => !p.trim())) return ["Fill in every WhatsApp template variable."];
  return [];
};

export const TestSendDialog = ({
  open,
  onClose,
  input,
  broadcastId,
  me,
}: {
  open: boolean;
  onClose: () => void;
  input: Pick<BroadcastInput, "category" | "channels" | "content">;
  broadcastId?: string | null;
  me?: { email?: string; phone_number?: string };
}) => {
  const send = useTestSendMutation();
  const [chosen, setChosen] = useState<Channel[]>(input.channels);
  const [result, setResult] = useState<TestSendResult | null>(null);
  const destination: Record<Channel, string> = {
    email: me?.email ?? "your email",
    whatsapp: me?.phone_number ?? "your WhatsApp number",
    in_app: "your notifications",
  };

  const close = () => {
    setResult(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send a test to yourself</DialogTitle>
          <DialogDescription>
            Personalised with your name, marked [Test], and sent right away. Nobody else receives
            it.
          </DialogDescription>
        </DialogHeader>
        {result ? (
          <ul className="space-y-2 text-sm">
            {(Object.keys(result.results) as Channel[]).map((c) => {
              const r = result.results[c];
              if (!r) return null;
              return (
                <li key={c}>
                  <span className="font-medium">{CHANNEL_LABELS[c]}: </span>
                  {r.ok ? (
                    <span>sent to {r.destination}</span>
                  ) : (
                    <span className="text-destructive">failed: {r.error}</span>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium mb-1">Channels</legend>
            {input.channels.map((c) => (
              <Label key={c} className="flex items-center gap-2 font-normal">
                <Checkbox
                  checked={chosen.includes(c)}
                  onCheckedChange={(on) =>
                    setChosen(on ? [...chosen, c] : chosen.filter((x) => x !== c))
                  }
                />
                {CHANNEL_LABELS[c]}
                <span className="text-muted-foreground">to {destination[c]}</span>
              </Label>
            ))}
          </fieldset>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            Close
          </Button>
          {!result && (
            <Button
              disabled={!chosen.length || send.isPending}
              onClick={() =>
                send.mutate(
                  {
                    ...input,
                    channels: input.channels.filter((c) => chosen.includes(c)),
                    broadcast_id: broadcastId ?? undefined,
                  },
                  { onSuccess: setResult },
                )
              }
            >
              {send.isPending ? "Sending…" : "Send test"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
