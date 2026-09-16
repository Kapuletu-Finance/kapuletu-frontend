"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { env } from "@/env";
import { useSaveRawTemplateMutation } from "@/features/admin/services/mutations";
import {
  type AdminTemplateItem,
  useAdminRawTemplateQuery,
  useAdminTemplatesQuery,
} from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

export const EmailTemplatesTab: React.FC = () => {
  const { data: templates, isLoading: isLoadingTemplates } = useAdminTemplatesQuery();
  const [selectedTemplate, setSelectedTemplate] = useState<AdminTemplateItem | null>(null);

  // Set default selection when data loads
  useEffect(() => {
    if (templates && templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  const [mode, setMode] = useState<"preview" | "edit">("preview");

  // Preview State
  const [dummyMessage, setDummyMessage] = useState(
    "We are thrilled to exclusively invite you to join the KapuLetu Private Beta.\n\nAs a trusted partner, you'll get early access to our state-of-the-art platform designed to manage your group's treasury with unprecedented transparency and ease.",
  );

  // Edit State
  const { data: rawTemplate, isLoading: isLoadingRaw } = useAdminRawTemplateQuery(
    selectedTemplate?.id || null,
  );
  const saveMutation = useSaveRawTemplateMutation();
  const [rawContent, setRawContent] = useState("");

  useEffect(() => {
    if (rawTemplate) {
      setRawContent(rawTemplate.content);
    }
  }, [rawTemplate]);

  const previewUrl = selectedTemplate
    ? `${env.NEXT_PUBLIC_BACKEND_URL}/admin/templates/preview/${selectedTemplate.id}?message=${encodeURIComponent(dummyMessage)}`
    : "";

  const handleSaveRaw = async () => {
    if (!selectedTemplate) return;
    await saveMutation.mutateAsync({ name: selectedTemplate.id, content: rawContent });
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold tracking-tight">Email Templates Manager</h3>
          <p className="text-sm text-muted-foreground">
            Preview and professionally adjust the Jinja HTML branding of all system emails.
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setMode("preview")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Live Preview
          </button>
          <button
            onClick={() => setMode("edit")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "edit" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Edit Source Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
        {/* Left Pane: Selection */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <div className="px-4 py-3 bg-muted/50 border-b border-border font-medium text-sm flex items-center justify-between">
              Templates List
              {isLoadingTemplates && (
                <IconLibrary
                  name="activity"
                  className="size-4 animate-spin text-muted-foreground"
                />
              )}
            </div>
            <div className="p-2 flex flex-col gap-1 overflow-y-auto max-h-[600px]">
              {templates?.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left ${
                    selectedTemplate?.id === tmpl.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconLibrary name="layout" className="size-4 shrink-0" />
                  <span className="truncate">{tmpl.name}</span>
                </button>
              ))}
              {!isLoadingTemplates && (!templates || templates.length === 0) && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No templates found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Pane: Editor or Preview */}
        <div className="lg:col-span-9 border border-border rounded-xl bg-card flex flex-col overflow-hidden shadow-sm">
          {mode === "preview" ? (
            <>
              <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                <div className="font-medium text-sm flex items-center gap-2">
                  <IconLibrary name="eye" className="size-4 text-muted-foreground" />
                  Live Render: <span className="text-foreground">{selectedTemplate?.name}</span>
                </div>
              </div>

              <div className="p-4 border-b border-border bg-card">
                <Label className="mb-2 block">Test Injection Message</Label>
                <Textarea
                  value={dummyMessage}
                  onChange={(e) => setDummyMessage(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  See how dynamic message bodies wrap within the layout.
                </p>
              </div>

              <div className="flex-1 bg-muted/20 relative">
                {previewUrl ? (
                  <iframe
                    key={previewUrl}
                    src={previewUrl}
                    className="w-full h-full border-0"
                    title="Template Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    Select a template to preview.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
                <div className="font-medium text-sm flex items-center gap-2 text-destructive">
                  <IconLibrary name="alert" className="size-4" />
                  Raw Source Editor: <span className="text-foreground">{selectedTemplate?.id}</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveRaw}
                  disabled={saveMutation.isPending || !selectedTemplate}
                >
                  {saveMutation.isPending ? "Saving..." : "Save Template"}
                </Button>
              </div>

              <div className="flex-1 relative bg-[#1e1e1e]">
                {isLoadingRaw ? (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                    Loading source...
                  </div>
                ) : (
                  <textarea
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    className="w-full h-full bg-transparent text-[#d4d4d4] font-mono text-[13px] p-6 focus:outline-none resize-none"
                    spellCheck={false}
                  />
                )}
              </div>
              <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 text-xs text-destructive flex items-center gap-2">
                <IconLibrary name="info" className="size-3.5" />
                Warning: Editing raw Jinja HTML can break the platform's email functionality. Ensure
                tags like {"{{ message }}"} are intact.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
