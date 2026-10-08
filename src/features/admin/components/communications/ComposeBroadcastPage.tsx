"use client";

import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type Audience,
  type BroadcastInput,
  type Category,
  type Channel,
  type DraftInput,
  type RecipientSearchResult,
  type SubscriptionState,
  useBroadcastActionMutation,
  useBroadcastEstimateQuery,
  useBroadcastQuery,
  useCreateBroadcastMutation,
  useRecipientSearchQuery,
  useSaveDraftMutation,
} from "@/features/admin/services/communicationsApi";
import { PageLayout } from "@/features/shared/components/PageLayout";
import { RichTextEditor } from "@/features/shared/components/RichTextEditor";
import { TestSendDialog, useWhatsAppProblems, WhatsAppTemplateFields } from "./ComposerParts";
import { audienceLabel, CHANNEL_LABELS, useDebouncedValue, useHasCommsAccess } from "./shared";

type AudienceType = "all_users" | "customers" | "subscription" | "staff" | "selected_users";

const AUDIENCES: { value: AudienceType; label: string; hint: string }[] = [
  { value: "customers", label: "All customers", hint: "Every active treasurer account" },
  {
    value: "subscription",
    label: "Customers by subscription",
    hint: "Target paying, trial, lapsed or free-tier customers",
  },
  { value: "all_users", label: "Everyone", hint: "Customers and staff" },
  { value: "staff", label: "Staff", hint: "Internal employees only" },
  { value: "selected_users", label: "Selected people", hint: "Pick individual accounts" },
];

const SUBSCRIPTION_STATES: { value: SubscriptionState; label: string }[] = [
  { value: "paid", label: "Paying" },
  { value: "trial", label: "On trial" },
  { value: "lapsed", label: "Lapsed (grace period)" },
  { value: "comp", label: "Free grant" },
  { value: "free", label: "Free tier" },
];

const PLACEHOLDERS = ["first_name", "last_name", "full_name", "email"];

const textOf = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const fillSample = (text: string) =>
  text.replace(
    /\{\{\s*(\w+)\s*\}\}/g,
    (_m, key: string) =>
      ({
        first_name: "Jane",
        last_name: "Wanjiru",
        full_name: "Jane Wanjiru",
        email: "jane@example.com",
      })[key] ?? `{{${key}}}`,
  );

/** ISO time to the value a datetime-local input expects, in the browser's time zone. */
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const Section = ({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-base">
        <span className="text-muted-foreground mr-2">{step}.</span>
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">{children}</CardContent>
  </Card>
);

const PeoplePicker = ({
  selected,
  onChange,
}: {
  selected: RecipientSearchResult[];
  onChange: (people: RecipientSearchResult[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search, 250);
  const { data, isFetching } = useRecipientSearchQuery(q);
  const chosen = new Set(selected.map((p) => p.user_id));

  return (
    <div className="space-y-2">
      <Label htmlFor="people-search">Find people</Label>
      <Input
        id="people-search"
        placeholder="Name, email or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {q.length >= 2 && (
        <ul className="max-h-56 overflow-y-auto rounded-md border border-border divide-y divide-border">
          {isFetching && !data ? (
            <li className="p-3 text-sm text-muted-foreground">Searching…</li>
          ) : !data?.length ? (
            <li className="p-3 text-sm text-muted-foreground">No one matches.</li>
          ) : (
            data.map((p) => (
              <li key={p.user_id}>
                <button
                  type="button"
                  disabled={chosen.has(p.user_id)}
                  onClick={() => onChange([...selected, p])}
                  className="w-full text-left p-3 hover:bg-muted/50 disabled:opacity-50 disabled:cursor-default"
                >
                  <span className="font-medium">{p.name}</span>
                  <span className="text-sm text-muted-foreground"> · {p.email}</span>
                  {!p.marketing_consent && (
                    <span className="block text-xs text-muted-foreground">
                      No marketing consent
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected people">
          {selected.map((p) => (
            <li key={p.user_id}>
              <Badge variant="secondary" className="gap-1 pr-1">
                {p.name}
                <button
                  type="button"
                  aria-label={`Remove ${p.name}`}
                  onClick={() => onChange(selected.filter((s) => s.user_id !== p.user_id))}
                  className="rounded-sm hover:bg-muted p-0.5"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ComposeBroadcastPage: React.FC<{ draftId?: string | null }> = ({
  draftId: initialDraftId = null,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { me } = useHasCommsAccess();
  const create = useCreateBroadcastMutation();
  const saveDraft = useSaveDraftMutation();
  const action = useBroadcastActionMutation();
  const [draftId, setDraftId] = useState<string | null>(initialDraftId);
  // Only a draft opened from the URL is loaded; one created here already has its state in the form
  const [loadId] = useState(initialDraftId);
  const { data: draft, isLoading: loadingDraft } = useBroadcastQuery(loadId);
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("service");
  const [audienceType, setAudienceType] = useState<AudienceType>("customers");
  const [states, setStates] = useState<SubscriptionState[]>(["paid"]);
  const [people, setPeople] = useState<RecipientSearchResult[]>([]);
  const [channels, setChannels] = useState<Channel[]>(["email", "in_app"]);

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [html, setHtml] = useState("");
  const [sameInApp, setSameInApp] = useState(true);
  const [inAppTitle, setInAppTitle] = useState("");
  const [inAppBody, setInAppBody] = useState("");
  const [waTemplate, setWaTemplate] = useState("");
  const [waLanguage, setWaLanguage] = useState("en");
  const [waParams, setWaParams] = useState<string[]>([]);

  const [scheduled, setScheduled] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [confirming, setConfirming] = useState(false);

  // Reopening a draft: fill the form once from what was saved
  const hydrated = useRef(false);
  useEffect(() => {
    if (!draft || hydrated.current) return;
    hydrated.current = true;
    const a = draft.audience;
    setTitle(draft.title);
    setCategory(draft.category);
    if (a.type === "subscription") setStates(a.states);
    if (a.type === "selected_users") setPeople(draft.audience_people ?? []);
    setAudienceType(a.type === "legacy" ? "customers" : a.type);
    setChannels(draft.channels);
    const c = draft.content ?? {};
    setSubject(c.email?.subject ?? "");
    setPreheader(c.email?.preheader ?? "");
    setHtml(c.email?.html ?? "");
    setSameInApp(!c.in_app);
    setInAppTitle(c.in_app?.title ?? "");
    setInAppBody(c.in_app?.body ?? "");
    setWaTemplate(c.whatsapp?.template ?? "");
    setWaLanguage(c.whatsapp?.language ?? "en");
    setWaParams(c.whatsapp?.params ?? []);
    setScheduled(!!draft.scheduled_for);
    setScheduledFor(draft.scheduled_for ? toLocalInput(`${draft.scheduled_for}Z`) : "");
  }, [draft]);

  const audience: Audience | null = useMemo(() => {
    if (audienceType === "subscription")
      return states.length ? { type: "subscription", states } : null;
    if (audienceType === "selected_users")
      return people.length
        ? { type: "selected_users", user_ids: people.map((p) => p.user_id) }
        : null;
    return { type: audienceType };
  }, [audienceType, states, people]);

  const target = useDebouncedValue(
    audience && channels.length ? { category, audience, channels } : null,
    400,
  );
  const { data: reach, isFetching: estimating } = useBroadcastEstimateQuery(target);

  const has = (c: Channel) => channels.includes(c);
  const toggleChannel = (c: Channel, on: boolean) =>
    setChannels(on ? [...channels, c] : channels.filter((x) => x !== c));
  const usesEmailForInApp = has("in_app") && has("email") && sameInApp;

  const contentProblems: string[] = [];
  if (has("email") && (!subject.trim() || !textOf(html)))
    contentProblems.push("Email needs a subject and a body.");
  if (has("in_app") && !usesEmailForInApp && (!inAppTitle.trim() || !inAppBody.trim()))
    contentProblems.push("In-app notification needs a title and a message.");
  contentProblems.push(...useWhatsAppProblems(has("whatsapp"), waTemplate, waLanguage, waParams));

  const problems: string[] = [];
  if (title.trim().length < 3) problems.push("Give the broadcast a name (at least 3 characters).");
  if (!audience) problems.push("Choose who should receive it.");
  if (!channels.length) problems.push("Pick at least one channel.");
  problems.push(...contentProblems);
  if (scheduled && (!scheduledFor || new Date(scheduledFor) < new Date()))
    problems.push("Pick a time in the future, or send now.");
  if (reach && reach.reachable_people === 0)
    problems.push("Nobody in this audience can be reached.");

  const payload = (): BroadcastInput => ({
    title: title.trim(),
    category,
    audience: audience as Audience,
    channels,
    content: {
      ...(has("email") && {
        email: { subject: subject.trim(), html, preheader: preheader.trim() || undefined },
      }),
      ...(has("in_app") &&
        !usesEmailForInApp && { in_app: { title: inAppTitle.trim(), body: inAppBody.trim() } }),
      ...(has("whatsapp") && {
        whatsapp: { template: waTemplate, language: waLanguage, params: waParams },
      }),
    },
    scheduled_for: scheduled ? new Date(scheduledFor).toISOString() : null,
  });

  const draftPayload = (): DraftInput => ({
    ...payload(),
    title: title.trim() || "Untitled broadcast",
    audience,
    scheduled_for: scheduled && scheduledFor ? new Date(scheduledFor).toISOString() : null,
  });
  const snapshot = JSON.stringify(draftPayload());
  const unsaved = savedSnapshot === null ? !draftId : snapshot !== savedSnapshot;

  // Mark the hydrated draft as saved so "unsaved changes" only reflects edits made here
  useEffect(() => {
    if (draft && hydrated.current && savedSnapshot === null) setSavedSnapshot(snapshot);
  }, [draft, snapshot, savedSnapshot]);

  const persistDraft = (onSaved?: (id: string) => void) =>
    saveDraft.mutate(
      { id: draftId, draft: draftPayload() },
      {
        onSuccess: (b) => {
          setSavedSnapshot(snapshot);
          if (!draftId) {
            setDraftId(b.id);
            router.replace(`${pathname}?draft=${b.id}`, { scroll: false });
          }
          onSaved ? onSaved(b.id) : toast.success("Draft saved.");
        },
      },
    );

  const sendOrSubmit = () => {
    const done = (id: string) => router.push(`/admin/communications/broadcasts?open=${id}`);
    if (!draftId) {
      create.mutate(payload(), {
        onSuccess: (b) => done(b.id),
        onSettled: () => setConfirming(false),
      });
      return;
    }
    // A draft: save the latest edits, then submit it
    persistDraft((id) =>
      action.mutate(
        { id, action: "submit" },
        { onSuccess: () => done(id), onSettled: () => setConfirming(false) },
      ),
    );
  };
  const busy = create.isPending || saveDraft.isPending || action.isPending;

  if (loadId && loadingDraft) {
    return <p className="text-sm text-muted-foreground p-6">Loading draft…</p>;
  }
  if (loadId && draft && draft.status !== "draft") {
    return (
      <PageLayout title="This broadcast isn't a draft">
        <p className="text-sm text-muted-foreground">
          It has already been submitted. Return it to draft from the broadcast's details to edit it.
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={draftId ? "Edit draft" : "New broadcast"}
      subtitle="Announce something to customers or staff, or run a marketing campaign to people who opted in."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        <div className="space-y-6">
          <Section step={1} title="What kind of message is this?">
            <div className="space-y-2">
              <Label htmlFor="bc-title">Name (internal)</Label>
              <Input
                id="bc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. October product update"
                maxLength={255}
              />
            </div>
            <RadioGroup
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
              className="grid gap-3 sm:grid-cols-2"
              aria-label="Category"
            >
              {(
                [
                  [
                    "service",
                    "Service",
                    "Account, billing and product notices everyone should get. No promotions.",
                  ],
                  [
                    "marketing",
                    "Marketing",
                    "Offers and promotions. Email and WhatsApp only go to people who opted in, with an unsubscribe link.",
                  ],
                ] as const
              ).map(([value, label, hint]) => (
                <Label
                  key={value}
                  htmlFor={`cat-${value}`}
                  className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer has-[[data-checked]]:border-primary font-normal"
                >
                  <RadioGroupItem id={`cat-${value}`} value={value} className="mt-0.5" />
                  <span>
                    <span className="font-medium block">{label}</span>
                    <span className="text-xs text-muted-foreground">{hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </Section>

          <Section step={2} title="Who should receive it?">
            <RadioGroup
              value={audienceType}
              onValueChange={(v) => setAudienceType(v as AudienceType)}
              className="grid gap-2 sm:grid-cols-2"
              aria-label="Audience"
            >
              {AUDIENCES.map((a) => (
                <Label
                  key={a.value}
                  htmlFor={`aud-${a.value}`}
                  className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer has-[[data-checked]]:border-primary font-normal"
                >
                  <RadioGroupItem id={`aud-${a.value}`} value={a.value} className="mt-0.5" />
                  <span>
                    <span className="font-medium block">{a.label}</span>
                    <span className="text-xs text-muted-foreground">{a.hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
            {audienceType === "subscription" && (
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium mb-2">Subscription status</legend>
                <div className="flex flex-wrap gap-4">
                  {SUBSCRIPTION_STATES.map((s) => (
                    <Label key={s.value} className="flex items-center gap-2 font-normal">
                      <Checkbox
                        checked={states.includes(s.value)}
                        onCheckedChange={(on) =>
                          setStates(on ? [...states, s.value] : states.filter((x) => x !== s.value))
                        }
                      />
                      {s.label}
                    </Label>
                  ))}
                </div>
              </fieldset>
            )}
            {audienceType === "selected_users" && (
              <PeoplePicker selected={people} onChange={setPeople} />
            )}
          </Section>

          <Section
            step={3}
            title="Channels"
            description="WhatsApp can only send templates approved in Meta Business Manager."
          >
            <div className="flex flex-wrap gap-6">
              {(Object.keys(CHANNEL_LABELS) as Channel[]).map((c) => (
                <Label key={c} className="flex items-center gap-2 font-normal">
                  <Checkbox checked={has(c)} onCheckedChange={(on) => toggleChannel(c, !!on)} />
                  {CHANNEL_LABELS[c]}
                </Label>
              ))}
            </div>
          </Section>

          {channels.length > 0 && (
            <Section
              step={4}
              title="Message"
              description={`Personalise with ${PLACEHOLDERS.map((p) => `{{${p}}}`).join(", ")}.`}
            >
              {has("email") && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Email</h3>
                  <div className="space-y-2">
                    <Label htmlFor="bc-subject">Subject</Label>
                    <Input
                      id="bc-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      maxLength={200}
                      placeholder="e.g. {{first_name}}, your October update"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bc-preheader">Preview text (optional)</Label>
                    <Input
                      id="bc-preheader"
                      value={preheader}
                      onChange={(e) => setPreheader(e.target.value)}
                      maxLength={200}
                      placeholder="Shown next to the subject in the inbox"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body</Label>
                    <RichTextEditor content={html} onChange={setHtml} />
                  </div>
                </div>
              )}

              {has("in_app") && (
                <div className="space-y-3 border-t border-border pt-4">
                  <h3 className="text-sm font-semibold">In-app notification</h3>
                  {has("email") && (
                    <Label className="flex items-center gap-2 font-normal">
                      <Switch checked={sameInApp} onCheckedChange={setSameInApp} />
                      Use the email subject and text
                    </Label>
                  )}
                  {!usesEmailForInApp && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="bc-inapp-title">Title</Label>
                        <Input
                          id="bc-inapp-title"
                          value={inAppTitle}
                          onChange={(e) => setInAppTitle(e.target.value)}
                          maxLength={120}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bc-inapp-body">Message</Label>
                        <Textarea
                          id="bc-inapp-body"
                          value={inAppBody}
                          onChange={(e) => setInAppBody(e.target.value)}
                          maxLength={2000}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {has("whatsapp") && (
                <WhatsAppTemplateFields
                  template={waTemplate}
                  language={waLanguage}
                  params={waParams}
                  onChange={(next) => {
                    setWaTemplate(next.template);
                    setWaLanguage(next.language);
                    setWaParams(next.params);
                  }}
                />
              )}
            </Section>
          )}

          <Section step={5} title="When">
            <RadioGroup
              value={scheduled ? "later" : "now"}
              onValueChange={(v) => setScheduled(v === "later")}
              className="flex gap-6"
              aria-label="When to send"
            >
              <Label className="flex items-center gap-2 font-normal">
                <RadioGroupItem value="now" /> Send now
              </Label>
              <Label className="flex items-center gap-2 font-normal">
                <RadioGroupItem value="later" /> Schedule
              </Label>
            </RadioGroup>
            {scheduled && (
              <div className="space-y-2 max-w-xs">
                <Label htmlFor="bc-when">Send at (your local time)</Label>
                <Input
                  id="bc-when"
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                />
              </div>
            )}
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reach</CardTitle>
              <CardDescription>
                {audience ? audienceLabel(audience) : "Choose an audience"}
                {estimating && " · updating…"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reach ? (
                <>
                  <p className="text-3xl font-semibold tabular-nums">
                    {reach.reachable_people.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground"> people</span>
                  </p>
                  <dl className="space-y-2 text-sm">
                    {(Object.keys(reach.channels) as Channel[]).map((c) => {
                      const r = reach.channels[c];
                      if (!r) return null;
                      const skipped = r.no_consent + r.suppressed + r.no_destination;
                      return (
                        <div key={c}>
                          <dt className="flex justify-between">
                            <span>{CHANNEL_LABELS[c]}</span>
                            <span className="tabular-nums font-medium">
                              {r.deliverable.toLocaleString()}
                            </span>
                          </dt>
                          {skipped > 0 && (
                            <dd className="text-xs text-muted-foreground">
                              {[
                                r.no_consent && `${r.no_consent} no consent`,
                                r.suppressed && `${r.suppressed} suppressed`,
                                r.no_destination && `${r.no_destination} no address`,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </dd>
                          )}
                        </div>
                      );
                    })}
                  </dl>
                  {reach.needs_approval && (
                    <p className="text-xs rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 p-2">
                      Marketing to more than {reach.approval_threshold.toLocaleString()} people
                      needs a second person to approve before it is sent.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Pick an audience and a channel to see who this reaches.
                </p>
              )}
            </CardContent>
          </Card>

          {has("email") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Email preview</CardTitle>
                <CardDescription className="truncate">
                  {fillSample(subject) || "No subject yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <iframe
                  title="Email preview"
                  sandbox=""
                  srcDoc={`<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;color:#333">${fillSample(html) || "<p style='color:#999'>Start writing to see a preview.</p>"}</div>`}
                  className="w-full h-64 rounded-md border border-border bg-white"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Shown with sample values. The sent email uses the branded layout
                  {category === "marketing" && " and an unsubscribe link"}.
                </p>
              </CardContent>
            </Card>
          )}

          {problems.length > 0 && (
            <ul
              className="text-xs text-muted-foreground space-y-1 list-disc pl-4"
              aria-live="polite"
            >
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              disabled={busy || (!!draftId && !unsaved)}
              onClick={() => persistDraft()}
            >
              {saveDraft.isPending ? "Saving…" : draftId && !unsaved ? "Saved" : "Save draft"}
            </Button>
            <Button
              variant="outline"
              disabled={!channels.length || contentProblems.length > 0}
              onClick={() => setTesting(true)}
            >
              Send test
            </Button>
          </div>
          <Button
            className="w-full"
            disabled={problems.length > 0 || !reach || busy}
            onClick={() => setConfirming(true)}
          >
            Review and {scheduled ? "schedule" : "send"}
          </Button>
        </aside>
      </div>

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {reach?.needs_approval
                ? "Submit for approval?"
                : scheduled
                  ? "Schedule broadcast?"
                  : "Send broadcast?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              “{title.trim()}” to {reach?.reachable_people.toLocaleString()} people (
              {audience && audienceLabel(audience)}) by{" "}
              {channels.map((c) => CHANNEL_LABELS[c]).join(", ")}
              {scheduled && scheduledFor && `, on ${new Date(scheduledFor).toLocaleString()}`}.{" "}
              {reach?.needs_approval
                ? "Nothing is sent until someone else approves it."
                : "Once sending starts you can cancel what hasn't gone out yet, but sent messages can't be recalled."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction disabled={busy} onClick={sendOrSubmit}>
              {busy
                ? "Saving…"
                : reach?.needs_approval
                  ? "Submit"
                  : scheduled
                    ? "Schedule"
                    : "Send"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {testing && (
        <TestSendDialog
          open
          onClose={() => setTesting(false)}
          input={{ category, channels, content: payload().content }}
          broadcastId={draftId}
          me={me ? { email: me.email, phone_number: me.phone_number } : undefined}
        />
      )}
    </PageLayout>
  );
};
