"use client";

import { AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useResolveApprovalRequestMutation,
  useSubmitApprovalRequestMutation,
} from "@/features/admin/services/mutations";
import { useAdminApprovalsQuery } from "@/features/admin/services/queries";

const AdminApprovalsClient: React.FC = () => {
  const { data: approvals = [], isLoading } = useAdminApprovalsQuery("pending");
  const resolveMutation = useResolveApprovalRequestMutation();
  const submitDummyMutation = useSubmitApprovalRequestMutation();

  const handleResolve = (requestId: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    resolveMutation.mutate({ requestId, action });
  };

  const handleCreateDummy = () => {
    submitDummyMutation.mutate({
      action_type: "ISSUE_REFUND",
      payload: { amount: 1500, user_id: "user_123", reason: "Double charge" },
      justification: "User was double charged due to system glitch on payment gateway.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals Queue</h1>
          <p className="text-muted-foreground">
            Review and authorize sensitive actions initiated by staff.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleCreateDummy}
          disabled={submitDummyMutation.isPending}
        >
          {submitDummyMutation.isPending ? "Simulating..." : "Simulate Sensitive Action"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Actions requiring Super Admin or Admin authorization.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading queue...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <p>All caught up! No pending requests.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  approvals.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">
                        {req.action_type.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {req.requested_by.split("-")[0]}...
                        </span>
                      </TableCell>
                      <TableCell>{new Date(req.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-sm">
                          <Clock className="h-4 w-4" /> Pending
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Action Details: {req.action_type.replace("_", " ")}
                              </DialogTitle>
                              <DialogDescription>
                                Review the payload and justification before deciding.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                  Justification
                                </h4>
                                <p className="text-sm">
                                  {req.justification || "No justification provided."}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                  Payload
                                </h4>
                                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto">
                                  {JSON.stringify(req.payload, null, 2)}
                                </pre>
                              </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                              <Button
                                variant="destructive"
                                onClick={() => handleResolve(req.id, "reject")}
                                disabled={resolveMutation.isPending}
                              >
                                Reject
                              </Button>
                              <Button
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleResolve(req.id, "approve")}
                                disabled={resolveMutation.isPending}
                              >
                                Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApprovalsClient;
