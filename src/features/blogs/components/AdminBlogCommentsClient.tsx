"use client";

import { format } from "date-fns";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUpdateCommentStatusAdminMutation } from "../services/mutations";
import { useGetAdminCommentsQuery } from "../services/queries";

export const AdminBlogCommentsClient: React.FC<{ embeddedPostId?: string }> = ({
  embeddedPostId,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = embeddedPostId || searchParams.get("postId");
  const isEmbedded = !!embeddedPostId;
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const { data: comments, isLoading } = useGetAdminCommentsQuery(statusFilter);
  const updateStatusMutation = useUpdateCommentStatusAdminMutation();

  const filteredComments = comments?.filter((c) => !postId || c.post_id === postId);

  const handleUpdateStatus = async (commentId: string, newStatus: "approved" | "rejected") => {
    try {
      await updateStatusMutation.mutateAsync({ commentId, status: newStatus });
      toast.success(`Comment ${newStatus} successfully`);
    } catch (_error) {
      toast.error(`Failed to update comment to ${newStatus}`);
    }
  };

  return (
    <div className={isEmbedded ? "" : "flex flex-col gap-6 p-6"}>
      {!isEmbedded && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Comment Moderation</h1>
              <p className="text-muted-foreground mt-1">
                Review, approve, and manage user comments{" "}
                {postId ? "for this specific post" : "across all articles"}.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className={isEmbedded ? "border-0 shadow-none" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle>{isEmbedded ? "Comments" : "Comments Queue"}</CardTitle>
            <CardDescription>
              {isEmbedded
                ? "Manage comments for this article."
                : "Manage the conversation across all articles."}
            </CardDescription>
          </div>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as any)}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !filteredComments || filteredComments.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <p className="text-muted-foreground mb-4">No {statusFilter} comments found.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Author</TableHead>
                    <TableHead className="w-1/2">Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell className="font-medium align-top">
                        {comment.guest_name || "Registered User"}
                        {comment.user_id && (
                          <Badge variant="secondary" className="ml-2 text-[10px]">
                            MEMBER
                          </Badge>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          Post ID: {comment.post_id.slice(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <p className="text-sm line-clamp-3 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm align-top">
                        {format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <div className="flex justify-end gap-2">
                          {statusFilter !== "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(comment.id, "approved")}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {statusFilter !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(comment.id, "rejected")}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
