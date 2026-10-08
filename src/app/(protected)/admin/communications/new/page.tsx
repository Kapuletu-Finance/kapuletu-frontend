import { ComposeBroadcastPage } from "@/features/admin/components/communications/ComposeBroadcastPage";

export default async function CommunicationsNewBroadcastRoute({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft } = await searchParams;
  return <ComposeBroadcastPage draftId={draft ?? null} />;
}
