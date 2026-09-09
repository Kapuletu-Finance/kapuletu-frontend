import { formatDistanceToNow } from "date-fns";
import type React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  ExtendedActiveUser,
  ExtendedActiveUsersResponse,
} from "@/features/admin/services/queries";

interface Props {
  data?: ExtendedActiveUsersResponse;
  isLoading: boolean;
}

export const EnhancedActiveUsers: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Live Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="flex flex-col h-[400px]">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">Live Active Users</CardTitle>
          <Badge variant="secondary" className="flex gap-1.5 items-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {data.active_now_count} Online Now
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-[330px] px-6 py-4">
          {data.active_now.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground mt-10">
              No users online right now.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {data.active_now.map((user) => (
                  <UserActivityRow key={user.user_id} user={user} />
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const UserActivityRow = ({ user }: { user: ExtendedActiveUser }) => {
  const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 pb-3 last:border-0">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary/5 text-xs text-primary font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none flex items-center gap-2">
            {user.full_name}
            <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">
              {user.role}
            </Badge>
          </span>
          <span
            className="text-xs text-muted-foreground mt-1 truncate max-w-[150px]"
            title={user.current_action}
          >
            {user.current_action}
          </span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {user.last_active_at
          ? formatDistanceToNow(new Date(user.last_active_at), { addSuffix: true })
          : "Unknown"}
      </div>
    </div>
  );
};
