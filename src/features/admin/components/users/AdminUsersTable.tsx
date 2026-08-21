"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminUserItem } from "@/features/admin/services/queries";
import IconLibrary from "@/features/shared/components/IconLibrary";

interface AdminUsersTableProps {
  users: AdminUserItem[];
  isLoading: boolean;
  onRowClick: (userId: string) => void;
}

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  users,
  isLoading,
  onRowClick,
}) => {
  const formatDate = (iso: string) => {
    if (!iso) return "Unknown";
    return new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2 mt-4">
        {["s1", "s2", "s3", "s4", "s5"].map((k) => (
          <Skeleton key={k} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border mt-4">
        <span className="text-sm text-muted-foreground">No users found.</span>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border mt-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Contact</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Plan</TableHead>
            <TableHead className="font-semibold">Joined</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.user_id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => onRowClick(user.slug)}
            >
              <TableCell>
                <p className="font-medium text-foreground">{user.full_name}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">{user.phone || "N/A"}</p>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-xs uppercase ${
                    user.is_active
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {user.is_active ? "Active" : "Suspended"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs bg-muted/50 text-foreground">
                  {user.plan_name}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(user.created_at)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconLibrary name="more-horizontal" className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onRowClick(user.slug)}>
                      <IconLibrary name="eye" className="mr-2 h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(user.email);
                      }}
                    >
                      <IconLibrary name="copy" className="mr-2 h-4 w-4" />
                      Copy Email
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
