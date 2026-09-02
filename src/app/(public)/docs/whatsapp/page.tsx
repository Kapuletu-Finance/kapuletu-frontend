import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import { DocsVideo } from '@/features/docs/components/DocsVideo';
import Link from 'next/link';

export default function WhatsAppIndexPage() {
  const setupGuides = [
    { title: "Connecting WhatsApp", link: "/docs/whatsapp/connecting" },
    { title: "What messages can be forwarded?", link: "/docs/whatsapp/message-types" },
    { title: "How to forward an M-Pesa message", link: "/docs/whatsapp/forwarding-guide" },
    { title: "How KapuLetu interprets a message", link: "/docs/whatsapp/interpretation" },
  ];

  const troubleshootingGuides = [
    { title: "Handling unknown contributors & masked numbers", link: "/docs/whatsapp/masked-numbers" },
    { title: "Handling duplicate messages", link: "/docs/whatsapp/duplicate-messages" },
    { title: "Handling incorrect amounts or wrong activities", link: "/docs/whatsapp/incorrect-amounts" },
    { title: "General WhatsApp troubleshooting", link: "/docs/whatsapp/general-troubleshooting" },
  ];

  return (
    <DocsArticle 
      title="WhatsApp Processing"
      description="Automate your treasury by forwarding M-Pesa messages directly to KapuLetu."
      difficulty="Intermediate"
    >
      <DocsCallout type="info" title="The most powerful feature">
        WhatsApp integration is what makes KapuLetu special. Instead of manually typing out hundreds of M-Pesa receipts, you can simply forward them to the KapuLetu bot, and they will be automatically parsed into your Inbox.
      </DocsCallout>

      <DocsVideo title="How to setup and use WhatsApp Forwarding" duration="4:30" />

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Setup & Usage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {setupGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4 border-b border-border pb-2">Processing & Troubleshooting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {troubleshootingGuides.map((guide, idx) => (
          <Link key={idx} href={guide.link} className="p-4 border border-border rounded-lg bg-card hover:border-primary/50 transition-colors">
            <h3 className="font-semibold text-foreground text-sm">{guide.title}</h3>
          </Link>
        ))}
      </div>
    </DocsArticle>
  );
}
