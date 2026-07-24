import Link from "next/link";
import { Button } from "@/components/ui/button";
import GroupsListCard from "@/features/groups/components/GroupsListCard";

const GroupsSection = () => {
  return (
    <section className="font-semibold flex flex-col flex-1 gap-4">
      <div className="flex justify-between items-center h-9">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">GROUPS</h2>

        <Button size="sm" variant="secondary" className="text-primary hover:bg-primary/10">
          <Link href="#">View All</Link>
        </Button>
      </div>

      <GroupsListCard />
    </section>
  );
};

export default GroupsSection;
