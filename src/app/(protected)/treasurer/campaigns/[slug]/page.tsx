import PageLayout from "@/features/shared/components/PageLayout";

export default function CampaignDetailsPage({ params }: { params: { slug: string } }) {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold mb-2">Campaign Details</h1>
        <p className="text-muted-foreground">Details for campaign: {params.slug}</p>
      </div>
    </PageLayout>
  );
}
