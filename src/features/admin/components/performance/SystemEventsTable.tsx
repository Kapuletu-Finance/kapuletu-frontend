import { format } from "date-fns";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { SystemEvent } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface Props {
  data?: SystemEvent[];
  isLoading: boolean;
}

export const SystemEventsTable: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No recent events found.
        </CardContent>
      </Card>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "error":
        return <IconLibrary name="alert" className="w-4 h-4 text-destructive" />;
      case "warning":
        return <IconLibrary name="alert" className="w-4 h-4 text-amber-500" />;
      case "info":
        return <IconLibrary name="info" className="w-4 h-4 text-blue-500" />;
      default:
        return <IconLibrary name="info" className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b bg-muted/20">
        <CardTitle>Recent System Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea orientation="horizontal" className="w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/10 text-muted-foreground text-left">
                <th className="font-medium p-4 py-3">Event</th>
                <th className="font-medium p-4 py-3">Source</th>
                <th className="font-medium p-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((event) => (
                <tr
                  key={event.id}
                  className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                >
                  <td className="p-4 py-3 flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <span className="font-medium">{event.message}</span>
                  </td>
                  <td className="p-4 py-3">
                    <Badge variant="outline">{event.source}</Badge>
                  </td>
                  <td className="p-4 py-3 text-muted-foreground whitespace-nowrap">
                    {format(new Date(event.timestamp), "MMM d, h:mm a")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
