import { Card } from "@/components/ui/card";
import EmptyState from "@/features/shared/components/EmptyState";

const RecentActivitiesCard = () => {
  return (
    <section className="font-semibold flex flex-col gap-4">
      <div className="flex items-center h-9">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RECENT ACTIVITIES
        </h2>
      </div>

      <Card className="shadow-sm p-5 flex-1 flex flex-col rounded-2xl">
        <div className="flex-1 flex flex-col justify-center rounded-3xl border-none">
          <EmptyState message="No activity yet." />
        </div>
      </Card>
    </section>
  );
};

export default RecentActivitiesCard;
