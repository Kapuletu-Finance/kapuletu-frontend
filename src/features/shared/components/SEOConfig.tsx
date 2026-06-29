import type { Metadata } from "next";
import { env } from "@/env";

export const metadataConfig: Metadata = {
  alternates: {
    canonical: env.NEXT_PUBLIC_APP_URL,
  },
  authors: [{ name: "KapuLetu Operations Team", url: env.NEXT_PUBLIC_APP_URL }],

  category: "finance",
  creator: "KapuLetu Systems",
  description:
    "Streamline your Chama, self-help group, or investment welfare club with KapuLetu. Automatically ingest SMS records, split member deposits, manage crowdfunding campaigns, and generate instant immutable ledger updates.",
  keywords: [
    "KapuLetu Treasury",
    "Chama Finance Management",
    "Automated Ledger",
    "SMS Ingestion Finance",
    "Welfare Group Accounts",
    "Investment Club Software",
    "Chama Contribution Tracker",
    "Mobile Ledger Ingestion",
    "Immutable Financial Audit",
    "Split Deposit Allocation",
    "Kenya Digital Chama Tools",
    "Multi-tenant Financial Platform",
  ],
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),

  openGraph: {
    description:
      "Eliminate manual bookkeeping mistakes in your community finance circles. Empower group treasurers with automated text parsing, cryptographic audit records, and one-click WhatsApp summary exports.",
    locale: "en_KE",
    siteName: "KapuLetu Treasury",
    title: "KapuLetu Treasury | Automated Community Financial Ledger",
    type: "website",
    url: env.NEXT_PUBLIC_APP_URL,
  },
  publisher: "KapuLetu Treasury",

  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      noimageindex: false,
    },
    index: true,
    nocache: false,
  },
  title: {
    default: "KapuLetu Treasury | Automated Community Financial Ledger",
    template: "%s | KapuLetu Treasury",
  },

  twitter: {
    card: "summary_large_image",
    description:
      "Empower group treasurers with automated SMS parsing pipelines, explicit role-based safeguards, and multi-member contribution accounting updates.",
    title: "KapuLetu Treasury | Real-Time Automated Chama Bookkeeping",
  },
};

export const SEOConfig: React.FC = () => {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    alternateName: "KapuLetu Financial Ledger System",
    applicationCategory: "BusinessApplication",
    author: {
      "@type": "Organization",
      name: "KapuLetu Systems",
    },
    description:
      "High-performance, secure, multi-tenant digital treasury system optimized for group treasurers and platform operators to manage community deposits and campaign audit reports.",
    inLanguage: "en-KE",
    name: "KapuLetu Treasury",
    operatingSystem: "All",
    url: env.NEXT_PUBLIC_APP_URL,
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD schema injection
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  );
};
