"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRawTemplateMutation } from "@/features/admin/services/mutations";
import {
  type AdminTemplateItem,
  useAdminRawTemplateQuery,
  useAdminTemplatePreviewQuery,
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

  const [mode, setMode] = useState<"preview" | "advanced_edit">("preview");

  // Preview State
  const [dummyMessage, setDummyMessage] = useState(
    "We are thrilled to exclusively invite you to join the KapuLetu Private Beta.\n\nAs a trusted partner, you'll get early access to our state-of-the-art platform designed to manage your group's treasury with unprecedented transparency and ease.",
  );

  // Use the new authenticated query for preview HTML
  const { data: previewHtml, isLoading: isPreviewLoading } = useAdminTemplatePreviewQuery(
    selectedTemplate?.id || null,
    dummyMessage,
  );

  // Edit State
  const { data: rawTemplate, isLoading: isLoadingRaw } = useAdminRawTemplateQuery(
    selectedTemplate?.id || null,
  );
  const saveMutation = useSaveRawTemplateMutation();
  const [rawContent, setRawContent] = useState("");
  const [showAdvancedWarning, setShowAdvancedWarning] = useState(true);

  useEffect(() => {
    if (rawTemplate) {
      setRawContent(rawTemplate.content);
    }
  }, [rawTemplate]);

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
            onClick={() => setMode("advanced_edit")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${mode === "advanced_edit" ? "bg-background shadow-sm text-destructive" : "text-muted-foreground hover:text-destructive"}`}
          >
            Advanced Code Editor
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
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setShowAdvancedWarning(true);
                  }}
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
                {isPreviewLoading && (
                  <span className="text-xs text-muted-foreground animate-pulse">
                    Loading render...
                  </span>
                )}
              </div>

              <div className="p-4 border-b border-border bg-card flex flex-col gap-2">
                <Label className="block text-sm font-medium">Test Injection Message</Label>
                <Textarea
                  value={dummyMessage}
                  onChange={(e) => setDummyMessage(e.target.value)}
                  className="min-h-[80px] text-sm font-mono bg-muted/30"
                  placeholder="Enter sample message body..."
                />
                <p className="text-xs text-muted-foreground">
                  Update the message above to see how dynamic text wraps within the template layout.
                </p>
              </div>

              <div className="flex-1 bg-white relative">
                {previewHtml ? (
                  <iframe
                    key={selectedTemplate?.id}
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Template Preview"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm bg-muted/20">
                    Select a template to preview.
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 bg-destructive/10 border-b border-destructive/20 flex items-center justify-between">
                <div className="font-medium text-sm flex items-center gap-2 text-destructive">
                  <IconLibrary name="alert" className="size-4" />
                  Advanced Code Editor:{" "}
                  <span className="text-foreground">{selectedTemplate?.id}</span>
                </div>
                <Button
                  size="sm"
                  onClick={handleSaveRaw}
                  disabled={saveMutation.isPending || !selectedTemplate || showAdvancedWarning}
                  variant="destructive"
                >
                  {saveMutation.isPending ? "Saving..." : "Save Template"}
                </Button>
              </div>

              <div className="flex-1 relative bg-[#1e1e1e] overflow-hidden flex flex-col">
                {showAdvancedWarning ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card">
                    <IconLibrary name="alert" className="size-16 text-destructive mb-4" />
                    <h4 className="text-lg font-bold text-foreground mb-2">Proceed with Caution</h4>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Editing raw HTML can permanently break the platform's email functionality. You
                      must ensure that system variables like <code>{"{{ message }}"}</code> remain
                      perfectly intact. This area is intended for developers only.
                    </p>
                    <Button variant="destructive" onClick={() => setShowAdvancedWarning(false)}>
                      I Understand, Proceed to Editor
                    </Button>
                  </div>
                ) : isLoadingRaw ? (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
