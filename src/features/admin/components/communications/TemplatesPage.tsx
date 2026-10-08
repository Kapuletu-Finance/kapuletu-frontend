"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useEmailTemplateQuery,
  useEmailTemplatesQuery,
  useRestoreTemplateMutation,
  useSaveTemplateMutation,
  useTemplatePreviewQuery,
} from "@/features/admin/services/communicationsApi";
import { errorMessage } from "@/features/admin/services/financeApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { cn } from "@/lib/utils";
import { dateTime, useDebouncedValue } from "./shared";

type Mode = "preview" | "edit" | "history";

export const TemplatesPage: React.FC = () => {
  const { data: templates, isLoading } = useEmailTemplatesQuery();
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("preview");
  const name = selected ?? templates?.[0]?.id ?? null;

  const { data: detail } = useEmailTemplateQuery(name);
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  const [sample, setSample] = useState("This is how your message reads inside the template.");
  useEffect(() => {
    if (detail) setDraft(detail.content);
  }, [detail]);

  const dirty = !!detail && draft !== detail.content;
  const previewContent = useDebouncedValue(mode === "edit" && dirty ? draft : null, 500);
  const previewMessage = useDebouncedValue(sample, 500);
  const preview = useTemplatePreviewQuery(name, previewContent, previewMessage);
  const save = useSaveTemplateMutation();
  const restore = useRestoreTemplateMutation();

  return (
    <PageLayout
      title="Email templates"
      subtitle="Layouts for system emails (invites, receipts, reminders). Every save is checked in a sandbox, versioned and can be rolled back."
    >
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Templates" className="rounded-xl border border-border bg-card p-2 h-fit">
          {isLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <ul className="space-y-1">
              {templates?.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    aria-current={t.id === name ? "page" : undefined}
                    onClick={() => {
                      setSelected(t.id);
                      setMode("preview");
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm",
                      t.id === name ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
                    )}
                  >
                    {t.name}
                    <span className="block text-xs text-muted-foreground">
                      {t.version ? `Version ${t.version}` : "Original"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>

        <section className="rounded-xl border border-border bg-card overflow-hidden flex flex-col min-h-[640px]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-3">
            <div className="flex gap-1" role="group" aria-label="View">
              {(["preview", "edit", "history"] as Mode[]).map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={mode === m ? "default" : "ghost"}
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                >
                  {{ preview: "Preview", edit: "Edit HTML", history: "History" }[m]}
                </Button>
              ))}
            </div>
            {mode === "edit" && (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  aria-label="Change note"
                  placeholder="What changed? (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-8 w-56"
                  maxLength={255}
                />
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!dirty}
                  onClick={() => detail && setDraft(detail.content)}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  disabled={!dirty || save.isPending || !name}
                  onClick={() =>
                    name &&
                    save.mutate(
                      { name, content: draft, note: note.trim() || undefined },
                      { onSuccess: () => setNote("") },
                    )
                  }
                >
                  {save.isPending ? "Saving…" : "Save new version"}
                </Button>
              </div>
            )}
          </div>

          {mode === "history" ? (
            <ul className="divide-y divide-border">
              {!detail?.versions.length ? (
                <li className="p-6 text-sm text-muted-foreground">
                  Never edited: the original file is in use.
                </li>
              ) : (
                detail.versions.map((v) => (
                  <li key={v.version} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">
                        Version {v.version}
                        {v.version === detail.version && (
                          <span className="text-xs text-primary ml-2">current</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dateTime(v.created_at)} · {v.created_by ?? "unknown"}
                        {v.note && ` · ${v.note}`}
                      </p>
                    </div>
                    {v.version !== detail.version && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={restore.isPending}
                        onClick={() => name && restore.mutate({ name, version: v.version })}
                      >
                        Restore
                      </Button>
                    )}
                  </li>
                ))
              )}
            </ul>
          ) : (
            <div className={cn("flex-1 grid", mode === "edit" && "lg:grid-cols-2")}>
              {mode === "edit" && (
                <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-border">
                  <p className="text-xs text-muted-foreground p-3 border-b border-border">
                    Jinja HTML. Keep variables such as <code>{"{{ message }}"}</code>; code that
                    reaches outside the template is refused on save.
                  </p>
                  <Textarea
                    aria-label="Template HTML"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    spellCheck={false}
                    className="flex-1 min-h-[520px] rounded-none border-0 font-mono text-[13px] resize-none focus-visible:ring-0"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <div className="p-3 border-b border-border space-y-1">
                  <Label htmlFor="tpl-sample" className="text-xs">
                    Sample message
                  </Label>
                  <Input
                    id="tpl-sample"
                    value={sample}
                    onChange={(e) => setSample(e.target.value)}
                  />
                </div>
                {preview.isError ? (
                  <p role="alert" className="p-4 text-sm text-destructive">
                    {errorMessage(preview.error, "This template can't be rendered.")}
                  </p>
                ) : (
                  <iframe
                    title="Template preview"
                    sandbox=""
                    srcDoc={preview.data ?? ""}
                    className="flex-1 w-full min-h-[480px] bg-white"
                  />
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
};
