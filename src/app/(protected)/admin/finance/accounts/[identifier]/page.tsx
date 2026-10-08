import { AccountPage } from "@/features/admin/components/finance/AccountPage";

export default async function FinanceAccountRoute({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  return <AccountPage identifier={identifier} />;
}
