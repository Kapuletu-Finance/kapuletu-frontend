import React from 'react';
import { DocsArticle } from '@/features/docs/components/DocsArticle';
import { DocsCallout } from '@/features/docs/components/DocsCallout';
import Link from 'next/link';

export default function FAQIndexPage() {
  const faqs = [
    { question: "Can I manage multiple groups?", answer: "Yes. You can create and switch between multiple groups using the switcher in the header or sidebar.", link: "/docs/groups" },
    { question: "Can I record cash contributions?", answer: "Yes. You can manually record cash, bank transfers, or any other type of contribution from the Add Contribution menu.", link: "/docs/contributions" },
    { question: "Can I correct a contribution after approving it?", answer: "Yes, provided you have the required permission. However, edits are permanently tracked in the audit log for transparency.", link: "/docs/contributions" },
    { question: "What happens if a member uses a different phone number?", answer: "You can manually match an unrecognized phone number to an existing member directly from the Inbox.", link: "/docs/contributions/inbox" },
  ];

  return (
    <DocsArticle 
      title="Frequently Asked Questions"
      description="Quick answers to common questions about KapuLetu."
      difficulty="Beginner"
    >
      <DocsCallout type="info">
        These are quick answers. For detailed, step-by-step instructions, please follow the 'Read full guide' links.
      </DocsCallout>

      <div className="space-y-6 my-8">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-6 border border-border rounded-xl bg-card">
            <h3 className="font-bold text-foreground text-lg mb-2">{faq.question}</h3>
            <p className="text-muted-foreground mb-4">{faq.answer}</p>
            <Link href={faq.link} className="text-primary text-sm font-medium hover:underline">
              Read full guide &rarr;
            </Link>
          </div>
        ))}
      </div>

    </DocsArticle>
  );
}
