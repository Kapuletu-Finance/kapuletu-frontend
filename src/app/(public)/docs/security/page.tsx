import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import Link from 'next/link';

export default function SecurityIndexPage() {
  const accountGuides = [
    { title: "Creating an account, Signing in, Verifying email", link: "/docs/security/account-creation" },
    { title: "Changing/Resetting password, Updating profile", link: "/docs/security/password-profile" },
    { title: "Managing phone number, Managing sessions, Logging out", link: "/docs/security/sessions" },
  ];

  const securityGuides = [
    { title: "Two-factor authentication", link: "/docs/security/2fa" },
    { title: "Data protection & Privacy", link: "/docs/security/data-protection" },
    { title: "Access control, Roles and permissions", link: "/docs/security/access-control" },
    { title: "Suspicious activity reporting", link: "/docs/security/suspicious-activity" },
  ];

  return (
    <DocsArticle 
      title="Account & Security"
      description="Manage your KapuLetu profile and secure your organization's data."
      difficulty="Beginner"
    >
      <DocsCallout type="info" title="Security First">
        Because KapuLetu handles financial data, we strongly recommend enabling Two-Factor Authentication (2FA) for all Treasurer accounts.
      </DocsCallout>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Account Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {accountGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors shadow-sm">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Security & Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {securityGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors shadow-sm">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
