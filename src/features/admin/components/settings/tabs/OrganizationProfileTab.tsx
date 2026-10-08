"use client";

import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useUpdateOrganizationProfileMutation } from "@/features/admin/services/mutations";
import {
  type OrganizationProfile,
  useOrganizationProfileQuery,
} from "@/features/admin/services/queries";

const FIELDS: {
  key: keyof OrganizationProfile;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  { key: "name", label: "Organisation name", placeholder: "Kapuletu Systems Ltd", required: true },
  { key: "tagline", label: "Tagline", placeholder: "Community treasury management" },
  { key: "address", label: "Address", placeholder: "Westlands, Nairobi, Kenya" },
  { key: "phone", label: "Phone", placeholder: "+254 7XX XXX XXX" },
  { key: "email", label: "Email", placeholder: "info@kapuletu.co.ke" },
  { key: "website", label: "Website", placeholder: "www.kapuletu.co.ke" },
  { key: "registration_number", label: "Company registration no.", placeholder: "PVT-XXXXXXX" },
  { key: "tax_pin", label: "KRA PIN", placeholder: "P0XXXXXXXXX" },
];

const joinParts = (...parts: (string | null)[]) => parts.filter(Boolean).join(" · ");

/** Mirrors the PDF letterhead so admins can see what official documents will show. */
const LetterheadPreview: React.FC<{ profile: OrganizationProfile }> = ({ profile }) => (
  <div className="rounded-lg border bg-white p-4 text-slate-800 dark:bg-white">
    <div className="flex items-start justify-between gap-4 border-b-2 border-primary pb-3">
      <Image src="/shared/logo.png" alt="Kapuletu" width={120} height={36} className="h-9 w-auto" />
      <div className="text-right text-[11px] leading-snug text-slate-500">
        <p className="text-sm font-bold text-slate-800">{profile.name || "Organisation name"}</p>
        <p>{joinParts(profile.address, profile.phone)}</p>
        <p>{joinParts(profile.email, profile.website)}</p>
        <p>
          {joinParts(
            profile.registration_number && `Reg. No. ${profile.registration_number}`,
            profile.tax_pin && `KRA PIN ${profile.tax_pin}`,
          )}
        </p>
      </div>
    </div>
    <p className="pt-3 text-xs text-slate-400">
      Document title, reference and content follow here…
    </p>
  </div>
);

const ProfileForm: React.FC<{ initial: OrganizationProfile }> = ({ initial }) => {
  const [profile, setProfile] = useState(initial);
  const mutation = useUpdateOrganizationProfileMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send blanks as null so optional details disappear from the letterhead.
    const cleaned = Object.fromEntries(
      Object.entries(profile).map(([k, v]) => [
        k,
        typeof v === "string" && v.trim() === "" ? null : v,
      ]),
    ) as OrganizationProfile;
    mutation.mutate(cleaned);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LetterheadPreview profile={profile} />
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <Label htmlFor={`org-${field.key}`}>{field.label}</Label>
            <Input
              id={`org-${field.key}`}
              type={field.key === "email" ? "email" : "text"}
              required={field.required}
              value={profile[field.key] ?? ""}
              placeholder={field.placeholder}
              onChange={(e) => setProfile((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save organisation details"}
        </Button>
      </div>
    </form>
  );
};

export const OrganizationProfileTab: React.FC = () => {
  const { data, isLoading } = useOrganizationProfileQuery();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Organisation & letterhead</h2>
        <p className="text-sm text-muted-foreground">
          These details appear on every official Kapuletu document: attendance reports, receipts and
          financial exports.
        </p>
      </div>
      {isLoading || !data ? <Skeleton className="h-96 w-full" /> : <ProfileForm initial={data} />}
    </div>
  );
};
