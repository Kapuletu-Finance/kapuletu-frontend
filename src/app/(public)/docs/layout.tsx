import React from 'react';
import { DocsLayout } from '@/features/docs/components/DocsLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & Learning Centre | KapuLetu',
  description: 'Learn how to use KapuLetu, manage groups, record contributions, and automate your treasury.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}
