import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Contribution {
  id: string;
  name: string;
  amount: string;
  date: string;
  paymentMethod: "M-pesa" | "Cash";
  avatarBg: string;
}

const contributions: Contribution[] = [
  {
    id: "1",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-burnt-amber text-white",
  },
  {
    id: "2",
    name: "Jane Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "Cash",
    avatarBg: "bg-primary text-primary-foreground",
  },
  {
    id: "3",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-refined-blue text-white",
  },
  {
    id: "4",
    name: "John Doe",
    amount: "Ksh. 500",
    date: "13 Jul 2026, 10:55 AM",
    paymentMethod: "M-pesa",
    avatarBg: "bg-burnt-amber text-white",
  },
];

const RecentContributionsCard = () => {
  return (
    <Card className="rounded-3xl border-none shadow-sm bg-card overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-border">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          RECENT CONTRIBUTIONS
        </h2>
        <button type="button" className="text-sm font-semibold text-primary hover:underline">
          View All
        </button>
      </CardHeader>

      <CardContent className="p-6">
        {/* Table Header */}
        <div className="grid grid-cols-4 text-xs font-semibold text-muted-foreground pb-4 px-2">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span className="text-right">Payment method</span>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {contributions.map((item) => (
            <div key={item.id} className="grid grid-cols-4 items-center py-4 px-2 text-sm">
              {/* Name & Avatar */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${item.avatarBg}`}
                >
                  JD
                </div>
                <span className="font-semibold text-foreground truncate">{item.name}</span>
              </div>

              {/* Amount */}
              <span className="font-medium text-foreground">{item.amount}</span>

              {/* Date */}
              <span className="text-muted-foreground text-xs">{item.date}</span>

              {/* Payment Method Badge */}
              <div className="text-right">
                <Badge
                  variant="secondary"
                  className={`px-3 py-1 rounded-full font-medium text-xs ${
                    item.paymentMethod === "M-pesa"
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {item.paymentMethod}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentContributionsCard;
